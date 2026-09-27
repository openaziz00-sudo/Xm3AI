/**
 * Xm3 AI Agent definitions
 * Public-facing branded names map to real backend models.
 * This mapping is internal only.
 */

export interface XmAgent {
  id: string;
  name: string;            // Public display name
  tagline: string;         // Short capability description
  badge: string;           // Capability badge text
  badgeColor: string;      // Tailwind color class
  icon: string;            // Emoji icon
  accentColor: string;     // Tailwind text color
  bgColor: string;         // Tailwind bg/border color
  capabilities: string[];  // Feature bullets
  provider: 'google' | 'openrouter';
  // --- INTERNAL (never expose to UI) ---
  _realProvider: string;
  _realModel: string;
}

export const XM3_AGENTS: XmAgent[] = [
  {
    id: 'xm3-core',
    name: 'Xm3 Core',
    tagline: 'Fast, reliable, all-purpose assistant',
    badge: 'General',
    badgeColor: 'text-blue-400',
    icon: '⚡',
    accentColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    capabilities: ['Multi-turn conversation', 'Document drafting', 'Code assistance', 'Fast responses'],
    provider: 'google',
    _realProvider: 'Google',
    _realModel: 'gemini-2.5-flash',
  },
  {
    id: 'xm3-think',
    name: 'Xm3 Think',
    tagline: 'Deep reasoning & multi-step analysis',
    badge: 'Reasoning',
    badgeColor: 'text-violet-400',
    icon: '🧠',
    accentColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
    capabilities: ['Chain-of-thought reasoning', 'Complex problem solving', 'Multi-layer analysis', 'Research synthesis'],
    provider: 'google',
    _realProvider: 'Google',
    _realModel: 'gemini-2.5-pro',
  },
  {
    id: 'xm3-search',
    name: 'Xm3 Search',
    tagline: 'Real-time web synthesis & fact checking',
    badge: 'DeepSearch',
    badgeColor: 'text-emerald-400',
    icon: '🔍',
    accentColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    capabilities: ['Live web search', 'Source ranking & verification', 'Citation extraction', 'Cross-reference synthesis'],
    provider: 'openrouter',
    _realProvider: 'OpenRouter',
    _realModel: 'perplexity/llama-3.1-sonar-large-128k-online',
  },
  {
    id: 'xm3-vision',
    name: 'Xm3 Vision',
    tagline: 'Image understanding & visual analysis',
    badge: 'Multimodal',
    badgeColor: 'text-orange-400',
    icon: '👁',
    accentColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    capabilities: ['Image analysis & description', 'Chart & diagram reading', 'Document OCR', 'Visual QA'],
    provider: 'google',
    _realProvider: 'Google',
    _realModel: 'gemini-2.5-flash',
  },
  {
    id: 'xm3-code',
    name: 'Xm3 Code',
    tagline: 'Expert-level code generation & review',
    badge: 'Code',
    badgeColor: 'text-cyan-400',
    icon: '</> ',
    accentColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    capabilities: ['Code generation & completion', 'Bug detection & fixes', 'Architecture design', 'Supports 40+ languages'],
    provider: 'openrouter',
    _realProvider: 'OpenRouter',
    _realModel: 'anthropic/claude-3.5-sonnet',
  },
];

/** Map agent ID → real model config for backend calls */
export const AGENT_MODEL_MAP: Record<string, { provider: string; model: string }> = Object.fromEntries(
  XM3_AGENTS.map((a) => [a.id, { provider: a._realProvider, model: a._realModel }])
);

/** Default agent for new sessions */
export const DEFAULT_AGENT_ID = 'xm3-core';
