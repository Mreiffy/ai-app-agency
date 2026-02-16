import { QuickAction, QUICK_ACTIONS } from '../types';
import { Hammer, TrendingUp, FileText, DollarSign, Palette, Zap, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: QuickAction) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'hammer': <Hammer className="w-4 h-4" />,
  'trending-up': <TrendingUp className="w-4 h-4" />,
  'file-text': <FileText className="w-4 h-4" />,
  'dollar-sign': <DollarSign className="w-4 h-4" />,
  'palette': <Palette className="w-4 h-4" />,
  'zap': <Zap className="w-4 h-4" />,
};

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            className="p-3 rounded-xl bg-cyber-card border border-cyber-border 
                     hover:border-neon-cyan/50 hover:bg-neon-cyan/5
                     transition-all group text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-neon-cyan group-hover:scale-110 transition-transform">
                {iconMap[action.icon]}
              </span>
              <span className="text-sm font-medium text-white">{action.label}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{action.command}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
