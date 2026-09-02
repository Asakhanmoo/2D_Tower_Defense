import { Rect, Vector2D } from '../engine/types';

export abstract class Entity {
  public id: string;
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public width: number;
  public height: number;
  public isGrounded: boolean = false;
  public isDead: boolean = false;
  public facingRight: boolean = true;
  public animFrame: number = 0;

  constructor(id: string, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public getRect(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public getCenter(): Vector2D {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  public abstract update(dt: number, worldContext?: unknown): void;
  public abstract render(ctx: CanvasRenderingContext2D, debugHitbox?: boolean): void;
}
