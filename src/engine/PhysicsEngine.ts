import { PhysicsConfig, Rect } from './types';

export const defaultPhysicsConfig: PhysicsConfig = {
  gravity: 1400, // pixels/sec^2
  terminalVelocity: 900,
  moveSpeed: 240,
  acceleration: 1600,
  deceleration: 1800,
  airAcceleration: 950,
  airDeceleration: 600,
  jumpForce: 520,
  variableJumpMultiplier: 0.5,
  coyoteTimeMs: 120,
  jumpBufferMs: 120,
  maxFallSpeed: 700,
  dashSpeed: 600,
  dashDurationMs: 180,
  dashCooldownMs: 650,
  wallSlideSpeed: 120,
  wallJumpForceX: 280,
  wallJumpForceY: 480,
};

export class PhysicsEngine {
  public static checkAABB(rectA: Rect, rectB: Rect): boolean {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }

  public static getOverlap(rectA: Rect, rectB: Rect): { x: number; y: number } {
    const overlapX = Math.min(rectA.x + rectA.width - rectB.x, rectB.x + rectB.width - rectA.x);
    const overlapY = Math.min(rectA.y + rectA.height - rectB.y, rectB.y + rectB.height - rectA.y);
    return { x: overlapX, y: overlapY };
  }
}
