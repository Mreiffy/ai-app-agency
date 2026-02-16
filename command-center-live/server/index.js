const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Paths
const AGENCY_PATH = '/data/.openclaw/workspace/agency';
const MEMORY_PATH = path.join(AGENCY_PATH, 'agents');
const SHARED_PATH = path.join(AGENCY_PATH, 'shared');

// In-memory state
const state = {
  agents: {},
  activities: [],
  queue: [],
  missions: []
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
        state.agents[agentId] = {
          ...AGENT_CONFIG[agentId],
          id: agentId,
          status: parseStatus(content),
          currentTask: parseCurrentTask(content),
          lastUpdate: fs.statSync(memoryFile).mtime
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
      const lines = content.split('\n').filter(l => l.startsWith('- [')).slice(-20);
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
  if (content.match(/research|analyze|find|search/i)) return 'observation';
  if (content.match(/build|deploy|create|implement/i)) return 'action';
  if (content.match(/thinking|planning|considering/i)) return 'thinking';
  return 'alert';
}

// Add activity
function addActivity(agentId, type, content, meta = []) {
  const agent = AGENT_CONFIG[agentId];
  const activity = {
    id: Date.now(),
    agent: agent.name,
    emoji: agent.emoji,
    type,
    content,
    time: new Date().toISOString().split('T')[0],
    meta
  };
  state.activities.unshift(activity);
  if (state.activities.length > 50) state.activities.pop();
  
  // Broadcast to all connected clients
  broadcast({ type: 'activity', data: activity });
  
  // Also append to audit log
  appendToAuditLog(agentId, content);
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

// Dispatch task to agent
async function dispatchTask(agentId, taskType, details) {
  const taskId = `task_${Date.now()}`;
  
  // Update agent status
  state.agents[agentId].status = 'working';
  state.agents[agentId].currentTask = details;
  
  // Add to mission queue
  const mission = {
    id: taskId,
    agent: agentId,
    type: taskType,
    details,
    status: 'running',
    progress: 0,
    started: new Date().toISOString()
  };
  state.missions.push(mission);
  
  addActivity(agentId, 'action', `Started mission: ${details}`, ['In Progress', `Task ID: ${taskId.slice(-6)}`]);
  
  // Try to spawn actual agent via OpenClaw
  try {
    // Write task to agent's memory
    const memoryFile = path.join(MEMORY_PATH, agentId, `${agentId}_memory.md`);
    const taskEntry = `\n\n## Current Task [${new Date().toISOString()}]\nStatus: working\nTask: ${details}\nType: ${taskType}\n`;
    fs.appendFileSync(memoryFile, taskEntry);
    
    // Trigger OpenClaw session if possible
    // Note: This requires proper OpenClaw integration
    // For now, we simulate the agent working
    simulateAgentWork(agentId, taskId, details);
    
  } catch (e) {
    console.error('Failed to dispatch task:', e.message);
    addActivity('larz', 'alert', `Failed to dispatch task to ${agentId}: ${e.message}`, ['Error']);
  }
  
  broadcast({ type: 'mission', data: mission });
  return taskId;
}

function simulateAgentWork(agentId, taskId, details) {
  const steps = [
    { progress: 10, message: 'Analyzing requirements...' },
    { progress: 25, message: 'Researching best practices...' },
    { progress: 40, message: 'Creating initial design...' },
    { progress: 60, message: 'Building core features...' },
    { progress: 80, message: 'Testing and refining...' },
    { progress: 100, message: 'Task completed!' }
  ];
  
  let stepIndex = 0;
  const interval = setInterval(() => {
    if (stepIndex >= steps.length) {
      clearInterval(interval);
      completeTask(taskId);
      return;
    }
    
    const step = steps[stepIndex];
    const mission = state.missions.find(m => m.id === taskId);
    if (mission) {
      mission.progress = step.progress;
      addActivity(agentId, 'thinking', step.message, [`Progress: ${step.progress}%`]);
      broadcast({ type: 'mission_update', data: mission });
    }
    
    stepIndex++;
  }, 3000 + Math.random() * 2000); // 3-5 seconds per step
}

function completeTask(taskId) {
  const mission = state.missions.find(m => m.id === taskId);
  if (mission) {
    mission.status = 'completed';
    mission.progress = 100;
    state.agents[mission.agent].status = 'online';
    state.agents[mission.agent].currentTask = null;
    addActivity(mission.agent, 'action', `Completed: ${mission.details}`, ['✓ Done']);
    broadcast({ type: 'mission_complete', data: mission });
  }
}

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  
  // Send current state
  ws.send(JSON.stringify({ type: 'state', data: state }));
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

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
    const taskId = await dispatchTask(agent, type || 'task', details);
    res.json({ success: true, taskId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/app-idea', async (req, res) => {
  const { idea } = req.body;
  
  if (!idea) {
    return res.status(400).json({ error: 'Missing app idea' });
  }
  
  // This triggers the full pipeline
  const pipelineId = `pipeline_${Date.now()}`;
  
  addActivity('larz', 'action', `Starting app pipeline for: ${idea}`, ['Pipeline ID: ' + pipelineId.slice(-6)]);
  
  // Phase 1: Scout researches
  setTimeout(() => {
    dispatchTask('scout', 'research', `Research market for: ${idea}. Find pain points, competitors, pricing models.`);
  }, 500);
  
  // Phase 2: Innovator strategizes (after scout)
  setTimeout(() => {
    dispatchTask('innovator', 'strategy', `Create product strategy for: ${idea} based on Scout's research`);
  }, 15000);
  
  // Phase 3: Julie designs (after innovator)
  setTimeout(() => {
    dispatchTask('julie', 'design', `Design UX/UI for: ${idea} based on product strategy`);
  }, 30000);
  
  // Phase 4: Engineer builds (after julie)
  setTimeout(() => {
    dispatchTask('engineer', 'build', `Build MVP for: ${idea} based on Julie's designs`);
  }, 60000);
  
  res.json({ 
    success: true, 
    pipelineId,
    message: 'App pipeline started. Scout is researching now...'
  });
});

app.post('/api/approve', (req, res) => {
  const { itemId } = req.body;
  addActivity('larz', 'action', `Approved item: ${itemId}`, ['Approved']);
  res.json({ success: true });
});

app.post('/api/deny', (req, res) => {
  const { itemId } = req.body;
  addActivity('larz', 'action', `Denied item: ${itemId}`, ['Denied']);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 AI Agency API running on port ${PORT}`);
  console.log(`📊 WebSocket enabled for real-time updates`);
  
  // Initial load
  loadAgentState();
  loadActivities();
});

// Periodic refresh
setInterval(() => {
  loadAgentState();
}, 5000);
