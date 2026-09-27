import { useState, useCallback, useRef } from 'react';
import type { Message, AIMode } from '@/types';
import { MOCK_AI_RESPONSES } from '@/constants';

const generateId = () => Math.random().toString(36).slice(2, 10);

function makeWelcome(agentName: string): Message {
  return {
    id: 'welcome-' + generateId(),
    role: 'assistant',
    content: `Welcome to **Xm3 AI Studio**. **${agentName}** is ready to collaborate.\n\n- Type \`/think\` for deep reasoning\n- Type \`/search\` to activate DeepSearch\n- Use the editor panel on the right for docs or code\n\nWhat are we working on today?`,
    timestamp: new Date(),
    mode: 'chat',
  };
}

export function useChat(initialMode: AIMode = 'chat', agentName = 'Xm3 Core') {
  const [messages, setMessages] = useState<Message[]>(() => [makeWelcome(agentName)]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>(initialMode);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      let effectiveMode: AIMode = aiMode;
      let processedContent = content;

      if (content.toLowerCase().startsWith('/think')) {
        effectiveMode = 'think';
        processedContent = content.replace(/^\/think\s*/i, '') || 'Analyze this deeply.';
      } else if (content.toLowerCase().startsWith('/search')) {
        effectiveMode = 'deepsearch';
        processedContent = content.replace(/^\/search\s*/i, '') || 'Search for relevant information.';
      }

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: processedContent,
        timestamp: new Date(),
        mode: effectiveMode,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      abortRef.current = false;

      const delay = effectiveMode === 'think' ? 2200 : effectiveMode === 'deepsearch' ? 1800 : 900;
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!abortRef.current) {
        const pool = MOCK_AI_RESPONSES[effectiveMode] ?? MOCK_AI_RESPONSES['chat'];
        const responseText = pool[Math.floor(Math.random() * pool.length)];

        const assistantMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          mode: effectiveMode,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }

      setIsLoading(false);
    },
    [isLoading, aiMode]
  );

  const clearMessages = useCallback((newAgentName = agentName) => {
    abortRef.current = true;
    setIsLoading(false);
    setMessages([makeWelcome(newAgentName)]);
  }, [agentName]);

  const replaceMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, []);

  return { messages, isLoading, aiMode, setAiMode, sendMessage, clearMessages, replaceMessages, setMessages };
}
