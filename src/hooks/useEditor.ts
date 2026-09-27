import { useState, useCallback } from 'react';
import type { Document, EditorMode, CodeFile, CodeLanguage } from '@/types';
import { DEFAULT_CODE, SAMPLE_DOCUMENT } from '@/constants';

const generateId = () => Math.random().toString(36).slice(2, 10);

const defaultDoc = (): Document => ({
  id: generateId(),
  title: 'Untitled Document',
  content: SAMPLE_DOCUMENT,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const defaultCodeFile = (): CodeFile => ({
  id: generateId(),
  name: 'main.py',
  language: 'python',
  content: DEFAULT_CODE['python'],
});

export function useEditor(
  initDoc?: Document,
  initCode?: CodeFile,
  initMode: EditorMode = 'document'
) {
  const [editorMode, setEditorMode] = useState<EditorMode>(initMode);
  const [document, setDocument] = useState<Document>(initDoc ?? defaultDoc());
  const [codeFile, setCodeFile] = useState<CodeFile>(initCode ?? defaultCodeFile());
  const [isSaved, setIsSaved] = useState(true);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const updateDocumentContent = useCallback((content: string) => {
    setIsSaved(false);
    setDocument((prev) => ({ ...prev, content, updatedAt: new Date() }));
    if (saveTimer) clearTimeout(saveTimer);
    const t = setTimeout(() => setIsSaved(true), 1200);
    setSaveTimer(t);
  }, [saveTimer]);

  const updateDocumentTitle = useCallback((title: string) => {
    setDocument((prev) => ({ ...prev, title, updatedAt: new Date() }));
  }, []);

  const updateCodeContent = useCallback((content: string) => {
    setIsSaved(false);
    setCodeFile((prev) => ({ ...prev, content }));
    if (saveTimer) clearTimeout(saveTimer);
    const t = setTimeout(() => setIsSaved(true), 1200);
    setSaveTimer(t);
  }, [saveTimer]);

  const updateCodeLanguage = useCallback((language: CodeLanguage) => {
    setCodeFile((prev) => ({
      ...prev,
      language,
      name: `main.${getExtension(language)}`,
      content: DEFAULT_CODE[language],
    }));
  }, []);

  const replaceAll = useCallback((doc: Document, code: CodeFile, mode: EditorMode) => {
    setDocument(doc);
    setCodeFile(code);
    setEditorMode(mode);
  }, []);

  return {
    editorMode, setEditorMode,
    document, codeFile, isSaved,
    updateDocumentContent, updateDocumentTitle,
    updateCodeContent, updateCodeLanguage,
    replaceAll,
  };
}

function getExtension(lang: CodeLanguage): string {
  const map: Record<CodeLanguage, string> = {
    python: 'py', javascript: 'js', typescript: 'ts', cpp: 'cpp', rust: 'rs', go: 'go',
  };
  return map[lang] ?? 'txt';
}
