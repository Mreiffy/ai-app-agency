import { Cpu, DollarSign, Zap } from 'lucide-react';
import { SystemMetrics } from '../types';

interface HeaderProps {
  currentTime: Date;
  metrics: SystemMetrics;
}

export function Header({ currentTime, metrics }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <header className="h-20 glass-panel border-b border-cyber-border/50 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 
                        border border-neon-cyan/30 flex items-center justify-center text-2xl">
          🏭
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">AI APP AGENCY</h1>
          <p className="text-xs text-gray-400 font-mono">Software Factory Command Center</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-gray-300">6 Agents Online</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-yellow" />
            <span className="text-sm text-gray-300">{metrics.activeTasks} Active Tasks</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neon-green" />
            <span className="text-sm text-gray-300">${metrics.dailyCost.toFixed(2)} Today</span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-gray-300">{metrics.apiCalls.toLocaleString()} API Calls</span>
          </div>
        </div>

        {/* Clock */}
        <div className="text-right border-l border-cyber-border pl-6">
          <div className="text-2xl font-mono font-bold text-white">{formatTime(currentTime)}</div>
          <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>
        </div>
      </div>
    </header>
  );
}
