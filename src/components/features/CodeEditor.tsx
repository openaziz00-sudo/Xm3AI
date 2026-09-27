import { useState } from 'react';
import { Play, Copy, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import type { CodeFile, CodeLanguage } from '@/types';
import { CODE_LANGUAGES } from '@/constants';

interface CodeEditorProps {
  codeFile: CodeFile;
  onContentChange: (content: string) => void;
  onLanguageChange: (lang: CodeLanguage) => void;
}

const langColors: Record<CodeLanguage, string> = {
  python: 'text-yellow-400',
  javascript: 'text-yellow-300',
  typescript: 'text-blue-400',
  cpp: 'text-blue-300',
  rust: 'text-orange-400',
  go: 'text-cyan-400',
};

const CodeEditor = ({ codeFile, onContentChange, onLanguageChange }: CodeEditorProps) => {
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied to clipboard');
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setOutput(`Hello, World! Welcome to Xm3.\n\nProcess finished with exit code 0`);
      toast.success('Code executed successfully');
    }, 1400);
  };

  const lineCount = codeFile.content.split('\n').length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))] surface-2">
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 surface-3 border border-[hsl(var(--border))] rounded-lg text-xs font-medium hover:border-[hsl(var(--blue-glow))] transition-colors"
            >
              <span className={langColors[codeFile.language]}>{codeFile.language}</span>
              <ChevronDown className={`w-3 h-3 text-[hsl(var(--text-subtle))] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 left-0 w-36 surface-1 border border-[hsl(var(--border))] rounded-lg shadow-xl z-50 overflow-hidden">
                {CODE_LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => { onLanguageChange(l.value); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      codeFile.language === l.value
                        ? 'bg-[hsl(var(--surface-3))] text-foreground'
                        : 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-2))]'
                    }`}
                  >
                    <span className={langColors[l.value]}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File name */}
          <span className="text-xs text-[hsl(var(--text-subtle))] mono">{codeFile.name}</span>
          <span className="text-xs text-[hsl(var(--text-subtle))]">{lineCount} lines</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[hsl(var(--text-subtle))] hover:text-foreground hover:surface-3 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="select-none px-3 py-4 text-right text-xs text-[hsl(var(--text-subtle))] mono leading-relaxed surface-2 border-r border-[hsl(var(--border))] overflow-y-hidden min-w-[3rem]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="leading-[1.6rem]">{i + 1}</div>
          ))}
        </div>

        {/* Editor */}
        <textarea
          value={codeFile.content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-sm text-[hsl(var(--text-secondary))] mono leading-[1.6rem] resize-none outline-none px-4 py-4 placeholder:text-[hsl(var(--text-subtle))] overflow-y-auto"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Output panel */}
      {output !== null && (
        <div className="border-t border-[hsl(var(--border))] surface-2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))]">
            <span className="text-xs font-medium text-emerald-400">Output</span>
            <button
              onClick={() => setOutput(null)}
              className="text-xs text-[hsl(var(--text-subtle))] hover:text-foreground transition-colors"
            >
              ✕ Clear
            </button>
          </div>
          <pre className="px-4 py-3 text-xs text-emerald-300 mono leading-relaxed overflow-x-auto max-h-32">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
