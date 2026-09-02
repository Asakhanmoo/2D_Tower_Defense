import { useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { TileType, EntityType, LevelData } from '../engine/types';
import { X, Play, Download, Upload, Trash2, Brush, Check } from 'lucide-react';

interface LevelEditorProps {
  engine: GameEngine;
  onClose: () => void;
  activeBrush: { type: 'tile' | 'entity' | 'spawn' | 'eraser'; value: number | EntityType };
  onSelectBrush: (brush: { type: 'tile' | 'entity' | 'spawn' | 'eraser'; value: number | EntityType }) => void;
}

export const LevelEditor = ({
  engine,
  onClose,
  activeBrush,
  onSelectBrush,
}: LevelEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonString, setJsonString] = useState('');

  const brushItems = [
    { label: 'Grass', type: 'tile' as const, value: TileType.SOLID_GRASS, color: 'bg-emerald-600' },
    { label: 'Dirt', type: 'tile' as const, value: TileType.SOLID_DIRT, color: 'bg-amber-800' },
    { label: 'Stone', type: 'tile' as const, value: TileType.SOLID_STONE, color: 'bg-slate-600' },
    { label: 'Platform', type: 'tile' as const, value: TileType.ONE_WAY_PLATFORM, color: 'bg-amber-600' },
    { label: 'Spikes', type: 'tile' as const, value: TileType.SPIKES_UP, color: 'bg-slate-400' },
    { label: 'Lava', type: 'tile' as const, value: TileType.LAVA, color: 'bg-rose-600' },
    { label: 'Bounce', type: 'tile' as const, value: TileType.BOUNCE_PAD, color: 'bg-pink-600' },
    { label: 'Coin', type: 'entity' as const, value: EntityType.COIN, color: 'bg-yellow-500' },
    { label: 'Gem', type: 'entity' as const, value: EntityType.GEM, color: 'bg-cyan-500' },
    { label: 'Heart', type: 'entity' as const, value: EntityType.HEART, color: 'bg-rose-500' },
    { label: 'Patrol', type: 'entity' as const, value: EntityType.PATROL_ENEMY, color: 'bg-red-500' },
    { label: 'Slime', type: 'entity' as const, value: EntityType.SLIME_ENEMY, color: 'bg-green-500' },
    { label: 'Bat', type: 'entity' as const, value: EntityType.BAT_ENEMY, color: 'bg-indigo-500' },
    { label: 'Goal', type: 'entity' as const, value: EntityType.GOAL, color: 'bg-purple-600' },
    { label: 'Spawn', type: 'spawn' as const, value: 0, color: 'bg-sky-500' },
    { label: 'Eraser', type: 'eraser' as const, value: 0, color: 'bg-slate-800' },
  ];

  const handleExport = () => {
    const levelData: LevelData = {
      id: `custom-level-${Date.now()}`,
      name: `Custom Level (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      theme: engine.levelManager.activeLevel.theme,
      width: engine.levelManager.tilemap.width,
      height: engine.levelManager.tilemap.height,
      tileSize: engine.levelManager.tilemap.tileSize,
      playerSpawn: { ...engine.levelManager.activeLevel.playerSpawn },
      tiles: engine.levelManager.tilemap.grid,
      entities: engine.levelManager.activeLevel.entities,
    };

    const str = JSON.stringify(levelData, null, 2);
    setJsonString(str);
    setShowJsonModal(true);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonString) as LevelData;
      if (parsed.tiles && parsed.width && parsed.height) {
        engine.levelManager.loadCustomLevel(parsed);
        setShowJsonModal(false);
      }
    } catch {
      alert('Invalid level JSON format');
    }
  };

  const handleClearGrid = () => {
    if (confirm('Clear all blocks in this level?')) {
      const tm = engine.levelManager.tilemap;
      for (let y = 0; y < tm.height; y++) {
        for (let x = 0; x < tm.width; x++) {
          tm.grid[y][x] = TileType.EMPTY;
        }
      }
    }
  };

  return (
    <div
      id="level-editor-toolbar"
      className="absolute bottom-4 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl p-3 max-w-4xl mx-auto flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Brush className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-semibold text-slate-200 tracking-wide">Level Designer & Tile Painter</h2>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            Click & drag on canvas to paint
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-play-test"
            onClick={() => {
              engine.play();
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Play</span>
          </button>

          <button
            id="btn-export-json"
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Import</span>
          </button>

          <button
            id="btn-clear-level"
            onClick={handleClearGrid}
            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Clear Level Grid"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id="btn-close-editor"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Brush Palette */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {brushItems.map(b => {
          const isSelected = activeBrush.type === b.type && activeBrush.value === b.value;
          return (
            <button
              key={`${b.type}-${b.value}-${b.label}`}
              id={`brush-${b.label.toLowerCase()}`}
              onClick={() => onSelectBrush({ type: b.type, value: b.value })}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md scale-105'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
              <span>{b.label}</span>
            </button>
          );
        })}
      </div>

      {/* JSON Import/Export Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-200">Level Blueprint JSON</h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={jsonString}
              onChange={e => setJsonString(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonString);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>

              <button
                onClick={handleImport}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                <Upload className="w-4 h-4" />
                <span>Load Level</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
