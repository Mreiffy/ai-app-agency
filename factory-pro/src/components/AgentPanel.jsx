import React from 'react';
import { User, Briefcase, Play, CheckCircle, Clock } from 'lucide-react';

export default function AgentPanel({ agents, selectedAgent, onSelectAgent, onLaunchMission }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]';
      case 'online': return 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#2a2a3a] flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          Agent Roster
        </h2>
        <span className="text-xs text-green-400 font-mono">
          {agents.filter(a => a.status === 'online').length} ONLINE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-xs">Loading agents...</p>
          </div>
        ) : (
          agents.map(agent => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`group relative p-4 rounded-xl border cursor-pointer transition-all
                ${selectedAgent?.id === agent.id 
                  ? 'border-cyan-500/50 bg-cyan-500/5' 
                  : 'border-[#2a2a3a] bg-[#1a1a25] hover:border-[#3a3a4a] hover:bg-[#1e1e2e]'
                }
                ${agent.busy ? 'border-l-4 border-l-cyan-500' : 'border-l-4 border-l-green-500'}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{agent.role}</p>
                  
                  {agent.busy && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{agent.task}</span>
                      </div>
                      <div className="h-1.5 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!agent.busy && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchMission(agent);
                      }}
                      className="mt-3 w-full py-1.5 px-3 bg-cyan-500/10 border border-cyan-500/30 
                               text-cyan-400 text-xs rounded-lg opacity-0 group-hover:opacity-100
                               transition-all hover:bg-cyan-500 hover:text-black font-semibold
                               flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Assign Mission
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
