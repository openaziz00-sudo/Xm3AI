import { useEffect, useState } from 'react';
import { ExternalLink, KeyRound, LoaderCircle } from 'lucide-react';
import {
  clearAllStoredKeys,
  clearStoredKey,
  readKeySettings,
  updateKeySettings,
  type ProviderId,
  type ProviderKeys,
} from '@/lib/keys';
import { testGeminiKey, type ConnectionResult } from '@/lib/providers/gemini';
import { testOpenRouterKey } from '@/lib/providers/openrouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

type Status = ConnectionResult['status'] | 'untested' | 'not-set' | 'testing';
interface ProviderStatus {
  status: Status;
  message: string;
}

const EMPTY_KEYS: ProviderKeys = { gemini: '', openrouter: '' };
const INITIAL_STATUS: Record<ProviderId, ProviderStatus> = {
  gemini: { status: 'not-set', message: '' },
  openrouter: { status: 'not-set', message: '' },
};
const statusClasses: Record<Status, string> = {
  valid: 'text-emerald-400',
  invalid: 'text-red-400',
  error: 'text-amber-400',
  untested: 'text-amber-300',
  'not-set': 'text-[hsl(var(--text-subtle))]',
  testing: 'text-blue-300',
};
const statusLabels: Record<Status, string> = {
  valid: '✓ Valid',
  invalid: '✗ Invalid',
  error: '⚠ Error',
  untested: '⚠ Untested',
  'not-set': '— Not set',
  testing: 'Testing…',
};

/** Manage provider keys without sending them to Xm3AI's server. */
const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const [keys, setKeys] = useState<ProviderKeys>(EMPTY_KEYS);
  const [remember, setRemember] = useState(false);
  const [statuses, setStatuses] = useState(INITIAL_STATUS);
  const [storageMessage, setStorageMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    try {
      const saved = readKeySettings();
      setKeys(saved.keys);
      setRemember(saved.remember);
      setStorageMessage('');
      setStatuses({
        gemini: { status: saved.keys.gemini ? 'untested' : 'not-set', message: saved.keys.gemini ? 'Saved key has not been tested in this session.' : '' },
        openrouter: { status: saved.keys.openrouter ? 'untested' : 'not-set', message: saved.keys.openrouter ? 'Saved key has not been tested in this session.' : '' },
      });
    } catch {
      setKeys(EMPTY_KEYS);
      setRemember(false);
      setStorageMessage('Could not read saved browser settings. Keys were not loaded; clear saved keys or enter them again.');
    }
  }, [open]);

  /** Update tab memory and, when opted in, local storage for one provider. */
  const updateKey = (provider: ProviderId, value: string) => {
    const next = { ...keys, [provider]: value };
    setKeys(next);
    setStatuses((previous) => ({
      ...previous,
      [provider]: { status: value.trim() ? 'untested' : 'not-set', message: value.trim() ? 'Connection not checked yet.' : '' },
    }));
    setStorageMessage('');
    try {
      updateKeySettings(next, remember);
    } catch {
      setStorageMessage('Could not save keys in this browser. They remain only in memory for this tab.');
    }
  };

  /** Persist or discard browser-local keys according to the remember checkbox. */
  const setRememberPreference = (checked: boolean) => {
    setRemember(checked);
    setStorageMessage('');
    try {
      updateKeySettings(keys, checked);
    } catch {
      setRemember(false);
      setStorageMessage('Could not update browser storage. Keys remain only in memory for this tab.');
    }
  };

  /** Run the provider's minimal read-only key check and store only its status. */
  const testKey = async (provider: ProviderId) => {
    const apiKey = keys[provider].trim();
    if (!apiKey) {
      setStatuses((previous) => ({
        ...previous,
        [provider]: { status: 'not-set', message: 'Add a key before testing.' },
      }));
      return;
    }

    setStatuses((previous) => ({
      ...previous,
      [provider]: { status: 'testing', message: 'Testing directly with provider…' },
    }));
    const result = provider === 'gemini'
      ? await testGeminiKey(apiKey)
      : await testOpenRouterKey(apiKey);
    setStatuses((previous) => ({ ...previous, [provider]: result }));
  };

  /** Clear one provider key from the dialog, memory, and optional local storage. */
  const clearKey = (provider: ProviderId) => {
    const next = { ...keys, [provider]: '' };
    setKeys(next);
    setStatuses((previous) => ({ ...previous, [provider]: INITIAL_STATUS[provider] }));
    setStorageMessage('');
    try {
      updateKeySettings(next, remember);
      clearStoredKey(provider);
    } catch {
      setStorageMessage('Could not clear the saved key from browser storage. Check browser storage permissions.');
    }
  };

  /** Clear every provider key and disable remembered-key storage. */
  const clearAll = () => {
    setKeys(EMPTY_KEYS);
    setRemember(false);
    setStatuses(INITIAL_STATUS);
    setStorageMessage('');
    try {
      clearAllStoredKeys();
    } catch {
      setStorageMessage('Could not clear browser storage. Remove saved keys in your browser settings.');
    }
  };

  /** Render a provider input with test, status, and clear controls. */
  const renderProvider = (provider: ProviderId, title: string, placeholder: string, href: string) => (
    <section className="rounded-xl border border-[hsl(var(--border))] surface-2 p-4" aria-labelledby={`${provider}-heading`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 id={`${provider}-heading`} className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-[hsl(var(--text-subtle))]">
            Status: <span role="status" aria-live="polite" className={statusClasses[statuses[provider].status]}>{statusLabels[statuses[provider].status]}{statuses[provider].message ? ` — ${statuses[provider].message}` : ''}</span>
          </p>
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200">
          Get a key <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <label htmlFor={`${provider}-key`} className="mb-1.5 block text-xs font-medium text-[hsl(var(--text-secondary))">{title}</label>
      <input
        id={`${provider}-key`}
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={keys[provider]}
        onChange={(event) => updateKey(provider, event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[hsl(var(--border))] surface-1 px-3 py-2 text-sm text-foreground outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void testKey(provider)}
          disabled={statuses[provider].status === 'testing' || !keys[provider].trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {statuses[provider].status === 'testing' && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
          Test Connection
        </button>
        <button type="button" onClick={() => clearKey(provider)} className="rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-xs text-[hsl(var(--text-secondary))] hover:text-foreground">
          Clear
        </button>
      </div>
    </section>
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-[hsl(var(--border))] surface-1 p-0 text-foreground">
        <DialogHeader className="flex-row items-start gap-3 border-b border-[hsl(var(--border))] px-5 py-4 pr-12 text-left">
          <span className="mt-0.5 rounded-lg bg-blue-500/10 p-2 text-blue-300"><KeyRound className="h-4 w-4" /></span>
          <div>
            <DialogTitle id="settings-title" className="text-base font-bold">Settings · API keys</DialogTitle>
            <DialogDescription className="mt-1 text-xs text-[hsl(var(--text-subtle))]">Enter a provider key here, then test it directly from this browser.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          {renderProvider('gemini', 'Google Gemini API Key', 'AIza…', 'https://aistudio.google.com/apikey')}
          {renderProvider('openrouter', 'OpenRouter API Key', 'sk-or-…', 'https://openrouter.ai/keys')}

          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[hsl(var(--border))] px-3 py-3 text-xs text-[hsl(var(--text-secondary))]">
            <input type="checkbox" checked={remember} onChange={(event) => setRememberPreference(event.target.checked)} className="mt-0.5 accent-blue-500" />
            <span><span className="font-medium text-foreground">Remember on this device</span><br />Off by default. When enabled, keys are saved in this browser’s local storage.</span>
          </label>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-[hsl(var(--text-secondary))]">
            <p className="font-semibold text-amber-300">⚠️ Security Notice</p>
            <p className="mt-1">Your API keys are stored only in this browser's local storage. They are never sent to Xm3AI servers. However, any browser extension with permission to read page data could access them. Only enter keys on devices you trust. To revoke access, delete the key in your provider's dashboard and click "Clear" here.</p>
            <p className="mt-2">By default, keys stay in memory only and are discarded when the tab is closed or refreshed. Enable “Remember on this device” to store them in local storage. Clicking “Test Connection” sends the selected key directly to that provider, not to Xm3AI.</p>
          </div>

          {storageMessage && <p role="alert" className="text-xs text-amber-300">{storageMessage}</p>}
          <button type="button" onClick={clearAll} className="text-xs font-medium text-red-300 hover:text-red-200">Clear all keys</button>
        </div>

        <DialogFooter className="border-t border-[hsl(var(--border))] px-5 py-3 text-left">
          <p className="text-[11px] leading-relaxed text-[hsl(var(--text-subtle))]">Connection checks use the providers’ read-only key/model endpoints; they do not make an AI generation request. The key is sent to a provider only when you click “Test Connection.”</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
