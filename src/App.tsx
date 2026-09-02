import { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './engine/GameEngine';
import { GameState, GameStats, TileType, EntityType } from './engine/types';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { ControlsOverlay } from './components/ControlsOverlay';
import { DebugInspector } from './components/DebugInspector';
import { LevelEditor } from './components/LevelEditor';
import { GameMenu } from './components/GameMenu';
import { DocsModal } from './components/DocsModal';
import { Enemy } from './entities/Enemy';
import { Collectible } from './entities/Collectible';
import { Goal } from './entities/Goal';

export function App() {
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }
  const engine = engineRef.current;

  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [stats, setStats] = useState<GameStats>(engine.stats);
  const [isMuted, setIsMuted] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  // Brush for Level Editor
  const [activeBrush, setActiveBrush] = useState<{
    type: 'tile' | 'entity' | 'spawn' | 'eraser';
    value: number | EntityType;
  }>({
    type: 'tile',
    value: TileType.SOLID_GRASS,
  });

  useEffect(() => {
    engine.onStateChange = (newState) => {
      setGameState(newState);
      if (newState === GameState.LEVEL_EDITOR) {
        setIsEditorOpen(true);
      }
    };

    engine.onStatsUpdate = (newStats) => {
      setStats({ ...newStats });
    };

    engine.start();

    // Global keyboard hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'KeyR') {
        engine.restartCurrentLevel();
      } else if (e.code === 'KeyM') {
        setIsMuted(m => !m);
      } else if (e.code === 'Digit1') {
        engine.levelManager.loadLevel(0);
        engine.play();
      } else if (e.code === 'Digit2') {
        engine.levelManager.loadLevel(1);
        engine.play();
      } else if (e.code === 'Digit3') {
        engine.levelManager.loadLevel(2);
        engine.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
    };
  }, [engine]);

  const handleStartGame = () => {
    engine.play();
  };

  const handleCanvasClick = useCallback((worldX: number, worldY: number) => {
    if (!isEditorOpen) return;

    const tileSize = engine.levelManager.tilemap.tileSize;
    const tileX = Math.floor(worldX / tileSize);
    const tileY = Math.floor(worldY / tileSize);

    if (activeBrush.type === 'tile') {
      engine.levelManager.tilemap.setTile(tileX, tileY, Number(activeBrush.value));
    } else if (activeBrush.type === 'eraser') {
      engine.levelManager.tilemap.setTile(tileX, tileY, TileType.EMPTY);
      // Remove any entity at this tile
      engine.levelManager.enemies = engine.levelManager.enemies.filter(
        e => Math.floor(e.x / tileSize) !== tileX || Math.floor(e.y / tileSize) !== tileY
      );
      engine.levelManager.collectibles = engine.levelManager.collectibles.filter(
        c => Math.floor(c.x / tileSize) !== tileX || Math.floor(c.y / tileSize) !== tileY
      );
    } else if (activeBrush.type === 'spawn') {
      engine.levelManager.activeLevel.playerSpawn = { x: tileX, y: tileY };
      engine.levelManager.player.setSpawn(tileX * tileSize, tileY * tileSize);
      engine.levelManager.player.x = tileX * tileSize;
      engine.levelManager.player.y = tileY * tileSize;
    } else if (activeBrush.type === 'entity') {
      const entType = activeBrush.value as EntityType;
      const pxX = tileX * tileSize;
      const pxY = tileY * tileSize;

      if ([EntityType.PATROL_ENEMY, EntityType.SLIME_ENEMY, EntityType.BAT_ENEMY].includes(entType)) {
        engine.levelManager.enemies.push(new Enemy(entType, pxX, pxY));
      } else if ([EntityType.COIN, EntityType.GEM, EntityType.HEART].includes(entType)) {
        engine.levelManager.collectibles.push(new Collectible(entType, pxX, pxY));
      } else if (entType === EntityType.GOAL) {
        engine.levelManager.goal = new Goal(pxX, pxY);
      }
    }
  }, [isEditorOpen, activeBrush, engine]);

  return (
    <main
      id="game-main-app"
      className="relative w-screen h-screen bg-slate-950 flex flex-col select-none overflow-hidden"
    >
      {/* HUD Bar */}
      <GameHUD
        engine={engine}
        stats={stats}
        gameState={gameState}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector(!showInspector)}
        isEditorOpen={isEditorOpen}
        onToggleEditor={() => {
          const nextVal = !isEditorOpen;
          setIsEditorOpen(nextVal);
          if (nextVal) {
            engine.pause();
          } else {
            engine.play();
          }
        }}
        onOpenDocs={() => setShowDocs(true)}
      />

      {/* Main Interactive Canvas */}
      <GameCanvas
        engine={engine}
        onCanvasClick={handleCanvasClick}
      />

      {/* Touch D-Pad for Mobile */}
      <ControlsOverlay engine={engine} />

      {/* Menus / Overlays */}
      <GameMenu
        engine={engine}
        gameState={gameState}
        stats={stats}
        onStartGame={handleStartGame}
      />

      {/* Game Dev Sandbox / Inspector */}
      {showInspector && (
        <DebugInspector
          engine={engine}
          onClose={() => setShowInspector(false)}
        />
      )}

      {/* Interactive Level Editor */}
      {isEditorOpen && (
        <LevelEditor
          engine={engine}
          onClose={() => {
            setIsEditorOpen(false);
            engine.play();
          }}
          activeBrush={activeBrush}
          onSelectBrush={setActiveBrush}
        />
      )}

      {/* Architecture & Game Dev Documentation Modal */}
      {showDocs && (
        <DocsModal onClose={() => setShowDocs(false)} />
      )}
    </main>
  );
}

export default App;
