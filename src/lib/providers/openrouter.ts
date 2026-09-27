import type { ConnectionResult, GenerateTextOptions, GenerationResult } from './gemini';

const REQUEST_TIMEOUT_MS = 90_000;

function linkAbortSignal(parent?: AbortSignal) {
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  if (parent?.aborted) controller.abort();
  else parent?.addEventListener('abort', forwardAbort, { once: true });
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return {
    signal: controller.signal,
    cleanup: () => {
      globalThis.clearTimeout(timeoutId);
      parent?.removeEventListener('abort', forwardAbort);
    },
  };
}

/** Validate an OpenRouter key using its read-only current-key endpoint. */
export async function testOpenRouterKey(apiKey: string): Promise<ConnectionResult> {
  const key = apiKey.trim();
  if (!key) return { status: 'invalid', message: 'Enter an OpenRouter API key first.' };

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });

    if (response.ok) return { status: 'valid', message: 'OpenRouter accepted the key.' };
    if (response.status === 401 || response.status === 403) {
      return { status: 'invalid', message: 'OpenRouter rejected this key or its access. Check that it is active and copied correctly.' };
    }
    return { status: 'error', message: `OpenRouter returned HTTP ${response.status}. Check the key's access and try again.` };
  } catch {
    return {
      status: 'error',
      message: controller.signal.aborted
        ? 'The OpenRouter check timed out. Check your connection and try again.'
        : 'Could not reach OpenRouter from this browser. Check your connection and try again.',
    };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

/** Generate a text reply directly through OpenRouter without routing the key through Xm3AI servers. */
export async function generateOpenRouterReply(options: GenerateTextOptions): Promise<GenerationResult> {
  const apiKey = options.apiKey.trim();
  if (!apiKey) return { ok: false, message: 'No OpenRouter API key configured.' };
  if (!options.messages.length) return { ok: false, message: 'Enter a message before sending.' };

  const request = linkAbortSignal(options.signal);
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-OpenRouter-Title': 'Xm3AI Studio',
      },
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: request.signal,
      body: JSON.stringify({
        model: options.model,
        stream: false,
        max_tokens: 2048,
        messages: [
          { role: 'system', content: options.systemInstruction },
          ...options.messages.map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { ok: false, message: 'OpenRouter rejected this key or model access. Check your key and selected model.' };
      }
      if (response.status === 402) return { ok: false, message: 'OpenRouter could not fulfill this request with the key’s current credits or model access.' };
      if (response.status === 429) return { ok: false, message: 'OpenRouter rate-limited this request. Check your provider quota and try again.' };
      if (response.status >= 500) return { ok: false, message: 'OpenRouter is temporarily unavailable. Try again shortly.' };
      return { ok: false, message: `OpenRouter could not complete the request (HTTP ${response.status}). Check the selected model and key access.` };
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object') {
      return { ok: false, message: 'OpenRouter returned an unreadable response. Try again.' };
    }
    const choices = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices;
    const content = choices?.[0]?.message?.content;
    const text = typeof content === 'string'
      ? content.trim()
      : Array.isArray(content)
        ? content.map((part) => part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? part.text : '').join('').trim()
        : '';
    if (!text) return { ok: false, message: 'OpenRouter returned no text. Try again or select a different model.' };
    return { ok: true, text };
  } catch {
    if (options.signal?.aborted) return { ok: false, message: 'Request cancelled.' };
    return {
      ok: false,
      message: request.signal.aborted
        ? 'The OpenRouter request timed out. Try a shorter prompt or try again.'
        : 'Could not reach OpenRouter from this browser. Check your connection and try again.',
    };
  } finally {
    request.cleanup();
  }
}
