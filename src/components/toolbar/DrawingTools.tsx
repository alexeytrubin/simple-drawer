import { useState } from 'react';
import { Paintbrush2, Pencil, SprayCan as Spray, Circle, Grid3X3, SquareAsterisk, Diamond, Trash2 } from 'lucide-react';

interface DrawingToolsProps {
  activeTool: string | null;
  strokeWidth: number;
  color: string;
  onToolSelect: (tool: string | null) => void;
  onStrokeWidthChange: (width: number) => void;
  onColorChange: (color: string) => void;
  onShadowChange: (shadow: { color: string; blur: number; offsetX: number; offsetY: number }) => void;
  onClearCanvas: () => void;
  shadow: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export function DrawingTools({ 
  activeTool, 
  strokeWidth, 
  color,
  shadow,
  onToolSelect, 
  onStrokeWidthChange,
  onColorChange,
  onShadowChange,
  onClearCanvas
}: DrawingToolsProps) {
  const [showShadowSettings, setShowShadowSettings] = useState(false);

  return (
    <div className="absolute left-16 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Drawing Tools</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onToolSelect(activeTool === 'brush' ? null : 'brush')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'brush' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Brush Tool"
            >
              <Paintbrush2 className="w-5 h-5" />
              <span className="text-xs mt-1">Brush</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'pencil' ? null : 'pencil')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'pencil' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Pencil Tool"
            >
              <Pencil className="w-5 h-5" />
              <span className="text-xs mt-1">Pencil</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'spray' ? null : 'spray')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'spray' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Spray Tool"
            >
              <Spray className="w-5 h-5" />
              <span className="text-xs mt-1">Spray</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'circle' ? null : 'circle')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'circle' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Circle Brush"
            >
              <Circle className="w-5 h-5" />
              <span className="text-xs mt-1">Circle</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'vline' ? null : 'vline')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'vline' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Vertical Line Pattern"
            >
              <Grid3X3 className="w-5 h-5" />
              <span className="text-xs mt-1">V-Line</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'hline' ? null : 'hline')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'hline' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Horizontal Line Pattern"
            >
              <Grid3X3 className="w-5 h-5 rotate-90" />
              <span className="text-xs mt-1">H-Line</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'square' ? null : 'square')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'square' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Square Pattern"
            >
              <SquareAsterisk className="w-5 h-5" />
              <span className="text-xs mt-1">Square</span>
            </button>
            <button
              onClick={() => onToolSelect(activeTool === 'diamond' ? null : 'diamond')}
              className={`p-2 rounded flex flex-col items-center justify-center ${activeTool === 'diamond' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              title="Diamond Pattern"
            >
              <Diamond className="w-5 h-5" />
              <span className="text-xs mt-1">Diamond</span>
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <h3 className="text-sm font-medium mb-2">Brush Settings</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-600">Color:</label>
                <span className="text-xs text-gray-600">{color}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-600">Width:</label>
                <span className="text-xs text-gray-600">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={strokeWidth}
                onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <button 
                onClick={() => setShowShadowSettings(!showShadowSettings)}
                className="text-sm text-gray-700 flex items-center gap-1"
              >
                <span className={`transform transition-transform ${showShadowSettings ? 'rotate-90' : ''}`}>▶</span>
                Shadow Settings
              </button>
              
              {showShadowSettings && (
                <div className="mt-2 pl-2 border-l-2 border-gray-200 space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-gray-600">Shadow Color:</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => onShadowChange({...shadow, color: e.target.value})}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={shadow.color}
                        onChange={(e) => onShadowChange({...shadow, color: e.target.value})}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-gray-600">Blur:</label>
                      <span className="text-xs text-gray-600">{shadow.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={shadow.blur}
                      onChange={(e) => onShadowChange({...shadow, blur: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-gray-600">Offset:</label>
                      <span className="text-xs text-gray-600">{shadow.offsetX}px, {shadow.offsetY}px</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shadow.offsetX}
                        onChange={(e) => onShadowChange({...shadow, offsetX: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shadow.offsetY}
                        onChange={(e) => onShadowChange({...shadow, offsetY: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <button
            onClick={onClearCanvas}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded flex items-center gap-1 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Clear Canvas</span>
          </button>
          
          <div className="text-xs text-gray-500">
            Press ESC to exit drawing mode
          </div>
        </div>
      </div>
    </div>
  );
}