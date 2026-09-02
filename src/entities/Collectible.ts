import { Entity } from './Entity';
import { EntityType } from '../engine/types';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';
import { soundManager } from '../assets/audio/SoundEffects';
import { ParticleSystem } from '../engine/ParticleSystem';

export class Collectible extends Entity {
  public type: EntityType;
  public collected: boolean = false;
  public value: number = 100;

  constructor(type: EntityType, x: number, y: number) {
    const size = type === EntityType.GEM ? 20 : 16;
    super(`item_${Math.random()}`, x, y, size, size);
    this.type = type;
    if (type === EntityType.GEM) this.value = 500;
    if (type === EntityType.HEART) this.value = 50;
  }

  public collect(particles: ParticleSystem) {
    if (this.collected) return;
    this.collected = true;

    if (this.type === EntityType.COIN) {
      soundManager.playCoin();
      particles.emitSparkles(this.x + this.width / 2, this.y + this.height / 2, '#eab308', 8);
    } else if (this.type === EntityType.GEM) {
      soundManager.playGem();
      particles.emitSparkles(this.x + this.width / 2, this.y + this.height / 2, '#06b6d4', 14);
    } else if (this.type === EntityType.HEART) {
      soundManager.playGem();
      particles.emitSparkles(this.x + this.width / 2, this.y + this.height / 2, '#f43f5e', 10);
    }
  }

  public update(dt: number) {
    this.animFrame += dt * 10;
  }

  public render(ctx: CanvasRenderingContext2D, debugHitbox = false) {
    if (this.collected) return;

    SpriteCatalog.drawCollectible(
      ctx,
      this.type,
      this.x,
      this.y,
      this.width,
      this.height,
      this.animFrame
    );

    if (debugHitbox) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
