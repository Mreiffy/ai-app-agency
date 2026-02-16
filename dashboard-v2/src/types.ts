export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'working' | 'idle' | 'offline';
  currentTask?: string;
  progress?: number;
  lastActivity: string;
  memory: string[];
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
}

export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  type: 'task_start' | 'task_complete' | 'message' | 'alert' | 'error';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface SystemMetrics {
  dailyCost: number;
  monthlyCost: number;
  budgetRemaining: number;
  apiCalls: number;
  buildsCompleted: number;
  activeTasks: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  agentId?: string;
  command: string;
}

export const AGENTS: Agent[] = [
  {
    id: 'larz',
    name: 'Larz',
    role: 'Chief Orchestrator',
    avatar: '🦞',
    status: 'online',
    currentTask: 'Managing agency operations',
    progress: 100,
    lastActivity: '2 min ago',
    memory: ['Agency initialized', 'Dashboard deployed to Vercel', 'Scout monitoring active'],
    color: 'cyan'
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Trend Researcher',
    avatar: '🔍',
    status: 'working',
    currentTask: 'Scanning Product Hunt trends',
    progress: 65,
    lastActivity: 'Just now',
    memory: ['AI video explosion detected', 'Terminal AI agents trending', 'Found 7 app opportunities'],
    color: 'purple'
  },
  {
    id: 'julie',
    name: 'Julie',
    role: 'Content & Design',
    avatar: '🎨',
    status: 'idle',
    currentTask: 'Ready for creative tasks',
    progress: 0,
    lastActivity: '15 min ago',
    memory: ['Brand guidelines ready', 'Design system created'],
    color: 'pink'
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Full-Stack Dev',
    avatar: '🏗️',
    status: 'idle',
    currentTask: 'Ready to build',
    progress: 0,
    lastActivity: '20 min ago',
    memory: ['Vercel deployment configured', 'CLI tools ready'],
    color: 'green'
  },
  {
    id: 'innovator',
    name: 'Innovator',
    role: 'Proactive Improver',
    avatar: '💡',
    status: 'working',
    currentTask: 'Planning overnight build',
    progress: 30,
    lastActivity: '5 min ago',
    memory: ['Analyzing Scout findings', 'Prioritizing PromptSync build'],
    color: 'yellow'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    role: 'Cost & Safety Auditor',
    avatar: '🛡️',
    status: 'online',
    currentTask: 'Monitoring costs: $0.00/$10',
    progress: 100,
    lastActivity: '1 min ago',
    memory: ['Cost tracking active', 'No alerts'],
    color: 'red'
  }
];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'Build App', icon: 'hammer', agentId: 'engineer', command: 'Start new build from Scout findings' },
  { id: '2', label: 'Research Trends', icon: 'trending-up', agentId: 'scout', command: 'Deep dive into latest trends' },
  { id: '3', label: 'Daily Brief', icon: 'file-text', agentId: 'larz', command: 'Generate daily briefing' },
  { id: '4', label: 'Check Costs', icon: 'dollar-sign', agentId: 'guardian', command: 'Show cost dashboard' },
  { id: '5', label: 'Design Assets', icon: 'palette', agentId: 'julie', command: 'Create brand assets' },
  { id: '6', label: 'Innovate', icon: 'zap', agentId: 'innovator', command: 'Suggest improvements' },
];
