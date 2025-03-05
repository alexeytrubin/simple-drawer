import { Square, Circle, Type, Trash2, Grid, Copy, LayoutGrid, Download, Triangle, Star, Hexagon, ChevronDown, ChevronRight, MinusSquare, Save, FolderOpen, Plus } from 'lucide-react';
import { fabric } from 'fabric';
import { useState, useRef, useEffect } from 'react';
import { exportCanvas } from '../utils/canvasUtils';
import {
  addRectangle,
  addCircle,
  addEllipse,
  addTriangle,
  addPolygon,
  addStar,
  addText,
  deleteSelected,
  duplicateInRow,
  duplicateInGrid,
  toggleLineDrawing,
  saveCanvasState,
  loadCanvasState,
  createNewCanvas
} from '../utils/toolbarUtils';

interface ToolbarProps {
  canvas: fabric.Canvas | null;
  currentColor: string;
}

interface ShapeMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onShapeSelect: (shape: string) => void;
}

interface SavedDesignsMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onLoad: (name: string) => void;
  onNew: () => void;
  savedDesigns: string[];
}

function ShapeMenu({ x, y, onClose, onShapeSelect }: ShapeMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
  };

  const buttonClass = "w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm";

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-[160px] z-50"
      style={menuStyle}
    >
      <button className={buttonClass} onClick={() => onShapeSelect('rectangle')}>
        <Square className="w-4 h-4" />
        <span>Rectangle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('circle')}>
        <Circle className="w-4 h-4" />
        <span>Circle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('ellipse')}>
        <Circle className="w-4 h-4 scale-x-150" />
        <span>Ellipse</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('triangle')}>
        <Triangle className="w-4 h-4" />
        <span>Triangle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('hexagon')}>
        <Hexagon className="w-4 h-4" />
        <span>Hexagon</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('star')}>
        <Star className="w-4 h-4" />
        <span>Star</span>
      </button>
    </div>
  );
}

function SavedDesignsMenu({ x, y, onClose, onLoad, onNew, savedDesigns }: SavedDesignsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
  };

  const buttonClass = "w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm";

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-[200px] z-50"
      style={menuStyle}
    >
      <button className={buttonClass} onClick={onNew}>
        <Plus className="w-4 h-4" />
        <span>New Design</span>
      </button>
      
      {savedDesigns.length > 0 && (
        <>
          <div className="h-px bg-gray-200 my-1" />
          <div className="py-1 px-3">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Saved Designs</h3>
          </div>
          {savedDesigns.map((name) => (
            <button
              key={name}
              className={buttonClass}
              onClick={() => onLoad(name)}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

export function Toolbar({ canvas, currentColor }: ToolbarProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showDuplicateOptions, setShowDuplicateOptions] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [shapeMenu, setShapeMenu] = useState<{ x: number; y: number } | null>(null);
  const [savedDesignsMenu, setSavedDesignsMenu] = useState<{ x: number; y: number } | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<string[]>([]);

  useEffect(() => {
    // Load saved design names from localStorage
    const designs = Object.keys(localStorage).filter(key => key.startsWith('canvas_'));
    setSavedDesigns(designs.map(key => key.replace('canvas_', '')));
  }, []);

  const toggleGrid = () => {
    if (!canvas) return;
    const gridLines = canvas.getObjects().filter(obj => 
      obj instanceof fabric.Line && !obj.selectable
    );
    
    gridLines.forEach(line => {
      line.set('visible', !showGrid);
    });
    
    canvas.requestRenderAll();
    setShowGrid(!showGrid);
  };

  const handleLineDrawing = () => {
    if (!canvas) return;
    const newMode = !isDrawingMode;
    toggleLineDrawing(canvas, newMode, currentColor);
    setIsDrawingMode(newMode);
  };

  const handleShapeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShapeMenu({ x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleShapeSelect = (shape: string) => {
    if (!canvas) return;
    
    switch (shape) {
      case 'rectangle':
        addRectangle(canvas, currentColor);
        break;
      case 'circle':
        addCircle(canvas, currentColor);
        break;
      case 'ellipse':
        addEllipse(canvas, currentColor);
        break;
      case 'triangle':
        addTriangle(canvas, currentColor);
        break;
      case 'hexagon':
        addPolygon(canvas, currentColor);
        break;
      case 'star':
        addStar(canvas, currentColor);
        break;
    }
    
    setShapeMenu(null);
  };

  const handleSave = () => {
    if (!canvas) return;
    
    const name = prompt('Enter a name for your design:');
    if (!name) return;
    
    saveCanvasState(canvas, name);
    setSavedDesigns(prev => [...new Set([...prev, name])]);
  };

  const handleSavedDesignsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSavedDesignsMenu({ x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleLoadDesign = (name: string) => {
    if (!canvas) return;
    loadCanvasState(canvas, name);
    setSavedDesignsMenu(null);
  };

  const handleNewDesign = () => {
    if (!canvas) return;
    if (confirm('Are you sure you want to create a new design? All unsaved changes will be lost.')) {
      createNewCanvas(canvas);
      setSavedDesignsMenu(null);
    }
  };

  const buttonClass = "w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors";

  return (
    <div className="w-16 bg-white border-r border-gray-200 py-4 flex flex-col items-center gap-2">
      <div className="space-y-2 w-full px-2">
        <button 
          onClick={handleShapeClick} 
          className={`${buttonClass} ${shapeMenu ? 'bg-indigo-100 text-indigo-600' : ''}`} 
          title="Add Shape"
        >
          <Square className="w-6 h-6" />
        </button>
        <button 
          onClick={handleLineDrawing} 
          className={`${buttonClass} ${isDrawingMode ? 'bg-indigo-100 text-indigo-600' : ''}`} 
          title="Draw Line"
        >
          <MinusSquare className="w-6 h-6" />
        </button>
      </div>

      <div className="w-8 h-px bg-gray-200 my-2" />
      
      <button onClick={() => addText(canvas)} className={buttonClass} title="Add Text">
        <Type className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => setShowDuplicateOptions(!showDuplicateOptions)} 
        className={`${buttonClass} ${showDuplicateOptions ? 'text-indigo-600' : ''}`}
        title="Duplicate Options"
      >
        <Copy className="w-6 h-6" />
      </button>
      
      {showDuplicateOptions && (
        <div className="absolute left-16 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Duplicate in Row</h3>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map(count => (
                  <button
                    key={count}
                    onClick={() => duplicateInRow(canvas, count)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Duplicate in Grid</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { rows: 2, cols: 2 },
                  { rows: 2, cols: 3 },
                  { rows: 3, cols: 2 },
                  { rows: 3, cols: 3 }
                ].map(({ rows, cols }) => (
                  <button
                    key={`${rows}x${cols}`}
                    onClick={() => duplicateInGrid(canvas, rows, cols)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-1"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    {rows}×{cols}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={toggleGrid} 
        className={`${buttonClass} ${showGrid ? 'text-indigo-600' : 'text-gray-400'}`}
        title="Toggle Grid"
      >
        <Grid className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => exportCanvas(canvas)} 
        className={buttonClass}
        title="Export as PNG"
      >
        <Download className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => deleteSelected(canvas)} 
        className={`${buttonClass} text-red-600 hover:bg-red-50`}
        title="Delete Selected"
      >
        <Trash2 className="w-6 h-6" />
      </button>

      <div className="w-8 h-px bg-gray-200 my-2" />
      
      <button 
        onClick={handleSave} 
        className={buttonClass}
        title="Save Design"
      >
        <Save className="w-6 h-6" />
      </button>

      <button 
        onClick={handleSavedDesignsClick}
        className={`${buttonClass} ${savedDesignsMenu ? 'bg-indigo-100 text-indigo-600' : ''}`}
        title="Open Design"
      >
        <FolderOpen className="w-6 h-6" />
      </button>

      {shapeMenu && (
        <ShapeMenu
          x={shapeMenu.x}
          y={shapeMenu.y}
          onClose={() => setShapeMenu(null)}
          onShapeSelect={handleShapeSelect}
        />
      )}

      {savedDesignsMenu && (
        <SavedDesignsMenu
          x={savedDesignsMenu.x}
          y={savedDesignsMenu.y}
          onClose={() => setSavedDesignsMenu(null)}
          onLoad={handleLoadDesign}
          onNew={handleNewDesign}
          savedDesigns={savedDesigns}
        />
      )}
    </div>
  );
}