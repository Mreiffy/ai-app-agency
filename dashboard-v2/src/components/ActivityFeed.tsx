import { Activity } from '../types';
import { Terminal, AlertCircle, CheckCircle, MessageSquare, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Activity[];
}

const typeIcons = {
  task_start: <Clock className="w-4 h-4 text-neon-cyan" />,
  task_complete: <CheckCircle className="w-4 h-4 text-neon-green" />,
  message: <MessageSquare className="w-4 h-4 text-neon-purple" />,
  alert: <AlertCircle className="w-4 h-4 text-neon-yellow" />,
  error: <AlertTriangle className="w-4 h-4 text-neon-red" />,
};

const typeColors = {
  task_start: 'border-neon-cyan/30 bg-neon-cyan/5',
  task_complete: 'border-neon-green/30 bg-neon-green/5',
  message: 'border-neon-purple/30 bg-neon-purple/5',
  alert: 'border-neon-yellow/30 bg-neon-yellow/5',
  error: 'border-neon-red/30 bg-neon-red/5',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Activity Feed
        </h2>
        <span className="text-xs text-gray-500 font-mono">{activities.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 rounded-xl border ${typeColors[activity.type]} animate-slide-in`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcons[activity.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-gray-300">{activity.agentName}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{activity.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
