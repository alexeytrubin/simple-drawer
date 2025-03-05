import React, { useRef, useEffect } from 'react';
import { logoTemplates } from '../utils/templates/logoTemplates';
import { fabric } from 'fabric';
import { X } from 'lucide-react';

interface TemplatesMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  canvas: fabric.Canvas | null;
  title?: string;
}

export function TemplatesMenu({ x, y, onClose, canvas, title = "Complex Figures" }: TemplatesMenuProps) {
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

  const handleTemplateSelect = (template: typeof logoTemplates[0]) => {
    if (!canvas) return;
    
    if (canvas.getObjects().length > 0) {
      const shouldProceed = confirm('This will clear your current design. Are you sure you want to continue?');
      if (!shouldProceed) return;
    }
    
    template.create(canvas);
    onClose();
  };

  const categories = Array.from(new Set(logoTemplates.map(t => t.category)));

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  };

  // Helper function to get canvas center
  const getCanvasCenter = () => {
    if (!canvas) return { x: 0, y: 0 };
    return {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
  };

  const createAppleLogo = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create Apple logo components
    // Main apple body (circle)
    const appleBody = new fabric.Circle({
      radius: 40,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 10,
    });

    // Bite (circle)
    const bite = new fabric.Circle({
      radius: 20,
      fill: '#FFFFFF',
      originX: 'center',
      originY: 'center',
      left: 30,
      top: 0,
    });

    // Leaf (ellipse)
    const leaf = new fabric.Ellipse({
      rx: 15,
      ry: 8,
      fill: '#000000',
      angle: 45,
      originX: 'center',
      originY: 'center',
      left: 10,
      top: -35,
    });

    // Stem (rectangle)
    const stem = new fabric.Rect({
      width: 8,
      height: 20,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      left: 0,
      top: -25,
    });

    // Create group and add objects
    const group = new fabric.Group([appleBody, bite, leaf, stem], {
      left: canvasCenter.x,
      top: canvasCenter.y,
      originX: 'center',
      originY: 'center'
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    onClose();
  };

  const createAimTarget = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create aim/target components
    // Outer circle
    const outerCircle = new fabric.Circle({
      radius: 50,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
    });

    // Middle circle
    const middleCircle = new fabric.Circle({
      radius: 35,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Inner circle
    const innerCircle = new fabric.Circle({
      radius: 20,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Bullseye
    const bullseye = new fabric.Circle({
      radius: 8,
      fill: '#FF0000',
      originX: 'center',
      originY: 'center',
    });

    // Horizontal line
    const horizontalLine = new fabric.Line([-60, 0, 60, 0], {
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Vertical line
    const verticalLine = new fabric.Line([0, -60, 0, 60], {
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Create group and add objects
    const group = new fabric.Group(
      [outerCircle, middleCircle, innerCircle, bullseye, horizontalLine, verticalLine], 
      {
        left: canvasCenter.x,
        top: canvasCenter.y,
        originX: 'center',
        originY: 'center'
      }
    );

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    onClose();
  };

  const createNikeSwoosh = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create Nike swoosh using a path
    const swooshPath = 'M10,60 Q50,10 90,40 Q95,45 100,50 Q70,20 30,70 Q20,80 10,60 Z';
    
    const swoosh = new fabric.Path(swooshPath, {
      fill: '#000000',
      left: canvasCenter.x,
      top: canvasCenter.y,
      originX: 'center',
      originY: 'center',
      scaleX: 2,
      scaleY: 2
    });

    canvas.add(swoosh);
    canvas.setActiveObject(swoosh);
    canvas.requestRenderAll();
    onClose();
  };

  const createMoon = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create moon using two circles
    const fullCircle = new fabric.Circle({
      radius: 40,
      fill: '#FFC107',
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0,
    });
    
    const shadowCircle = new fabric.Circle({
      radius: 35,
      fill: '#FFFFFF',
      originX: 'center',
      originY: 'center',
      left: 20,
      top: 0,
    });
    
    // Create a group for the moon
    const group = new fabric.Group([fullCircle, shadowCircle], {
      left: canvasCenter.x,
      top: canvasCenter.y,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    onClose();
  };
  
  const createSimpleFace = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create face components
    const face = new fabric.Circle({
      radius: 50,
      fill: '#FFEB3B',
      originX: 'center',
      originY: 'center',
    });
    
    const leftEye = new fabric.Circle({
      radius: 8,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      left: -20,
      top: -15,
    });
    
    const rightEye = new fabric.Circle({
      radius: 8,
      fill: '#000000',
      originX: 'center',
      originY: 'center',
      left: 20,
      top: -15,
    });
    
    // Create smile using a path
    const smile = new fabric.Path('M-25,10 Q0,35 25,10', {
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 4,
      originX: 'center',
      originY: 'center',
    });
    
    // Create group for the face
    const group = new fabric.Group([face, leftEye, rightEye, smile], {
      left: canvasCenter.x,
      top: canvasCenter.y,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    onClose();
  };
  
  const createSimpleHouse = () => {
    if (!canvas) return;
    
    const canvasCenter = getCanvasCenter();
    
    // Create house components
    const base = new fabric.Rect({
      width: 100,
      height: 80,
      fill: '#795548',
      originX: 'center',
      originY: 'center',
      top: 20,
    });
    
    // Roof (triangle)
    const roofPoints = [
      { x: -60, y: 0 },
      { x: 0, y: -60 },
      { x: 60, y: 0 }
    ];
    
    const roof = new fabric.Polygon(roofPoints, {
      fill: '#D32F2F',
      originX: 'center',
      originY: 'center',
      top: -30,
    });
    
    // Door
    const door = new fabric.Rect({
      width: 30,
      height: 50,
      fill: '#5D4037',
      originX: 'center',
      originY: 'center',
      top: 35,
    });
    
    // Window
    const window = new fabric.Rect({
      width: 25,
      height: 25,
      fill: '#90CAF9',
      stroke: '#5D4037',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      left: 30,
      top: 10,
    });
    
    // Create group for the house
    const group = new fabric.Group([base, roof, door, window], {
      left: canvasCenter.x,
      top: canvasCenter.y,
      originX: 'center',
      originY: 'center'
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="absolute bg-white shadow-lg rounded-lg p-4 z-50 w-64"
      style={menuStyle}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{title}</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={createAppleLogo}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Apple Logo
        </button>
        
        <button 
          onClick={createAimTarget}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Target/Aim
        </button>
        
        <button 
          onClick={createNikeSwoosh}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Nike Swoosh
        </button>
        
        <button 
          onClick={createMoon}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Moon
        </button>
        
        <button 
          onClick={createSimpleFace}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Smiley Face
        </button>
        
        <button 
          onClick={createSimpleHouse}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center"
        >
          Simple House
        </button>
      </div>
    </div>
  );
}