import { CameraConfig, Vector2D } from './types';

export class Camera {
  public config: CameraConfig;
  public viewportWidth: number = 800;
  public viewportHeight: number = 600;

  constructor() {
    this.config = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1,
      smoothSpeed: 8,
      shakeIntensity: 0,
      shakeDurationMs: 0,
      deadzoneWidth: 60,
      deadzoneHeight: 80,
      minX: 0,
      minY: 0,
      maxX: 2000,
      maxY: 1200,
    };
  }

  public setBounds(minX: number, minY: number, maxX: number, maxY: number) {
    this.config.minX = minX;
    this.config.minY = minY;
    this.config.maxX = maxX;
    this.config.maxY = maxY;
  }

  public setViewport(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  public shake(intensity: number, durationMs: number) {
    this.config.shakeIntensity = Math.max(this.config.shakeIntensity, intensity);
    this.config.shakeDurationMs = Math.max(this.config.shakeDurationMs, durationMs);
  }

  public follow(targetX: number, targetY: number, snap = false) {
    this.config.targetX = targetX;
    this.config.targetY = targetY;

    if (snap) {
      this.config.x = targetX - this.viewportWidth / 2;
      this.config.y = targetY - this.viewportHeight / 2;
      this.clamp();
    }
  }

  public update(dt: number) {
    const targetCenterX = this.config.targetX - this.viewportWidth / 2;
    const targetCenterY = this.config.targetY - this.viewportHeight / 2;

    // Smooth Lerp
    const lerpFactor = Math.min(1, this.config.smoothSpeed * dt);
    this.config.x += (targetCenterX - this.config.x) * lerpFactor;
    this.config.y += (targetCenterY - this.config.y) * lerpFactor;

    // Update screen shake
    if (this.config.shakeDurationMs > 0) {
      this.config.shakeDurationMs -= dt * 1000;
      if (this.config.shakeDurationMs <= 0) {
        this.config.shakeIntensity = 0;
      }
    }

    this.clamp();
  }

  private clamp() {
    const maxCamX = Math.max(0, this.config.maxX - this.viewportWidth);
    const maxCamY = Math.max(0, this.config.maxY - this.viewportHeight);

    this.config.x = Math.max(this.config.minX, Math.min(maxCamX, this.config.x));
    this.config.y = Math.max(this.config.minY, Math.min(maxCamY, this.config.y));
  }

  public getScreenOffset(): Vector2D {
    let shakeOffsetX = 0;
    let shakeOffsetY = 0;

    if (this.config.shakeIntensity > 0) {
      shakeOffsetX = (Math.random() - 0.5) * this.config.shakeIntensity * 2;
      shakeOffsetY = (Math.random() - 0.5) * this.config.shakeIntensity * 2;
    }

    return {
      x: Math.round(this.config.x + shakeOffsetX),
      y: Math.round(this.config.y + shakeOffsetY),
    };
  }

  public screenToWorld(screenX: number, screenY: number): Vector2D {
    const offset = this.getScreenOffset();
    return {
      x: screenX + offset.x,
      y: screenY + offset.y,
    };
  }

  public worldToScreen(worldX: number, worldY: number): Vector2D {
    const offset = this.getScreenOffset();
    return {
      x: worldX - offset.x,
      y: worldY - offset.y,
    };
  }
}
