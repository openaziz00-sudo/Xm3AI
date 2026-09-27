export type ConnectionResult =
  | { status: 'valid'; message: string }
  | { status: 'invalid'; message: string }
  | { status: 'error'; message: string };

export interface ProviderMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateTextOptions {
  apiKey: string;
  model: string;
  messages: ProviderMessage[];
  systemInstruction: string;
  signal?: AbortSignal;
}

export type GenerationResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

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

/** Check a Gemini key by listing one model; no prompt or generation request is sent. */
export async function testGeminiKey(apiKey: string): Promise<ConnectionResult> {
  const key = apiKey.trim();
  if (!key) return { status: 'invalid', message: 'Enter a Google Gemini API key first.' };

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', {
      method: 'GET',
      headers: { 'x-goog-api-key': key },
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });

    if (response.ok) return { status: 'valid', message: 'Google accepted the key.' };
    if (response.status === 401 || response.status === 403) {
      return { status: 'invalid', message: 'Google rejected this key or its API access. Check that it is active and copied correctly.' };
    }
    return { status: 'error', message: `Google returned HTTP ${response.status}. Check the key's API access and try again.` };
  } catch {
    return {
      status: 'error',
      message: controller.signal.aborted
        ? 'The Google check timed out. Check your connection and try again.'
        : 'Could not reach Google from this browser. Check your connection and try again.',
    };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

/** Generate a text reply directly through Gemini without routing the key through Xm3AI servers. */
export async function generateGeminiReply(options: GenerateTextOptions): Promise<GenerationResult> {
  const apiKey = options.apiKey.trim();
  if (!apiKey) return { ok: false, message: 'No Gemini API key configured.' };
  if (!options.messages.length) return { ok: false, message: 'Enter a message before sending.' };

  const request = linkAbortSignal(options.signal);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(options.model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: request.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: options.systemInstruction }] },
          contents: options.messages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          })),
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { ok: false, message: 'Google rejected this key or model access. Check the key and enabled Gemini API access.' };
      }
      if (response.status === 429) return { ok: false, message: 'Google rate-limited this request. Check your provider quota and try again.' };
      if (response.status >= 500) return { ok: false, message: 'Google is temporarily unavailable. Try again shortly.' };
      return { ok: false, message: `Google could not complete the request (HTTP ${response.status}). Check the selected model and key access.` };
    }

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object') {
      return { ok: false, message: 'Google returned an unreadable response. Try again.' };
    }
    const candidates = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }> }).candidates;
    const text = candidates?.[0]?.content?.parts?.map((part) => typeof part.text === 'string' ? part.text : '').join('').trim();
    if (!text) return { ok: false, message: 'Google returned no text. The request may have been blocked or reached a response limit.' };
    return { ok: true, text };
  } catch {
    if (options.signal?.aborted) return { ok: false, message: 'Request cancelled.' };
    return {
      ok: false,
      message: request.signal.aborted
        ? 'The Google request timed out. Try a shorter prompt or try again.'
        : 'Could not reach Google from this browser. Check your connection and try again.',
    };
  } finally {
    request.cleanup();
  }
}
