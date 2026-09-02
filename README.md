# 2D_Platformer

A modular, production-ready 2D Platformer game development starter kit and physics engine. Designed for learning and mastering fundamental Game Dev concepts: Fixed Timestep Game Loops, AABB Kinematics & Collision Resolution, Player State Machines, Coyote Time, Jump Buffering, Parallax Scrolling, Procedural Web Audio Synthesis, Level Design, and In-Engine Debug Tools.

---

## 📁 Project Skeleton & Folder Architecture

```text
src/
├── assets/                  # Game assets & procedural generators
│   ├── audio/              # Sound synthesis & audio clips (Jump, Dash, Coins, Victory, Hurt)
│   ├── sprites/            # Pixel-art sprite rendering (Player, Enemies, Tiles, Props)
│   └── maps/               # Level blueprints & grid matrix definitions (Levels 1, 2, 3)
│
├── engine/                  # Core Game Engine Systems
│   ├── types.ts            # Type definitions, interfaces, vectors, game states
│   ├── GameEngine.ts       # Master game loop, fixed update 60Hz tick, lifecycle
│   ├── InputManager.ts     # Keyboard, Touch, Virtual D-pad, edge-triggered inputs
│   ├── PhysicsEngine.ts    # AABB collision math, gravity, jump curves, coyote time
│   ├── Camera.ts           # Smooth lerping target follow, bounds clamping, screen shake
│   ├── ParticleSystem.ts   # Dust puffs, landing impact, coin sparkles, dash ghost trails
│   └── AudioManager.ts     # Web Audio API 8-bit procedural sound synthesizer
│
├── entities/                # Game Object & Actor Hierarchy
│   ├── Entity.ts           # Base abstract entity class with physics & lifecycle
│   ├── Player.ts           # Player controller (Idle, Run, Jump, WallSlide, WallJump, Dash, Hurt)
│   ├── Enemy.ts            # AI Actors: Patrol Walker, Jumper Slime, Sine-Wave Bat
│   ├── Collectible.ts      # Interactive items: Coins, Gems, Health Hearts
│   ├── Checkpoint.ts       # Checkpoint flagpoles & respawn coordinators
│   └── Goal.ts             # Level completion portal & victory triggers
│
├── world/                   # Environment & Level Management
│   ├── Tilemap.ts          # 2D Grid collision mapping, auto-tiling, one-way platforms
│   ├── Background.ts       # Multi-layered parallax scrolling (Plains, Cavern, Castle)
│   └── LevelManager.ts     # Level loader, progression, custom JSON level importer
│
└── components/              # Interactive UI & Game Dev Studio Panels
    ├── GameCanvas.tsx      # Responsive Web Canvas viewport with ResizeObserver
    ├── GameHUD.tsx         # Health hearts, coin counter, score, timer, audio toggle
    ├── ControlsOverlay.tsx # Mobile/Touch on-screen D-pad and action buttons
    ├── DebugInspector.tsx  # Game Dev Sandbox (live physics sliders, hitboxes, god mode, FPS)
    ├── LevelEditor.tsx     # Visual in-game tile painter & JSON level import/export
    ├── GameMenu.tsx        # Start screen, Pause overlay, Game Over, Victory modal
    └── DocsModal.tsx       # Interactive in-app Game Dev Architecture Guide
```

---

## 🎮 Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move Left / Right** | `A` / `D` or `←` / `→` | Left / Right D-Pad |
| **Jump / Wall Jump** | `Space` / `W` / `↑` | Jump Button (Blue) |
| **Air Dash** | `Shift` / `J` / `X` | Dash Button (Cyan) |
| **Pause / Resume** | `Esc` / `P` | Pause Icon |
| **Restart Level** | `R` | Reload Icon |
| **Select Levels** | `1`, `2`, `3` | Sandbox Level Picker |

---

## 🧠 Fundamental Game Dev Skills & Features

1. **Fixed Timestep (60Hz Physics Accumulator)**: Keeps physics calculations deterministic and independent of screen refresh rate.
2. **Kinematic Platforming Physics**: Separated X/Y collision checking avoids sticking to walls or snagging on corners.
3. **Platformer "Juice" Mechanics**:
   - **Coyote Time (120ms)**: Jump right after walking off ledges.
   - **Jump Buffering (120ms)**: Queues jump input slightly before touching the ground.
   - **Variable Jump Height**: Cut vertical ascent short by releasing the jump key early.
   - **Wall Jump & Wall Slide**: Friction slide along vertical walls and kick off in opposite directions.
   - **Screen Shake & Particle Feedback**: Visceral feedback on landings, hits, stomps, and completions.
4. **Visual Level Designer**: Paint tiles, place enemies and collectibles, and export custom JSON levels directly within the live preview.
5. **Zero-Dependency Audio**: Pure Web Audio API chiptune synthesis with instant zero-latency feedback.
