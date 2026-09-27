import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Zap, Shield, Github, Mail,
  Command, FolderOpen, MessageSquare
} from 'lucide-react';
import { XM3_AGENTS } from '@/constants/agents';

const heroImg = 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80&auto=format&fit=crop';

const features = [
  {
    icon: MessageSquare,
    title: 'Dual-Pane Workspace',
    desc: 'AI chat alongside a full document and code editor. No context switching — collaborate and create in one unified view.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    featured: true,
  },
  {
    icon: FolderOpen,
    title: 'File Manager',
    desc: 'Organize documents and code files in a tree-based file manager. Create, rename, and switch files instantly.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    featured: false,
  },
  {
    icon: Command,
    title: 'Command Palette',
    desc: 'Press Ctrl+K to access every action — switch agents, change modes, create sessions — without lifting your hands.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    featured: false,
  },
  {
    icon: Sparkles,
    title: 'Session History',
    desc: 'Every conversation is saved. Restore any past session, switch between projects, and never lose context again.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    featured: false,
  },
];

const stats = [
  { value: '5', label: 'AI Agents' },
  { value: '6+', label: 'Languages' },
  { value: '3', label: 'AI Modes' },
  { value: '∞', label: 'Sessions' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-5 overflow-hidden dot-grid">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass border border-blue-500/30 rounded-full text-xs text-blue-400 font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            5 AI Agents · Powered by Google &amp; OpenRouter
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="text-foreground">The AI workspace</span>
            <br />
            <span className="text-gradient">built for deep work</span>
          </h1>

          <p className="text-lg text-[hsl(var(--text-secondary))] max-w-2xl mx-auto leading-relaxed mb-10">
            Xm3 AI Studio combines five specialized AI agents, a document editor, code workspace,
            session history, file manager, and command palette — in one seamless interface.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              to="/studio"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] group"
            >
              <Sparkles className="w-4 h-4" />
              Open Studio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#agents"
              className="flex items-center gap-2 px-6 py-3 glass border border-[hsl(var(--border))] hover:border-blue-500/40 text-[hsl(var(--text-secondary))] hover:text-foreground rounded-xl font-medium text-sm transition-all"
            >
              Meet the agents
            </a>
          </div>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-[0_0_40px_rgba(59,130,246,0.08)] max-w-4xl mx-auto">
            <img
              src={heroImg}
              alt="Xm3 AI Studio dual-pane interface"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Studio Live</span>
              </div>
              <span className="text-xs text-[hsl(var(--text-subtle))]">Dual-pane workspace</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-5 border-y border-[hsl(var(--border))]">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient mb-1">{s.value}</div>
              <div className="text-xs text-[hsl(var(--text-subtle))] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section id="agents" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass border border-[hsl(var(--border))] rounded-full text-xs text-[hsl(var(--text-subtle))] font-medium mb-4">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              5 Specialized AI Agents
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              One studio, <span className="text-blue-400">five intelligences</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-base max-w-xl mx-auto">
              Each agent is purpose-built for a specific task. Switch instantly — from a fast conversation
              to deep reasoning, web search, code review, or visual analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {XM3_AGENTS.map((agent, i) => (
              <div
                key={agent.id}
                className={`relative p-5 rounded-2xl border glass hover:border-blue-500/30 transition-all group cursor-default ${
                  i === 0 ? 'md:col-span-2 lg:col-span-1 ring-1 ring-blue-500/20' : ''
                }`}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl border ${agent.bgColor} flex items-center justify-center text-xl`}>
                    {agent.icon}
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${agent.bgColor} ${agent.accentColor} font-medium`}>
                    {agent.badge}
                  </span>
                </div>

                <h3 className={`text-base font-bold mb-1 ${agent.accentColor}`}>{agent.name}</h3>
                <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed mb-4">
                  {agent.tagline}
                </p>

                {/* Capability bullets */}
                <ul className="space-y-1.5">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2 text-xs text-[hsl(var(--text-subtle))]">
                      <div className={`w-1 h-1 rounded-full ${agent.accentColor.replace('text-', 'bg-')}`} />
                      {cap}
                    </li>
                  ))}
                </ul>

                {i === 0 && (
                  <Link
                    to="/studio"
                    className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${agent.accentColor} hover:opacity-80`}
                  >
                    Try now <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-5 border-t border-[hsl(var(--border))]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Everything in the <span className="text-blue-400">Studio</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-sm max-w-lg mx-auto">
              Built-in tools to help you think, write, and build without leaving the workspace.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`p-5 rounded-2xl border glass hover:border-blue-500/30 transition-all ${f.featured ? 'ring-1 ring-blue-500/10' : ''}`}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${f.bg} mb-3`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-2xl mx-auto text-center glass border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/4 rounded-3xl" />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start collaborating with AI
            </h2>
            <p className="text-[hsl(var(--text-secondary))] mb-8 text-sm leading-relaxed">
              Open the studio and begin your first session. Five agents, three modes, one workspace — ready instantly.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <Sparkles className="w-4 h-4" />
              Launch Xm3 Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">Xm3<span className="text-blue-400">AI</span> Studio</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="mailto:openaziz00@gmail.com"
              className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-subtle))] hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              openaziz00@gmail.com
            </a>
            <a
              href="https://github.com/7drabd1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-subtle))] hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              7drabd1
            </a>
          </div>
          <p className="text-xs text-[hsl(var(--text-subtle))]">
            © {new Date().getFullYear()} Xm3 AI Studio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
