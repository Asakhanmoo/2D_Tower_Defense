export interface Vector2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  LEVEL_EDITOR = 'LEVEL_EDITOR',
}

export enum TileType {
  EMPTY = 0,
  SOLID_GRASS = 1,
  SOLID_DIRT = 2,
  SOLID_STONE = 3,
  ONE_WAY_PLATFORM = 4,
  SPIKES_UP = 5,
  SPIKES_DOWN = 6,
  WATER = 7,
  LAVA = 8,
  BOUNCE_PAD = 9,
  LADDER = 10,
  ICE = 11,
}

export enum EntityType {
  PLAYER = 'PLAYER',
  PATROL_ENEMY = 'PATROL_ENEMY',
  SLIME_ENEMY = 'SLIME_ENEMY',
  BAT_ENEMY = 'BAT_ENEMY',
  COIN = 'COIN',
  GEM = 'GEM',
  HEART = 'HEART',
  CHECKPOINT = 'CHECKPOINT',
  GOAL = 'GOAL',
  MOVING_PLATFORM = 'MOVING_PLATFORM',
  SPRING = 'SPRING',
}

export enum PlayerActionState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  JUMPING = 'JUMPING',
  FALLING = 'FALLING',
  WALL_SLIDING = 'WALL_SLIDING',
  DASHING = 'DASHING',
  HURT = 'HURT',
  DEAD = 'DEAD',
}

export interface PhysicsConfig {
  gravity: number;
  terminalVelocity: number;
  moveSpeed: number;
  acceleration: number;
  deceleration: number;
  airAcceleration: number;
  airDeceleration: number;
  jumpForce: number;
  variableJumpMultiplier: number;
  coyoteTimeMs: number;
  jumpBufferMs: number;
  maxFallSpeed: number;
  dashSpeed: number;
  dashDurationMs: number;
  dashCooldownMs: number;
  wallSlideSpeed: number;
  wallJumpForceX: number;
  wallJumpForceY: number;
}

export interface LevelData {
  id: string;
  name: string;
  theme: 'plains' | 'cavern' | 'castle';
  width: number; // in tiles
  height: number; // in tiles
  tileSize: number;
  tiles: number[][]; // grid of TileType
  playerSpawn: Vector2D;
  entities: {
    type: EntityType;
    x: number; // tile coordinates or pixel coordinates
    y: number;
    properties?: Record<string, unknown>;
  }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  shape?: 'square' | 'circle' | 'spark';
  gravity?: number;
}

export interface CameraConfig {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  zoom: number;
  smoothSpeed: number;
  shakeIntensity: number;
  shakeDurationMs: number;
  deadzoneWidth: number;
  deadzoneHeight: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  jumpPressedThisFrame: boolean;
  jumpReleasedThisFrame: boolean;
  dash: boolean;
  dashPressedThisFrame: boolean;
  attack: boolean;
  attackPressedThisFrame: boolean;
  interact: boolean;
  pause: boolean;
}

export interface GameStats {
  score: number;
  coinsCollected: number;
  totalCoins: number;
  health: number;
  maxHealth: number;
  lives: number;
  timeElapsed: number; // in seconds
  deaths: number;
  currentLevelIndex: number;
}
