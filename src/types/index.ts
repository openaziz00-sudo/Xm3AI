export type AIMode = 'chat' | 'think' | 'deepsearch';
export type EditorMode = 'document' | 'code';
export type CodeLanguage = 'python' | 'javascript' | 'typescript' | 'cpp' | 'rust' | 'go';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: AIMode;
  thinking?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeFile {
  id: string;
  name: string;
  language: CodeLanguage;
  content: string;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  aiMode: AIMode;
  editorMode: EditorMode;
  document: Document;
  codeFile: CodeFile;
  createdAt: Date;
}
