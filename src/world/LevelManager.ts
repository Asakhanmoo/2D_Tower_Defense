import { LevelData, EntityType } from '../engine/types';
import { defaultLevels } from '../assets/maps/defaultLevels';
import { Tilemap } from './Tilemap';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Collectible } from '../entities/Collectible';
import { Checkpoint } from '../entities/Checkpoint';
import { Goal } from '../entities/Goal';

export class LevelManager {
  public levels: LevelData[] = [...defaultLevels];
  public currentLevelIndex: number = 0;
  public activeLevel: LevelData;
  public tilemap: Tilemap;
  public player: Player;
  public enemies: Enemy[] = [];
  public collectibles: Collectible[] = [];
  public checkpoints: Checkpoint[] = [];
  public goal: Goal | null = null;

  constructor() {
    this.activeLevel = this.levels[0];
    this.tilemap = new Tilemap(this.activeLevel.width, this.activeLevel.height, this.activeLevel.tileSize, this.activeLevel.tiles);
    this.player = new Player(this.activeLevel.playerSpawn.x * this.activeLevel.tileSize, this.activeLevel.playerSpawn.y * this.activeLevel.tileSize);
    this.loadLevel(0);
  }

  public loadLevel(index: number) {
    if (index < 0 || index >= this.levels.length) {
      index = 0;
    }
    this.currentLevelIndex = index;
    this.activeLevel = this.levels[index];

    // Rebuild Tilemap
    this.tilemap = new Tilemap(
      this.activeLevel.width,
      this.activeLevel.height,
      this.activeLevel.tileSize,
      this.activeLevel.tiles
    );

    // Reset Player
    const spawnPxX = this.activeLevel.playerSpawn.x * this.activeLevel.tileSize;
    const spawnPxY = this.activeLevel.playerSpawn.y * this.activeLevel.tileSize;
    this.player.setSpawn(spawnPxX, spawnPxY);
    this.player.respawn();

    // Spawn Entities
    this.enemies = [];
    this.collectibles = [];
    this.checkpoints = [];
    this.goal = null;

    for (const ent of this.activeLevel.entities) {
      const pxX = ent.x * this.activeLevel.tileSize;
      const pxY = ent.y * this.activeLevel.tileSize;

      switch (ent.type) {
        case EntityType.PATROL_ENEMY:
        case EntityType.SLIME_ENEMY:
        case EntityType.BAT_ENEMY:
          this.enemies.push(new Enemy(ent.type, pxX, pxY));
          break;
        case EntityType.COIN:
        case EntityType.GEM:
        case EntityType.HEART:
          this.collectibles.push(new Collectible(ent.type, pxX, pxY));
          break;
        case EntityType.CHECKPOINT:
          this.checkpoints.push(new Checkpoint(pxX, pxY));
          break;
        case EntityType.GOAL:
          this.goal = new Goal(pxX, pxY);
          break;
        default:
          break;
      }
    }
  }

  public nextLevel(): boolean {
    if (this.currentLevelIndex + 1 < this.levels.length) {
      this.loadLevel(this.currentLevelIndex + 1);
      return true;
    }
    return false;
  }

  public restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  public loadCustomLevel(customLevel: LevelData) {
    this.levels.push(customLevel);
    this.loadLevel(this.levels.length - 1);
  }
}
