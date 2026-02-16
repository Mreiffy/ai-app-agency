import { useState, useRef, useEffect } from 'react';
import { Agent, Message } from '../types';
import { Send, User, Command, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ChatPanelProps {
  agent: Agent;
  messages: Message[];
  onSendMessage: (agentId: string, content: string) => void;
}

const agentColors = {
  cyan: 'border-neon-cyan/30 bg-neon-cyan/5',
  purple: 'border-neon-purple/30 bg-neon-purple/5',
  pink: 'border-neon-pink/30 bg-neon-pink/5',
  green: 'border-neon-green/30 bg-neon-green/5',
  yellow: 'border-neon-yellow/30 bg-neon-yellow/5',
  red: 'border-neon-red/30 bg-neon-red/5',
};

const suggestions = [
  "What's the current status?",
  "Start a new build",
  "Show me today's trends",
  "Check our costs",
  "Plan tomorrow's work",
];

export function ChatPanel({ agent, messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(agent.id, input);
      setInput('');
    }
  };

  return (
    <div className={`glass-panel rounded-2xl h-full flex flex-col overflow-hidden ${agentColors[agent.color]}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-cyber-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h2 className="font-semibold text-white flex items-center gap-2">
              {agent.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green border border-neon-green/30">
                {agent.status}
              </span>
            </h2>
            <p className="text-xs text-gray-400">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Command className="w-4 h-4" />
          <span>Chat Mode</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 
                           border border-neon-cyan/30 flex items-center justify-center text-4xl animate-float">
              {agent.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation with {agent.name}</h3>
              <p className="text-sm text-gray-400 max-w-md">
                {agent.name} is ready to help. Ask about current tasks, request work, or get updates on the agency.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(agent.id, suggestion)}
                  className="px-3 py-1.5 text-xs bg-cyber-card border border-cyber-border rounded-lg 
                           text-gray-300 hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''} animate-slide-in`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                             ${message.sender === 'user' 
                               ? 'bg-neon-cyan/20 border border-neon-cyan/30' 
                               : 'bg-cyber-card border border-cyber-border'}`}>
                {message.sender === 'user' 
                  ? <User className="w-4 h-4 text-neon-cyan" />
                  : <span className="text-sm">{agent.avatar}</span>
                }
              </div>
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-xl text-sm
                               ${message.sender === 'user'
                                 ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-white'
                                 : 'bg-cyber-card border border-cyber-border text-gray-200'}`}>
                  {message.content}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {format(message.timestamp, 'HH:mm')}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cyber-border/50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 
                       focus:ring-1 focus:ring-neon-cyan/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              ↵ Enter
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-3 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-xl
                     hover:bg-neon-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
