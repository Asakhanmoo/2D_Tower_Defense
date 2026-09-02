import { Entity } from './Entity';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';
import { soundManager } from '../assets/audio/SoundEffects';
import { ParticleSystem } from '../engine/ParticleSystem';

export class Goal extends Entity {
  public completed: boolean = false;

  constructor(x: number, y: number) {
    super(`goal_${Math.random()}`, x, y, 32, 48);
  }

  public trigger(particles: ParticleSystem) {
    if (this.completed) return;
    this.completed = true;
    soundManager.playVictory();
    particles.emitCelebration(this.x + this.width / 2, this.y + this.height / 2);
  }

  public update(dt: number) {
    this.animFrame += dt * 10;
  }

  public render(ctx: CanvasRenderingContext2D, debugHitbox = false) {
    SpriteCatalog.drawGoal(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.animFrame
    );

    if (debugHitbox) {
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
