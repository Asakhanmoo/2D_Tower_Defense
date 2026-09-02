import { useEffect, useRef, type MouseEvent } from 'react';
import { GameEngine } from '../engine/GameEngine';

interface GameCanvasProps {
  engine: GameEngine;
  onCanvasClick?: (worldX: number, worldY: number, e: MouseEvent<HTMLCanvasElement>) => void;
}

export const GameCanvas = ({ engine, onCanvasClick }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Handle responsive container resizing
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false; // Keep crisp pixel art
      engine.camera.setViewport(rect.width, rect.height);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);
    updateSize();

    // Render loop synced with display refresh
    let animId: number;
    const renderLoop = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        engine.render(ctx, rect.width, rect.height);
        ctx.restore();
      }
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onCanvasClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = engine.camera.screenToWorld(screenX, screenY);
    onCanvasClick(worldPos.x, worldPos.y, e);
  };

  return (
    <div
      id="game-canvas-container"
      ref={containerRef}
      className="relative w-full h-full flex-1 min-h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center cursor-crosshair select-none"
    >
      <canvas
        id="game-viewport-canvas"
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full block"
      />
    </div>
  );
};
