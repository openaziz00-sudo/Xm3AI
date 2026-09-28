import { useEffect, useRef } from 'react';
import { Brain, Search, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

function renderMarkdown(text: string): string {
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  return escapedText
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_: string, lang: string, code: string) =>
      `<pre class="bg-[hsl(var(--surface-2))] border border-[hsl(var(--border))] rounded-lg p-4 overflow-x-auto my-3"><code class="text-blue-300 mono text-sm">${code}</code></pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="text-blue-400 bg-[hsl(var(--surface-2))] px-1.5 py-0.5 rounded text-sm mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-[hsl(var(--text-secondary))] italic">$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-foreground mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-foreground mt-4 mb-2">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-blue-500 pl-3 italic text-[hsl(var(--text-subtle))] my-2">$1</blockquote>')
    .replace(/^→ (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-400 font-bold">→</span><span>$1</span></div>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-[hsl(var(--text-secondary))] my-0.5">$1</li>')
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc text-[hsl(var(--text-secondary))] my-0.5">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

const modeIconMap = {
  chat: MessageCircle,
  think: Brain,
  deepsearch: Search,
};
const modeColorMap = {
  chat: 'text-blue-400',
  think: 'text-violet-400',
  deepsearch: 'text-emerald-400',
};
const modeLabelMap = {
  chat: 'Xm3',
  think: 'Think',
  deepsearch: 'DeepSearch',
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const mode = message.mode ?? 'chat';
  const Icon = modeIconMap[mode];

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] px-4 py-3 bg-[hsl(var(--blue-dim))] rounded-2xl rounded-tr-sm text-white text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-5">
      <div className="flex-shrink-0 w-7 h-7 rounded-full glass-blue flex items-center justify-center mt-0.5">
        <Icon className={`w-3.5 h-3.5 ${modeColorMap[mode]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-semibold ${modeColorMap[mode]}`}>{modeLabelMap[mode]}</span>
          <span className="text-xs text-[hsl(var(--text-subtle))]">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div
          className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
      </div>
    </div>
  );
};

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  aiMode: 'chat' | 'think' | 'deepsearch';
}

const ChatMessages = ({ messages, isLoading, aiMode }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadingLabels = { chat: 'Thinking...', think: 'Reasoning deeply...', deepsearch: 'Searching sources...' };
  const LoadIcon = modeIconMap[aiMode];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex gap-3 mb-5">
          <div className="flex-shrink-0 w-7 h-7 rounded-full glass-blue flex items-center justify-center">
            <LoadIcon className={`w-3.5 h-3.5 ${modeColorMap[aiMode]} animate-pulse`} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Loader2 className="w-3.5 h-3.5 text-[hsl(var(--text-subtle))] animate-spin" />
            <span className="text-xs text-[hsl(var(--text-subtle))] italic">{loadingLabels[aiMode]}</span>
            <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
