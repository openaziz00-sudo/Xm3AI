import type { ConnectionResult } from './gemini';

/** Validate an OpenRouter key using its read-only current-key endpoint. */
export async function testOpenRouterKey(apiKey: string): Promise<ConnectionResult> {
  const key = apiKey.trim();
  if (!key) return { status: 'invalid', message: 'Enter an OpenRouter API key first.' };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);
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
    if (response.status === 401) return { status: 'invalid', message: 'OpenRouter rejected this key. Check that it is active and copied correctly.' };
    return { status: 'error', message: `OpenRouter returned HTTP ${response.status}. Check the key's access and try again.` };
  } catch {
    return {
      status: 'error',
      message: controller.signal.aborted
        ? 'The OpenRouter check timed out. Check your connection and try again.'
        : 'Could not reach OpenRouter from this browser. Check your connection and try again.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
