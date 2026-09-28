import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic, Command } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  onOpenCommandPalette: () => void;
}

const ChatInput = ({ onSend, isLoading, onOpenCommandPalette }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const hints = ['/think', '/search'];

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Hint chips */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
        {hints.map((h) => (
          <button
            key={h}
            onClick={() => setValue(h + ' ')}
            className="flex-shrink-0 text-[10px] px-2 py-1 surface-3 border border-[hsl(var(--border))] rounded-full text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:border-blue-500/40 transition-colors mono"
          >
            {h}
          </button>
        ))}
      </div>

      <div className="relative surface-2 border border-[hsl(var(--border))] rounded-xl focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { setValue(e.target.value); handleInput(); }}
          onKeyDown={handleKeyDown}
          placeholder="Message Xm3 AI... (Shift+Enter for new line)"
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-[hsl(var(--text-subtle))] resize-none outline-none px-4 pt-3 pb-10 leading-relaxed max-h-[140px] disabled:opacity-50"
        />

        {/* Bottom toolbar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <button
              title="Attach file"
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-3))] transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              title="Voice input"
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-3))] transition-colors"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCommandPalette}
              title="Command palette (Ctrl+K)"
              className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-[hsl(var(--text-subtle))] mt-1.5 text-center leading-relaxed">
        Works offline without a key. Connect a provider for live responses; usage or charges may apply.
      </p>
    </div>
  );
};

export default ChatInput;
