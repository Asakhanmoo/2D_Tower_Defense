import { Entity } from './Entity';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';
import { soundManager } from '../assets/audio/SoundEffects';
import { ParticleSystem } from '../engine/ParticleSystem';

export class Checkpoint extends Entity {
  public activated: boolean = false;

  constructor(x: number, y: number) {
    super(`checkpoint_${Math.random()}`, x, y, 20, 32);
  }

  public activate(particles: ParticleSystem) {
    if (this.activated) return;
    this.activated = true;
    soundManager.playGem();
    particles.emitSparkles(this.x + this.width / 2, this.y + 10, '#22c55e', 16);
  }

  public update(dt: number) {
    this.animFrame += dt * 8;
  }

  public render(ctx: CanvasRenderingContext2D, debugHitbox = false) {
    SpriteCatalog.drawCheckpoint(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.activated,
      this.animFrame
    );

    if (debugHitbox) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
