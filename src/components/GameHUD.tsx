import { GameEngine } from '../engine/GameEngine';
import { GameStats, GameState } from '../engine/types';
import { Heart, Coins, Volume2, VolumeX, Pause, Play, Wrench, Edit3, BookOpen, RotateCcw } from 'lucide-react';
import { soundManager } from '../assets/audio/SoundEffects';

interface GameHUDProps {
  engine: GameEngine;
  stats: GameStats;
  gameState: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  onOpenDocs: () => void;
}

export const GameHUD = ({
  engine,
  stats,
  gameState,
  isMuted,
  onToggleMute,
  showInspector,
  onToggleInspector,
  isEditorOpen,
  onToggleEditor,
  onOpenDocs,
}: GameHUDProps) => {
  const currentLevelName = engine.levelManager.activeLevel.name;
  const isPlaying = gameState === GameState.PLAYING;
  const player = engine.levelManager.player;
  const dashReady = player.canDash && player.dashCooldownTimer <= 0;

  return (
    <header
      id="game-hud-bar"
      className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-none"
    >
      {/* Top Left: Health, Coins, Score */}
      <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
        {/* Health Hearts */}
        <div className="flex items-center gap-1">
          {Array.from({ length: stats.maxHealth }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-all ${
                i < stats.health ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 scale-90'
              }`}
            />
          ))}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-0.5" />

        {/* Coins */}
        <div className="flex items-center gap-1.5 text-amber-400 font-pixel text-xs">
          <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{stats.coinsCollected}</span>
        </div>

        <div className="h-4 w-px bg-slate-700 mx-0.5" />

        {/* Score */}
        <div className="text-slate-200 font-pixel text-xs tracking-wider">
          <span className="text-slate-400 text-[10px] mr-1">PTS</span>
          {stats.score.toString().padStart(5, '0')}
        </div>
      </div>

      {/* Top Center: Level Name & Dash Indicator */}
      <div className="hidden md:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
        <span className="text-xs font-semibold text-slate-300">{currentLevelName}</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400">Dash:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
              dashReady
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            {dashReady ? 'READY' : 'CHARGING'}
          </span>
        </div>
      </div>

      {/* Top Right: Game Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          id="btn-restart-level"
          onClick={() => engine.restartCurrentLevel()}
          title="Restart Level (R)"
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          id="btn-toggle-audio"
          onClick={() => {
            onToggleMute();
            soundManager.setMuted(!isMuted);
          }}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          id="btn-toggle-pause"
          onClick={() => engine.pause()}
          title="Pause / Resume (Esc)"
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        <div className="h-6 w-px bg-slate-800 mx-0.5" />

        <button
          id="btn-toggle-editor"
          onClick={onToggleEditor}
          title="Level Designer & Tile Painter"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isEditorOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Level Editor</span>
        </button>

        <button
          id="btn-toggle-inspector"
          onClick={onToggleInspector}
          title="Physics & Engine Inspector"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            showInspector
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Sandbox</span>
        </button>

        <button
          id="btn-open-docs"
          onClick={onOpenDocs}
          title="Architecture Guide & Fundamentals"
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </header>
  );
};
