import React from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, AlertTriangle, User } from 'lucide-react';

const TYPE_CONFIG = {
  deploy: { color: 'purple', icon: '🚀', label: 'DEPLOY' },
  build: { color: 'cyan', icon: '🏗️', label: 'BUILD' },
  budget: { color: 'yellow', icon: '💰', label: 'BUDGET' },
  review: { color: 'blue', icon: '👁️', label: 'REVIEW' },
  complete: { color: 'green', icon: '✅', label: 'COMPLETE' }
};

export default function ApprovalQueue({ approvals, onApprove, onDeny }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#2a2a3a] flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Approval Queue
        </h2>
        <span className={`text-xs px-2 py-1 rounded-full font-mono ${approvals.length > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
          {approvals.length} PENDING
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {approvals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a25] border border-[#2a2a3a] 
                          flex items-center justify-center text-2xl">
              ✅
            </div>
            <p className="text-sm font-medium">All Caught Up!</p>
            <p className="text-xs mt-1">No pending approvals</p>
          </div>
        ) : (
          approvals.map((item, index) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.review;
            const isUrgent = item.urgent;
            
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 animate-slide-in
                  ${isUrgent 
                    ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                    : 'border-[#2a2a3a] bg-[#1a1a25]'
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${config.color}-500/20 text-${config.color}-400`}>
                      {config.label}
                    </span>
                    {isUrgent && (
                      <span className="flex items-center gap-1 text-[10px] text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{item.desc}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.agent}
                  </span>
                  {item.estimatedCost && (
                    <span className="text-yellow-400">
                      Est. ${item.estimatedCost.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onDeny(item.id)}
                    className="flex-1 py-2 px-3 bg-transparent border border-[#2a2a3a] 
                             text-gray-400 text-xs rounded-lg font-semibold
                             hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5
                             transition-all flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    Deny
                  </button>
                  <button
                    onClick={() => onApprove(item.id)}
                    className="flex-1 py-2 px-3 bg-green-500/10 border border-green-500/50 
                             text-green-400 text-xs rounded-lg font-semibold
                             hover:bg-green-500 hover:text-black
                             transition-all flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
