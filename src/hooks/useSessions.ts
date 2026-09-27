import { useState, useCallback } from 'react';
import type { Message, AIMode, EditorMode, Document, CodeFile } from '@/types';
import { DEFAULT_CODE, SAMPLE_DOCUMENT } from '@/constants';

const generateId = () => Math.random().toString(36).slice(2, 10);

export interface SessionEntry {
  id: string;
  title: string;
  messages: Message[];
  aiMode: AIMode;
  editorMode: EditorMode;
  document: Document;
  codeFile: CodeFile;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

function makeWelcome(): Message {
  return {
    id: 'welcome-' + generateId(),
    role: 'assistant',
    content: `Welcome to **Xm3 AI Studio**. I'm ready to collaborate.\n\n- Type \`/think\` for deep reasoning\n- Type \`/search\` to activate DeepSearch\n- Use the editor on the right to write docs or code\n\nWhat are we building today?`,
    timestamp: new Date(),
    mode: 'chat',
  };
}

function makeDefaultDoc(): Document {
  return {
    id: generateId(),
    title: 'Untitled Document',
    content: SAMPLE_DOCUMENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function makeDefaultCode(): CodeFile {
  return {
    id: generateId(),
    name: 'main.py',
    language: 'python',
    content: DEFAULT_CODE['python'],
  };
}

function makeSession(overrides: Partial<SessionEntry> = {}): SessionEntry {
  return {
    id: generateId(),
    title: 'New Session',
    messages: [makeWelcome()],
    aiMode: 'chat',
    editorMode: 'document',
    document: makeDefaultDoc(),
    codeFile: makeDefaultCode(),
    agentId: 'xm3-core',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionEntry[]>(() => [makeSession()]);
  const [activeId, setActiveId] = useState<string>(() => sessions[0]?.id ?? '');

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  const createSession = useCallback(() => {
    const s = makeSession();
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
    return s;
  }, []);

  const switchSession = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const s = makeSession();
        return [s];
      }
      return remaining;
    });
    setActiveId((prev) => {
      if (prev !== id) return prev;
      const remaining = sessions.filter((s) => s.id !== id);
      return remaining[0]?.id ?? sessions[0]?.id ?? '';
    });
  }, [sessions]);

  const renameSession = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, updatedAt: new Date() } : s))
    );
  }, []);

  const updateActiveSession = useCallback((patch: Partial<SessionEntry>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, ...patch, updatedAt: new Date() } : s))
    );
  }, [activeId]);

  /** Auto-title from first user message */
  const autoTitle = useCallback((msgs: Message[]) => {
    const first = msgs.find((m) => m.role === 'user');
    if (!first) return;
    const title = first.content.slice(0, 36) + (first.content.length > 36 ? '…' : '');
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId && s.title === 'New Session' ? { ...s, title } : s
      )
    );
  }, [activeId]);

  return {
    sessions,
    activeSession,
    activeId,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    updateActiveSession,
    autoTitle,
  };
}
