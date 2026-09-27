import { useState } from 'react';
import { ExternalLink, X, RefreshCw, ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface BrowserPreviewProps {
  open: boolean;
  onClose: () => void;
}

const BrowserPreview = ({ open, onClose }: BrowserPreviewProps) => {
  const [url, setUrl] = useState('https://xm3.ai');
  const [inputUrl, setInputUrl] = useState('https://xm3.ai');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://xm3.ai']);
  const [histIdx, setHistIdx] = useState(0);

  if (!open) return null;

  const navigate = (target: string) => {
    let final = target.trim();
    if (!final.startsWith('http')) final = 'https://' + final;
    setUrl(final);
    setInputUrl(final);
    setLoading(true);
    const newHistory = [...history.slice(0, histIdx + 1), final];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
    setTimeout(() => setLoading(false), 1200);
  };

  const goBack = () => {
    if (histIdx <= 0) return;
    const prev = history[histIdx - 1];
    setHistIdx((i) => i - 1);
    setUrl(prev);
    setInputUrl(prev);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const goForward = () => {
    if (histIdx >= history.length - 1) return;
    const next = history[histIdx + 1];
    setHistIdx((i) => i + 1);
    setUrl(next);
    setInputUrl(next);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-5xl h-[80vh] surface-1 border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface-2))]">
          {/* Window controls */}
          <div className="flex items-center gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" title="Close" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-0.5 ml-2">
            <button
              onClick={goBack}
              disabled={histIdx <= 0}
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goForward}
              disabled={histIdx >= history.length - 1}
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={reload}
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('https://xm3.ai')}
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* URL bar */}
          <form
            className="flex-1 flex items-center gap-2 px-3 py-1.5 surface-1 border border-[hsl(var(--border))] rounded-lg focus-within:border-[hsl(var(--blue-glow))] transition-colors"
            onSubmit={(e) => { e.preventDefault(); navigate(inputUrl); }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none mono"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Loading bar */}
        {loading && (
          <div className="h-0.5 bg-[hsl(var(--surface-2))]">
            <div className="h-full bg-blue-500 animate-pulse w-2/3 transition-all" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 relative bg-[hsl(var(--surface-2))]">
          <iframe
            key={url}
            src={url}
            title="Browser Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          {/* Overlay for blocked content */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[hsl(var(--surface-2))]">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
              <p className="text-sm text-[hsl(var(--text-subtle))]">Loading {url}…</p>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-2))]">
          <span className="text-[10px] text-[hsl(var(--text-subtle))] mono truncate max-w-xs">{url}</span>
          <span className="text-[10px] text-[hsl(var(--text-subtle))]">Xm3 Browser · Preview Mode</span>
        </div>
      </div>
    </div>
  );
};

export default BrowserPreview;
