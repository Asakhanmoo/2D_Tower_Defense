import { TileType, Rect } from '../engine/types';
import { SpriteCatalog } from '../assets/sprites/SpriteCatalog';

export class Tilemap {
  public width: number; // in tiles
  public height: number; // in tiles
  public tileSize: number = 32;
  public grid: number[][];

  constructor(width: number, height: number, tileSize: number = 32, initialGrid?: number[][]) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    if (initialGrid) {
      this.grid = initialGrid.map(row => [...row]);
    } else {
      this.grid = Array(height).fill(0).map(() => Array(width).fill(TileType.EMPTY));
    }
  }

  public getTile(tx: number, ty: number): number {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
      return TileType.EMPTY;
    }
    return this.grid[ty][tx];
  }

  public setTile(tx: number, ty: number, tileType: number) {
    if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
      this.grid[ty][tx] = tileType;
    }
  }

  public isSolid(tile: number): boolean {
    return (
      tile === TileType.SOLID_GRASS ||
      tile === TileType.SOLID_DIRT ||
      tile === TileType.SOLID_STONE ||
      tile === TileType.ICE
    );
  }

  public isOneWay(tile: number): boolean {
    return tile === TileType.ONE_WAY_PLATFORM;
  }

  public isHazard(tile: number): boolean {
    return (
      tile === TileType.SPIKES_UP ||
      tile === TileType.SPIKES_DOWN ||
      tile === TileType.LAVA
    );
  }

  public isBouncePad(tile: number): boolean {
    return tile === TileType.BOUNCE_PAD;
  }

  /**
   * Returns all colliding tile boxes in the neighborhood of a bounding box
   */
  public getCollidingTiles(box: Rect): { tx: number; ty: number; type: number; rect: Rect }[] {
    const minTx = Math.max(0, Math.floor(box.x / this.tileSize));
    const maxTx = Math.min(this.width - 1, Math.floor((box.x + box.width) / this.tileSize));
    const minTy = Math.max(0, Math.floor(box.y / this.tileSize));
    const maxTy = Math.min(this.height - 1, Math.floor((box.y + box.height) / this.tileSize));

    const result: { tx: number; ty: number; type: number; rect: Rect }[] = [];

    for (let ty = minTy; ty <= maxTy; ty++) {
      for (let tx = minTx; tx <= maxTx; tx++) {
        const type = this.grid[ty][tx];
        if (type !== TileType.EMPTY) {
          result.push({
            tx,
            ty,
            type,
            rect: {
              x: tx * this.tileSize,
              y: ty * this.tileSize,
              width: this.tileSize,
              height: type === TileType.ONE_WAY_PLATFORM ? 8 : this.tileSize,
            },
          });
        }
      }
    }

    return result;
  }

  public render(ctx: CanvasRenderingContext2D, camX: number, camY: number, viewW: number, viewH: number, animFrame: number) {
    const startCol = Math.max(0, Math.floor(camX / this.tileSize));
    const endCol = Math.min(this.width - 1, Math.ceil((camX + viewW) / this.tileSize));
    const startRow = Math.max(0, Math.floor(camY / this.tileSize));
    const endRow = Math.min(this.height - 1, Math.ceil((camY + viewH) / this.tileSize));

    for (let ty = startRow; ty <= endRow; ty++) {
      for (let tx = startCol; tx <= endCol; tx++) {
        const type = this.grid[ty][tx];
        if (type !== TileType.EMPTY) {
          SpriteCatalog.drawTile(ctx, type, tx * this.tileSize, ty * this.tileSize, this.tileSize, animFrame);
        }
      }
    }
  }
}
