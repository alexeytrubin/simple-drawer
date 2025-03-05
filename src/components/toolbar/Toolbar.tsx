import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { Square, Type, Trash2, Grid, Copy, Download, Image as ImageIcon, Paintbrush2, LayoutTemplate, Group, Ungroup, PaintBucket } from 'lucide-react';
import { ShapeMenu } from './ShapeMenu';
import { ToolbarButton } from './ToolbarButton';
import { ExportMenu } from '../ExportMenu';
import { DrawingTools } from './DrawingTools';
import { TemplatesMenu } from '../TemplatesMenu';
import {
  addRectangle,
  addCircle,
  addEllipse,
  addTriangle,
  addPolygon,
  addStar,
  addText,
  addImage
} from '../../utils/toolbar/shapeUtils';
import { deleteSelected, duplicateSelected } from '../../utils/toolbar/generalUtils';
import { 
  enableBrushTool, 
  enablePencilTool, 
  enableSprayBrush,
  enableCircleBrush,
  enablePatternBrush,
  disableDrawingMode,
  clearCanvas,
  updateBrushSettings,
  createPatternBrushes
} from '../../utils/toolbar/drawingUtils';
import { groupSelectedObjects, ungroupSelectedObjects, isGroupSelected, isMultipleObjectsSelected } from '../../utils/toolbar/groupUtils';
import { BackgroundColorMenu } from './BackgroundColorMenu';

interface ToolbarProps {
  canvas: fabric.Canvas | null;
  currentColor: string;
}

export function Toolbar({ canvas, currentColor }: ToolbarProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [shapeMenu, setShapeMenu] = useState<{ x: number; y: number } | null>(null);
  const [exportMenu, setExportMenu] = useState<{ x: number; y: number } | null>(null);
  const [drawingTools, setDrawingTools] = useState<{ x: number; y: number } | null>(null);
  const [templatesMenu, setTemplatesMenu] = useState<{ x: number; y: number } | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [brushColor, setBrushColor] = useState(currentColor);
  const [shadow, setShadow] = useState({
    color: '#000000',
    blur: 0,
    offsetX: 0,
    offsetY: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canGroup, setCanGroup] = useState(false);
  const [canUngroup, setCanUngroup] = useState(false);
  const [activePatternType, setActivePatternType] = useState<'vline' | 'hline' | 'square' | 'diamond' | null>(null);
  const patternBrushesRef = useRef<ReturnType<typeof createPatternBrushes> | null>(null);
  const [backgroundColorMenu, setBackgroundColorMenu] = useState<{ x: number; y: number } | null>(null);

  // Initialize pattern brushes when canvas is ready
  useEffect(() => {
    if (!canvas) return;
    patternBrushesRef.current = createPatternBrushes(canvas);
  }, [canvas]);

  // Check if objects can be grouped or ungrouped
  useEffect(() => {
    if (!canvas) return;

    const checkGroupStatus = () => {
      setCanGroup(isMultipleObjectsSelected(canvas));
      setCanUngroup(isGroupSelected(canvas));
    };

    canvas.on('selection:created', checkGroupStatus);
    canvas.on('selection:updated', checkGroupStatus);
    canvas.on('selection:cleared', () => {
      setCanGroup(false);
      setCanUngroup(false);
    });

    return () => {
      canvas.off('selection:created', checkGroupStatus);
      canvas.off('selection:updated', checkGroupStatus);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  // Update brush color when currentColor changes
  useEffect(() => {
    setBrushColor(currentColor);
    if (activeTool && canvas) {
      updateBrushSettings(canvas, { color: currentColor });
    }
  }, [currentColor, canvas, activeTool]);

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

  const handleDrawingToolClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawingTools(prev => prev ? null : { x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleToolSelect = (tool: string | null) => {
    if (!canvas) return;

    // If selecting the same tool, disable it
    if (tool === activeTool) {
      disableDrawingMode(canvas);
      setActiveTool(null);
      setIsDrawingMode(false);
      setActivePatternType(null);
      return;
    }

    // Enable the selected tool
    const drawingOptions = {
      color: brushColor,
      width: strokeWidth,
      shadow: shadow.blur > 0 ? shadow : undefined
    };

    switch (tool) {
      case 'brush':
        enableBrushTool(canvas, drawingOptions);
        setActivePatternType(null);
        break;
      case 'pencil':
        enablePencilTool(canvas, drawingOptions);
        setActivePatternType(null);
        break;
      case 'spray':
        enableSprayBrush(canvas, drawingOptions);
        setActivePatternType(null);
        break;
      case 'circle':
        enableCircleBrush(canvas, drawingOptions);
        setActivePatternType(null);
        break;
      case 'vline':
        enablePatternBrush(canvas, drawingOptions, 'vline');
        setActivePatternType('vline');
        break;
      case 'hline':
        enablePatternBrush(canvas, drawingOptions, 'hline');
        setActivePatternType('hline');
        break;
      case 'square':
        enablePatternBrush(canvas, drawingOptions, 'square');
        setActivePatternType('square');
        break;
      case 'diamond':
        enablePatternBrush(canvas, drawingOptions, 'diamond');
        setActivePatternType('diamond');
        break;
      default:
        disableDrawingMode(canvas);
        setIsDrawingMode(false);
        setActiveTool(null);
        setActivePatternType(null);
        return;
    }

    setActiveTool(tool);
    setIsDrawingMode(true);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    if (activeTool && canvas) {
      updateBrushSettings(canvas, { width });
    }
  };

  const handleBrushColorChange = (color: string) => {
    setBrushColor(color);
    if (activeTool && canvas) {
      // If it's a pattern brush, we need to recreate it with the new color
      if (activePatternType && canvas.isDrawingMode) {
        enablePatternBrush(canvas, {
          color,
          width: strokeWidth,
          shadow: shadow.blur > 0 ? shadow : undefined
        }, activePatternType);
      } else {
        updateBrushSettings(canvas, { color });
      }
    }
  };

  const handleShadowChange = (newShadow: typeof shadow) => {
    setShadow(newShadow);
    if (activeTool && canvas) {
      updateBrushSettings(canvas, { shadow: newShadow });
    }
  };

  const handleClearCanvas = () => {
    if (!canvas) return;
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      clearCanvas(canvas);
    }
  };

  // Add event listener for ESC key to exit drawing mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeTool) {
          disableDrawingMode(canvas);
          setActiveTool(null);
          setIsDrawingMode(false);
          setActivePatternType(null);
        }
        setDrawingTools(null); // Close the menu when pressing ESC
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, canvas]);

  const handleShapeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShapeMenu({ x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleExportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setExportMenu({ x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleTemplatesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTemplatesMenu({ x: rect.left + rect.width + 8, y: rect.top });
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      addImage(canvas, file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGroupObjects = () => {
    if (!canvas) return;
    groupSelectedObjects(canvas);
  };

  const handleUngroupObjects = () => {
    if (!canvas) return;
    ungroupSelectedObjects(canvas);
  };

  const handleBackgroundColorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBackgroundColorMenu(prev => prev ? null : { x: rect.left + rect.width + 8, y: rect.top });
  };

  const handleBackgroundColorChange = (color: string) => {
    if (!canvas) return;
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    setBackgroundColorMenu(null);
  };

  if (!canvas) return null;

  return (
    <div className="w-16 bg-white border-r border-gray-200 py-4 flex flex-col items-center gap-2">
      <div className="space-y-2 w-full px-2">
        <ToolbarButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleTemplatesClick(e)}
          icon={LayoutTemplate}
          title="Complex Figures"
          isActive={!!templatesMenu}
        />
        <ToolbarButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleShapeClick(e)}
          icon={Square}
          title="Add Shape"
          isActive={!!shapeMenu}
        />
        <ToolbarButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDrawingToolClick(e)}
          icon={Paintbrush2}
          title="Drawing Tools"
          isActive={!!drawingTools || !!activeTool}
        />
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          icon={ImageIcon}
          title="Upload Image"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="w-8 h-px bg-gray-200 my-2" />
      
      <ToolbarButton
        onClick={() => addText(canvas)}
        icon={Type}
        title="Add Text"
      />
      
      <ToolbarButton
        onClick={() => duplicateSelected(canvas)}
        icon={Copy}
        title="Duplicate Selected"
      />
      
      <ToolbarButton
        onClick={handleGroupObjects}
        icon={Group}
        title="Group Objects"
        isActive={canGroup}
        disabled={!canGroup}
        className={!canGroup ? "opacity-50 cursor-not-allowed" : ""}
      />
      
      <ToolbarButton
        onClick={handleUngroupObjects}
        icon={Ungroup}
        title="Ungroup Objects"
        isActive={canUngroup}
        disabled={!canUngroup}
        className={!canUngroup ? "opacity-50 cursor-not-allowed" : ""}
      />
      
      <ToolbarButton
        onClick={toggleGrid}
        icon={Grid}
        title="Toggle Grid"
        isActive={showGrid}
      />
      
      <ToolbarButton
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleBackgroundColorClick(e)}
        icon={PaintBucket}
        title="Background Color"
        isActive={!!backgroundColorMenu}
      />
      
      <ToolbarButton
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleExportClick(e)}
        icon={Download}
        title="Export"
        isActive={!!exportMenu}
      />
      
      <ToolbarButton
        onClick={() => deleteSelected(canvas)}
        icon={Trash2}
        title="Delete Selected"
        className="text-red-600 hover:bg-red-50"
      />

      {shapeMenu && (
        <ShapeMenu
          x={shapeMenu.x}
          y={shapeMenu.y}
          onClose={() => setShapeMenu(null)}
          onShapeSelect={handleShapeSelect}
        />
      )}

      {exportMenu && (
        <ExportMenu
          x={exportMenu.x}
          y={exportMenu.y}
          onClose={() => setExportMenu(null)}
          canvas={canvas}
        />
      )}

      {drawingTools && (
        <DrawingTools
          activeTool={activeTool}
          strokeWidth={strokeWidth}
          color={brushColor}
          shadow={shadow}
          onToolSelect={handleToolSelect}
          onStrokeWidthChange={handleStrokeWidthChange}
          onColorChange={handleBrushColorChange}
          onShadowChange={handleShadowChange}
          onClearCanvas={handleClearCanvas}
        />
      )}

      {templatesMenu && (
        <TemplatesMenu
          x={templatesMenu.x}
          y={templatesMenu.y}
          onClose={() => setTemplatesMenu(null)}
          canvas={canvas}
          title="Complex Figures"
        />
      )}

      {backgroundColorMenu && (
        <BackgroundColorMenu
          x={backgroundColorMenu.x}
          y={backgroundColorMenu.y}
          onClose={() => setBackgroundColorMenu(null)}
          onColorSelect={handleBackgroundColorChange}
        />
      )}
    </div>
  );
}