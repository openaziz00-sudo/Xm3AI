import type { CodeLanguage } from '@/types';

export const AI_PROVIDERS = [
  { id: 'gemini', label: 'Google Gemini', model: 'gemini-2.5-flash' },
  { id: 'openrouter', label: 'Open Router', model: 'meta-llama/llama-3.3-70b' },
] as const;

export const CODE_LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
];

export const DEFAULT_CODE: Record<CodeLanguage, string> = {
  python: `# Xm3 AI Studio — Python Workspace\ndef greet(name: str) -> str:\n    return f"Hello, {name}! Welcome to Xm3."\n\nresult = greet("World")\nprint(result)\n`,
  javascript: `// Xm3 AI Studio — JavaScript Workspace\nconst greet = (name) => {\n  return \`Hello, \${name}! Welcome to Xm3.\`;\n};\n\nconsole.log(greet("World"));\n`,
  typescript: `// Xm3 AI Studio — TypeScript Workspace\nconst greet = (name: string): string => {\n  return \`Hello, \${name}! Welcome to Xm3.\`;\n};\n\nconsole.log(greet("World"));\n`,
  cpp: `// Xm3 AI Studio — C++ Workspace\n#include <iostream>\n#include <string>\n\nstd::string greet(const std::string& name) {\n    return "Hello, " + name + "! Welcome to Xm3.";\n}\n\nint main() {\n    std::cout << greet("World") << std::endl;\n    return 0;\n}\n`,
  rust: `// Xm3 AI Studio — Rust Workspace\nfn greet(name: &str) -> String {\n    format!("Hello, {}! Welcome to Xm3.", name)\n}\n\nfn main() {\n    println!("{}", greet("World"));\n}\n`,
  go: `// Xm3 AI Studio — Go Workspace\npackage main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return fmt.Sprintf("Hello, %s! Welcome to Xm3.", name)\n}\n\nfunc main() {\n    fmt.Println(greet("World"))\n}\n`,
};

export const MOCK_AI_RESPONSES: Record<string, string[]> = {
  think: [
    `**Analyzing your request deeply...**\n\nAfter thorough reasoning across multiple dimensions:\n\n1. **Primary insight**: The core problem involves optimizing the interaction between structured data and semantic understanding.\n\n2. **Secondary considerations**:\n   - Memory efficiency vs. processing speed tradeoff\n   - Edge cases in multilingual contexts\n   - Scalability beyond 10k concurrent users\n\n3. **Recommended approach**: Implement a layered caching strategy with semantic embeddings at the retrieval layer.\n\nThis analysis synthesizes patterns from 847 similar architectural decisions.`,
    `**Deep Reasoning Mode Active**\n\nBreaking down the problem space:\n\n→ **Layer 1**: Surface semantics — what you're asking literally\n→ **Layer 2**: Intent mapping — what you actually need\n→ **Layer 3**: Contextual optimization — best path given constraints\n\nConclusion: The most elegant solution here balances simplicity with extensibility. Here's my structured recommendation...`,
  ],
  deepsearch: [
    `**DeepSearch Results** — *Searched across 12,400+ sources*\n\n📄 **Top findings:**\n\n1. **arXiv:2401.12345** — "Scaling Laws for Collaborative AI Systems" (2024)\n   > Key finding: Dual-pane interfaces reduce context switching by 67%\n\n2. **Nature Machine Intelligence** — Recent advances in code generation\n   > LLMs achieve 89.3% pass@1 on HumanEval with chain-of-thought\n\n3. **GitHub Trending** — 3 relevant repositories found\n\n*Sources verified and ranked by relevance score.*`,
    `**Search Complete** — *Real-time web synthesis*\n\nFound **23 high-quality sources** matching your query.\n\n**Summary**: The consensus across recent literature suggests that hybrid approaches outperform single-modal solutions by a significant margin. Key papers include foundational work from Google DeepMind and OpenAI's scaling research division.\n\n**Confidence**: 94.2% | **Freshness**: Last 30 days`,
  ],
  chat: [
    `I understand what you're looking for. Here's how I'd approach this:\n\nThe key is to **structure your workflow** around clear separation of concerns. Think of it as layers:\n\n\`\`\`\nInput → Processing → Output → Feedback\n\`\`\`\n\nEach layer should be independently testable and replaceable. Would you like me to elaborate on any specific layer?`,
    `Great question! Let me break this down:\n\n**The short answer**: Yes, this is absolutely achievable with the right architecture.\n\n**The longer answer** involves considering three factors:\n1. Your current data model\n2. The expected load patterns  \n3. Latency requirements\n\nI can help you design each component. Where would you like to start?`,
    `Here's a clean implementation for what you described:\n\n\`\`\`python\nclass Solution:\n    def process(self, data: list) -> dict:\n        result = {}\n        for item in data:\n            key = item.get('id')\n            result[key] = self._transform(item)\n        return result\n    \n    def _transform(self, item: dict) -> dict:\n        return {k: v for k, v in item.items() if v is not None}\n\`\`\`\n\nThis handles edge cases gracefully. Want me to add error handling or typing?`,
  ],
};

export const SAMPLE_DOCUMENT = `# Welcome to Xm3 Studio\n\nThis is your collaborative workspace powered by **Xm3 AI**. You can:\n\n- Edit documents in real-time alongside AI assistance\n- Switch between **Document** and **Code** modes\n- Use **DeepSearch** to research topics instantly\n- Activate **Think Mode** for deep reasoning\n\n## Getting Started\n\nType a message in the chat panel to begin collaborating. The AI will help you draft, refine, and expand your content.\n\n### Tips\n\n1. Use **/think** to activate deep reasoning mode\n2. Use **/search** to trigger DeepSearch\n3. Press **Ctrl+K** to open command palette\n\n> "The best interface is the one that disappears, leaving only the work." — Xm3 Design Philosophy\n`;
