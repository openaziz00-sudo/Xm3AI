export type ProviderId = 'gemini' | 'openrouter';

export interface ProviderKeys {
  gemini: string;
  openrouter: string;
}

export interface KeySettings {
  keys: ProviderKeys;
  remember: boolean;
}

const KEYS_STORAGE_KEY = 'xm3ai.provider-keys.v1';
const REMEMBER_STORAGE_KEY = 'xm3ai.remember-provider-keys.v1';
const EMPTY_KEYS: ProviderKeys = { gemini: '', openrouter: '' };

let inMemoryKeys: ProviderKeys = { ...EMPTY_KEYS };

/** Read remembered keys from this browser, or the current tab's volatile keys. */
export function readKeySettings(): KeySettings {
  if (typeof window === 'undefined') return { keys: { ...inMemoryKeys }, remember: false };

  const remember = window.localStorage.getItem(REMEMBER_STORAGE_KEY) === 'true';
  if (!remember) return { keys: { ...inMemoryKeys }, remember: false };

  const raw = window.localStorage.getItem(KEYS_STORAGE_KEY);
  if (!raw) return { keys: { ...EMPTY_KEYS }, remember: true };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Saved key settings are unreadable. Clear saved keys and enter them again.');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Saved key settings are unreadable. Clear saved keys and enter them again.');
  }

  const record = parsed as Partial<ProviderKeys>;
  const keys = {
    gemini: typeof record.gemini === 'string' ? record.gemini : '',
    openrouter: typeof record.openrouter === 'string' ? record.openrouter : '',
  };
  inMemoryKeys = { ...keys };
  return { keys, remember: true };
}

/** Read the current-tab keys or the saved keys without exposing storage details to callers. */
export function getActiveKeys(): ProviderKeys {
  return readKeySettings().keys;
}

/** Update the current-tab keys and persist them only when the user opted in. */
export function updateKeySettings(keys: ProviderKeys, remember: boolean): void {
  inMemoryKeys = { ...keys };
  if (typeof window === 'undefined') return;

  if (remember) {
    window.localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
    window.localStorage.setItem(REMEMBER_STORAGE_KEY, 'true');
  } else {
    window.localStorage.removeItem(KEYS_STORAGE_KEY);
    window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
  }
}

/** Remove one provider key from memory and from local storage when it is enabled. */
export function clearStoredKey(provider: ProviderId): void {
  const current = getActiveKeys();
  current[provider] = '';
  const remember = typeof window !== 'undefined' && window.localStorage.getItem(REMEMBER_STORAGE_KEY) === 'true';
  updateKeySettings(current, remember);
}

/** Remove all saved provider keys and clear the current tab's in-memory keys. */
export function clearAllStoredKeys(): void {
  inMemoryKeys = { ...EMPTY_KEYS };
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(KEYS_STORAGE_KEY);
  window.localStorage.removeItem(REMEMBER_STORAGE_KEY);
}
