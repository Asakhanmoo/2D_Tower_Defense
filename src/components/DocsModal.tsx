import { X, Cpu, Move, Zap, Music, Compass, Sparkles } from 'lucide-react';

interface DocsModalProps {
  onClose: () => void;
}

export const DocsModal = ({ onClose }: DocsModalProps) => {
  return (
    <div
      id="docs-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="docs-modal-card"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">2D Game Dev Fundamentals Guide</h2>
              <p className="text-[11px] text-slate-400">Core architecture, physics kinematics, state machines & game feel</p>
            </div>
          </div>
          <button
            id="btn-close-docs"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Architecture & Game Loop */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3>1. The Core Game Loop & Fixed Timestep</h3>
            </div>
            <p>
              Games decouple rendering (variable FPS via <code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded">requestAnimationFrame</code>) from physics calculation. We use an accumulator pattern running at a fixed 60Hz (<code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded">1/60s</code>) to ensure consistent jump arcs and collision behavior across any screen refresh rate (60Hz, 144Hz, 240Hz).
            </p>
          </section>

          {/* Section 2: Kinematics & Collisions */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <Move className="w-4 h-4 text-emerald-400" />
              <h3>2. AABB Kinematics & Collision Resolution</h3>
            </div>
            <p>
              Axis-Aligned Bounding Box (AABB) checks are calculated independently on the X axis, resolved, and then on the Y axis. This eliminates corner snagging. One-way platforms permit ascending through the bottom while solidifying when falling from above.
            </p>
          </section>

          {/* Section 3: Game Feel & "Juice" */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3>3. Game Feel & "Juice" Mechanics</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li><strong className="text-slate-200">Coyote Time (120ms):</strong> Gives players a generous grace period to jump after walking off a platform.</li>
              <li><strong className="text-slate-200">Jump Buffering (120ms):</strong> Remembers the jump button press if triggered right before touching the ground.</li>
              <li><strong className="text-slate-200">Variable Jump Height:</strong> Releasing the jump key early applies a multiplier to cut vertical velocity for precise platforming.</li>
              <li><strong className="text-slate-200">Screen Shake & Particles:</strong> Camera impulse decay and impact dust provide physical feedback on landings, stomps, and hits.</li>
            </ul>
          </section>

          {/* Section 4: Level Design & Parallax */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-semibold text-sm">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3>4. Parallax Backgrounds & Camera Smooth Follow</h3>
            </div>
            <p>
              Distant mountains and clouds scroll at proportional fractions (e.g. 0.05x, 0.1x, 0.25x) of the camera position, producing perceived optical depth. The camera lerps toward the player with a deadzone to prevent jitter.
            </p>
          </section>

          {/* Section 5: Web Audio Procedural Chiptune */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
              <Music className="w-4 h-4 text-rose-400" />
              <h3>5. Procedural Sound Synthesizer</h3>
            </div>
            <p>
              Zero external audio assets required. Sound effects are synthesized on-the-fly using browser <code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded">AudioContext</code> oscillators with exponential pitch ramps, bandpass filters, and gain envelopes.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            id="btn-close-docs-footer"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
