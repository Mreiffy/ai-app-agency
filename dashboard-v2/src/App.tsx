import { useState, useEffect, useCallback } from 'react';
import { AGENTS, Activity, Message, SystemMetrics } from './types';
import { Header } from './components/Header';
import { AgentPanel } from './components/AgentPanel';
import { ChatPanel } from './components/ChatPanel';
import { ActivityFeed } from './components/ActivityFeed';
import { MetricsPanel } from './components/MetricsPanel';
import { QuickActions } from './components/QuickActions';
import './index.css';

function App() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [metrics] = useState<SystemMetrics>({
    dailyCost: 0,
    monthlyCost: 0,
    budgetRemaining: 300,
    apiCalls: 1452,
    buildsCompleted: 0,
    activeTasks: 2
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate activities
  useEffect(() => {
    const sampleActivities: Activity[] = [
      {
        id: '1',
        agentId: 'scout',
        agentName: 'Scout',
        type: 'task_complete',
        message: 'Completed trend analysis - found 7 opportunities',
        timestamp: new Date(Date.now() - 1000 * 60 * 2)
      },
      {
        id: '2',
        agentId: 'larz',
        agentName: 'Larz',
        type: 'message',
        message: 'Dashboard deployed successfully to Vercel',
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '3',
        agentId: 'innovator',
        agentName: 'Innovator',
        type: 'task_start',
        message: 'Planning overnight build: PromptSync',
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        id: '4',
        agentId: 'guardian',
        agentName: 'Guardian',
        type: 'message',
        message: 'Cost check: $0.00 / $10 daily budget ✅',
        timestamp: new Date(Date.now() - 1000 * 60 * 15)
      }
    ];
    setActivities(sampleActivities);

    // Add new activity every 10-30 seconds
    const interval = setInterval(() => {
      const agents = AGENTS.filter(a => a.status === 'working');
      if (agents.length > 0) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const newActivity: Activity = {
          id: Date.now().toString(),
          agentId: agent.id,
          agentName: agent.name,
          type: Math.random() > 0.5 ? 'message' : 'task_complete',
          message: `${agent.currentTask} - ${Math.floor(Math.random() * 20) + 80}% complete`,
          timestamp: new Date()
        };
        setActivities(prev => [newActivity, ...prev].slice(0, 50));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = useCallback((agentId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      agentId,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), newMessage]
    }));

    // Simulate agent response
    setTimeout(() => {
      const agent = AGENTS.find(a => a.id === agentId);
      if (agent) {
        const responses: Record<string, string> = {
          larz: "I'm coordinating the team. What would you like me to prioritize?",
          scout: "I'm monitoring Product Hunt, Hacker News, and Twitter. Found some interesting trends today!",
          julie: "Ready to create content! Need landing page copy, social posts, or design assets?",
          engineer: "Standing by. What should I build? I can scaffold a full app in minutes.",
          innovator: "I've been analyzing our workflows. Have some ideas for optimization!",
          guardian: "All systems secure. Current spend: $0.00. You're well within budget."
        };

        const response: Message = {
          id: (Date.now() + 1).toString(),
          agentId,
          content: responses[agentId] || "I'm on it! Processing your request...",
          sender: 'agent',
          timestamp: new Date()
        };

        setMessages(prev => ({
          ...prev,
          [agentId]: [...(prev[agentId] || []), response]
        }));
      }
    }, 1000);
  }, []);

  const handleQuickAction = useCallback((action: { agentId?: string; command: string }) => {
    if (action.agentId) {
      const agent = AGENTS.find(a => a.id === action.agentId);
      if (agent) {
        setSelectedAgent(agent);
        handleSendMessage(agent.id, action.command);
      }
    }
  }, [handleSendMessage]);

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <Header currentTime={currentTime} metrics={metrics} />
      
      <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        {/* Left Panel - Agent Selection */}
        <div className="col-span-3 flex flex-col gap-4 h-full">
          <AgentPanel 
            agents={AGENTS}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
          <QuickActions onAction={handleQuickAction} />
        </div>

        {/* Center Panel - Chat */}
        <div className="col-span-6 h-full">
          <ChatPanel 
            agent={selectedAgent}
            messages={messages[selectedAgent.id] || []}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right Panel - Activity & Metrics */}
        <div className="col-span-3 flex flex-col gap-4 h-full">
          <MetricsPanel metrics={metrics} />
          <ActivityFeed activities={activities} />
        </div>
      </main>
    </div>
  );
}

export default App;
