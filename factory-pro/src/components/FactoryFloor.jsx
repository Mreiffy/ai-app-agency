import React from 'react';
import { Factory, Cpu, Sparkles, Shield } from 'lucide-react';

const WORKSTATIONS = [
  { id: 'research', name: 'Research Lab', icon: '🔬', role: 'scout' },
  { id: 'design', name: 'Design Studio', icon: '🎨', role: 'julie' },
  { id: 'build', name: 'Build Station', icon: '⚡', role: 'engineer' },
  { id: 'strategy', name: 'Strategy Room', icon: '📊', role: 'larz' },
  { id: 'innovation', name: 'Innovation Lab', icon: '💡', role: 'innovator' },
  { id: 'security', name: 'Security Hub', icon: '🔒', role: 'guardian' }
];

export default function FactoryFloor({ agents, onSelectAgent }) {
  const getAgentForStation = (roleId) => agents.find(a => a.id === roleId) || null;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Factory className="w-4 h-4" />
          Factory Floor
        </h2>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Working</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {WORKSTATIONS.map((station, index) => {
          const agent = getAgentForStation(station.role);
          const isBusy = agent?.busy;
          
          return (
            <div
              key={station.id}
              onClick={() => agent && onSelectAgent(agent)}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all
                ${isBusy 
                  ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                  : 'border-[#2a2a3a] bg-[#12121a] hover:border-[#3a3a4a]'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                <div className={`w-3 h-3 rounded-full ${isBusy ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]'}`} />
              </div>

              {/* Station Header */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{station.name}</p>
              </div>

              {/* Agent Display */}
              <div className="flex flex-col items-center justify-center h-[calc(100%-60px)]">
                {agent ? (
                  <>
                    <div className={`text-5xl mb-3 ${isBusy ? 'animate-pulse' : ''}`}>
                      {agent.avatar}
                    </div>
                    <h3 className="font-bold text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{agent.role}</p>
                    
                    {isBusy && (
                      <div className="w-full mt-4">
                        <p className="text-xs text-cyan-400 text-center mb-2 truncate px-2">
                          {agent.task}
                        </p>
                        <div className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${agent.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 mt-1 font-mono">
                          {agent.progress}%
                        </p>
                      </div>
                    )}
                    
                    {!isBusy && (
                      <div className="mt-3 px-3 py-1 bg-green-500/10 border border-green-500/30 
                                    text-green-400 text-[10px] rounded-full">
                        Ready for Mission
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    <div className="text-3xl mb-2">{station.icon}</div>
                    <p className="text-xs">No Agent Assigned</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
