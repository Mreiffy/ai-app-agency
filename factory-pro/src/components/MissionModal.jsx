import React, { useState, useEffect } from 'react';
import { X, Rocket, Search, Palette, Code, Lightbulb, Send } from 'lucide-react';

const QUICK_MISSIONS = [
  { id: 'research', icon: Search, label: 'Deep Research', agent: 'scout', desc: 'Analyze trends & competitors' },
  { id: 'design', icon: Palette, label: 'Design Sprint', agent: 'julie', desc: 'Create UI/UX & assets' },
  { id: 'build', icon: Code, label: 'Build MVP', agent: 'engineer', desc: 'Ship working prototype' },
  { id: 'improve', icon: Lightbulb, label: 'Optimize', agent: 'innovator', desc: 'Suggest improvements' }
];

export default function MissionModal({ agents, selectedAgent, onClose, onSubmit }) {
  const [agentId, setAgentId] = useState(selectedAgent?.id || '');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAgent) {
      setAgentId(selectedAgent.id);
    }
  }, [selectedAgent]);

  const handleQuickMission = (mission) => {
    setAgentId(mission.agent);
    setDetails(`${mission.label}: ${mission.desc}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agentId || !details.trim()) return;
    
    setSubmitting(true);
    await onSubmit({ agentId, details: details.trim(), type: 'mission' });
    setSubmitting(false);
  };

  const selectedAgentData = agents.find(a => a.id === agentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#12121a] border border-[#2a2a3a] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a3a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                          border border-cyan-500/30 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Launch Mission</h2>
              <p className="text-xs text-gray-500">Assign a task to an agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#2a2a3a] flex items-center justify-center
                     text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Quick Missions */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
              Quick Missions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_MISSIONS.map(mission => {
                const Icon = mission.icon;
                const isSelected = agentId === mission.agent && details.includes(mission.label);
                
                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => handleQuickMission(mission)}
                    className={`p-3 rounded-xl border text-left transition-all
                      ${isSelected 
                        ? 'border-cyan-500/50 bg-cyan-500/10' 
                        : 'border-[#2a2a3a] bg-[#1a1a25] hover:border-[#3a3a4a]'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <div className="font-semibold text-sm">{mission.label}</div>
                    <div className="text-[10px] text-gray-500">{mission.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agent Selection */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Select Agent
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full bg-[#1a1a25] border border-[#2a2a3a] rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30
                       transition-all"
            >
              <option value="">Choose an available agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.avatar} {agent.name} — {agent.role}
                </option>
              ))}
            </select>
            {selectedAgentData && (
              <p className="mt-2 text-xs text-cyan-400 flex items-center gap-1">
                <span>●</span>
                {selectedAgentData.name} is ready for this mission
              </p>
            )}
          </div>

          {/* Mission Details */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Mission Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what you want the agent to accomplish..."
              rows={4}
              className="w-full bg-[#1a1a25] border border-[#2a2a3a] rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30
                       transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-transparent border border-[#2a2a3a] 
                       text-gray-400 rounded-xl font-semibold text-sm
                       hover:border-gray-500 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agentId || !details.trim() || submitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 
                       text-black rounded-xl font-bold text-sm
                       hover:from-cyan-400 hover:to-purple-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Launch Mission
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
