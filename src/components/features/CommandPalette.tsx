import { useState, useEffect, useCallback } from 'react';
import {
  Command, Search, Plus, RotateCcw, PanelRightOpen, Brain,
  FileText, Code2, Zap, X, ArrowRight
} from 'lucide-react';
import type { AIMode, EditorMode } from '@/types';
import { XM3_AGENTS } from '@/constants/agents';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNewSession: () => void;
  onToggleEditor: () => void;
  onSetAiMode: (mode: AIMode) => void;
  onSetEditorMode: (mode: EditorMode) => void;
  onSetAgent: (id: string) => void;
  currentAiMode: AIMode;
  currentEditorMode: EditorMode;
  currentAgentId: string;
}

interface CommandItem {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  icon: React.FC<{ className?: string }>;
  color?: string;
  action: () => void;
}

const CommandPalette = ({
  open,
  onClose,
  onNewSession,
  onToggleEditor,
  onSetAiMode,
  onSetEditorMode,
  onSetAgent,
  currentAiMode,
  currentEditorMode,
  currentAgentId,
}: CommandPaletteProps) => {
  const [query, setQuery] = useState('');

  const commands: CommandItem[] = [
    {
      id: 'new-session',
      label: 'New Session',
      description: 'Start a fresh conversation',
      shortcut: 'N',
      icon: Plus,
      color: 'text-blue-400',
      action: () => { onNewSession(); onClose(); },
    },
    {
      id: 'toggle-editor',
      label: 'Toggle Editor Panel',
      description: 'Show or hide the editor pane',
      shortcut: 'E',
      icon: PanelRightOpen,
      action: () => { onToggleEditor(); onClose(); },
    },
    {
      id: 'mode-chat',
      label: 'Switch to Chat Mode',
      description: currentAiMode === 'chat' ? '✓ Active' : 'Standard conversation',
      shortcut: '1',
      icon: Command,
      color: 'text-blue-400',
      action: () => { onSetAiMode('chat'); onClose(); },
    },
    {
      id: 'mode-think',
      label: 'Switch to Think Mode',
      description: currentAiMode === 'think' ? '✓ Active' : 'Deep reasoning & analysis',
      shortcut: '2',
      icon: Brain,
      color: 'text-violet-400',
      action: () => { onSetAiMode('think'); onClose(); },
    },
    {
      id: 'mode-search',
      label: 'Switch to DeepSearch',
      description: currentAiMode === 'deepsearch' ? '✓ Active' : 'Real-time web synthesis',
      shortcut: '3',
      icon: Search,
      color: 'text-emerald-400',
      action: () => { onSetAiMode('deepsearch'); onClose(); },
    },
    {
      id: 'editor-doc',
      label: 'Document Editor',
      description: currentEditorMode === 'document' ? '✓ Active' : 'Switch to document editing',
      icon: FileText,
      color: 'text-blue-400',
      action: () => { onSetEditorMode('document'); onClose(); },
    },
    {
      id: 'editor-code',
      label: 'Code Editor',
      description: currentEditorMode === 'code' ? '✓ Active' : 'Switch to code editing',
      icon: Code2,
      color: 'text-cyan-400',
      action: () => { onSetEditorMode('code'); onClose(); },
    },
    ...XM3_AGENTS.map((agent) => ({
      id: `agent-${agent.id}`,
      label: `Use ${agent.name}`,
      description: agent.tagline + (currentAgentId === agent.id ? ' · ✓ Active' : ''),
      icon: Zap,
      color: agent.accentColor,
      action: () => { onSetAgent(agent.id); onClose(); },
    })),
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset query when opened
  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg surface-1 border border-[hsl(var(--border))] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[hsl(var(--border))]">
          <Search className="w-4 h-4 text-[hsl(var(--text-subtle))] flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-[hsl(var(--text-subtle))] outline-none"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="text-[10px] px-1.5 py-0.5 surface-3 border border-[hsl(var(--border))] rounded text-[hsl(var(--text-subtle))]">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 rounded text-[hsl(var(--text-subtle))] hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Commands list */}
        <div className="max-h-[320px] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-[hsl(var(--text-subtle))]">
              No commands found for "{query}"
            </div>
          )}
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[hsl(var(--surface-2))] transition-colors group text-left"
              >
                <div className="w-7 h-7 rounded-lg surface-3 border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${cmd.color ?? 'text-[hsl(var(--text-secondary))]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{cmd.label}</p>
                  <p className="text-xs text-[hsl(var(--text-subtle))] truncate">{cmd.description}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cmd.shortcut && (
                    <kbd className="text-[10px] px-1.5 py-0.5 surface-3 border border-[hsl(var(--border))] rounded text-[hsl(var(--text-subtle))]">
                      {cmd.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="w-3 h-3 text-[hsl(var(--text-subtle))]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] flex items-center gap-4">
          <span className="text-[10px] text-[hsl(var(--text-subtle))]">
            <kbd className="px-1 py-0.5 surface-3 border border-[hsl(var(--border))] rounded mr-1">↑↓</kbd> Navigate
          </span>
          <span className="text-[10px] text-[hsl(var(--text-subtle))]">
            <kbd className="px-1 py-0.5 surface-3 border border-[hsl(var(--border))] rounded mr-1">↵</kbd> Select
          </span>
          <span className="text-[10px] text-[hsl(var(--text-subtle))] ml-auto flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>+K to open</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
