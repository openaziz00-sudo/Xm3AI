
import { useEffect, useCallback, useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { useChat } from '@/hooks/useChat';
import { useEditor } from '@/hooks/useEditor';
import { XM3_AGENTS, DEFAULT_AGENT_ID } from '@/constants/agents';
import ChatPane from '@/components/features/ChatPane';
import EditorPane from '@/components/features/EditorPane';
import SessionHistory from '@/components/features/SessionHistory';
import CommandPalette from '@/components/features/CommandPalette';
import BrowserPreview from '@/components/features/BrowserPreview';
import FileManager from '@/components/features/FileManager';
import SettingsDialog from '@/components/features/SettingsDialog';

interface StudioProps {
  externalCmdOpen?: boolean;
  onCmdClose?: () => void;
}

const Studio = ({ externalCmdOpen, onCmdClose }: StudioProps) => {
  const [editorVisible, setEditorVisible] = useState(true);
  const [sessionSidebarCollapsed, setSessionSidebarCollapsed] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [browserPreviewOpen, setBrowserPreviewOpen] = useState(false);
  const [agentId, setAgentId] = useState(DEFAULT_AGENT_ID);

  // Sync external command palette trigger from header
  useEffect(() => {
    if (externalCmdOpen) {
      setCommandPaletteOpen(true);
    }
  }, [externalCmdOpen]);

  const { sessions, activeSession, activeId, createSession, switchSession, deleteSession, updateActiveSession, autoTitle } = useSessions();
  const currentAgent = XM3_AGENTS.find((a) => a.id === agentId) ?? XM3_AGENTS[0];

  const { messages, isLoading, aiMode, setAiMode, sendMessage, clearMessages, replaceMessages } = useChat(
    activeSession.aiMode,
    currentAgent.name,
    agentId
  );

  const {
    editorMode, setEditorMode,
    document, codeFile, isSaved,
    updateDocumentContent, updateDocumentTitle,
    updateCodeContent, updateCodeLanguage,
    replaceAll,
  } = useEditor(activeSession.document, activeSession.codeFile, activeSession.editorMode);

  useEffect(() => {
    if (messages.length > 1) {
      updateActiveSession({ messages, aiMode, editorMode, document, codeFile, agentId });
      autoTitle(messages);
    }
  }, [messages, aiMode, editorMode, document, codeFile, agentId, updateActiveSession, autoTitle]);

  const handleSwitchSession = useCallback((id: string) => {
    switchSession(id);
    const s = sessions.find((sess) => sess.id === id);
    if (!s) return;
    replaceMessages(s.messages);
    replaceAll(s.document, s.codeFile, s.editorMode);
    setAiMode(s.aiMode);
    setAgentId(s.agentId ?? DEFAULT_AGENT_ID);
  }, [sessions, switchSession, replaceMessages, replaceAll, setAiMode]);

  const handleNewSession = useCallback(() => {
    const s = createSession();
    const agent = XM3_AGENTS.find((a) => a.id === agentId) ?? XM3_AGENTS[0];
    clearMessages(agent.name);
    replaceAll(s.document, s.codeFile, s.editorMode);
    setAiMode('chat');
  }, [createSession, clearMessages, replaceAll, setAiMode, agentId]);

  const handleAgentChange = useCallback((id: string) => {
    setAgentId(id);
    const agent = XM3_AGENTS.find((a) => a.id === id) ?? XM3_AGENTS[0];
    clearMessages(agent.name);
  }, [clearMessages]);

  const handleClosePalette = useCallback(() => {
    setCommandPaletteOpen(false);
    onCmdClose?.();
  }, [onCmdClose]);

  return (
    <div className="flex h-screen pt-14 overflow-hidden bg-background">
      {/* Session History Sidebar */}
      <SessionHistory
        sessions={sessions}
        activeId={activeId}
        onSwitch={handleSwitchSession}
        onCreate={handleNewSession}
        onDelete={deleteSession}
        collapsed={sessionSidebarCollapsed}
        onToggle={() => setSessionSidebarCollapsed((c) => !c)}
      />

      {/* File Manager */}
      {fileManagerOpen && (
        <div className="w-52 flex-shrink-0 hidden md:flex">
          <FileManager />
        </div>
      )}

      {/* Chat Pane */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          editorVisible ? 'w-full md:w-[420px] lg:w-[460px] xl:w-[500px]' : 'w-full'
        } flex-shrink-0`}
        style={{ minWidth: 0 }}
      >
        <ChatPane
          messages={messages}
          isLoading={isLoading}
          aiMode={aiMode}
          onModeChange={setAiMode}
          onSend={sendMessage}
          onClear={handleNewSession}
          agentId={agentId}
          onAgentChange={handleAgentChange}
          onToggleEditor={() => setEditorVisible((v) => !v)}
          editorVisible={editorVisible}
          onOpenBrowser={() => setBrowserPreviewOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      </div>

      {/* Editor Pane */}
      {editorVisible && (
        <div className="hidden md:flex flex-col flex-1 min-w-0 overflow-hidden">
          <EditorPane
            editorMode={editorMode}
            onEditorModeChange={setEditorMode}
            document={document}
            onDocContentChange={updateDocumentContent}
            onDocTitleChange={updateDocumentTitle}
            codeFile={codeFile}
            onCodeContentChange={updateCodeContent}
            onCodeLanguageChange={updateCodeLanguage}
            isSaved={isSaved}
            onToggleFileManager={() => setFileManagerOpen((f) => !f)}
            fileManagerOpen={fileManagerOpen}
          />
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={handleClosePalette}
        onNewSession={handleNewSession}
        onToggleEditor={() => setEditorVisible((v) => !v)}
        onSetAiMode={setAiMode}
        onSetEditorMode={setEditorMode}
        onSetAgent={handleAgentChange}
        onOpenSettings={() => setSettingsOpen(true)}
        currentAiMode={aiMode}
        currentEditorMode={editorMode}
        currentAgentId={agentId}
      />

      {/* Browser Preview */}
      <BrowserPreview
        open={browserPreviewOpen}
        onClose={() => setBrowserPreviewOpen(false)}
      />

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Studio;
