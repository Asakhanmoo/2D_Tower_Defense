/**
 * Procedural Sprite & Texture Generator and Renderers.
 * Creates sharp pixel-art graphics rendered directly to Canvas or cached offscreen canvases.
 */

export class SpriteCatalog {
  private static spriteCache: Map<string, HTMLCanvasElement> = new Map();

  /**
   * Helper to create a cached offscreen canvas with nearest-neighbor crisp pixel rendering
   */
  public static getOrCreateCanvas(key: string, width: number, height: number, drawFn: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
    if (this.spriteCache.has(key)) {
      return this.spriteCache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      drawFn(ctx);
    }
    this.spriteCache.set(key, canvas);
    return canvas;
  }

  /**
   * Draws the hero player sprite with crisp pixel details
   */
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    facingRight: boolean,
    state: string,
    animFrame: number,
    isInvulnerable: boolean
  ) {
    if (isInvulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
      return; // Flash effect when hurt
    }

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const halfW = width / 2;
    const halfH = height / 2;

    // Body base offset based on state & animation
    let bodyBob = 0;
    let legOffset = 0;
    let armAngle = 0;

    if (state === 'RUNNING') {
      bodyBob = Math.sin(animFrame * 0.4) * 2;
      legOffset = Math.sin(animFrame * 0.4) * 5;
      armAngle = Math.cos(animFrame * 0.4) * 0.5;
    } else if (state === 'JUMPING') {
      bodyBob = -2;
      legOffset = -3;
    } else if (state === 'FALLING') {
      bodyBob = 1;
      legOffset = 2;
    } else if (state === 'DASHING') {
      // Glow trail
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
    }

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, halfH - 2, halfW * 0.7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Cape / Scarf trailing back
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    const scarfWave = Math.sin(animFrame * 0.3) * 3;
    ctx.moveTo(-halfW * 0.3, -halfH * 0.2 + bodyBob);
    ctx.lineTo(-halfW * 0.9 - (state === 'RUNNING' ? 6 : 2), -halfH * 0.1 + bodyBob + scarfWave);
    ctx.lineTo(-halfW * 0.4, halfH * 0.1 + bodyBob);
    ctx.closePath();
    ctx.fill();

    // 2. Legs / Boots
    ctx.fillStyle = '#1e293b'; // Boots color
    // Back leg
    ctx.fillRect(-halfW * 0.55 - legOffset * 0.6, halfH * 0.4 + bodyBob, 7, 9);
    // Front leg
    ctx.fillStyle = '#334155';
    ctx.fillRect(-halfW * 0.05 + legOffset * 0.6, halfH * 0.4 + bodyBob, 7, 9);

    // 3. Torso / Armor (Cyan / Indigo tunic)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-halfW * 0.6, -halfH * 0.3 + bodyBob, halfW * 1.2, halfH * 0.8);
    
    // Belt & Buckle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-halfW * 0.6, halfH * 0.25 + bodyBob, halfW * 1.2, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-halfW * 0.15, halfH * 0.25 + bodyBob, 5, 3);

    // 4. Head / Helmet
    // Skin face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-halfW * 0.4, -halfH * 0.85 + bodyBob, halfW * 0.9, halfH * 0.6);

    // Helmet / Hair (Golden/Amber or Hero cap)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-halfW * 0.5, -halfH * 0.95 + bodyBob, halfW * 1.1, halfH * 0.45);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-halfW * 0.5, -halfH * 0.95 + bodyBob, 4, halfH * 0.45); // Visor rim

    // Eye (sharp pixel)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(halfW * 0.05, -halfH * 0.6 + bodyBob, 3, 4);
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(halfW * 0.05 + 1, -halfH * 0.6 + bodyBob, 1, 1);

    // 5. Arms / Hand
    ctx.save();
    ctx.translate(-halfW * 0.1, -halfH * 0.1 + bodyBob);
    ctx.rotate(armAngle);
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-3, 0, 6, 10);
    ctx.fillStyle = '#fed7aa'; // Hand
    ctx.fillRect(-3, 8, 6, 4);
    ctx.restore();

    ctx.restore();
  }

  /**
   * Draws a Tile based on TileType
   */
  public static drawTile(
    ctx: CanvasRenderingContext2D,
    type: number,
    x: number,
    y: number,
    size: number,
    _animFrame: number
  ) {
    switch (type) {
      case 1: // SOLID_GRASS
        // Dirt base
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y, size, size);
        // Dirt speckles
        ctx.fillStyle = '#5a2707';
        ctx.fillRect(x + 4, y + 12, 4, 4);
        ctx.fillRect(x + 18, y + 20, 5, 4);
        ctx.fillRect(x + 10, y + 24, 3, 3);
        // Grass top layer
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x, y, size, 7);
        // Grass overhang blades
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x + 2, y + 7, 3, 3);
        ctx.fillRect(x + 9, y + 7, 4, 4);
        ctx.fillRect(x + 18, y + 7, 3, 3);
        ctx.fillRect(x + 25, y + 7, 4, 5);
        // Highlight top line
        ctx.fillStyle = '#86efac';
        ctx.fillRect(x, y, size, 2);
        break;

      case 2: // SOLID_DIRT
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#5a2707';
        ctx.fillRect(x + 5, y + 6, 6, 5);
        ctx.fillRect(x + 18, y + 14, 5, 5);
        ctx.fillRect(x + 8, y + 22, 6, 4);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x + 20, y + 4, 4, 4);
        break;

      case 3: // SOLID_STONE
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, size, size);
        // Brick borders
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, size, 1);
        ctx.fillRect(x, y + size / 2, size, 1);
        ctx.fillRect(x, y, 1, size / 2);
        ctx.fillRect(x + size / 2, y + size / 2, 1, size / 2);
        // Stone texture highlight
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 2, y + 2, size / 2 - 4, size / 2 - 4);
        ctx.fillRect(x + size / 2 + 2, y + size / 2 + 2, size / 2 - 4, size / 2 - 4);
        break;

      case 4: // ONE_WAY_PLATFORM
        // Semi-solid wooden platform
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x, y, size, 8);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x, y, size, 2); // Highlight
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y + 6, size, 2); // Shadow
        // Wood grain
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x + 8, y + 3, 2, 3);
        ctx.fillRect(x + 20, y + 3, 3, 3);
        break;

      case 5: // SPIKES_UP
        ctx.fillStyle = '#cbd5e1';
        // Draw 3 sharp triangular spikes
        const spikeW = size / 3;
        for (let i = 0; i < 3; i++) {
          const sx = x + i * spikeW;
          ctx.beginPath();
          ctx.moveTo(sx, y + size);
          ctx.lineTo(sx + spikeW / 2, y + 4);
          ctx.lineTo(sx + spikeW, y + size);
          ctx.closePath();
          ctx.fillStyle = '#e2e8f0';
          ctx.fill();
          // Shadow half
          ctx.beginPath();
          ctx.moveTo(sx + spikeW / 2, y + 4);
          ctx.lineTo(sx + spikeW, y + size);
          ctx.lineTo(sx + spikeW / 2, y + size);
          ctx.closePath();
          ctx.fillStyle = '#94a3b8';
          ctx.fill();
        }
        // Base plate
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y + size - 3, size, 3);
        break;

      case 6: // SPIKES_DOWN
        const sW = size / 3;
        for (let i = 0; i < 3; i++) {
          const sx = x + i * sW;
          ctx.beginPath();
          ctx.moveTo(sx, y);
          ctx.lineTo(sx + sW / 2, y + size - 4);
          ctx.lineTo(sx + sW, y);
          ctx.closePath();
          ctx.fillStyle = '#e2e8f0';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(sx + sW / 2, y + size - 4);
          ctx.lineTo(sx + sW, y);
          ctx.lineTo(sx + sW / 2, y);
          ctx.closePath();
          ctx.fillStyle = '#94a3b8';
          ctx.fill();
        }
        ctx.fillStyle = '#475569';
        ctx.fillRect(x, y, size, 3);
        break;

      case 7: // WATER
        ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.fillRect(x, y, size, 3);
        break;

      case 8: // LAVA
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(x, y, size, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 4, y + 2, 6, 2);
        ctx.fillRect(x + 18, y + 2, 8, 2);
        break;

      case 9: // BOUNCE_PAD
        ctx.fillStyle = '#db2777';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size, size / 2, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size, size / 3, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size / 2 - 3, y + size / 2 - 2, 6, 6);
        break;

      case 10: // LADDER
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 4, y, 4, size);
        ctx.fillRect(x + size - 8, y, 4, size);
        // Rungs
        ctx.fillRect(x + 4, y + 4, size - 8, 3);
        ctx.fillRect(x + 4, y + 14, size - 8, 3);
        ctx.fillRect(x + 4, y + 24, size - 8, 3);
        break;

      case 11: // ICE
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(x, y, size, 4);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(x + 4, y + 8, 12, 2);
        ctx.fillRect(x + 16, y + 18, 10, 2);
        break;

      default:
        break;
    }
  }

  /**
   * Draws enemies (Patrol, Slime, Bat)
   */
  public static drawEnemy(
    ctx: CanvasRenderingContext2D,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    facingRight: boolean,
    animFrame: number,
    isHurt: boolean
  ) {
    if (isHurt && Math.floor(Date.now() / 60) % 2 === 0) return;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    const halfW = width / 2;
    const halfH = height / 2;

    if (type === 'PATROL_ENEMY') {
      // Mushroom / Beetle Walker
      const waddle = Math.sin(animFrame * 0.4) * 2;

      // Feet
      ctx.fillStyle = '#713f12';
      ctx.fillRect(-halfW * 0.7, halfH * 0.4 + waddle, 6, 6);
      ctx.fillRect(halfW * 0.1, halfH * 0.4 - waddle, 6, 6);

      // Body
      ctx.fillStyle = '#e11d48'; // Red mushroom cap
      ctx.beginPath();
      ctx.arc(0, 0, halfW * 0.85, Math.PI, 0);
      ctx.lineTo(halfW * 0.85, halfH * 0.4);
      ctx.lineTo(-halfW * 0.85, halfH * 0.4);
      ctx.closePath();
      ctx.fill();

      // White spots on cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-halfW * 0.4, -halfH * 0.3, 3, 0, Math.PI * 2);
      ctx.arc(halfW * 0.3, -halfH * 0.4, 4, 0, Math.PI * 2);
      ctx.arc(0, -halfH * 0.6, 3, 0, Math.PI * 2);
      ctx.fill();

      // Eyes (angry look)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(halfW * 0.1, halfH * 0.05, 5, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(halfW * 0.25, halfH * 0.15, 3, 3);

    } else if (type === 'SLIME_ENEMY') {
      // Jumper Slime (Green gelatinous blob)
      const squish = Math.sin(animFrame * 0.5) * 3;
      const w = halfW + squish;
      const h = halfH - squish;

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(0, squish, w, h, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner glow
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.ellipse(-w * 0.3, -h * 0.3 + squish, w * 0.4, h * 0.3, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Cute/Derpy Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w * 0.1, -2 + squish, 4, 4);
      ctx.fillRect(w * 0.45, -2 + squish, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.1 + 1, -2 + squish, 1, 1);
      ctx.fillRect(w * 0.45 + 1, -2 + squish, 1, 1);

    } else if (type === 'BAT_ENEMY') {
      // Flying Bat
      const flap = Math.sin(animFrame * 0.6) * 8;

      // Bat Body
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(0, 0, halfW * 0.4, halfH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bat Ears
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.3, -halfH * 0.4);
      ctx.lineTo(-halfW * 0.2, -halfH * 0.8);
      ctx.lineTo(0, -halfH * 0.3);
      ctx.lineTo(halfW * 0.2, -halfH * 0.8);
      ctx.lineTo(halfW * 0.3, -halfH * 0.4);
      ctx.fill();

      // Bat Wings
      ctx.fillStyle = '#1e293b';
      // Left wing
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.2, -halfH * 0.1);
      ctx.lineTo(-halfW * 0.95, -halfH * 0.3 + flap);
      ctx.lineTo(-halfW * 0.6, halfH * 0.4 + flap * 0.5);
      ctx.closePath();
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(halfW * 0.2, -halfH * 0.1);
      ctx.lineTo(halfW * 0.95, -halfH * 0.3 + flap);
      ctx.lineTo(halfW * 0.6, halfH * 0.4 + flap * 0.5);
      ctx.closePath();
      ctx.fill();

      // Red Eyes
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, -2, 2, 2);
      ctx.fillRect(halfW * 0.2, -2, 2, 2);
    }

    ctx.restore();
  }

  /**
   * Draws collectibles (Coin, Gem, Heart)
   */
  public static drawCollectible(
    ctx: CanvasRenderingContext2D,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number
  ) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const bob = Math.sin(animFrame * 0.1) * 3;
    ctx.translate(0, bob);

    if (type === 'COIN') {
      // Rotating 3D gold coin
      const scaleX = Math.abs(Math.cos(animFrame * 0.1));
      ctx.scale(scaleX || 0.1, 1);

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // Inner ring
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-1, -width * 0.2, 2, width * 0.4);

    } else if (type === 'GEM') {
      // Emerald / Ruby gemstone
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, -height * 0.45);
      ctx.lineTo(width * 0.4, -height * 0.15);
      ctx.lineTo(0, height * 0.45);
      ctx.lineTo(-width * 0.4, -height * 0.15);
      ctx.closePath();
      ctx.fill();

      // Gem facets
      ctx.fillStyle = '#a5f3fc';
      ctx.beginPath();
      ctx.moveTo(0, -height * 0.45);
      ctx.lineTo(0, height * 0.45);
      ctx.lineTo(-width * 0.4, -height * 0.15);
      ctx.closePath();
      ctx.fill();

    } else if (type === 'HEART') {
      // Pulsing heart
      const pulse = 1 + Math.sin(animFrame * 0.15) * 0.08;
      ctx.scale(pulse, pulse);

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      const topCurveHeight = height * 0.3;
      ctx.moveTo(0, height * 0.3);
      ctx.bezierCurveTo(-width * 0.5, -topCurveHeight, -width * 0.5, -height * 0.4, 0, -height * 0.2);
      ctx.bezierCurveTo(width * 0.5, -height * 0.4, width * 0.5, -topCurveHeight, 0, height * 0.3);
      ctx.fill();

      // Heart highlight
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(-width * 0.18, -height * 0.2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draws Goal Portal or Checkpoint Flag
   */
  public static drawGoal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number
  ) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    // Swirling portal rings
    const rot = animFrame * 0.05;
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 12;

    // Outer portal ring
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.45, height * 0.48, rot, 0, Math.PI * 2);
    ctx.stroke();

    // Inner bright energy vortex
    ctx.strokeStyle = '#c7d2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.32, height * 0.35, -rot * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Center portal core
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.3);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#818cf8');
    gradient.addColorStop(1, 'rgba(49, 46, 129, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, width * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  public static drawCheckpoint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    activated: boolean,
    animFrame: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Pole
    ctx.fillStyle = '#64748b';
    ctx.fillRect(4, 0, 4, height);

    // Base
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, height - 4, 12, 4);

    // Flag / Torch
    if (activated) {
      // Waving green flag
      const wave = Math.sin(animFrame * 0.2) * 3;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(8, 2);
      ctx.lineTo(8 + width * 0.7, 8 + wave);
      ctx.lineTo(8, 16);
      ctx.closePath();
      ctx.fill();

      // Sparkle
      ctx.fillStyle = '#86efac';
      ctx.fillRect(8 + width * 0.3, 6 + wave, 2, 2);
    } else {
      // Inactive gray flag
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(8, 2);
      ctx.lineTo(8 + width * 0.6, 8);
      ctx.lineTo(8, 14);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}
