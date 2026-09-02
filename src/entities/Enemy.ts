import { Entity } from './Entity';
import { EntityType } from '../engine/types';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';
import { Tilemap } from '../world/Tilemap';
import { ParticleSystem } from '../engine/ParticleSystem';
import { soundManager } from '../assets/audio/SoundEffects';

export class Enemy extends Entity {
  public type: EntityType;
  public patrolSpeed: number = 60;
  public patrolDirection: number = -1;
  public initialX: number;
  public initialY: number;
  public patrolRange: number = 160;

  // Slime jump timer
  public jumpCooldown: number = 0;

  // Hurt / death
  public isHurt: boolean = false;
  public hurtTimer: number = 0;

  constructor(type: EntityType, x: number, y: number) {
    let w = 24;
    let h = 24;
    if (type === EntityType.BAT_ENEMY) {
      w = 26;
      h = 18;
    } else if (type === EntityType.SLIME_ENEMY) {
      w = 22;
      h = 18;
    }
    super(`enemy_${Math.random()}`, x, y, w, h);
    this.type = type;
    this.initialX = x;
    this.initialY = y;
    this.facingRight = false;
  }

  public takeDamage(particles: ParticleSystem) {
    this.isDead = true;
    soundManager.playStomp();
    particles.emitSparkles(this.x + this.width / 2, this.y + this.height / 2, '#ef4444', 12);
  }

  public update(dt: number, worldContext?: { tilemap: Tilemap; particles: ParticleSystem; playerX?: number }) {
    if (this.isDead) return;

    this.animFrame += dt * 8;
    const tilemap = worldContext?.tilemap;

    if (this.type === EntityType.PATROL_ENEMY) {
      // Horizontal walking patrol
      this.vx = this.patrolDirection * this.patrolSpeed;
      this.facingRight = this.patrolDirection > 0;

      // Turn around if exceeding patrol radius
      if (Math.abs(this.x - this.initialX) > this.patrolRange) {
        this.patrolDirection *= -1;
      }

      // Physics integration
      this.x += this.vx * dt;
      this.vy += 1200 * dt; // gravity
      this.y += this.vy * dt;

      if (tilemap) {
        const tiles = tilemap.getCollidingTiles(this.getRect());
        for (const t of tiles) {
          if (tilemap.isSolid(t.type)) {
            if (this.vy > 0) {
              this.y = t.rect.y - this.height;
              this.vy = 0;
            }
          }
        }

        // Wall collision check
        const nextX = this.x + this.patrolDirection * 6;
        const wallCheckTile = tilemap.getTile(
          Math.floor((nextX + (this.patrolDirection > 0 ? this.width : 0)) / tilemap.tileSize),
          Math.floor((this.y + this.height / 2) / tilemap.tileSize)
        );
        if (tilemap.isSolid(wallCheckTile)) {
          this.patrolDirection *= -1;
        }

        // Cliff detection (don't walk off ledges)
        const groundUnderAhead = tilemap.getTile(
          Math.floor((nextX + (this.patrolDirection > 0 ? this.width : 0)) / tilemap.tileSize),
          Math.floor((this.y + this.height + 4) / tilemap.tileSize)
        );
        if (!tilemap.isSolid(groundUnderAhead) && !tilemap.isOneWay(groundUnderAhead)) {
          this.patrolDirection *= -1;
        }
      }

    } else if (this.type === EntityType.SLIME_ENEMY) {
      // Jumper Slime
      this.jumpCooldown -= dt;
      if (this.jumpCooldown <= 0 && this.isGrounded) {
        this.vy = -340;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 80;
        this.facingRight = this.vx > 0;
        this.jumpCooldown = Math.random() * 1.5 + 1.2;
        this.isGrounded = false;
      }

      this.vy += 1000 * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (tilemap) {
        const tiles = tilemap.getCollidingTiles(this.getRect());
        for (const t of tiles) {
          if (tilemap.isSolid(t.type) || tilemap.isOneWay(t.type)) {
            if (this.vy > 0) {
              this.y = t.rect.y - this.height;
              this.vy = 0;
              this.vx = 0;
              this.isGrounded = true;
            }
          }
        }
      }

    } else if (this.type === EntityType.BAT_ENEMY) {
      // Sinusoidal flying bat
      this.vx = this.patrolDirection * 50;
      this.facingRight = this.patrolDirection > 0;
      this.x += this.vx * dt;
      this.y = this.initialY + Math.sin(this.animFrame * 0.4) * 25;

      if (Math.abs(this.x - this.initialX) > this.patrolRange) {
        this.patrolDirection *= -1;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, debugHitbox = false) {
    if (this.isDead) return;

    SpriteCatalog.drawEnemy(
      ctx,
      this.type,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      this.animFrame,
      this.isHurt
    );

    if (debugHitbox) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
