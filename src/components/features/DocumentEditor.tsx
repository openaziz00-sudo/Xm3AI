import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Code2, Eye, Edit3 } from 'lucide-react';
import type { Document } from '@/types';

interface DocumentEditorProps {
  document: Document;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
}

function renderPreview(text: string): string {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_: string, _lang: string, code: string) =>
      `<pre class="bg-[hsl(var(--surface-2))] border border-[hsl(var(--border))] rounded-lg p-4 overflow-x-auto my-3 text-sm"><code class="text-blue-300 mono">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="text-blue-400 bg-[hsl(var(--surface-2))] px-1.5 py-0.5 rounded text-sm mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-6 mb-3 pb-2 border-b border-[hsl(var(--border))]">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-foreground mt-5 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-foreground mt-4 mb-1">$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500 pl-4 italic text-[hsl(var(--text-subtle))] my-3">$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal text-[hsl(var(--text-secondary))] my-1 leading-relaxed">$1</li>')
    .replace(/^[-•] (.+)$/gm, '<li class="ml-6 list-disc text-[hsl(var(--text-secondary))] my-1 leading-relaxed">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

const toolbar = [
  { label: 'Bold', icon: Bold, insert: ['**', '**'], title: 'Bold (Ctrl+B)' },
  { label: 'Italic', icon: Italic, insert: ['*', '*'], title: 'Italic (Ctrl+I)' },
  { label: 'H2', icon: Heading2, insert: ['## ', ''], title: 'Heading 2' },
  { label: 'Quote', icon: Quote, insert: ['> ', ''], title: 'Blockquote' },
  { label: 'Code', icon: Code2, insert: ['`', '`'], title: 'Inline code' },
  { label: 'List', icon: List, insert: ['- ', ''], title: 'Bullet list' },
  { label: 'Ordered', icon: ListOrdered, insert: ['1. ', ''], title: 'Numbered list' },
];

const DocumentEditor = ({ document, onContentChange, onTitleChange }: DocumentEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormat = (before: string, after: string) => {
    const ta = window.document.getElementById('doc-textarea') as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const newContent =
      ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    onContentChange(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))] surface-2">
        <div className="flex items-center gap-0.5">
          {toolbar.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                title={t.title}
                onClick={() => insertFormat(t.insert[0], t.insert[1])}
                disabled={isPreview}
                className="p-1.5 rounded-md text-[hsl(var(--text-subtle))] hover:text-foreground hover:surface-3 disabled:opacity-30 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setIsPreview((p) => !p)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isPreview
              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
              : 'text-[hsl(var(--text-subtle))] hover:text-foreground hover:surface-3'
          }`}
        >
          {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div
            className="px-8 py-6 text-sm text-[hsl(var(--text-secondary))] leading-relaxed min-h-full"
            dangerouslySetInnerHTML={{ __html: renderPreview(document.content) }}
          />
        ) : (
          <textarea
            id="doc-textarea"
            value={document.content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Start writing your document..."
            className="w-full h-full min-h-full bg-transparent text-sm text-[hsl(var(--text-secondary))] leading-relaxed resize-none outline-none px-8 py-6 mono placeholder:text-[hsl(var(--text-subtle))]"
            spellCheck
          />
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
