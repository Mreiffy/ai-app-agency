const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const AGENCY_ROOT = '/data/.openclaw/workspace/agency';
const SHARED_ROOT = path.join(AGENCY_ROOT, 'shared');
const AGENTS_ROOT = path.join(AGENCY_ROOT, 'agents');

// In-memory activity log (persisted to file)
const ACTIVITY_LOG = path.join(SHARED_ROOT, 'logs/activity_feed.json');
let activities = [];
try { activities = JSON.parse(fs.readFileSync(ACTIVITY_LOG, 'utf8')); } catch(e) { activities = []; }

function saveActivities() {
  fs.mkdirSync(path.dirname(ACTIVITY_LOG), { recursive: true });
  fs.writeFileSync(ACTIVITY_LOG, JSON.stringify(activities.slice(0, 200), null, 2));
}

// Task queue
const TASK_QUEUE = path.join(SHARED_ROOT, 'logs/task_queue.json');
let tasks = [];
try { tasks = JSON.parse(fs.readFileSync(TASK_QUEUE, 'utf8')); } catch(e) { tasks = []; }

function saveTasks() {
  fs.mkdirSync(path.dirname(TASK_QUEUE), { recursive: true });
  fs.writeFileSync(TASK_QUEUE, JSON.stringify(tasks, null, 2));
}

// Agent definitions
const AGENTS = {
  larz: { name: 'Larz', emoji: '🦞', role: 'Orchestrator', desc: 'Coordinates all agents, breaks down tasks, manages workflow' },
  scout: { name: 'Scout', emoji: '🔍', role: 'Researcher', desc: 'Market research, trend analysis, competitor intelligence' },
  julie: { name: 'Julie', emoji: '🎨', role: 'Designer', desc: 'UI/UX design, branding, visual strategy' },
  engineer: { name: 'Engineer', emoji: '🏗️', role: 'Developer', desc: 'Builds MVPs, writes code, deploys apps' },
  innovator: { name: 'Innovator', emoji: '💡', role: 'Strategist', desc: 'Improvement ideas, overnight builds, strategy' },
  guardian: { name: 'Guardian', emoji: '🛡️', role: 'Auditor', desc: 'Security, cost monitoring, quality assurance' }
};

// GET /api/agents — live agent status
app.get('/api/agents', (req, res) => {
  const agentStatuses = {};
  for (const [id, info] of Object.entries(AGENTS)) {
    const memFile = path.join(AGENTS_ROOT, id, `${id}_memory.md`);
    let lastActivity = 'Idle';
    let status = 'online';
    let lastUpdate = null;

    try {
      const content = fs.readFileSync(memFile, 'utf8');
      const stat = fs.statSync(memFile);
      lastUpdate = stat.mtime;

      // Check if updated in last 5 minutes = working
      const minutesAgo = (Date.now() - stat.mtime.getTime()) / 60000;
      if (minutesAgo < 5) status = 'working';
      else if (minutesAgo < 30) status = 'online';
      else status = 'idle';

      // Extract last line with content
      const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      if (lines.length > 0) lastActivity = lines[lines.length - 1].substring(0, 80);
    } catch(e) {}

    // Check if agent has active tasks
    const activeTasks = tasks.filter(t => t.assignedTo === id && t.status === 'running');
    if (activeTasks.length > 0) {
      status = 'working';
      lastActivity = `Working on: ${activeTasks[0].title}`;
    }

    agentStatuses[id] = { ...info, id, status, lastActivity, lastUpdate };
  }
  res.json(agentStatuses);
});

// GET /api/activity — live activity feed
app.get('/api/activity', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const since = req.query.since ? new Date(req.query.since) : null;
  let filtered = activities;
  if (since) filtered = activities.filter(a => new Date(a.timestamp) > since);
  res.json(filtered.slice(0, limit));
});

// POST /api/activity — add activity (used by agents)
app.post('/api/activity', (req, res) => {
  const { agent, type, content, meta } = req.body;
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    agent, type, content, meta: meta || [],
    timestamp: new Date().toISOString()
  };
  activities.unshift(entry);
  saveActivities();
  res.json(entry);
});

// GET /api/tasks — task queue
app.get('/api/tasks', (req, res) => {
  const status = req.query.status;
  let filtered = tasks;
  if (status) filtered = tasks.filter(t => t.status === status);
  res.json(filtered);
});

// POST /api/tasks — create a new task (this is the main dispatch)
app.post('/api/tasks', (req, res) => {
  const { title, description, type, assignedTo, priority } = req.body;

  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    title,
    description,
    type: type || 'general',
    assignedTo: assignedTo || 'larz',
    priority: priority || 'normal',
    status: 'pending',
    progress: 0,
    pipeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Define pipeline based on task type
  if (type === 'build-app') {
    task.pipeline = [
      { agent: 'scout', step: 'Research & Pain Points', status: 'pending', output: null },
      { agent: 'julie', step: 'UX Strategy & Wireframes', status: 'pending', output: null },
      { agent: 'engineer', step: 'Build MVP', status: 'pending', output: null },
      { agent: 'innovator', step: 'Review & Improve', status: 'pending', output: null },
      { agent: 'guardian', step: 'Security Audit', status: 'pending', output: null }
    ];
  } else if (type === 'research') {
    task.pipeline = [
      { agent: 'scout', step: 'Deep Research', status: 'pending', output: null },
      { agent: 'innovator', step: 'Strategic Analysis', status: 'pending', output: null }
    ];
  } else if (type === 'design') {
    task.pipeline = [
      { agent: 'scout', step: 'Research Inspiration', status: 'pending', output: null },
      { agent: 'julie', step: 'Create Designs', status: 'pending', output: null }
    ];
  }

  tasks.unshift(task);
  saveTasks();

  // Log activity
  activities.unshift({
    id: Date.now().toString(36),
    agent: `${AGENTS[task.assignedTo || 'larz'].emoji} ${AGENTS[task.assignedTo || 'larz'].name}`,
    type: 'action',
    content: `<strong>New task received:</strong> ${title}. Pipeline: ${task.pipeline.map(p => p.step).join(' → ')}`,
    meta: [`Priority: ${priority}`, `${task.pipeline.length} steps`],
    timestamp: new Date().toISOString()
  });
  saveActivities();

  // Trigger the task via OpenClaw sessions_spawn (async)
  triggerTask(task);

  res.json(task);
});

// POST /api/tasks/:id/approve — approve a pending task
app.post('/api/tasks/:id/approve', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.status = 'running';
  task.updatedAt = new Date().toISOString();
  saveTasks();

  activities.unshift({
    id: Date.now().toString(36),
    agent: '🦞 Larz',
    type: 'action',
    content: `<strong>Task approved:</strong> ${task.title}. Starting pipeline execution.`,
    meta: ['Founder approved'],
    timestamp: new Date().toISOString()
  });
  saveActivities();

  res.json(task);
});

// POST /api/tasks/:id/deny
app.post('/api/tasks/:id/deny', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.status = 'denied';
  task.updatedAt = new Date().toISOString();
  saveTasks();
  res.json(task);
});

// GET /api/metrics — budget and system metrics
app.get('/api/metrics', (req, res) => {
  let costData = { total: 0, daily: 0, monthly_limit: 300 };
  try {
    const costLog = fs.readFileSync(path.join(SHARED_ROOT, 'logs/cost_log.md'), 'utf8');
    // Parse cost data from log
    const totalMatch = costLog.match(/Total:\s*\$?([\d.]+)/i);
    if (totalMatch) costData.total = parseFloat(totalMatch[1]);
  } catch(e) {}

  res.json({
    budget: costData,
    agents: {
      total: 6,
      active: Object.keys(AGENTS).length,
      working: tasks.filter(t => t.status === 'running').length
    },
    tasks: {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length
    }
  });
});

// Trigger task execution via writing to agent memory + creating a dispatch file
async function triggerTask(task) {
  const dispatchDir = path.join(SHARED_ROOT, 'dispatch');
  fs.mkdirSync(dispatchDir, { recursive: true });

  const dispatchFile = path.join(dispatchDir, `${task.id}.json`);
  fs.writeFileSync(dispatchFile, JSON.stringify(task, null, 2));

  // Write to orchestrator memory to signal new task
  const larzMem = path.join(AGENTS_ROOT, 'larz/larz_memory.md');
  const entry = `\n\n## Task Dispatched: ${task.title}\n- ID: ${task.id}\n- Type: ${task.type}\n- Time: ${task.createdAt}\n- Pipeline: ${task.pipeline.map(p => p.step).join(' → ')}\n- Description: ${task.description}\n`;
  fs.appendFileSync(larzMem, entry);

  console.log(`[DISPATCH] Task ${task.id}: ${task.title}`);
}

const PORT = process.env.PORT || 3456;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Agency Command Center API running on port ${PORT}`);
  console.log(`📡 Dashboard: http://localhost:${PORT}`);
});
