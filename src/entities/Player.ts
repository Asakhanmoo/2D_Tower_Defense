import { Entity } from './Entity';
import { InputState, PhysicsConfig, PlayerActionState } from '../engine/types';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';
import { soundManager } from '../assets/audio/SoundEffects';
import { Tilemap } from '../world/Tilemap';
import { ParticleSystem } from '../engine/ParticleSystem';

export class Player extends Entity {
  public state: PlayerActionState = PlayerActionState.IDLE;
  public health: number = 3;
  public maxHealth: number = 3;
  public coins: number = 0;
  public score: number = 0;

  // Jump feel mechanics
  public coyoteTimer: number = 0;
  public jumpBufferTimer: number = 0;
  public canDoubleJump: boolean = true;
  public isWallSliding: boolean = false;
  public wallSide: number = 0; // -1 left wall, +1 right wall

  // Dash mechanics
  public isDashing: boolean = false;
  public dashTimer: number = 0;
  public dashCooldownTimer: number = 0;
  public canDash: boolean = true;

  // Invulnerability
  public invulnerableTimer: number = 0;

  // Spawn position
  public spawnX: number;
  public spawnY: number;

  constructor(x: number, y: number) {
    super('player', x, y, 22, 28);
    this.spawnX = x;
    this.spawnY = y;
  }

  public setSpawn(x: number, y: number) {
    this.spawnX = x;
    this.spawnY = y;
  }

  public respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isDashing = false;
    this.invulnerableTimer = 1.0;
    this.state = PlayerActionState.IDLE;
  }

  public hurt(amount = 1, fromX?: number): boolean {
    if (this.invulnerableTimer > 0 || this.isDead || this.isDashing) return false;

    this.health -= amount;
    this.invulnerableTimer = 1.2;
    soundManager.playHurt();

    // Knockback
    this.vy = -300;
    if (fromX !== undefined) {
      this.vx = this.x < fromX ? -260 : 260;
    } else {
      this.vx = this.facingRight ? -240 : 240;
    }

    if (this.health <= 0) {
      this.isDead = true;
      this.state = PlayerActionState.DEAD;
      soundManager.playGameOver();
    } else {
      this.state = PlayerActionState.HURT;
    }
    return true;
  }

  public heal(amount = 1) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    soundManager.playGem();
  }

  public updatePlayer(
    dt: number,
    input: InputState,
    physics: PhysicsConfig,
    tilemap: Tilemap,
    particles: ParticleSystem
  ) {
    if (this.isDead) return;

    this.animFrame += dt * 10;

    // Timers
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt * 1000;

    // 1. Dash handling
    if (input.dashPressedThisFrame && this.canDash && this.dashCooldownTimer <= 0) {
      this.isDashing = true;
      this.canDash = false;
      this.dashTimer = physics.dashDurationMs / 1000;
      this.dashCooldownTimer = physics.dashCooldownMs;
      const dashDir = input.left ? -1 : input.right ? 1 : (this.facingRight ? 1 : -1);
      this.vx = dashDir * physics.dashSpeed;
      this.vy = 0;
      this.facingRight = dashDir > 0;
      soundManager.playDash();
      particles.emitDashTrail(this.x, this.y, this.width, this.height, this.facingRight);
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      particles.emitDashTrail(this.x, this.y, this.width, this.height, this.facingRight);
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.vx *= 0.5;
      } else {
        // Move during dash without gravity
        this.resolveMovement(dt, tilemap, particles, physics);
        return;
      }
    }

    // 2. Horizontal Movement
    const moveDir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const accel = this.isGrounded ? physics.acceleration : physics.airAcceleration;
    const decel = this.isGrounded ? physics.deceleration : physics.airDeceleration;

    if (moveDir !== 0) {
      this.vx += moveDir * accel * dt;
      if (Math.abs(this.vx) > physics.moveSpeed) {
        this.vx = Math.sign(this.vx) * physics.moveSpeed;
      }
      this.facingRight = moveDir > 0;
    } else {
      // Decelerate / friction
      if (this.vx > 0) {
        this.vx = Math.max(0, this.vx - decel * dt);
      } else if (this.vx < 0) {
        this.vx = Math.min(0, this.vx + decel * dt);
      }
    }

    // 3. Coyote time and Jump buffering
    if (this.isGrounded) {
      this.coyoteTimer = physics.coyoteTimeMs / 1000;
      this.canDoubleJump = true;
      this.canDash = true;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.jumpPressedThisFrame) {
      this.jumpBufferTimer = physics.jumpBufferMs / 1000;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // Wall slide detection
    this.isWallSliding = false;
    if (!this.isGrounded && this.vy > 0) {
      if (this.wallSide !== 0 && ((this.wallSide === -1 && input.left) || (this.wallSide === 1 && input.right))) {
        this.isWallSliding = true;
        this.vy = Math.min(this.vy, physics.wallSlideSpeed);
      }
    }

    // 4. Jump execution
    if (this.jumpBufferTimer > 0) {
      if (this.coyoteTimer > 0) {
        // Ground Jump
        this.vy = -physics.jumpForce;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.isGrounded = false;
        soundManager.playJump();
        particles.emitDust(this.x + this.width / 2, this.y + this.height);
      } else if (this.isWallSliding) {
        // Wall Jump
        this.vy = -physics.wallJumpForceY;
        this.vx = -this.wallSide * physics.wallJumpForceX;
        this.facingRight = this.wallSide === -1;
        this.jumpBufferTimer = 0;
        this.isWallSliding = false;
        soundManager.playJump();
        particles.emitDust(this.x + (this.wallSide === -1 ? 0 : this.width), this.y + this.height / 2);
      } else if (this.canDoubleJump) {
        // Double Jump
        this.vy = -physics.jumpForce * 0.9;
        this.canDoubleJump = false;
        this.jumpBufferTimer = 0;
        soundManager.playDoubleJump();
        particles.emitSparkles(this.x + this.width / 2, this.y + this.height, '#38bdf8', 8);
      }
    }

    // Variable jump height: release early to cut jump short
    if (input.jumpReleasedThisFrame && this.vy < 0) {
      this.vy *= physics.variableJumpMultiplier;
    }

    // 5. Gravity
    if (!this.isWallSliding) {
      this.vy += physics.gravity * dt;
      if (this.vy > physics.terminalVelocity) {
        this.vy = physics.terminalVelocity;
      }
    }

    // 6. Resolve Movement & Collision
    this.resolveMovement(dt, tilemap, particles, physics);

    // 7. Update Action State
    if (this.isDashing) {
      this.state = PlayerActionState.DASHING;
    } else if (this.isWallSliding) {
      this.state = PlayerActionState.WALL_SLIDING;
    } else if (!this.isGrounded) {
      this.state = this.vy < 0 ? PlayerActionState.JUMPING : PlayerActionState.FALLING;
    } else if (Math.abs(this.vx) > 15) {
      this.state = PlayerActionState.RUNNING;
    } else {
      this.state = PlayerActionState.IDLE;
    }
  }

  private resolveMovement(dt: number, tilemap: Tilemap, particles: ParticleSystem, physics: PhysicsConfig) {
    const wasGrounded = this.isGrounded;
    this.isGrounded = false;
    this.wallSide = 0;

    // Move X first
    this.x += this.vx * dt;
    let pRect = this.getRect();
    let tiles = tilemap.getCollidingTiles(pRect);

    for (const t of tiles) {
      if (tilemap.isSolid(t.type)) {
        if (this.vx > 0) {
          // Colliding right
          this.x = t.rect.x - this.width;
          this.vx = 0;
          this.wallSide = 1;
        } else if (this.vx < 0) {
          // Colliding left
          this.x = t.rect.x + t.rect.width;
          this.vx = 0;
          this.wallSide = -1;
        }
      }
    }

    // Move Y
    this.y += this.vy * dt;
    pRect = this.getRect();
    tiles = tilemap.getCollidingTiles(pRect);

    for (const t of tiles) {
      // Hazards
      if (tilemap.isHazard(t.type)) {
        this.hurt(1);
      }

      // Bounce pad
      if (tilemap.isBouncePad(t.type)) {
        if (this.vy > 0 && this.y + this.height - this.vy * dt <= t.rect.y + 12) {
          this.y = t.rect.y - this.height;
          this.vy = -physics.jumpForce * 1.55;
          soundManager.playSpring();
          particles.emitSparkles(t.rect.x + t.rect.width / 2, t.rect.y, '#db2777', 10);
        }
      }

      // Solid blocks
      if (tilemap.isSolid(t.type)) {
        if (this.vy > 0) {
          // Landing on ground
          this.y = t.rect.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
          if (!wasGrounded) {
            particles.emitDust(this.x + this.width / 2, this.y + this.height, 4);
          }
        } else if (this.vy < 0) {
          // Hitting ceiling
          this.y = t.rect.y + t.rect.height;
          this.vy = 0;
        }
      }

      // One-way platforms
      if (tilemap.isOneWay(t.type)) {
        // Only collide if moving downward and previously above top surface
        const prevBottom = this.y + this.height - this.vy * dt;
        if (this.vy > 0 && prevBottom <= t.rect.y + 4) {
          this.y = t.rect.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
          if (!wasGrounded) {
            particles.emitDust(this.x + this.width / 2, this.y + this.height, 3);
          }
        }
      }
    }

    // Bottom out of bounds check
    if (this.y > tilemap.height * tilemap.tileSize + 60) {
      this.hurt(3);
    }
  }

  public update(dt: number) {
    this.animFrame += dt * 10;
  }

  public render(ctx: CanvasRenderingContext2D, debugHitbox = false) {
    SpriteCatalog.drawPlayer(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.facingRight,
      this.state,
      this.animFrame,
      this.invulnerableTimer > 0
    );

    if (debugHitbox) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
