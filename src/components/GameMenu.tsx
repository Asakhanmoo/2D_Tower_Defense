import { GameEngine } from '../engine/GameEngine';
import { GameState, GameStats } from '../engine/types';
import { Play, RotateCcw, ArrowRight, Trophy, Skull } from 'lucide-react';

interface GameMenuProps {
  engine: GameEngine;
  gameState: GameState;
  stats: GameStats;
  onStartGame: () => void;
}

export const GameMenu = ({
  engine,
  gameState,
  stats,
  onStartGame,
}: GameMenuProps) => {
  if (gameState === GameState.PLAYING) return null;

  return (
    <div
      id="game-modal-backdrop"
      className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* 1. START / MAIN MENU */}
      {gameState === GameState.MENU && (
        <div
          id="main-menu-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <h1 className="font-pixel text-2xl sm:text-3xl text-sky-400 tracking-wider">
              2D PLATFORMER
            </h1>
            <p className="text-xs text-slate-400">
              Fundamental Game Development Starter Kit & Physics Engine
            </p>
          </div>

          {/* Controls Summary Card */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
            <div className="font-semibold text-indigo-300 text-[11px] tracking-wider uppercase">
              Keyboard Controls
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">←</kbd><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">→</kbd> Move</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">W</kbd> Jump</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">Shift</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">J</kbd> Dash</div>
              <div><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">Esc</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-200">P</kbd> Pause</div>
            </div>
          </div>

          <button
            id="btn-play-game"
            onClick={onStartGame}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-pixel text-xs tracking-wider shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START GAME</span>
          </button>
        </div>
      )}

      {/* 2. PAUSE MENU */}
      {gameState === GameState.PAUSED && (
        <div
          id="pause-menu-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5"
        >
          <h2 className="font-pixel text-lg text-slate-200">PAUSED</h2>
          <div className="space-y-2.5">
            <button
              id="btn-resume-game"
              onClick={() => engine.play()}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
            <button
              id="btn-restart-game-paused"
              onClick={() => engine.restartCurrentLevel()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Level</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GAME OVER */}
      {gameState === GameState.GAME_OVER && (
        <div
          id="game-over-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <Skull className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-pixel text-lg text-rose-400">GAME OVER</h2>
            <p className="text-xs text-slate-400">Watch your step and try again!</p>
          </div>
          <button
            id="btn-retry-level"
            onClick={() => engine.restartCurrentLevel()}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>
        </div>
      )}

      {/* 4. LEVEL COMPLETE */}
      {gameState === GameState.LEVEL_COMPLETE && (
        <div
          id="level-complete-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-pixel text-lg text-emerald-400">VICTORY!</h2>
            <p className="text-xs text-slate-400">
              Level complete! Score: <span className="text-amber-400 font-semibold">{stats.score}</span>
            </p>
          </div>

          <div className="space-y-2">
            <button
              id="btn-next-level"
              onClick={() => engine.nextLevel()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-replay-level"
              onClick={() => engine.restartCurrentLevel()}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Replay Stage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
