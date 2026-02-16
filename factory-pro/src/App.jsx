import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AgentPanel from './components/AgentPanel';
import FactoryFloor from './components/FactoryFloor';
import ApprovalQueue from './components/ApprovalQueue';
import MissionModal from './components/MissionModal';
import Toast from './components/Toast';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [agents, setAgents] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [metrics, setMetrics] = useState({ daily: 0, monthly: 0, budget: 300, remaining: 300, apiCalls: 0, buildsCompleted: 0 });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [view, setView] = useState('floor'); // 'floor' | 'agent' | 'analytics'

  const { lastMessage, connected } = useWebSocket('ws://localhost:3001');

  // Fetch initial data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s as backup
    return () => clearInterval(interval);
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'agents':
          setAgents(lastMessage.data);
          break;
        case 'approval_handled':
          fetchApprovals();
          addToast(lastMessage.approved ? '✅ Approved' : '❌ Denied', 'success');
          break;
        case 'mission_created':
          addToast('🚀 Mission Launched', 'success');
          fetchAgents();
          break;
      }
    }
  }, [lastMessage]);

  const fetchData = async () => {
    await Promise.all([fetchAgents(), fetchApprovals(), fetchMetrics()]);
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data);
    } catch (e) {
      console.error('Failed to fetch agents:', e);
    }
  };

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      setApprovals(data);
    } catch (e) {
      console.error('Failed to fetch approvals:', e);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (e) {
      console.error('Failed to fetch metrics:', e);
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      await fetch(`/api/approvals/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      await fetchApprovals();
    } catch (e) {
      addToast('❌ Failed to process approval', 'error');
    }
  };

  const handleLaunchMission = async (mission) => {
    try {
      await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mission)
      });
      setShowMissionModal(false);
      addToast(`🚀 Mission assigned to ${mission.agentId}`, 'success');
      await fetchAgents();
    } catch (e) {
      addToast('❌ Failed to launch mission', 'error');
    }
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,240,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <Header 
        metrics={metrics} 
        connected={connected}
        onLaunchMission={() => setShowMissionModal(true)}
        view={view}
        setView={setView}
      />

      <main className="flex-1 grid grid-cols-12 gap-0 relative z-10">
        {/* Left Sidebar - Agents */}
        <aside className="col-span-3 glass-panel border-r border-[#2a2a3a] flex flex-col">
          <AgentPanel 
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            onLaunchMission={(agent) => {
              setSelectedAgent(agent);
              setShowMissionModal(true);
            }}
          />
        </aside>

        {/* Center - Factory Floor or Agent Detail */}
        <section className="col-span-6 relative">
          {view === 'floor' ? (
            <FactoryFloor 
              agents={agents}
              onSelectAgent={setSelectedAgent}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-lg font-semibold mb-2">{selectedAgent?.name || 'Select an Agent'}</h3>
                <p className="text-sm">Click on an agent to view details</p>
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar - Approvals */}
        <aside className="col-span-3 glass-panel border-l border-[#2a2a3a] flex flex-col">
          <ApprovalQueue 
            approvals={approvals}
            onApprove={(id) => handleApprove(id, true)}
            onDeny={(id) => handleApprove(id, false)}
          />
        </aside>
      </main>

      {/* Mission Modal */}
      {showMissionModal && (
        <MissionModal
          agents={agents.filter(a => !a.busy)}
          selectedAgent={selectedAgent}
          onClose={() => setShowMissionModal(false)}
          onSubmit={handleLaunchMission}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>

      {/* Launch Button */}
      <button
        onClick={() => setShowMissionModal(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-8 py-4 
                   bg-gradient-to-r from-cyan-500 to-purple-500 
                   hover:from-cyan-400 hover:to-purple-400
                   text-black font-bold rounded-xl shadow-lg shadow-cyan-500/30
                   transition-all hover:scale-105 hover:-translate-y-1
                   flex items-center gap-3 text-lg"
      >
        <span>🚀</span>
        LAUNCH MISSION
      </button>
    </div>
  );
}

export default App;
