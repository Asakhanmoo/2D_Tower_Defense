import { GameState, GameStats, PhysicsConfig } from './types';
import { defaultPhysicsConfig, PhysicsEngine } from './PhysicsEngine';
import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { ParticleSystem } from './ParticleSystem';
import { Background } from '../world/Background';
import { LevelManager } from '../world/LevelManager';

export class GameEngine {
  public state: GameState = GameState.MENU;
  public physics: PhysicsConfig = { ...defaultPhysicsConfig };
  public input: InputManager;
  public camera: Camera;
  public particles: ParticleSystem;
  public background: Background;
  public levelManager: LevelManager;

  public stats: GameStats = {
    score: 0,
    coinsCollected: 0,
    totalCoins: 0,
    health: 3,
    maxHealth: 3,
    lives: 3,
    timeElapsed: 0,
    deaths: 0,
    currentLevelIndex: 0,
  };

  // Engine loop
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1 / 60; // 60 Hz physics

  // Debug options
  public debugMode: boolean = false;
  public showHitboxes: boolean = false;
  public godMode: boolean = false;
  public fps: number = 60;
  private frameCount: number = 0;
  private fpsTimer: number = 0;

  // Level Complete & Game Over callbacks for UI
  public onStateChange?: (state: GameState) => void;
  public onStatsUpdate?: (stats: GameStats) => void;

  constructor() {
    this.input = new InputManager();
    this.camera = new Camera();
    this.particles = new ParticleSystem();
    this.background = new Background();
    this.levelManager = new LevelManager();
    this.updateStats();
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public setState(newState: GameState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  public play() {
    this.setState(GameState.PLAYING);
  }

  public pause() {
    if (this.state === GameState.PLAYING) {
      this.setState(GameState.PAUSED);
    } else if (this.state === GameState.PAUSED) {
      this.setState(GameState.PLAYING);
    }
  }

  public restartCurrentLevel() {
    this.levelManager.restartLevel();
    this.particles.clear();
    this.updateStats();
    this.setState(GameState.PLAYING);
  }

  public nextLevel() {
    const hasNext = this.levelManager.nextLevel();
    this.particles.clear();
    this.updateStats();
    if (hasNext) {
      this.setState(GameState.PLAYING);
    } else {
      // Finished all levels!
      this.setState(GameState.LEVEL_COMPLETE);
    }
  }

  private updateStats() {
    const player = this.levelManager.player;
    this.stats = {
      score: this.stats.score,
      coinsCollected: player.coins,
      totalCoins: this.levelManager.collectibles.length,
      health: player.health,
      maxHealth: player.maxHealth,
      lives: this.stats.lives,
      timeElapsed: this.stats.timeElapsed,
      deaths: this.stats.deaths,
      currentLevelIndex: this.levelManager.currentLevelIndex,
    };
    if (this.onStatsUpdate) {
      this.onStatsUpdate(this.stats);
    }
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const frameDelta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // FPS calculation
    this.frameCount++;
    this.fpsTimer += frameDelta;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    // Input polling
    const inputState = this.input.update();

    if (inputState.pause) {
      this.pause();
    }

    if (this.state === GameState.PLAYING) {
      this.accumulator += frameDelta;
      this.stats.timeElapsed += frameDelta;

      while (this.accumulator >= this.fixedTimeStep) {
        this.fixedUpdate(this.fixedTimeStep, inputState);
        this.accumulator -= this.fixedTimeStep;
      }
    }

    // Camera follow target (smooth)
    const player = this.levelManager.player;
    this.camera.setBounds(
      0,
      0,
      this.levelManager.tilemap.width * this.levelManager.tilemap.tileSize,
      this.levelManager.tilemap.height * this.levelManager.tilemap.tileSize
    );
    this.camera.follow(player.x + player.width / 2, player.y + player.height / 2);
    this.camera.update(frameDelta);

    this.background.update(frameDelta);
    this.particles.update(frameDelta);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private fixedUpdate(dt: number, inputState: ReturnType<InputManager['update']>) {
    const player = this.levelManager.player;
    const tilemap = this.levelManager.tilemap;

    if (this.godMode) {
      player.health = player.maxHealth;
      player.invulnerableTimer = 1;
    }

    // Update player
    player.updatePlayer(dt, inputState, this.physics, tilemap, this.particles);

    // Player death check
    if (player.isDead && this.state !== GameState.GAME_OVER) {
      this.stats.deaths++;
      this.camera.shake(12, 350);
      this.updateStats();
      setTimeout(() => {
        if (this.state === GameState.PLAYING) {
          this.setState(GameState.GAME_OVER);
        }
      }, 700);
      return;
    }

    // Update enemies
    for (const enemy of this.levelManager.enemies) {
      enemy.update(dt, { tilemap, particles: this.particles, playerX: player.x });

      if (!enemy.isDead && !player.isDead) {
        // Player / Enemy collision
        const pRect = player.getRect();
        const eRect = enemy.getRect();

        if (PhysicsEngine.checkAABB(pRect, eRect)) {
          // Check if player landed on top of enemy (Stomp)
          const isStomp = player.vy > 0 && player.y + player.height - player.vy * dt <= eRect.y + 12;

          if (isStomp) {
            enemy.takeDamage(this.particles);
            player.vy = -this.physics.jumpForce * 0.75;
            this.stats.score += 200;
            this.camera.shake(4, 150);
            this.updateStats();
          } else {
            const hurtSuccess = player.hurt(1, enemy.x + enemy.width / 2);
            if (hurtSuccess) {
              this.camera.shake(8, 200);
              this.updateStats();
            }
          }
        }
      }
    }

    // Update collectibles
    for (const item of this.levelManager.collectibles) {
      item.update(dt);
      if (!item.collected) {
        if (PhysicsEngine.checkAABB(player.getRect(), item.getRect())) {
          item.collect(this.particles);
          if (item.type === 'COIN') {
            player.coins++;
            this.stats.score += 100;
          } else if (item.type === 'GEM') {
            this.stats.score += 500;
          } else if (item.type === 'HEART') {
            player.heal(1);
          }
          this.updateStats();
        }
      }
    }

    // Update Checkpoints
    for (const cp of this.levelManager.checkpoints) {
      cp.update(dt);
      if (!cp.activated && PhysicsEngine.checkAABB(player.getRect(), cp.getRect())) {
        cp.activate(this.particles);
        player.setSpawn(cp.x, cp.y);
      }
    }

    // Update Goal
    if (this.levelManager.goal) {
      this.levelManager.goal.update(dt);
      if (!this.levelManager.goal.completed && PhysicsEngine.checkAABB(player.getRect(), this.levelManager.goal.getRect())) {
        this.levelManager.goal.trigger(this.particles);
        this.stats.score += 1000;
        this.updateStats();
        setTimeout(() => {
          this.setState(GameState.LEVEL_COMPLETE);
        }, 1000);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.camera.setViewport(width, height);
    const camOffset = this.camera.getScreenOffset();

    ctx.clearRect(0, 0, width, height);

    // 1. Render Parallax Background
    this.background.render(
      ctx,
      this.levelManager.activeLevel.theme,
      camOffset,
      width,
      height
    );

    // 2. World Space transformations
    ctx.save();
    ctx.translate(-camOffset.x, -camOffset.y);

    const animFrame = performance.now() / 100;

    // 3. Tilemap
    this.levelManager.tilemap.render(ctx, camOffset.x, camOffset.y, width, height, animFrame);

    // 4. Checkpoints & Goal
    for (const cp of this.levelManager.checkpoints) {
      cp.render(ctx, this.showHitboxes);
    }
    if (this.levelManager.goal) {
      this.levelManager.goal.render(ctx, this.showHitboxes);
    }

    // 5. Collectibles
    for (const item of this.levelManager.collectibles) {
      item.render(ctx, this.showHitboxes);
    }

    // 6. Enemies
    for (const enemy of this.levelManager.enemies) {
      enemy.render(ctx, this.showHitboxes);
    }

    // 7. Player
    this.levelManager.player.render(ctx, this.showHitboxes);

    // 8. Particles
    this.particles.render(ctx);

    // 9. Debug bounding boxes & vectors
    if (this.showHitboxes) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      const p = this.levelManager.player;
      ctx.beginPath();
      ctx.moveTo(p.x + p.width / 2, p.y + p.height / 2);
      ctx.lineTo(p.x + p.width / 2 + p.vx * 0.1, p.y + p.height / 2 + p.vy * 0.1);
      ctx.stroke();
    }

    ctx.restore();
  }

  public destroy() {
    this.stop();
    this.input.destroy();
  }
}
