import { Agent } from '../types';
import { Clock, Cpu } from 'lucide-react';

interface AgentPanelProps {
  agents: Agent[];
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
}

const statusColors = {
  online: 'bg-neon-green',
  working: 'bg-neon-cyan',
  idle: 'bg-gray-500',
  offline: 'bg-gray-700'
};

const agentColors = {
  cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30',
  purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
  pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30',
  green: 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
  yellow: 'from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/30',
  red: 'from-neon-red/20 to-neon-red/5 border-neon-red/30',
};

export function AgentPanel({ agents, selectedAgent, onSelectAgent }: AgentPanelProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Active Agents
        </h2>
        <span className="text-xs text-neon-green font-mono">{agents.filter(a => a.status !== 'offline').length} ONLINE</span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`agent-card ${selectedAgent.id === agent.id ? 'active' : ''} 
                       bg-gradient-to-br ${agentColors[agent.color]}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{agent.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]} 
                                 ${agent.status === 'working' ? 'animate-pulse' : ''}`} />
                </div>
                <p className="text-xs text-gray-400 truncate">{agent.role}</p>
                
                {agent.currentTask && (
                  <p className="text-xs text-gray-300 mt-2 truncate">{agent.currentTask}</p>
                )}

                {agent.progress && agent.progress > 0 && (
                  <div className="mt-2">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill transition-all duration-500"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{agent.progress}%</span>
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{agent.lastActivity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
