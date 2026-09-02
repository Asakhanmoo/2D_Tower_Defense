import { LevelData, TileType, EntityType } from '../../engine/types';

/**
 * Starter level blueprints for the 2D Platformer
 */
export const defaultLevels: LevelData[] = [
  {
    id: 'level-1',
    name: '1. Greenhorn Grasslands',
    theme: 'plains',
    width: 36,
    height: 16,
    tileSize: 32,
    playerSpawn: { x: 2, y: 12 },
    tiles: createLevel1Grid(),
    entities: [
      { type: EntityType.COIN, x: 5, y: 11 },
      { type: EntityType.COIN, x: 6, y: 11 },
      { type: EntityType.COIN, x: 7, y: 11 },
      { type: EntityType.PATROL_ENEMY, x: 10, y: 12 },
      { type: EntityType.COIN, x: 13, y: 9 },
      { type: EntityType.COIN, x: 14, y: 8 },
      { type: EntityType.COIN, x: 15, y: 9 },
      { type: EntityType.CHECKPOINT, x: 18, y: 12 },
      { type: EntityType.SLIME_ENEMY, x: 23, y: 12 },
      { type: EntityType.GEM, x: 27, y: 6 },
      { type: EntityType.COIN, x: 29, y: 11 },
      { type: EntityType.COIN, x: 30, y: 11 },
      { type: EntityType.GOAL, x: 33, y: 11 },
    ],
  },
  {
    id: 'level-2',
    name: '2. Crystalline Caverns',
    theme: 'cavern',
    width: 40,
    height: 18,
    tileSize: 32,
    playerSpawn: { x: 2, y: 14 },
    tiles: createLevel2Grid(),
    entities: [
      { type: EntityType.COIN, x: 6, y: 13 },
      { type: EntityType.COIN, x: 7, y: 12 },
      { type: EntityType.BAT_ENEMY, x: 12, y: 9 },
      { type: EntityType.COIN, x: 14, y: 8 },
      { type: EntityType.GEM, x: 15, y: 4 },
      { type: EntityType.SPRING, x: 15, y: 14 },
      { type: EntityType.CHECKPOINT, x: 20, y: 7 },
      { type: EntityType.BAT_ENEMY, x: 24, y: 5 },
      { type: EntityType.SLIME_ENEMY, x: 28, y: 14 },
      { type: EntityType.HEART, x: 31, y: 8 },
      { type: EntityType.GOAL, x: 37, y: 13 },
    ],
  },
  {
    id: 'level-3',
    name: '3. Castle of Peril',
    theme: 'castle',
    width: 44,
    height: 20,
    tileSize: 32,
    playerSpawn: { x: 2, y: 16 },
    tiles: createLevel3Grid(),
    entities: [
      { type: EntityType.COIN, x: 5, y: 14 },
      { type: EntityType.COIN, x: 6, y: 14 },
      { type: EntityType.PATROL_ENEMY, x: 9, y: 16 },
      { type: EntityType.GEM, x: 14, y: 10 },
      { type: EntityType.BAT_ENEMY, x: 18, y: 11 },
      { type: EntityType.CHECKPOINT, x: 22, y: 14 },
      { type: EntityType.SLIME_ENEMY, x: 26, y: 11 },
      { type: EntityType.HEART, x: 29, y: 6 },
      { type: EntityType.PATROL_ENEMY, x: 34, y: 16 },
      { type: EntityType.GOAL, x: 41, y: 15 },
    ],
  },
];

function createLevel1Grid(): number[][] {
  const W = 36;
  const H = 16;
  const grid: number[][] = Array(H).fill(0).map(() => Array(W).fill(TileType.EMPTY));

  // Base ground
  for (let x = 0; x < W; x++) {
    // Gap pit between 20 and 22
    if (x >= 20 && x <= 22) {
      grid[H - 1][x] = TileType.SPIKES_UP;
      continue;
    }
    grid[13][x] = TileType.SOLID_GRASS;
    grid[14][x] = TileType.SOLID_DIRT;
    grid[15][x] = TileType.SOLID_DIRT;
  }

  // Left stepping platforms
  grid[11][5] = TileType.ONE_WAY_PLATFORM;
  grid[11][6] = TileType.ONE_WAY_PLATFORM;
  grid[11][7] = TileType.ONE_WAY_PLATFORM;

  // Center raised mound
  grid[10][13] = TileType.SOLID_GRASS;
  grid[10][14] = TileType.SOLID_GRASS;
  grid[10][15] = TileType.SOLID_GRASS;
  grid[11][13] = TileType.SOLID_DIRT;
  grid[11][14] = TileType.SOLID_DIRT;
  grid[11][15] = TileType.SOLID_DIRT;
  grid[12][13] = TileType.SOLID_DIRT;
  grid[12][14] = TileType.SOLID_DIRT;
  grid[12][15] = TileType.SOLID_DIRT;

  // High floating platform with Gem
  grid[7][26] = TileType.ONE_WAY_PLATFORM;
  grid[7][27] = TileType.ONE_WAY_PLATFORM;
  grid[7][28] = TileType.ONE_WAY_PLATFORM;

  return grid;
}

function createLevel2Grid(): number[][] {
  const W = 40;
  const H = 18;
  const grid: number[][] = Array(H).fill(0).map(() => Array(W).fill(TileType.EMPTY));

  // Ground with cavern stone
  for (let x = 0; x < W; x++) {
    if ((x >= 8 && x <= 10) || (x >= 23 && x <= 26)) {
      grid[H - 1][x] = TileType.SPIKES_UP;
      continue;
    }
    grid[15][x] = TileType.SOLID_STONE;
    grid[16][x] = TileType.SOLID_STONE;
    grid[17][x] = TileType.SOLID_STONE;
  }

  // High pillars for wall jumping
  for (let y = 8; y <= 14; y++) {
    grid[y][11] = TileType.SOLID_STONE;
    grid[y][18] = TileType.SOLID_STONE;
  }

  // Bounce pad in the center
  grid[14][15] = TileType.BOUNCE_PAD;

  // Floating platforms
  grid[8][20] = TileType.ONE_WAY_PLATFORM;
  grid[8][21] = TileType.ONE_WAY_PLATFORM;
  grid[8][22] = TileType.ONE_WAY_PLATFORM;

  grid[9][30] = TileType.ONE_WAY_PLATFORM;
  grid[9][31] = TileType.ONE_WAY_PLATFORM;

  return grid;
}

function createLevel3Grid(): number[][] {
  const W = 44;
  const H = 20;
  const grid: number[][] = Array(H).fill(0).map(() => Array(W).fill(TileType.EMPTY));

  // Castle floor with lava pits
  for (let x = 0; x < W; x++) {
    if ((x >= 10 && x <= 14) || (x >= 28 && x <= 32)) {
      grid[17][x] = TileType.LAVA;
      grid[18][x] = TileType.LAVA;
      grid[19][x] = TileType.LAVA;
      continue;
    }
    grid[17][x] = TileType.SOLID_STONE;
    grid[18][x] = TileType.SOLID_STONE;
    grid[19][x] = TileType.SOLID_STONE;
  }

  // Castle walls & ceilings
  for (let x = 0; x < W; x++) {
    grid[0][x] = TileType.SOLID_STONE;
  }

  // Staircase & climbing challenges
  grid[14][5] = TileType.ONE_WAY_PLATFORM;
  grid[14][6] = TileType.ONE_WAY_PLATFORM;

  grid[12][8] = TileType.ONE_WAY_PLATFORM;
  grid[12][9] = TileType.ONE_WAY_PLATFORM;

  // Floating stepping stones over lava
  grid[12][11] = TileType.SOLID_STONE;
  grid[12][13] = TileType.SOLID_STONE;

  // Midpoint tower
  for (let y = 10; y <= 16; y++) {
    grid[y][21] = TileType.SOLID_STONE;
    grid[y][23] = TileType.SOLID_STONE;
  }
  grid[15][22] = TileType.SOLID_STONE;

  // Hanging spike hazards
  grid[1][12] = TileType.SPIKES_DOWN;
  grid[1][13] = TileType.SPIKES_DOWN;
  grid[1][25] = TileType.SPIKES_DOWN;
  grid[1][26] = TileType.SPIKES_DOWN;

  // High secret path
  grid[7][28] = TileType.ONE_WAY_PLATFORM;
  grid[7][29] = TileType.ONE_WAY_PLATFORM;
  grid[7][30] = TileType.ONE_WAY_PLATFORM;

  return grid;
}
