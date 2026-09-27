export type ConnectionResult =
  | { status: 'valid'; message: string }
  | { status: 'invalid'; message: string }
  | { status: 'error'; message: string };

/** Check a Gemini key by listing one model; no prompt or generation request is sent. */
export async function testGeminiKey(apiKey: string): Promise<ConnectionResult> {
  const key = apiKey.trim();
  if (!key) return { status: 'invalid', message: 'Enter a Google Gemini API key first.' };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);
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
    if (response.status === 401) return { status: 'invalid', message: 'Google rejected this key. Check that it is active and copied correctly.' };
    return { status: 'error', message: `Google returned HTTP ${response.status}. Check the key's API access and try again.` };
  } catch {
    return {
      status: 'error',
      message: controller.signal.aborted
        ? 'The Google check timed out. Check your connection and try again.'
        : 'Could not reach Google from this browser. Check your connection and try again.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
