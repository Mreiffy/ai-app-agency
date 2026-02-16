import React from 'react';
import { Activity, Zap, DollarSign, Clock, Wifi, WifiOff } from 'lucide-react';

export default function Header({ metrics, connected, onLaunchMission, view, setView }) {
  const formatCurrency = (val) => `$${val.toFixed(2)}`;
  
  const budgetPercent = (metrics.monthly / metrics.budget) * 100;
  const budgetColor = budgetPercent > 80 ? 'text-red-400' : budgetPercent > 50 ? 'text-yellow-400' : 'text-green-400';

  return (
    <header className="h-16 glass-panel border-b border-[#2a2a3a] flex items-center justify-between px-6 relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                       border border-cyan-500/30 flex items-center justify-center text-xl">
          🏭
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 
                        bg-clip-text text-transparent">
            SOFTWARE FACTORY
          </h1>
          <p className="text-[10px] text-gray-500 font-mono">AI APP AGENCY v2.0</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-gray-400">{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400">6 Agents</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400">{metrics.buildsCompleted} Builds</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className={budgetColor}>{formatCurrency(metrics.monthly)}</span>
            <span className="text-gray-600">/ ${metrics.budget}</span>
          </div>

          <div className="w-px h-6 bg-[#2a2a3a]" />

          <div className="font-mono text-lg font-bold">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Manager Badge */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a25] rounded-lg border border-[#2a2a3a]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 
                       flex items-center justify-center text-sm">
          👤
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold">Factory Manager</div>
          <div className="text-[10px] text-gray-500">You</div>
        </div>
      </div>
    </header>
  );
}
