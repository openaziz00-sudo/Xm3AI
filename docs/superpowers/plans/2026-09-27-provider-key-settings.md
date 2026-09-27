# Provider Key Settings Implementation Plan

> **For agentic workers:** Use this plan task-by-task with focused verification; steps use checkbox syntax for tracking.

**Goal:** Add an in-app Settings dialog where users can enter Gemini and OpenRouter API keys, choose whether to remember them locally, clear them, and run provider-side connection checks without transmitting keys to Xm3AI.

**Architecture:** Keep two provider keys in React memory by default and optionally mirror them to the browser's `localStorage` only after explicit opt-in. A Settings dialog reachable from Ctrl+K will send minimal direct browser requests to official provider endpoints and report status without exposing raw request/response bodies. Google Gemini accepts either `GOOGLE_API_KEY` or `GEMINI_API_KEY` as the same credential; use one input and one storage slot. Do not create a webhook feature until its source, trigger, and effect are specified.

**Tech Stack:** Existing React, TypeScript, Vite, browser `fetch`, `localStorage`, existing Radix Dialog and UI primitives.

**Spec:** User-provided `pasted_content.txt` key-management requirements, narrowed by the follow-up to show in-app entry and allow browser-side checks.

## Global Constraints

- Never print, log, transmit to Xm3AI servers, commit, or include API key values in errors.
- Do not request or receive key values in chat; the user enters them directly in the app.
- Persist only when the user opts into “Remember on this device”; otherwise keep keys in memory only.
- Make provider tests go directly from the browser to Google/OpenRouter.
- Show the key-storage/security notice and clear-one / clear-all controls.
- Webhook work is out of scope until the user specifies what it is for.

---

### Task 1: Key state, optional persistence, and provider checks

**Files:**
- Create: `src/lib/keys.ts`
- Create: `src/lib/providers/gemini.ts`
- Create: `src/lib/providers/openrouter.ts`

**Interfaces:**
- `readSavedKeys(): ProviderKeys` — loads local keys defensively; never exposes saved values except to app code.
- `saveKeys(keys): void`, `clearKey(provider): void`, `clearAllKeys(): void` — isolate storage access and guard browser/storage failures.
- `testGeminiKey(key): Promise<ConnectionResult>` — calls Google API with `x-goog-api-key` header.
- `testOpenRouterKey(key): Promise<ConnectionResult>` — calls OpenRouter key-status endpoint with Bearer auth.
- All functions document missing keys, non-OK HTTP, network errors, and storage errors.

- [ ] Verify the official minimal provider endpoints and their authentication formats.
- [ ] Implement pure key helpers and explicit result types; do not return raw response text.
- [ ] Add the two direct provider test functions and avoid console output.

### Task 2: Settings UI and access path

**Files:**
- Create: `src/components/features/SettingsDialog.tsx`
- Modify: `src/pages/Studio.tsx`
- Modify: `src/components/features/CommandPalette.tsx`
- Modify: `src/App.tsx` or `src/components/layout/Header.tsx` only if a direct Settings control is needed.

**Interfaces:**
- Dialog receives `open` and `onClose`; manages key input, explicit remember checkbox, test status, individual clear buttons, and clear-all.
- Command Palette gains a “Settings” action. Ctrl+K opens the palette in Studio; the Settings action opens the dialog.

- [ ] Implement provider fields with expected prefixes and provider key links.
- [ ] Add “Test Connection” buttons and accessible status messages.
- [ ] Display the requested verbatim security notice and “keys never leave your browser” note.
- [ ] Ensure no key value appears in DOM attributes, toast text, URL, logs, or error text beyond the password input itself.

### Task 3: Verify and hand off

**Files:**
- No production files beyond Tasks 1–2; create test file only if a runner is already available.

- [ ] Run `npm run build` and `npm run lint`; distinguish pre-existing lint failures from new findings.
- [ ] Start the Vite app bound to `0.0.0.0`, verify it locally and at the session's public preview URL.
- [ ] Inspect the Settings dialog layout and navigation; do not enter or extract real secrets in the agent session.
- [ ] Tell the user that the UI calls provider endpoints directly; they can enter keys in the Settings page and read the success/error status. The agent cannot read a browser-local key value.
