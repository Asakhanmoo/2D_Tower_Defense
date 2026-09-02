import { GameEngine } from '../engine/GameEngine';
import { ArrowLeft, ArrowRight, Zap, ArrowUp } from 'lucide-react';

interface ControlsOverlayProps {
  engine: GameEngine;
}

export const ControlsOverlay = ({ engine }: ControlsOverlayProps) => {
  return (
    <div
      id="mobile-touch-controls"
      className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end pointer-events-none md:hidden"
    >
      {/* Directional Pad */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          id="touch-btn-left"
          onTouchStart={() => engine.input.setVirtualInput({ left: true })}
          onTouchEnd={() => engine.input.setVirtualInput({ left: false })}
          onMouseDown={() => engine.input.setVirtualInput({ left: true })}
          onMouseUp={() => engine.input.setVirtualInput({ left: false })}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-sky-600 border border-slate-700/60 flex items-center justify-center text-white shadow-xl backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          id="touch-btn-right"
          onTouchStart={() => engine.input.setVirtualInput({ right: true })}
          onTouchEnd={() => engine.input.setVirtualInput({ right: false })}
          onMouseDown={() => engine.input.setVirtualInput({ right: true })}
          onMouseUp={() => engine.input.setVirtualInput({ right: false })}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-sky-600 border border-slate-700/60 flex items-center justify-center text-white shadow-xl backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          id="touch-btn-dash"
          onTouchStart={() => engine.input.setVirtualInput({ dash: true })}
          onTouchEnd={() => engine.input.setVirtualInput({ dash: false })}
          onMouseDown={() => engine.input.setVirtualInput({ dash: true })}
          onMouseUp={() => engine.input.setVirtualInput({ dash: false })}
          className="w-14 h-14 rounded-2xl bg-sky-950/80 active:bg-sky-600 border border-sky-600/50 flex items-center justify-center text-sky-300 shadow-xl backdrop-blur-sm transition-transform active:scale-95"
        >
          <Zap className="w-6 h-6" />
        </button>

        <button
          id="touch-btn-jump"
          onTouchStart={() => engine.input.setVirtualInput({ jump: true })}
          onTouchEnd={() => engine.input.setVirtualInput({ jump: false })}
          onMouseDown={() => engine.input.setVirtualInput({ jump: true })}
          onMouseUp={() => engine.input.setVirtualInput({ jump: false })}
          className="w-16 h-16 rounded-2xl bg-indigo-600 active:bg-indigo-500 border border-indigo-400/50 flex items-center justify-center text-white shadow-xl backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowUp className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
