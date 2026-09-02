import { InputState } from './types';

/**
 * Handles keyboard, touch, and virtual D-pad inputs with frame-accurate edge detection.
 */
export class InputManager {
  private keysDown: Set<string> = new Set();
  private keysPressedThisFrame: Set<string> = new Set();
  private keysReleasedThisFrame: Set<string> = new Set();

  private virtualState: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
    dash: boolean;
    attack: boolean;
  } = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    attack: false,
  };

  private prevJump: boolean = false;
  private prevDash: boolean = false;
  private prevAttack: boolean = false;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Prevent default scroll behaviors for game keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
      e.preventDefault();
    }

    if (!this.keysDown.has(e.code)) {
      this.keysPressedThisFrame.add(e.code);
    }
    this.keysDown.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keysDown.delete(e.code);
    this.keysReleasedThisFrame.add(e.code);
  };

  public setVirtualInput(input: Partial<typeof this.virtualState>) {
    Object.assign(this.virtualState, input);
  }

  /**
   * Called once at the beginning of each frame update to produce unified InputState
   */
  public update(): InputState {
    const isKey = (codes: string[]) => codes.some(c => this.keysDown.has(c));
    const isJustPressed = (codes: string[]) => codes.some(c => this.keysPressedThisFrame.has(c));
    const isJustReleased = (codes: string[]) => codes.some(c => this.keysReleasedThisFrame.has(c));

    const left = isKey(['ArrowLeft', 'KeyA']) || this.virtualState.left;
    const right = isKey(['ArrowRight', 'KeyD']) || this.virtualState.right;
    const up = isKey(['ArrowUp', 'KeyW']) || this.virtualState.up;
    const down = isKey(['ArrowDown', 'KeyS']) || this.virtualState.down;

    const rawJump = isKey(['Space', 'ArrowUp', 'KeyW', 'KeyZ', 'KeyK']) || this.virtualState.jump;
    const jumpPressedThisFrame = isJustPressed(['Space', 'ArrowUp', 'KeyW', 'KeyZ', 'KeyK']) || (rawJump && !this.prevJump);
    const jumpReleasedThisFrame = isJustReleased(['Space', 'ArrowUp', 'KeyW', 'KeyZ', 'KeyK']) || (!rawJump && this.prevJump);
    this.prevJump = rawJump;

    const rawDash = isKey(['ShiftLeft', 'ShiftRight', 'KeyJ', 'KeyX']) || this.virtualState.dash;
    const dashPressedThisFrame = isJustPressed(['ShiftLeft', 'ShiftRight', 'KeyJ', 'KeyX']) || (rawDash && !this.prevDash);
    this.prevDash = rawDash;

    const rawAttack = isKey(['KeyF', 'KeyC']) || this.virtualState.attack;
    const attackPressedThisFrame = isJustPressed(['KeyF', 'KeyC']) || (rawAttack && !this.prevAttack);
    this.prevAttack = rawAttack;

    const interact = isJustPressed(['KeyE', 'Enter']);
    const pause = isJustPressed(['Escape', 'KeyP']);

    // Clear single-frame sets for the next tick
    this.keysPressedThisFrame.clear();
    this.keysReleasedThisFrame.clear();

    return {
      left,
      right,
      up,
      down,
      jump: rawJump,
      jumpPressedThisFrame,
      jumpReleasedThisFrame,
      dash: rawDash,
      dashPressedThisFrame,
      attack: rawAttack,
      attackPressedThisFrame,
      interact,
      pause,
    };
  }
}
