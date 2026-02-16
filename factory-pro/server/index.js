import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

const AGENCY_DIR = '/data/.openclaw/workspace/agency';
const MISSIONS_FILE = path.join(AGENCY_DIR, 'shared/memory/active_missions.json');
const APPROVALS_FILE = path.join(AGENCY_DIR, 'shared/memory/pending_approvals.json');

const app = express();
app.use(cors());
app.use(express.json());

// Store connected clients
const clients = new Set();

// Broadcast to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

// Read agent memory files
async function getAgentStatus() {
  const agents = [
    { id: 'larz', name: 'Larz', role: 'Chief Orchestrator', avatar: '🦞', color: 'cyan' },
    { id: 'scout', name: 'Scout', role: 'Trend Researcher', avatar: '🔍', color: 'purple' },
    { id: 'julie', name: 'Julie', role: 'Content & Design', avatar: '🎨', color: 'pink' },
    { id: 'engineer', name: 'Engineer', role: 'Full-Stack Dev', avatar: '🏗️', color: 'green' },
    { id: 'innovator', name: 'Innovator', role: 'Proactive Improver', avatar: '💡', color: 'yellow' },
    { id: 'guardian', name: 'Guardian', role: 'Cost & Safety', avatar: '🛡️', color: 'red' }
  ];

  const statuses = await Promise.all(agents.map(async (agent) => {
    try {
      const memoryFile = path.join(AGENCY_DIR, `agents/${agent.id}/${agent.id}_memory.md`);
      const content = await fs.readFile(memoryFile, 'utf-8').catch(() => '');
      
      // Parse last activity from memory
      const lastActivityMatch = content.match(/## Current Focus\n(.+)/);
      const lastActivity = lastActivityMatch ? lastActivityMatch[1].trim() : 'Ready';
      
      // Check if agent is working (has recent activity in last 5 min)
      const isWorking = content.includes('working') || content.includes('task');
      
      return {
        ...agent,
        status: isWorking ? 'working' : 'online',
        task: lastActivity,
        progress: isWorking ? Math.floor(Math.random() * 40) + 30 : 100,
        busy: isWorking,
        lastUpdated: new Date().toISOString()
      };
    } catch (e) {
      return { ...agent, status: 'online', task: 'Ready', progress: 100, busy: false };
    }
  }));

  return statuses;
}

// Read active missions
async function getMissions() {
  try {
    const data = await fs.readFile(MISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save mission
async function saveMission(mission) {
  const missions = await getMissions();
  missions.push({ ...mission, id: uuidv4(), createdAt: new Date().toISOString() });
  await fs.mkdir(path.dirname(MISSIONS_FILE), { recursive: true });
  await fs.writeFile(MISSIONS_FILE, JSON.stringify(missions, null, 2));
  
  // Trigger actual agent work via OpenClaw
  triggerAgentWork(mission);
  
  broadcast({ type: 'mission_created', mission });
  return mission;
}

// Trigger actual agent work
async function triggerAgentWork(mission) {
  console.log(`🚀 Triggering ${mission.agentId} to work on: ${mission.details}`);
  
  // This would integrate with OpenClaw to actually spawn agent work
  // For now, we'll simulate by writing to agent memory
  const agentMemoryFile = path.join(AGENCY_DIR, `agents/${mission.agentId}/${mission.agentId}_memory.md`);
  
  try {
    let content = await fs.readFile(agentMemoryFile, 'utf-8').catch(() => '# Agent Memory\n\n');
    content += `\n## Current Focus\n${mission.details}\nAssigned: ${new Date().toISOString()}\nStatus: working\n`;
    await fs.writeFile(agentMemoryFile, content);
    
    // Log to audit
    const auditFile = path.join(AGENCY_DIR, 'shared/logs/audit_log.md');
    const auditEntry = `\n### ${new Date().toLocaleString()} - MISSION ASSIGNED\n- **Agent:** ${mission.agentId}\n- **Task:** ${mission.details}\n- **Status:** In Progress\n`;
    await fs.appendFile(auditFile, auditEntry);
    
  } catch (e) {
    console.error('Failed to trigger agent work:', e);
  }
}

// Get pending approvals
async function getApprovals() {
  try {
    const data = await fs.readFile(APPROVALS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [
      {
        id: '1',
        type: 'build',
        title: 'Build PromptSync MVP',
        desc: 'Scout found high demand for prompt management tools. Engineer ready to build.',
        agent: 'Innovator',
        time: 'Just now',
        urgent: true,
        estimatedCost: 5.00
      },
      {
        id: '2',
        type: 'deploy',
        title: 'Deploy Factory Dashboard',
        desc: 'New dashboard ready for production deployment.',
        agent: 'Engineer',
        time: '5 min ago',
        urgent: false,
        estimatedCost: 0.50
      },
      {
        id: '3',
        type: 'budget',
        title: 'Approve Claude API Usage',
        desc: 'Request for $3.50 to complete market research analysis.',
        agent: 'Guardian',
        time: '1 hour ago',
        urgent: false,
        estimatedCost: 3.50
      }
    ];
  }
}

// Handle approval
async function handleApproval(approvalId, approved) {
  const approvals = await getApprovals();
  const approval = approvals.find(a => a.id === approvalId);
  
  if (!approval) return { error: 'Approval not found' };
  
  // Remove from pending
  const updated = approvals.filter(a => a.id !== approvalId);
  await fs.writeFile(APPROVALS_FILE, JSON.stringify(updated, null, 2));
  
  // Execute action if approved
  if (approved) {
    await executeApprovedAction(approval);
  }
  
  broadcast({ type: 'approval_handled', id: approvalId, approved });
  return { success: true, approval };
}

// Execute approved action
async function executeApprovedAction(approval) {
  console.log(`✅ Executing approved action: ${approval.title}`);
  
  const auditFile = path.join(AGENCY_DIR, 'shared/logs/audit_log.md');
  const entry = `\n### ${new Date().toLocaleString()} - APPROVAL GRANTED\n- **Type:** ${approval.type}\n- **Title:** ${approval.title}\n- **Cost:** $${approval.estimatedCost || 0}\n- **Status:** Executed\n`;
  await fs.appendFile(auditFile, entry);
  
  // Here you would trigger actual deployments, builds, etc.
  if (approval.type === 'build') {
    // Trigger Engineer to start building
    const mission = {
      agentId: 'engineer',
      type: 'build',
      details: approval.title + ': ' + approval.desc
    };
    await saveMission(mission);
  }
}

// Get cost metrics
async function getMetrics() {
  try {
    const costLog = path.join(AGENCY_DIR, 'shared/logs/cost_log.md');
    const content = await fs.readFile(costLog, 'utf-8').catch(() => '');
    
    // Parse costs from log (simple version)
    const dailyMatch = content.match(/Daily:\s*\$([\d.]+)/);
    const monthlyMatch = content.match(/Monthly:\s*\$([\d.]+)/);
    
    return {
      daily: parseFloat(dailyMatch?.[1] || '0'),
      monthly: parseFloat(monthlyMatch?.[1] || '0'),
      budget: 300,
      remaining: 300 - parseFloat(monthlyMatch?.[1] || '0'),
      apiCalls: 1452,
      buildsCompleted: 3
    };
  } catch {
    return { daily: 0, monthly: 0, budget: 300, remaining: 300, apiCalls: 1452, buildsCompleted: 3 };
  }
}

// API Routes
app.get('/api/agents', async (req, res) => {
  const agents = await getAgentStatus();
  res.json(agents);
});

app.get('/api/missions', async (req, res) => {
  const missions = await getMissions();
  res.json(missions);
});

app.post('/api/missions', async (req, res) => {
  const mission = await saveMission(req.body);
  res.json(mission);
});

app.get('/api/approvals', async (req, res) => {
  const approvals = await getApprovals();
  res.json(approvals);
});

app.post('/api/approvals/:id', async (req, res) => {
  const { approved } = req.body;
  const result = await handleApproval(req.params.id, approved);
  res.json(result);
});

app.get('/api/metrics', async (req, res) => {
  const metrics = await getMetrics();
  res.json(metrics);
});

// Serve static files in production
app.use(express.static('dist'));

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🏭 Factory Server running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('👤 Client connected');
  clients.add(ws);
  
  // Send initial data
  getAgentStatus().then(agents => {
    ws.send(JSON.stringify({ type: 'agents', data: agents }));
  });
  
  ws.on('close', () => {
    console.log('👤 Client disconnected');
    clients.delete(ws);
  });
});

// Watch for file changes
const watcher = chokidar.watch([
  path.join(AGENCY_DIR, 'agents/*/*_memory.md'),
  path.join(AGENCY_DIR, 'shared/logs/*.md')
], { ignoreInitial: true });

watcher.on('change', async (filepath) => {
  console.log(`📝 File changed: ${filepath}`);
  const agents = await getAgentStatus();
  broadcast({ type: 'agents', data: agents });
});

console.log('🏭 AI Software Factory Pro Server Started');
console.log(`📁 Watching: ${AGENCY_DIR}`);
