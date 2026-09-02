import { useState, useEffect } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { defaultPhysicsConfig } from '../engine/PhysicsEngine';
import { X, Sliders, Shield, Crosshair, RefreshCw, Layers } from 'lucide-react';

interface DebugInspectorProps {
  engine: GameEngine;
  onClose: () => void;
}

export const DebugInspector = ({ engine, onClose }: DebugInspectorProps) => {
  const [physics, setPhysics] = useState({ ...engine.physics });
  const [showHitboxes, setShowHitboxes] = useState(engine.showHitboxes);
  const [godMode, setGodMode] = useState(engine.godMode);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    playerX: 0,
    playerY: 0,
    vx: 0,
    vy: 0,
    state: 'IDLE',
    isGrounded: false,
    enemies: 0,
    particles: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const p = engine.levelManager.player;
      setTelemetry({
        fps: engine.fps,
        playerX: Math.round(p.x),
        playerY: Math.round(p.y),
        vx: Math.round(p.vx),
        vy: Math.round(p.vy),
        state: p.state,
        isGrounded: p.isGrounded,
        enemies: engine.levelManager.enemies.filter(e => !e.isDead).length,
        particles: (engine.particles as unknown as { particles: unknown[] }).particles?.length || 0,
      });
    }, 100);

    return () => clearInterval(interval);
  }, [engine]);

  const handlePhysicsChange = (key: keyof typeof physics, val: number) => {
    const updated = { ...physics, [key]: val };
    setPhysics(updated);
    engine.physics = updated;
  };

  const handleResetPhysics = () => {
    const reset = { ...defaultPhysicsConfig };
    setPhysics(reset);
    engine.physics = reset;
  };

  return (
    <aside
      id="debug-sandbox-panel"
      className="absolute top-16 right-4 bottom-4 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl z-40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">Game Dev Sandbox</h2>
        </div>
        <button
          id="btn-close-inspector"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
        {/* Real-time Telemetry Section */}
        <section className="space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>LIVE TELEMETRY</span>
            <span className="font-mono text-emerald-400">{telemetry.fps} FPS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">State: </span>
              <span className="text-indigo-300 font-semibold">{telemetry.state}</span>
            </div>
            <div>
              <span className="text-slate-500">Grounded: </span>
              <span className={telemetry.isGrounded ? 'text-emerald-400' : 'text-amber-400'}>
                {telemetry.isGrounded ? 'YES' : 'AIR'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Pos: </span>
              <span>{telemetry.playerX}, {telemetry.playerY}</span>
            </div>
            <div>
              <span className="text-slate-500">Vel: </span>
              <span>{telemetry.vx}, {telemetry.vy}</span>
            </div>
            <div>
              <span className="text-slate-500">Enemies: </span>
              <span>{telemetry.enemies}</span>
            </div>
            <div>
              <span className="text-slate-500">Particles: </span>
              <span>{telemetry.particles}</span>
            </div>
          </div>
        </section>

        {/* Level Switcher */}
        <section className="space-y-2">
          <label className="text-slate-400 font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>LEVEL SELECTOR</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {engine.levelManager.levels.map((lvl, idx) => (
              <button
                key={lvl.id}
                id={`btn-select-level-${idx}`}
                onClick={() => {
                  engine.levelManager.loadLevel(idx);
                  engine.play();
                }}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                  engine.levelManager.currentLevelIndex === idx
                    ? 'bg-indigo-600 border-indigo-400 text-white font-semibold'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                Lvl {idx + 1}
              </button>
            ))}
          </div>
        </section>

        {/* Debug Toggles */}
        <section className="space-y-2">
          <span className="text-slate-400 font-medium">ENGINE TOGGLES</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-toggle-hitboxes"
              onClick={() => {
                const val = !showHitboxes;
                setShowHitboxes(val);
                engine.showHitboxes = val;
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                showHitboxes
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Hitboxes</span>
            </button>

            <button
              id="btn-toggle-godmode"
              onClick={() => {
                const val = !godMode;
                setGodMode(val);
                engine.godMode = val;
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all ${
                godMode
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>God Mode</span>
            </button>
          </div>
        </section>

        {/* Physics Sliders */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">PHYSICS PARAMETERS</span>
            <button
              id="btn-reset-physics"
              onClick={handleResetPhysics}
              className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Gravity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span>Gravity</span>
              <span className="font-mono text-slate-400">{physics.gravity} px/s²</span>
            </div>
            <input
              id="input-gravity"
              type="range"
              min="400"
              max="2600"
              step="50"
              value={physics.gravity}
              onChange={e => handlePhysicsChange('gravity', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {/* Jump Force */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span>Jump Force</span>
              <span className="font-mono text-slate-400">{physics.jumpForce} px/s</span>
            </div>
            <input
              id="input-jump-force"
              type="range"
              min="300"
              max="800"
              step="20"
              value={physics.jumpForce}
              onChange={e => handlePhysicsChange('jumpForce', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {/* Move Speed */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span>Run Speed</span>
              <span className="font-mono text-slate-400">{physics.moveSpeed} px/s</span>
            </div>
            <input
              id="input-move-speed"
              type="range"
              min="100"
              max="500"
              step="20"
              value={physics.moveSpeed}
              onChange={e => handlePhysicsChange('moveSpeed', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {/* Coyote Time */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span>Coyote Time</span>
              <span className="font-mono text-slate-400">{physics.coyoteTimeMs} ms</span>
            </div>
            <input
              id="input-coyote-time"
              type="range"
              min="0"
              max="300"
              step="10"
              value={physics.coyoteTimeMs}
              onChange={e => handlePhysicsChange('coyoteTimeMs', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>

          {/* Dash Speed */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span>Dash Speed</span>
              <span className="font-mono text-slate-400">{physics.dashSpeed} px/s</span>
            </div>
            <input
              id="input-dash-speed"
              type="range"
              min="300"
              max="1000"
              step="50"
              value={physics.dashSpeed}
              onChange={e => handlePhysicsChange('dashSpeed', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
            />
          </div>
        </section>
      </div>
    </aside>
  );
};
