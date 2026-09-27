import { useState } from 'react';
import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { SessionEntry } from '@/hooks/useSessions';

interface SessionHistoryProps {
  sessions: SessionEntry[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SessionHistory = ({
  sessions,
  activeId,
  onSwitch,
  onCreate,
  onDelete,
  collapsed,
  onToggle,
}: SessionHistoryProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className={`flex flex-col h-full border-r border-[hsl(var(--border))] transition-all duration-300 ${
        collapsed ? 'w-12' : 'w-56'
      } flex-shrink-0 bg-[hsl(var(--sidebar-background))]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-[hsl(var(--border))]">
        {!collapsed && (
          <span className="text-xs font-semibold text-[hsl(var(--text-secondary))] tracking-wide uppercase ml-1">
            Sessions
          </span>
        )}
        <div className={`flex items-center gap-1 ${collapsed ? 'w-full justify-center' : 'ml-auto'}`}>
          {!collapsed && (
            <button
              onClick={onCreate}
              title="New session"
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsed: icons only */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1 pt-2">
          <button
            onClick={onCreate}
            title="New session"
            className="p-2 rounded-lg text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSwitch(s.id)}
              title={s.title}
              className={`p-2 rounded-lg transition-colors ${
                s.id === activeId
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Expanded: full list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-1">
          {sessions.map((s) => {
            const isActive = s.id === activeId;
            const isHovered = hoveredId === s.id;
            return (
              <div
                key={s.id}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex items-start gap-2.5 px-3 py-2.5 mx-1 my-0.5 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-blue-500/10 border border-blue-500/20 text-foreground'
                    : 'hover:bg-[hsl(var(--surface-2))] text-[hsl(var(--text-secondary))]'
                }`}
                onClick={() => onSwitch(s.id)}
              >
                <MessageSquare className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-[hsl(var(--text-subtle))]'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate leading-tight ${isActive ? 'text-foreground' : ''}`}>
                    {s.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-[hsl(var(--text-subtle))]" />
                    <span className="text-[10px] text-[hsl(var(--text-subtle))]">{timeAgo(s.updatedAt)}</span>
                  </div>
                </div>

                {/* Delete button */}
                {(isHovered || isActive) && sessions.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                    title="Delete session"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[hsl(var(--text-subtle))] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
