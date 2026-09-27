import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Github, ExternalLink, Menu, X, Command } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

const Header = ({ onOpenCommandPalette }: HeaderProps) => {
  const location = useLocation();
  const isStudio = location.pathname === '/studio';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--sidebar-background))] backdrop-blur-xl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-extrabold text-sm tracking-tight text-foreground">
          Xm3<span className="text-blue-400">AI</span>
        </span>
        <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded surface-3 border border-[hsl(var(--border))] text-[hsl(var(--text-subtle))] uppercase tracking-widest">
          Studio
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
        {[
          { href: '/', label: 'Home' },
          { href: '/studio', label: 'Studio' },
        ].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === item.href
                ? 'text-foreground bg-[hsl(var(--surface-3))] border border-[hsl(var(--border))]'
                : 'text-[hsl(var(--text-subtle))] hover:text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-2))]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {isStudio && onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            title="Command palette (Ctrl+K)"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 surface-2 border border-[hsl(var(--border))] rounded-lg text-xs text-[hsl(var(--text-subtle))] hover:text-foreground hover:border-[hsl(var(--blue-glow))] transition-all"
          >
            <Command className="w-3.5 h-3.5" />
            <span>⌘K</span>
          </button>
        )}

        <a
          href="https://github.com/7drabd1"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="hidden sm:flex p-2 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>

        {isStudio ? (
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 surface-3 border border-[hsl(var(--border))] rounded-lg text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-foreground hover:border-[hsl(var(--blue-glow))] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        ) : (
          <Link
            to="/studio"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_12px_rgba(59,130,246,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open Studio
          </Link>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-[hsl(var(--text-subtle))] hover:text-foreground hover:bg-[hsl(var(--surface-3))] transition-colors"
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[hsl(var(--sidebar-background))] border-b border-[hsl(var(--border))] py-3 px-5 md:hidden">
          {[
            { href: '/', label: 'Home' },
            { href: '/studio', label: 'Studio' },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2.5 text-sm font-medium transition-colors border-b border-[hsl(var(--border))] last:border-0 ${
                location.pathname === item.href
                  ? 'text-blue-400'
                  : 'text-[hsl(var(--text-secondary))] hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/7drabd1"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2.5 text-sm text-[hsl(var(--text-secondary))] hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:openaziz00@gmail.com"
            className="block py-2.5 text-sm text-[hsl(var(--text-secondary))] hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
