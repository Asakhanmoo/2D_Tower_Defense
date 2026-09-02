import { Vector2D } from '../engine/types';

export class Background {
  private clouds: { x: number; y: number; speed: number; size: number }[] = [];

  constructor() {
    // Generate initial procedural clouds
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: Math.random() * 2000,
        y: Math.random() * 200 + 40,
        speed: Math.random() * 15 + 10,
        size: Math.random() * 30 + 40,
      });
    }
  }

  public update(dt: number) {
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * dt;
      if (cloud.x > 2500) {
        cloud.x = -150;
        cloud.y = Math.random() * 200 + 40;
      }
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    theme: 'plains' | 'cavern' | 'castle',
    cameraOffset: Vector2D,
    viewWidth: number,
    viewHeight: number
  ) {
    if (theme === 'plains') {
      this.renderPlains(ctx, cameraOffset, viewWidth, viewHeight);
    } else if (theme === 'cavern') {
      this.renderCavern(ctx, cameraOffset, viewWidth, viewHeight);
    } else {
      this.renderCastle(ctx, cameraOffset, viewWidth, viewHeight);
    }
  }

  private renderPlains(ctx: CanvasRenderingContext2D, cam: Vector2D, w: number, h: number) {
    // Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(0.6, '#7dd3fc');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Clouds (speed 0.05 + auto drift)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (const cloud of this.clouds) {
      const renderX = (cloud.x - cam.x * 0.05) % (w + 200) - 100;
      const renderY = cloud.y - cam.y * 0.05;
      ctx.beginPath();
      ctx.arc(renderX, renderY, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.arc(renderX + cloud.size * 0.35, renderY - cloud.size * 0.2, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.arc(renderX + cloud.size * 0.7, renderY, cloud.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Distant Mountains (speed 0.1)
    const mtnX = -cam.x * 0.1;
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 120) {
      const peakX = ((x + mtnX) % (w + 400)) - 100;
      ctx.lineTo(peakX, h - 220 + Math.sin(x * 0.02) * 60);
      ctx.lineTo(peakX + 60, h - 140 + Math.sin((x + 60) * 0.02) * 40);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Foreground Rolling Hills (speed 0.25)
    const hillX = -cam.x * 0.25;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 200; x += 80) {
      const peakX = ((x + hillX) % (w + 400)) - 100;
      ctx.lineTo(peakX, h - 110 + Math.sin(x * 0.03) * 35);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  private renderCavern(ctx: CanvasRenderingContext2D, cam: Vector2D, w: number, h: number) {
    // Dark deep subterranean gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stalactite silhouettes in background (0.15x)
    ctx.fillStyle = '#1e293b';
    const bgX = -cam.x * 0.15;
    for (let x = 0; x < w + 200; x += 90) {
      const sx = ((x + bgX) % (w + 400)) - 50;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + 35, 120 + Math.sin(x * 0.05) * 40);
      ctx.lineTo(sx + 70, 0);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing crystal ambience
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.arc(w * 0.3 - cam.x * 0.05, h * 0.4 - cam.y * 0.05, 120, 0, Math.PI * 2);
    ctx.arc(w * 0.7 - cam.x * 0.05, h * 0.6 - cam.y * 0.05, 160, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCastle(ctx: CanvasRenderingContext2D, cam: Vector2D, w: number, h: number) {
    // Crimson night sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#450a0a');
    sky.addColorStop(0.5, '#1e1b4b');
    sky.addColorStop(1, '#0f172a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Moon
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(w * 0.8 - cam.x * 0.02, 90 - cam.y * 0.02, 38, 0, Math.PI * 2);
    ctx.fill();

    // Castle spires silhouette (0.12x)
    ctx.fillStyle = '#18181b';
    const bgX = -cam.x * 0.12;
    for (let x = 0; x < w + 200; x += 140) {
      const sx = ((x + bgX) % (w + 400)) - 50;
      ctx.fillRect(sx, h - 260, 50, 260);
      // Spire triangle
      ctx.beginPath();
      ctx.moveTo(sx - 10, h - 260);
      ctx.lineTo(sx + 25, h - 340);
      ctx.lineTo(sx + 60, h - 260);
      ctx.closePath();
      ctx.fill();
    }
  }
}
