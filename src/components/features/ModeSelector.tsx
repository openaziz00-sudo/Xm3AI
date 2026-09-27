import { Brain, Search, MessageCircle, ChevronDown } from 'lucide-react';
import type { AIMode } from '@/types';
import { XM3_AGENTS } from '@/constants/agents';
import { useState } from 'react';

interface ModeSelectorProps {
  aiMode: AIMode;
  onModeChange: (mode: AIMode) => void;
  agentId: string;
  onAgentChange: (id: string) => void;
}

const modes: { value: AIMode; label: string; icon: React.FC<{ className?: string }>; desc: string; color: string }[] = [
  { value: 'chat', label: 'Chat', icon: MessageCircle, desc: 'Standard conversation', color: 'text-blue-400' },
  { value: 'think', label: 'Think', icon: Brain, desc: 'Deep reasoning & analysis', color: 'text-violet-400' },
  { value: 'deepsearch', label: 'Search', icon: Search, desc: 'Real-time web synthesis', color: 'text-emerald-400' },
];

const ModeSelector = ({ aiMode, onModeChange, agentId, onAgentChange }: ModeSelectorProps) => {
  const [agentOpen, setAgentOpen] = useState(false);
  const currentAgent = XM3_AGENTS.find((a) => a.id === agentId) ?? XM3_AGENTS[0];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Mode buttons */}
      <div className="flex items-center gap-0.5 surface-2 border border-[hsl(var(--border))] rounded-lg p-0.5">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = aiMode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              title={m.desc}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                active
                  ? 'bg-[hsl(var(--surface-3))] text-foreground shadow-sm'
                  : 'text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? m.color : ''}`} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Agent selector — shows branded name only */}
      <div className="relative">
        <button
          onClick={() => setAgentOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 surface-2 border border-[hsl(var(--border))] rounded-lg text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-foreground hover:border-[hsl(var(--blue-glow))] transition-all duration-200 min-w-[110px] justify-between"
        >
          <span className={currentAgent.accentColor}>{currentAgent.icon}</span>
          <span className="truncate">{currentAgent.name}</span>
          <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${agentOpen ? 'rotate-180' : ''}`} />
        </button>

        {agentOpen && (
          <div className="absolute top-full mt-1 right-0 w-56 surface-1 border border-[hsl(var(--border))] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-[hsl(var(--border))]">
              <p className="text-[10px] text-[hsl(var(--text-subtle))] uppercase tracking-widest font-medium">AI Agents</p>
            </div>
            {XM3_AGENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => { onAgentChange(a.id); setAgentOpen(false); }}
                className={`w-full text-left px-3 py-2.5 transition-colors flex items-start gap-2.5 ${
                  agentId === a.id
                    ? 'bg-[hsl(var(--surface-3))]'
                    : 'hover:bg-[hsl(var(--surface-2))]'
                }`}
              >
                <span className={`text-base leading-none mt-0.5 ${a.accentColor}`}>{a.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${a.accentColor}`}>{a.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${a.bgColor} ${a.accentColor}`}>
                      {a.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-[hsl(var(--text-subtle))] mt-0.5 truncate">{a.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeSelector;
