import { RotateCcw, PanelRightOpen, Globe } from 'lucide-react';
import ChatMessages from '@/components/features/ChatMessages';
import ChatInput from '@/components/features/ChatInput';
import ModeSelector from '@/components/features/ModeSelector';
import type { Message, AIMode } from '@/types';
import { XM3_AGENTS } from '@/constants/agents';

interface ChatPaneProps {
  messages: Message[];
  isLoading: boolean;
  aiMode: AIMode;
  onModeChange: (mode: AIMode) => void;
  onSend: (content: string) => void;
  onClear: () => void;
  agentId: string;
  onAgentChange: (id: string) => void;
  onToggleEditor: () => void;
  editorVisible: boolean;
  onOpenBrowser: () => void;
  onOpenCommandPalette: () => void;
}

const ChatPane = ({
  messages,
  isLoading,
  aiMode,
  onModeChange,
  onSend,
  onClear,
  agentId,
  onAgentChange,
  onToggleEditor,
  editorVisible,
  onOpenBrowser,
  onOpenCommandPalette,
}: ChatPaneProps) => {
  const currentAgent = XM3_AGENTS.find((a) => a.id === agentId) ?? XM3_AGENTS[0];

  return (
    <div className="flex flex-col h-full surface-1 border-r border-[hsl(var(--border))]">
      {/* Pane header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className={`text-sm font-bold tracking-tight ${currentAgent.accentColor}`}>
            {currentAgent.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full surface-3 border border-[hsl(var(--border))] text-[hsl(var(--text-subtle))] uppercase tracking-widest">
            {currentAgent.badge}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onOpenBrowser}
            title="Browser Preview"
            className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            title="New session"
            className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-3))] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleEditor}
            title={editorVisible ? 'Hide editor' : 'Show editor'}
            className={`p-1.5 rounded-lg transition-colors ${
              editorVisible
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-3))]'
            }`}
          >
            <PanelRightOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
        <ModeSelector
          aiMode={aiMode}
          onModeChange={onModeChange}
          agentId={agentId}
          onAgentChange={onAgentChange}
        />
      </div>

      {/* Messages */}
      <ChatMessages messages={messages} isLoading={isLoading} aiMode={aiMode} />

      {/* Input */}
      <ChatInput onSend={onSend} isLoading={isLoading} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  );
};

export default ChatPane;
