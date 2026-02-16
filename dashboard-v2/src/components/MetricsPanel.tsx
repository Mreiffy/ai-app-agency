import { SystemMetrics } from '../types';
import { DollarSign, TrendingUp, Activity, Package, Wallet } from 'lucide-react';

interface MetricsPanelProps {
  metrics: SystemMetrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const costPercentage = (metrics.monthlyCost / 300) * 100;
  const budgetStatus = costPercentage < 50 ? 'good' : costPercentage < 80 ? 'warning' : 'danger';
  
  const statusColors = {
    good: 'text-neon-green border-neon-green/30 bg-neon-green/5',
    warning: 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/5',
    danger: 'text-neon-red border-neon-red/30 bg-neon-red/5',
  };

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Metrics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Daily Cost */}
        <div className="p-3 rounded-xl bg-cyber-card border border-cyber-border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-gray-400">Daily Cost</span>
          </div>
          <div className="text-xl font-bold text-white">${metrics.dailyCost.toFixed(2)}</div>
          <div className="text-xs text-gray-500">of $10 limit</div>
        </div>

        {/* Monthly Budget */}
        <div className={`p-3 rounded-xl border ${statusColors[budgetStatus]}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs text-gray-400">Monthly</span>
          </div>
          <div className="text-xl font-bold">${metrics.monthlyCost.toFixed(2)}</div>
          <div className="text-xs opacity-70">of $300 budget</div>
        </div>

        {/* Budget Progress */}
        <div className="col-span-2 p-3 rounded-xl bg-cyber-card border border-cyber-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Budget Remaining</span>
            <span className="text-xs font-medium text-neon-green">${metrics.budgetRemaining}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-neon-green"
              style={{ width: `${100 - costPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{100 - Math.round(costPercentage)}% remaining</div>
        </div>

        {/* API Calls */}
        <div className="p-3 rounded-xl bg-cyber-card border border-cyber-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-neon-purple" />
            <span className="text-xs text-gray-400">API Calls</span>
          </div>
          <div className="text-xl font-bold text-white">{metrics.apiCalls.toLocaleString()}</div>
          <div className="text-xs text-gray-500">total requests</div>
        </div>

        {/* Builds */}
        <div className="p-3 rounded-xl bg-cyber-card border border-cyber-border">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-neon-pink" />
            <span className="text-xs text-gray-400">Builds</span>
          </div>
          <div className="text-xl font-bold text-white">{metrics.buildsCompleted}</div>
          <div className="text-xs text-gray-500">completed</div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 p-3 rounded-xl bg-neon-green/5 border border-neon-green/20 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-sm text-neon-green">All systems operational</span>
      </div>
    </div>
  );
}
