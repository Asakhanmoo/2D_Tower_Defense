import { Particle } from './types';

export class ParticleSystem {
  private particles: Particle[] = [];

  public emit(particle: Partial<Particle> & { x: number; y: number }) {
    this.particles.push({
      x: particle.x,
      y: particle.y,
      vx: particle.vx ?? (Math.random() - 0.5) * 80,
      vy: particle.vy ?? (Math.random() - 0.5) * 80,
      size: particle.size ?? 4,
      color: particle.color ?? '#ffffff',
      alpha: 1,
      maxLife: particle.maxLife ?? 0.4,
      life: 0,
      shape: particle.shape ?? 'square',
      gravity: particle.gravity ?? 100,
    });
  }

  public emitDust(x: number, y: number, count = 6, color = 'rgba(203, 213, 225, 0.8)') {
    for (let i = 0; i < count; i++) {
      this.emit({
        x: x + (Math.random() - 0.5) * 12,
        y: y - 2,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 40 - 10,
        size: Math.random() * 3 + 2,
        color,
        maxLife: Math.random() * 0.25 + 0.15,
        gravity: 60,
        shape: 'circle',
      });
    }
  }

  public emitSparkles(x: number, y: number, color = '#fef08a', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 100 + 40;
      this.emit({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color,
        maxLife: Math.random() * 0.35 + 0.25,
        gravity: 40,
        shape: 'spark',
      });
    }
  }

  public emitDashTrail(x: number, y: number, width: number, height: number, facingRight: boolean) {
    for (let i = 0; i < 4; i++) {
      this.emit({
        x: x + (facingRight ? -4 : width + 4),
        y: y + Math.random() * height,
        vx: (facingRight ? -1 : 1) * (Math.random() * 60 + 40),
        vy: (Math.random() - 0.5) * 20,
        size: Math.random() * 4 + 3,
        color: '#38bdf8',
        maxLife: 0.2,
        gravity: 0,
        shape: 'square',
      });
    }
  }

  public emitCelebration(x: number, y: number) {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 80;
      const col = colors[Math.floor(Math.random() * colors.length)];
      this.emit({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        size: Math.random() * 4 + 3,
        color: col,
        maxLife: Math.random() * 0.8 + 0.6,
        gravity: 180,
        shape: 'square',
      });
    }
  }

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'spark') {
        ctx.fillRect(p.x - p.size / 2, p.y - 1, p.size, 2);
        ctx.fillRect(p.x - 1, p.y - p.size / 2, 2, p.size);
      } else {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }
  }

  public clear() {
    this.particles = [];
  }
}
