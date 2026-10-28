import React from 'react';
import ChessBot from './components/ChessBot';
import { Crown, Code2, ArrowLeft, ExternalLink, Github } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://phax.online" className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </a>
            <div>
              <span className="font-extrabold text-base tracking-wider uppercase font-mono text-white">
                PHAX<span className="text-amber-500">.CHESS</span>
              </span>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wider hidden sm:block">
                Непобедимый ИИ-движок Stockfish 3500+ ELO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://phax.online"
              className="px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>В портфолио</span>
            </a>
            <a
              href="https://github.com/phaxdev/phax-chess"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ChessBot isDark={true} />
      </main>
    </div>
  );
}

export default App;
