import { FileText, Code2, FolderOpen, Check, Clock } from 'lucide-react';
import DocumentEditor from '@/components/features/DocumentEditor';
import CodeEditor from '@/components/features/CodeEditor';
import type { EditorMode, Document, CodeFile, CodeLanguage } from '@/types';

interface EditorPaneProps {
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  document: Document;
  onDocContentChange: (c: string) => void;
  onDocTitleChange: (t: string) => void;
  codeFile: CodeFile;
  onCodeContentChange: (c: string) => void;
  onCodeLanguageChange: (l: CodeLanguage) => void;
  isSaved: boolean;
  onToggleFileManager: () => void;
  fileManagerOpen: boolean;
}

const EditorPane = ({
  editorMode,
  onEditorModeChange,
  document,
  onDocContentChange,
  onDocTitleChange,
  codeFile,
  onCodeContentChange,
  onCodeLanguageChange,
  isSaved,
  onToggleFileManager,
  fileManagerOpen,
}: EditorPaneProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Pane header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] surface-1">
        <div className="flex items-center gap-1 surface-2 border border-[hsl(var(--border))] rounded-lg p-1">
          <button
            onClick={() => onEditorModeChange('document')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              editorMode === 'document'
                ? 'bg-[hsl(var(--surface-3))] text-foreground'
                : 'text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Document
          </button>
          <button
            onClick={() => onEditorModeChange('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              editorMode === 'code'
                ? 'bg-[hsl(var(--surface-3))] text-foreground'
                : 'text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Save indicator */}
          <div className="flex items-center gap-1.5">
            {isSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-[hsl(var(--text-subtle))] animate-pulse" />
                <span className="text-xs text-[hsl(var(--text-subtle))]">Saving...</span>
              </>
            )}
          </div>

          {/* File manager toggle */}
          <button
            onClick={onToggleFileManager}
            title="Toggle file manager"
            className={`flex items-center gap-1.5 px-2 py-1 surface-3 border rounded-lg text-[10px] transition-colors ${
              fileManagerOpen
                ? 'border-blue-500/40 text-blue-400'
                : 'border-[hsl(var(--border))] text-[hsl(var(--text-subtle))] hover:text-foreground hover:border-[hsl(var(--blue-glow))]'
            }`}
          >
            <FolderOpen className="w-3 h-3" />
            <span className="hidden sm:inline">Files</span>
          </button>
        </div>
      </div>

      {/* Title for document mode */}
      {editorMode === 'document' && (
        <div className="px-8 pt-5 pb-2 border-b border-[hsl(var(--border))]">
          <input
            value={document.title}
            onChange={(e) => onDocTitleChange(e.target.value)}
            placeholder="Untitled Document"
            className="w-full bg-transparent text-xl font-bold text-foreground placeholder:text-[hsl(var(--text-subtle))] outline-none"
          />
          <p className="text-xs text-[hsl(var(--text-subtle))] mt-1">
            Last updated {document.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      {/* Editor content */}
      <div className="flex-1 overflow-hidden">
        {editorMode === 'document' ? (
          <DocumentEditor
            document={document}
            onContentChange={onDocContentChange}
            onTitleChange={onDocTitleChange}
          />
        ) : (
          <CodeEditor
            codeFile={codeFile}
            onContentChange={onCodeContentChange}
            onLanguageChange={onCodeLanguageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EditorPane;
