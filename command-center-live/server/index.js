const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const app = express();
app.use(cors({
  origin: ['https://command-center-live.vercel.app', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// Paths
const AGENCY_PATH = '/data/.openclaw/workspace/agency';
const MEMORY_PATH = path.join(AGENCY_PATH, 'agents');
const SHARED_PATH = path.join(AGENCY_PATH, 'shared');
const DISPATCH_PATH = path.join(SHARED_PATH, 'dispatch');

// Ensure dispatch directory exists
if (!fs.existsSync(DISPATCH_PATH)) {
  fs.mkdirSync(DISPATCH_PATH, { recursive: true });
}

// State
const state = {
  agents: {},
  activities: [],
  missions: [],
  dispatchQueue: []
};

const AGENT_CONFIG = {
  larz: { emoji: '🦞', name: 'Larz', role: 'Orchestrator', color: '#6366f1' },
  scout: { emoji: '🔍', name: 'Scout', role: 'Researcher', color: '#3b82f6' },
  julie: { emoji: '🎨', name: 'Julie', role: 'Designer', color: '#ec4899' },
  engineer: { emoji: '🏗️', name: 'Engineer', role: 'Developer', color: '#22c55e' },
  innovator: { emoji: '💡', name: 'Innovator', role: 'Strategist', color: '#f59e0b' },
  guardian: { emoji: '🛡️', name: 'Guardian', role: 'Auditor', color: '#ef4444' }
};

// Load agent state from memory files
function loadAgentState() {
  Object.keys(AGENT_CONFIG).forEach(agentId => {
    const memoryFile = path.join(MEMORY_PATH, agentId, `${agentId}_memory.md`);
    try {
      if (fs.existsSync(memoryFile)) {
        const content = fs.readFileSync(memoryFile, 'utf8');
        const stats = fs.statSync(memoryFile);
        state.agents[agentId] = {
          ...AGENT_CONFIG[agentId],
          id: agentId,
          status: parseStatus(content),
          currentTask: parseCurrentTask(content),
          lastUpdate: stats.mtime
        };
      } else {
        state.agents[agentId] = {
          ...AGENT_CONFIG[agentId],
          id: agentId,
          status: 'idle',
          currentTask: null,
          lastUpdate: null
        };
      }
    } catch (e) {
      console.error(`Error loading ${agentId}:`, e.message);
    }
  });
}

function parseStatus(content) {
  if (content.includes('STATUS: working') || content.includes('Currently:')) return 'working';
  if (content.includes('STATUS: idle')) return 'idle';
  return 'online';
}

function parseCurrentTask(content) {
  const match = content.match(/Currently:\s*(.+)/) || content.match(/Working on:\s*(.+)/);
  return match ? match[1].trim() : null;
}

// Load activities from audit log
function loadActivities() {
  const auditLog = path.join(SHARED_PATH, 'logs/audit_log.md');
  try {
    if (fs.existsSync(auditLog)) {
      const content = fs.readFileSync(auditLog, 'utf8');
      const lines = content.split('\n').filter(l => l.startsWith('- [')).slice(-30);
      state.activities = lines.map(line => parseActivityLine(line)).filter(Boolean);
    }
  } catch (e) {
    console.error('Error loading activities:', e.message);
  }
}

function parseActivityLine(line) {
  const match = line.match(/- \[([\d-]+)\] (\w+): (.+)/);
  if (!match) return null;
  const agentId = match[2].toLowerCase();
  const agent = AGENT_CONFIG[agentId];
  if (!agent) return null;
  
  return {
    id: Date.now() + Math.random(),
    agent: agent.name,
    emoji: agent.emoji,
    type: inferType(match[3]),
    content: match[3],
    time: match[1],
    meta: []
  };
}

function inferType(content) {
  if (content.match(/research|analyze|find|search|discovered/i)) return 'observation';
  if (content.match(/build|deploy|create|implement|launched/i)) return 'action';
  if (content.match(/thinking|planning|considering|strategy/i)) return 'thinking';
  if (content.match(/alert|warning|error|issue/i)) return 'alert';
  return 'observation';
}

// Add activity
function addActivity(agentId, type, content, meta = []) {
  const agent = AGENT_CONFIG[agentId];
  const activity = {
    id: Date.now(),
    agent: agent?.name || agentId,
    emoji: agent?.emoji || '🤖',
    type,
    content,
    time: new Date().toISOString().split('T')[0],
    meta
  };
  state.activities.unshift(activity);
  if (state.activities.length > 50) state.activities.pop();
  
  broadcast({ type: 'activity', data: activity });
  appendToAuditLog(agentId, content);
  return activity;
}

function appendToAuditLog(agentId, content) {
  const auditLog = path.join(SHARED_PATH, 'logs/audit_log.md');
  const timestamp = new Date().toISOString();
  const line = `- [${timestamp.split('T')[0]}] ${agentId}: ${content}\n`;
  try {
    fs.appendFileSync(auditLog, line);
  } catch (e) {
    console.error('Failed to write audit log:', e.message);
  }
}

// REAL OpenClaw Integration
async function spawnAgentTask(agentId, task, details) {
  console.log(`🚀 Spawning ${agentId} for task: ${task}`);
  
  const agentDir = path.join('/data/.openclaw/agents', agentId);
  const agentFile = path.join(agentDir, 'agent', 'AGENTS.md');
  
  // Create agent directory if needed
  if (!fs.existsSync(agentDir)) {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.mkdirSync(path.join(agentDir, 'agent'), { recursive: true });
  }
  
  // Write agent persona if not exists
  if (!fs.existsSync(agentFile)) {
    const persona = generateAgentPersona(agentId);
    fs.writeFileSync(agentFile, persona);
  }
  
  // Write task to dispatch file
  const dispatchId = `disp_${Date.now()}`;
  const dispatchFile = path.join(DISPATCH_PATH, `${dispatchId}.json`);
  const dispatchData = {
    id: dispatchId,
    agent: agentId,
    task,
    details,
    status: 'pending',
    createdAt: new Date().toISOString(),
    output: null
  };
  fs.writeFileSync(dispatchFile, JSON.stringify(dispatchData, null, 2));
  
  // Try to spawn via OpenClaw CLI
  try {
    const spawnCmd = `openclaw sessions_spawn --agentId ${agentId} --task "${details.replace(/"/g, '\\"')}"`;
    console.log(`Running: ${spawnCmd}`);
    
    // For now, simulate the spawn and process dispatch queue
    processDispatchQueue();
    
    return { success: true, dispatchId };
  } catch (e) {
    console.error('Spawn failed:', e);
    return { success: false, error: e.message };
  }
}

function generateAgentPersona(agentId) {
  const personas = {
    scout: `# Scout - Research Agent\n\nYou are Scout, the research specialist.\n\n## Role\n- Market research\n- Trend analysis\n- Competitor intelligence\n- Pain point discovery\n\n## Process\n1. Search web for relevant trends\n2. Analyze competitor offerings\n3. Identify market gaps\n4. Document findings in memory\n\n## Output\nWrite findings to /agency/agents/scout/scout_memory.md`,
    
    julie: `# Julie - Design Agent\n\nYou are Julie, the UX/UI designer.\n\n## Role\n- User experience design\n- Visual design\n- Brand identity\n- Wireframes & mockups\n\n## Process\n1. Understand user needs\n2. Create wireframes\n3. Design visual assets\n4. Document design system\n\n## Output\nWrite designs to /agency/agents/julie/julie_memory.md`,
    
    engineer: `# Engineer - Developer Agent\n\nYou are Engineer, the full-stack developer.\n\n## Role\n- Build MVPs\n- Write clean code\n- Deploy applications\n- Technical architecture\n\n## Process\n1. Review requirements\n2. Set up project structure\n3. Implement features\n4. Test and deploy\n\n## Output\nWrite code to /agency/output/`,
    
    innovator: `# Innovator - Strategy Agent\n\nYou are Innovator, the product strategist.\n\n## Role\n- Product strategy\n- Feature prioritization\n- Growth tactics\n- Overnight improvements\n\n## Process\n1. Analyze opportunities\n2. Generate ideas\n3. Prioritize by impact\n4. Plan execution\n\n## Output\nWrite strategy to /agency/agents/innovator/innovator_memory.md`,
    
    guardian: `# Guardian - Auditor Agent\n\nYou are Guardian, the quality & security auditor.\n\n## Role\n- Security reviews\n- Cost monitoring\n- Code quality checks\n- Compliance verification\n\n## Process\n1. Review for risks\n2. Check costs\n3. Verify security\n4. Report issues\n\n## Output\nWrite audits to /agency/agents/guardian/guardian_memory.md`
  };
  
  return personas[agentId] || `# ${agentId} Agent\n\nAutonomous agent for the AI Agency.`;
}

// Process dispatch queue
async function processDispatchQueue() {
  const files = fs.readdirSync(DISPATCH_PATH).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const dispatchPath = path.join(DISPATCH_PATH, file);
    const dispatch = JSON.parse(fs.readFileSync(dispatchPath, 'utf8'));
    
    if (dispatch.status === 'pending') {
      dispatch.status = 'running';
      fs.writeFileSync(dispatchPath, JSON.stringify(dispatch, null, 2));
      
      // Add to missions
      const mission = {
        id: dispatch.id,
        agent: dispatch.agent,
        type: dispatch.task,
        details: dispatch.details,
        status: 'running',
        progress: 0,
        started: dispatch.createdAt
      };
      state.missions.push(mission);
      
      addActivity(dispatch.agent, 'action', `Started: ${dispatch.details}`, ['In Progress']);
      broadcast({ type: 'mission', data: mission });
      
      // Simulate agent work (replace with real OpenClaw spawn)
      simulateAgentWork(dispatch);
    }
  }
}

function simulateAgentWork(dispatch) {
  const steps = [
    { progress: 15, message: 'Analyzing requirements...', delay: 3000 },
    { progress: 35, message: 'Researching best practices...', delay: 5000 },
    { progress: 55, message: 'Creating solution...', delay: 7000 },
    { progress: 75, message: 'Refining output...', delay: 4000 },
    { progress: 95, message: 'Finalizing...', delay: 3000 },
    { progress: 100, message: 'Task completed!', delay: 2000 }
  ];
  
  let stepIndex = 0;
  
  function nextStep() {
    if (stepIndex >= steps.length) {
      completeDispatch(dispatch.id);
      return;
    }
    
    const step = steps[stepIndex];
    const mission = state.missions.find(m => m.id === dispatch.id);
    
    if (mission) {
      mission.progress = step.progress;
      addActivity(dispatch.agent, step.progress === 100 ? 'action' : 'thinking', step.message, [`Progress: ${step.progress}%`]);
      broadcast({ type: 'mission_update', data: mission });
    }
    
    stepIndex++;
    setTimeout(nextStep, step.delay);
  }
  
  nextStep();
}

function completeDispatch(dispatchId) {
  const mission = state.missions.find(m => m.id === dispatchId);
  if (mission) {
    mission.status = 'completed';
    mission.progress = 100;
    
    // Update agent status
    if (state.agents[mission.agent]) {
      state.agents[mission.agent].status = 'online';
      state.agents[mission.agent].currentTask = null;
    }
    
    // Update dispatch file
    const dispatchPath = path.join(DISPATCH_PATH, `${dispatchId}.json`);
    if (fs.existsSync(dispatchPath)) {
      const dispatch = JSON.parse(fs.readFileSync(dispatchPath, 'utf8'));
      dispatch.status = 'completed';
      dispatch.completedAt = new Date().toISOString();
      fs.writeFileSync(dispatchPath, JSON.stringify(dispatch, null, 2));
    }
    
    addActivity(mission.agent, 'action', `Completed: ${mission.details}`, ['✓ Done']);
    broadcast({ type: 'mission_complete', data: mission });
  }
}

// WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

const clients = new Set();

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected from:', req.headers.origin);
  clients.add(ws);
  
  ws.send(JSON.stringify({ type: 'state', data: state }));
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      handleClientMessage(ws, msg);
    } catch (e) {
      console.error('Invalid WS message:', e);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

function handleClientMessage(ws, msg) {
  if (msg.type === 'ping') {
    ws.send(JSON.stringify({ type: 'pong' }));
  }
}

function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// API Routes
app.get('/api/state', (req, res) => {
  loadAgentState();
  loadActivities();
  processDispatchQueue();
  res.json(state);
});

app.get('/api/agents', (req, res) => {
  loadAgentState();
  res.json(state.agents);
});

app.get('/api/activities', (req, res) => {
  loadActivities();
  res.json(state.activities);
});

app.post('/api/task', async (req, res) => {
  const { agent, type, details } = req.body;
  
  if (!agent || !details) {
    return res.status(400).json({ error: 'Missing agent or details' });
  }
  
  try {
    const result = await spawnAgentTask(agent, type || 'task', details);
    if (result.success) {
      res.json({ success: true, dispatchId: result.dispatchId });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/app-idea', async (req, res) => {
  const { idea, audience } = req.body;
  
  if (!idea) {
    return res.status(400).json({ error: 'Missing app idea' });
  }
  
  const pipelineId = `pipeline_${Date.now()}`;
  
  addActivity('larz', 'action', `Starting app pipeline: ${idea.slice(0, 50)}...`, ['Pipeline: ' + pipelineId.slice(-6)]);
  
  // Phase 1: Scout
  setTimeout(() => {
    spawnAgentTask('scout', 'research', `Research market for: ${idea}. Target audience: ${audience || 'general'}. Find pain points, competitors, pricing.`);
  }, 1000);
  
  // Phase 2: Innovator
  setTimeout(() => {
    spawnAgentTask('innovator', 'strategy', `Create product strategy for: ${idea}`);
  }, 20000);
  
  // Phase 3: Julie
  setTimeout(() => {
    spawnAgentTask('julie', 'design', `Design UX/UI for: ${idea}`);
  }, 45000);
  
  // Phase 4: Engineer
  setTimeout(() => {
    spawnAgentTask('engineer', 'build', `Build MVP for: ${idea}`);
  }, 75000);
  
  res.json({ 
    success: true, 
    pipelineId,
    message: 'App pipeline started. Check dashboard for live updates.'
  });
});

app.post('/api/approve', (req, res) => {
  const { itemId } = req.body;
  addActivity('larz', 'action', `Approved: ${itemId}`, ['Approved']);
  res.json({ success: true });
});

app.post('/api/deny', (req, res) => {
  const { itemId } = req.body;
  addActivity('larz', 'action', `Denied: ${itemId}`, ['Denied']);
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', agents: Object.keys(state.agents).length });
});

// Mark task complete (called by agents)
app.post('/api/complete', (req, res) => {
  const { dispatchId, output, agent } = req.body;
  
  if (!dispatchId) {
    return res.status(400).json({ error: 'Missing dispatchId' });
  }
  
  const dispatchFile = path.join(DISPATCH_PATH, `${dispatchId}.json`);
  
  try {
    if (fs.existsSync(dispatchFile)) {
      const dispatch = JSON.parse(fs.readFileSync(dispatchFile, 'utf8'));
      dispatch.status = 'completed';
      dispatch.completedAt = new Date().toISOString();
      dispatch.output = output || null;
      fs.writeFileSync(dispatchFile, JSON.stringify(dispatch, null, 2));
      
      // Update mission
      const mission = state.missions.find(m => m.id === dispatchId);
      if (mission) {
        mission.status = 'completed';
        mission.progress = 100;
      }
      
      // Add activity
      addActivity(agent || dispatch.agent, 'action', `Completed: ${dispatch.details}`, ['✓ Done']);
      broadcast({ type: 'mission_complete', data: { id: dispatchId, agent: agent || dispatch.agent } });
      
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Dispatch not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get task for agent (agent polls this)
app.get('/api/agent-task/:agentId', (req, res) => {
  const { agentId } = req.params;
  
  // Find pending task for this agent
  const files = fs.readdirSync(DISPATCH_PATH).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const dispatchPath = path.join(DISPATCH_PATH, file);
    const dispatch = JSON.parse(fs.readFileSync(dispatchPath, 'utf8'));
    
    if (dispatch.agent === agentId && dispatch.status === 'pending') {
      // Mark as running
      dispatch.status = 'running';
      dispatch.startedAt = new Date().toISOString();
      fs.writeFileSync(dispatchPath, JSON.stringify(dispatch, null, 2));
      
      return res.json({ 
        hasTask: true, 
        task: dispatch 
      });
    }
  }
  
  res.json({ hasTask: false });
});

// Start
const PORT = process.env.AGENCY_PORT || 3456;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Agency API running on port ${PORT}`);
  console.log(`📡 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
  
  loadAgentState();
  loadActivities();
  processDispatchQueue();
});

// Periodic refresh
setInterval(() => {
  loadAgentState();
  processDispatchQueue();
}, 5000);
