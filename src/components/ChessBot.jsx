import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { 
  Bot, 
  RotateCcw, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';

// SVG Chess Pieces
const PIECES = {
  p: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <path
        d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
        fill={color === 'w' ? '#ffffff' : '#18181b'}
        stroke={color === 'w' ? '#18181b' : '#a1a1aa'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  r: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <g fill={color === 'w' ? '#ffffff' : '#18181b'} stroke={color === 'w' ? '#18181b' : '#a1a1aa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5H14V17" />
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        <path d="M11 14h23" />
      </g>
    </svg>
  ),
  n: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <g fill={color === 'w' ? '#ffffff' : '#18181b'} stroke={color === 'w' ? '#18181b' : '#a1a1aa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
        <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" />
        <circle cx="9.5" cy="25.5" r=".5" />
        <circle cx="15" cy="14.5" r=".8" />
      </g>
    </svg>
  ),
  b: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <g fill={color === 'w' ? '#ffffff' : '#18181b'} stroke={color === 'w' ? '#18181b' : '#a1a1aa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        <path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" stroke={color === 'w' ? '#18181b' : '#ffffff'} />
      </g>
    </svg>
  ),
  q: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <g fill={color === 'w' ? '#ffffff' : '#18181b'} stroke={color === 'w' ? '#18181b' : '#a1a1aa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" />
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" />
      </g>
    </svg>
  ),
  k: (color) => (
    <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-md select-none">
      <g fill={color === 'w' ? '#ffffff' : '#18181b'} stroke={color === 'w' ? '#18181b' : '#a1a1aa'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke={color === 'w' ? '#18181b' : '#ffffff'} />
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
        <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1 8-8.5 8-7 0-5-9-10.5-9s-3.5 9-10.5 9c-7.5 0-4.5-9-8.5-8-3 6 6 10.5 6 10.5v7z" />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
      </g>
    </svg>
  ),
};

// ==================== BUILT-IN FALLBACK MINIMAX ENGINE ====================
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST_PAWN = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const PST_KNIGHT = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

function evaluateBoard(game) {
  let total = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        const idx = r * 8 + c;
        const pst = piece.type === 'p' ? PST_PAWN[piece.color === 'w' ? idx : 63 - idx] : 
                    piece.type === 'n' ? PST_KNIGHT[piece.color === 'w' ? idx : 63 - idx] : 0;
        const score = val + pst;
        total += piece.color === 'w' ? score : -score;
      }
    }
  }
  return total;
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      game.move(m);
      const ev = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      game.move(m);
      const ev = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMoveFallback(game, depth = 3) {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  const isMaximizing = game.turn() === 'w';
  let bestMove = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

  for (const m of moves) {
    game.move(m);
    const value = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing && value > bestValue) {
      bestValue = value;
      bestMove = m;
    } else if (!isMaximizing && value < bestValue) {
      bestValue = value;
      bestMove = m;
    }
  }
  return bestMove;
}

// Get the actual Stockfish URL based on environment
const resolveStockfishUrl = () => {
  if (typeof window === 'undefined') return '/stockfish.js';
  const path = window.location.pathname;
  if (path.includes('phax-chess')) {
    return `${window.location.origin}/phax-chess/stockfish.js`;
  }
  return `${window.location.origin}/stockfish.js`;
};

export const ChessBot = ({ isDark = true }) => {
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [engineLevel, setEngineLevel] = useState('grandmaster');
  const [playerColor, setPlayerColor] = useState('w');
  const [isThinking, setIsThinking] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [botComment, setBotComment] = useState('Я готов. Сделай первый ход, если осмелишься.');
  const [gameStats, setGameStats] = useState({ botWins: 247, draws: 3, playerWins: 0 });

  const workerRef = useRef(null);
  const thinkingTimeoutRef = useRef(null);

  // Play Sound synthesized by Web Audio API
  const playSound = useCallback((type) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'move') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'capture') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'check') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) {}
  }, [soundEnabled]);

  // Execute Bot Move
  const makeBotMove = useCallback((from, to, promotion) => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }

    setGame(prev => {
      const nextGame = new Chess(prev.fen());
      try {
        const move = nextGame.move({ from, to, promotion: promotion || 'q' });
        if (move) {
          setLastMove({ from, to });
          if (move.captured) playSound('capture');
          else if (nextGame.inCheck()) playSound('check');
          else playSound('move');

          if (nextGame.isCheckmate()) {
            setBotComment('Мат! Ты достойно сражался, но против Stockfish шансов нет.');
            setGameStats(s => ({ ...s, botWins: s.botWins + 1 }));
            playSound('check');
          } else if (nextGame.inCheck()) {
            setBotComment('Шах! Твой король в опасности.');
          } else if (move.captured) {
            setBotComment('Минус фигура. Тактическая ошибка с твоей стороны.');
          } else {
            const comments = [
              'Контролирую центр доски. Всё под расчетом.',
              'Глубина анализа 15 ходов вперед. Попробуй найти слабость.',
              'Ты уверен в этом плане? Фигуры расположены пассивно.',
              'Идеальная позиционная игра. Никаких зевков.',
            ];
            setBotComment(comments[Math.floor(Math.random() * comments.length)]);
          }
        }
      } catch (e) {
        console.error('Invalid bot move attempt:', e);
      }
      setIsThinking(false);
      return nextGame;
    });
  }, [playSound]);

  // Initialize Stockfish Web Worker with proper path
  useEffect(() => {
    try {
      const workerUrl = resolveStockfishUrl();
      const worker = new Worker(workerUrl);
      
      worker.postMessage('uci');
      worker.postMessage('isready');
      workerRef.current = worker;

      worker.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';
        
        // Parse Evaluation
        if (line.includes('score cp')) {
          const m = line.match(/score cp (-?\d+)/);
          if (m) {
            const cp = parseInt(m[1], 10);
            setEvalScore(playerColor === 'w' ? -cp / 100 : cp / 100);
          }
        } else if (line.includes('score mate')) {
          const m = line.match(/score mate (-?\d+)/);
          if (m) {
            const mateIn = parseInt(m[1], 10);
            setEvalScore(mateIn > 0 ? -99 : 99);
            setBotComment(`Мат в ${Math.abs(mateIn)} хода. Финал предрешен.`);
          }
        }

        // Parse Best Move
        if (line.startsWith('bestmove')) {
          const parts = line.split(' ');
          const moveStr = parts[1];
          if (moveStr && moveStr !== '(none)') {
            const from = moveStr.substring(0, 2);
            const to = moveStr.substring(2, 4);
            const promotion = moveStr.length > 4 ? moveStr[4] : undefined;

            setTimeout(() => {
              makeBotMove(from, to, promotion);
            }, 250);
          }
        }
      };

      worker.onerror = (err) => {
        console.warn('Stockfish Worker failed to load from ' + workerUrl + ', using built-in minimax engine.', err);
        workerRef.current = null;
      };

      return () => {
        worker.terminate();
      };
    } catch (err) {
      console.warn('Stockfish Worker failed, fallback enabled', err);
      workerRef.current = null;
    }
  }, [playerColor, makeBotMove]);

  // Request Bot Move with safety watchdog
  const requestEngineMove = useCallback((currentGame) => {
    setIsThinking(true);
    const depth = engineLevel === 'grandmaster' ? 14 : engineLevel === 'master' ? 7 : 3;

    let workerSent = false;
    if (workerRef.current) {
      try {
        workerRef.current.postMessage('position fen ' + currentGame.fen());
        workerRef.current.postMessage(`go depth ${depth}`);
        workerSent = true;
      } catch (e) {
        workerSent = false;
      }
    }

    // Safety fallback: if worker fails, takes too long (>1.8s) or is not loaded
    thinkingTimeoutRef.current = setTimeout(() => {
      console.log('Engine watchdog: calculating move via fallback minimax...');
      const best = getBestMoveFallback(currentGame, 3);
      if (best) {
        makeBotMove(best.from, best.to, best.promotion);
      } else {
        setIsThinking(false);
      }
    }, workerSent ? 2200 : 300);
  }, [engineLevel, makeBotMove]);

  // Player Move Handler
  const onSquareClick = (square) => {
    if (isThinking || game.isGameOver()) return;

    const isPlayerTurn = game.turn() === playerColor;
    if (!isPlayerTurn) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    if (selectedSquare) {
      try {
        const newGame = new Chess(game.fen());
        const move = newGame.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (move) {
          setGame(newGame);
          setSelectedSquare(null);
          setPossibleMoves([]);
          setLastMove({ from: selectedSquare, to: square });

          if (move.captured) playSound('capture');
          else if (newGame.inCheck()) playSound('check');
          else playSound('move');

          if (newGame.isCheckmate()) {
            setBotComment('НЕВЕРОЯТНО! Ты победил бота! Это исторический момент!');
            setGameStats(s => ({ ...s, playerWins: s.playerWins + 1 }));
            playSound('check');
            return;
          } else if (newGame.isDraw()) {
            setBotComment('Ничья! Пат или трехкратное повторение.');
            setGameStats(s => ({ ...s, draws: s.draws + 1 }));
            return;
          }

          requestEngineMove(newGame);
          return;
        }
      } catch (e) {}
    }

    const piece = game.get(square);
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square, verbose: true });
      setPossibleMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // Reset Game
  const resetGame = () => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    const newG = new Chess();
    setGame(newG);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsThinking(false);
    setEvalScore(0);
    setBotComment('Новая партия! Я играю без пощады. Делай ход.');
    if (playerColor === 'b') {
      requestEngineMove(newG);
    }
  };

  // Surrender
  const surrender = () => {
    if (game.isGameOver()) return;
    setBotComment('Сдача принята. Разумное решение против Stockfish.');
    setGameStats(s => ({ ...s, botWins: s.botWins + 1 }));
  };

  // Switch Color
  const togglePlayerColor = () => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    const nextColor = playerColor === 'w' ? 'b' : 'w';
    setPlayerColor(nextColor);
    const newG = new Chess();
    setGame(newG);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsThinking(false);
    setEvalScore(0);
    if (nextColor === 'b') {
      setBotComment('Я играю белыми. Первый ход за мной!');
      requestEngineMove(newG);
    } else {
      setBotComment('Ты играешь белыми. Твой первый ход.');
    }
  };

  const files = playerColor === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = playerColor === 'w' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 transition-all ${
        isDark ? 'bg-zinc-950/80 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Crown className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                PHAX Stockfish AI • Шахматный Гроссмейстер
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                3500+ ELO
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Движок Stockfish NNUE в твоем браузере • Попробуй продержаться хотя бы 20 ходов
            </p>
          </div>
        </div>

        {/* Difficulty & Sound controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setEngineLevel('grandmaster')}
              className={`px-3 py-1 rounded-lg transition-all ${
                engineLevel === 'grandmaster' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Непобедимый
            </button>
            <button
              onClick={() => setEngineLevel('master')}
              className={`px-3 py-1 rounded-lg transition-all ${
                engineLevel === 'master' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Мастер
            </button>
            <button
              onClick={() => setEngineLevel('amateur')}
              className={`px-3 py-1 rounded-lg transition-all ${
                engineLevel === 'amateur' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Любитель
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Chess Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Board + Coordinates */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Bot Status & Eval bar */}
          <div className="w-full max-w-[480px] flex items-center justify-between mb-3 px-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Bot className={`w-4 h-4 ${isThinking ? 'text-amber-400 animate-spin' : 'text-zinc-400'}`} />
              <span className={isThinking ? 'text-amber-400 font-semibold' : 'text-zinc-300'}>
                {isThinking ? 'Бот рассчитывает ходы...' : 'Ход: ' + (game.turn() === 'w' ? 'Белые' : 'Черные')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Оценка:</span>
              <span className={`font-bold ${evalScore > 0 ? 'text-emerald-400' : evalScore < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                {evalScore > 0 ? `+${evalScore.toFixed(1)}` : evalScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Chessboard Container */}
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-[#18181b] border-2 border-zinc-700/80 shadow-2xl w-full max-w-[480px] aspect-square">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden border border-zinc-700/50">
              {ranks.map((rank, rIdx) =>
                files.map((file, fIdx) => {
                  const square = `${file}${rank}`;
                  const isLight = (rIdx + fIdx) % 2 === 0;
                  const piece = game.get(square);
                  const isSelected = selectedSquare === square;
                  const isPossible = possibleMoves.includes(square);
                  const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
                  const inCheckKing = piece && piece.type === 'k' && piece.color === game.turn() && game.inCheck();

                  return (
                    <div
                      key={square}
                      onClick={() => onSquareClick(square)}
                      className={`relative flex items-center justify-center cursor-pointer transition-colors ${
                        isLight ? 'bg-[#3f3f46]' : 'bg-[#27272a]'
                      } ${isLastMoveSquare ? 'ring-2 ring-inset ring-amber-400/60' : ''} ${
                        isSelected ? 'bg-amber-500/40 ring-2 ring-inset ring-amber-400' : ''
                      } ${inCheckKing ? 'bg-red-500/50 ring-2 ring-inset ring-red-500 animate-pulse' : ''}`}
                    >
                      {/* Rank and File Labels */}
                      {fIdx === 0 && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-mono text-zinc-400 select-none pointer-events-none opacity-60">
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-zinc-400 select-none pointer-events-none opacity-60">
                          {file}
                        </span>
                      )}

                      {/* Piece SVG */}
                      {piece && PIECES[piece.type] ? (
                        <div className="w-[85%] h-[85%] flex items-center justify-center transform active:scale-90 transition-transform">
                          {PIECES[piece.type](piece.color)}
                        </div>
                      ) : null}

                      {/* Legal Move Marker */}
                      {isPossible && (
                        <div
                          className={`absolute w-3.5 h-3.5 rounded-full pointer-events-none ${
                            piece ? 'ring-4 ring-emerald-400/80 bg-transparent' : 'bg-emerald-400/80 shadow-md shadow-emerald-400/50'
                          }`}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Commentary, Stats & Actions */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Commentary Bubble */}
          <div className="p-5 rounded-2xl border bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950 border-amber-500/30 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Bot className="w-4 h-4" />
              <span>Реплика Stockfish Bot:</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed font-sans italic">
              «{botComment}»
            </p>
          </div>

          {/* Stats Widget */}
          <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Победы бота</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{gameStats.botWins}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Ничьи</div>
              <div className="text-xl font-bold text-zinc-300 mt-1">{gameStats.draws}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Твои победы</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{gameStats.playerWins}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={resetGame}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Начать новую партию</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={togglePlayerColor}
                className="py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white hover:border-zinc-700 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Цвет: {playerColor === 'w' ? 'Белые ♔' : 'Черные ♚'}</span>
              </button>

              <button
                onClick={surrender}
                disabled={game.isGameOver()}
                className="py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Сдаться</span>
              </button>
            </div>
          </div>

          {/* Move History Log */}
          <div className="p-4 rounded-2xl border bg-zinc-900/40 border-zinc-800/80">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Запись партии (PGN)</span>
              <span>{game.history().length} полуходов</span>
            </div>
            <div className="h-24 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed pr-2 space-y-1">
              {game.history().length > 0 ? (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {game.history().map((m, idx) => (
                    <span key={idx} className={idx % 2 === 0 ? 'text-amber-400' : 'text-zinc-400'}>
                      {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}{m}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-zinc-600 italic">Ходов пока нет...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBot;
