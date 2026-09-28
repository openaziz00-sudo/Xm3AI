import { useState, useCallback, useRef } from 'react';
import type { Message, AIMode } from '@/types';
import { getActiveKeys, type ProviderId } from '@/lib/keys';
import { generateGeminiReply, type ProviderMessage } from '@/lib/providers/gemini';
import { generateOpenRouterReply } from '@/lib/providers/openrouter';
import { XM3_AGENTS } from '@/constants/agents';
import { generateOfflineReply } from '@/lib/offline';

const SEARCH_MODEL = 'perplexity/sonar-pro-search';
const MAX_HISTORY_MESSAGES = 20;

const generateId = () => Math.random().toString(36).slice(2, 10);

function makeWelcome(agentName: string): Message {
  return {
    id: 'welcome-' + generateId(),
    role: 'assistant',
    content: `**${agentName} is ready.**\n\nYou can start immediately in Offline mode — no API key is required. Connect Gemini or OpenRouter in Settings whenever you want live model responses.`,
    timestamp: new Date(),
    mode: 'chat',
  };
}

function buildSystemInstruction(agentName: string, mode: AIMode): string {
  const instructions = [
    `You are ${agentName}, an assistant in Xm3AI Studio. Answer the user's request directly and accurately.`,
    'Do not claim to have used tools, executed code, or searched the web unless the selected model actually provides that capability and you did so.',
  ];
  if (mode === 'think') {
    instructions.push('Reason carefully before answering. Provide the conclusion and a concise explanation, not private chain-of-thought.');
  }
  if (mode === 'deepsearch') {
    instructions.push('Use your web-search capability for current information. Include source URLs when your search results provide them. If you cannot search, say so; do not invent sources or search results.');
  }
  return instructions.join('\n');
}

function getConversationHistory(messages: Message[], userMessage: Message): ProviderMessage[] {
  const recent = [...messages, userMessage]
    .filter((message) => !message.id.startsWith('welcome-') && !message.error)
    .slice(-MAX_HISTORY_MESSAGES);
  while (recent[0]?.role === 'assistant') recent.shift();
  return recent.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export function useChat(initialMode: AIMode = 'chat', agentName = 'Xm3 Core', agentId = 'xm3-core') {
  const [messages, setMessages] = useState<Message[]>(() => [makeWelcome(agentName)]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>(initialMode);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      let effectiveMode: AIMode = aiMode;
      let processedContent = content.trim();
      if (processedContent.toLowerCase().startsWith('/think')) {
        effectiveMode = 'think';
        processedContent = processedContent.replace(/^\/think\s*/i, '') || 'Please help me think through this.';
      } else if (processedContent.toLowerCase().startsWith('/search')) {
        effectiveMode = 'deepsearch';
        processedContent = processedContent.replace(/^\/search\s*/i, '') || 'Search for relevant information.';
      }

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: processedContent,
        timestamp: new Date(),
        mode: effectiveMode,
      };
      setMessages((previous) => [...previous, userMessage]);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      try {
        const agent = XM3_AGENTS.find((item) => item.id === agentId) ?? XM3_AGENTS[0];
        const provider: ProviderId = effectiveMode === 'deepsearch'
          ? 'openrouter'
          : agent.provider === 'google' ? 'gemini' : 'openrouter';
        const model = effectiveMode === 'deepsearch' ? SEARCH_MODEL : agent._realModel;
        const systemInstruction = buildSystemInstruction(agent.name, effectiveMode);
        const history = getConversationHistory(messages, userMessage);
        const key = getActiveKeys()[provider]?.trim();

        if (!key) {
          if (!controller.signal.aborted) {
            setMessages((previous) => [...previous, generateOfflineReply(processedContent, agent.name, effectiveMode)]);
          }
          return;
        }

        const result = provider === 'gemini'
          ? await generateGeminiReply({ apiKey: key, model, messages: history, systemInstruction, signal: controller.signal })
          : await generateOpenRouterReply({ apiKey: key, model, messages: history, systemInstruction, signal: controller.signal });

        if (controller.signal.aborted) return;
        setMessages((previous) => [...previous, result.ok
          ? {
              id: generateId(),
              role: 'assistant' as const,
              content: result.text,
              timestamp: new Date(),
              mode: effectiveMode,
            }
          : generateOfflineReply(processedContent, agent.name, effectiveMode, result.message)]);
      } catch {
        if (!controller.signal.aborted) {
          setMessages((previous) => [...previous, {
            id: generateId(),
            role: 'assistant',
            content: 'Could not read provider settings in this browser. Open Settings, clear saved keys if needed, and enter the key again.',
            timestamp: new Date(),
            mode: effectiveMode,
            error: true,
          }]);
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [isLoading, aiMode, messages, agentId],
  );

  const clearMessages = useCallback((newAgentName = agentName) => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages([makeWelcome(newAgentName)]);
  }, [agentName]);

  const replaceMessages = useCallback((nextMessages: Message[]) => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages(nextMessages);
  }, []);

  return { messages, isLoading, aiMode, setAiMode, sendMessage, clearMessages, replaceMessages, setMessages };
}
