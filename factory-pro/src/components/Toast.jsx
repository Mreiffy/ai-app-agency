import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

const COLORS = {
  success: 'border-green-500/50 bg-green-500/10 text-green-400',
  error: 'border-red-500/50 bg-red-500/10 text-red-400',
  info: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
};

export default function Toast({ message, type = 'info' }) {
  const Icon = ICONS[type];
  
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border animate-slide-in ${COLORS[type]}`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
