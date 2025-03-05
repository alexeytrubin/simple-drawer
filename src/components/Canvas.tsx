import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createGrid, snapToGrid, handleKeyboardEvents, CanvasStateStack } from '../utils/canvasUtils';
import { moveToFront, moveForward, moveToBack, moveBackward } from '../utils/toolbarUtils';
import { configureControls } from '../utils/canvas/controlsConfig';
import { handleObjectScaling } from '../utils/canvas/scaleUtils';
import { ContextMenu } from './canvas/ContextMenu';
import { DimensionsLabel } from './canvas/DimensionsLabel';
import { ZoomControls } from './canvas/ZoomControls';
import { groupSelectedObjects, ungroupSelectedObjects } from '../utils/toolbar/groupUtils';

interface CanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  width: number;
  height: number;
  onSelectionChange: (hasSelection: boolean) => void;
}

export function Canvas({ onCanvasReady, width, height, onSelectionChange }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalScaleRef = useRef<{ scaleX: number; scaleY: number; left: number; top: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const canvasStateStack = new CanvasStateStack();

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Create canvas with full viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: viewportWidth,
      height: viewportHeight,
      backgroundColor: '#f9fafb', // Light gray background
      preserveObjectStacking: true,
      selection: true,
    });

    configureControls();

    // Create a background rectangle to represent the actual canvas area
    const canvasArea = new fabric.Rect({
      left: (viewportWidth - width) / 2,
      top: (viewportHeight - height) / 2,
      width: width,
      height: height,
      fill: '#ffffff',
      selectable: false,
      evented: false,
      hoverCursor: 'default',
    });
    canvas.add(canvasArea);
    canvasArea.sendToBack();

    // Create grid only within the canvas area
    const gridLines = createGrid(
      width, 
      height, 
      (viewportWidth - width) / 2, 
      (viewportHeight - height) / 2
    );
    canvas.add(...gridLines);
    gridLines.forEach(line => line.moveTo(1)); // Just above the white background

    canvas.on('object:moving', (e) => {
      if (e.target && !(e.target instanceof fabric.Line && !e.target.selectable)) {
        // Get the canvas area bounds
        const canvasLeft = (viewportWidth - width) / 2;
        const canvasTop = (viewportHeight - height) / 2;
        const canvasRight = canvasLeft + width;
        const canvasBottom = canvasTop + height;
        
        // Get object bounds
        const objWidth = e.target.getScaledWidth();
        const objHeight = e.target.getScaledHeight();
        
        // Constrain object to canvas area
        const newLeft = Math.max(canvasLeft, Math.min(canvasRight - objWidth, e.target.left!));
        const newTop = Math.max(canvasTop, Math.min(canvasBottom - objHeight, e.target.top!));
        
        e.target.set({
          left: newLeft,
          top: newTop
        });
        
        // Apply grid snapping relative to the canvas area
        snapToGrid(e.target, canvasLeft, canvasTop);
      }
    });

    canvas.on('selection:created', () => {
      onSelectionChange(true);
    });

    canvas.on('selection:updated', () => {
      onSelectionChange(true);
    });

    canvas.on('selection:cleared', () => {
      onSelectionChange(false);
    });

    canvas.on('object:scaling:before', (e) => {
      if (!e.target) return;
      originalScaleRef.current = {
        scaleX: e.target.scaleX!,
        scaleY: e.target.scaleY!,
        left: e.target.left!,
        top: e.target.top!
      };
    });

    canvas.on('object:scaling', (e) => {
      const target = e.target;
      if (!target || !originalScaleRef.current) return;

      const rect = target.getBoundingRect();
      const canvasZoom = canvas.getZoom();
      const canvasRect = canvas.getElement().getBoundingClientRect();
      const labelX = canvasRect.left + (rect.left + rect.width / 2) * canvasZoom;
      const labelY = canvasRect.top + rect.top * canvasZoom;

      setDimensions({
        width: rect.width,
        height: rect.height,
        x: labelX,
        y: labelY
      });

      const transform = target.controls[target.__corner!];
      if (!transform) return;

      const isCorner = ['tl', 'tr', 'bl', 'br'].includes(target.__corner!);
      if (!isCorner) return;

      handleObjectScaling(target, originalScaleRef.current, isCorner, canvas);
    });

    canvas.on('object:added', (obj) => {
      // if grid line, don't save
      if (!obj.target?.selectable) return;
      canvasStateStack.save(JSON.stringify(canvas.toJSON([ 'evented', 'selectable' ])));
    });

    canvas.on('object:modified', (e) => {
      console.log('object:modified', e);
      canvasStateStack.save(JSON.stringify(canvas.toJSON([ 'evented', 'selectable' ])));
      setDimensions(null);
      originalScaleRef.current = null;
      setIsPanning(false);
      lastPosRef.current = null;
    });

    canvas.on('mouse:up', () => {
      setDimensions(null);
      originalScaleRef.current = null;
    });

    // Add keyboard shortcuts for grouping/ungrouping
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle standard keyboard events
      handleKeyboardEvents(canvas, e, canvasStateStack);
      
      // Group objects with Ctrl+G
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        groupSelectedObjects(canvas);
      }
      
      // Ungroup objects with Ctrl+Shift+G
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        ungroupSelectedObjects(canvas);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [onCanvasReady, width, height, onSelectionChange]);

  useEffect(() => {
    if (!fabricCanvasRef.current || !containerRef.current) return;

    canvasStateStack.save(JSON.stringify(fabricCanvasRef.current.toJSON([ 'evented', 'selectable' ])));

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const target = canvas.findTarget(e, false);

      if (target && !(target instanceof fabric.Line && !target.selectable)) {
        canvas.setActiveObject(target);
        setContextMenu({ x: e.clientX, y: e.clientY });
      } else {
        setContextMenu(null);
      }
    };

    const handleClick = () => {
      setContextMenu(null);
    };

    containerRef.current.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const viewportWidth = window.innerWidth - 16;
    const viewportHeight = window.innerHeight - 24;
    
    // Update canvas dimensions
    canvas.setDimensions({ width: viewportWidth, height: viewportHeight });
    
    // Find and update the canvas area rectangle
    const canvasArea = canvas.getObjects().find(obj => 
      obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
    ) as fabric.Rect | undefined;
    
    if (canvasArea) {
      canvasArea.set({
        left: (viewportWidth - width) / 2,
        top: (viewportHeight - height) / 2,
        width: width,
        height: height
      });
    }
    
    // Remove existing grid
    const existingGrid = canvas.getObjects().filter(obj => 
      obj instanceof fabric.Line && !obj.selectable
    );
    canvas.remove(...existingGrid);
    
    // Create new grid
    const newGrid = createGrid(
      width, 
      height, 
      (viewportWidth - width) / 2, 
      (viewportHeight - height) / 2
    );
    canvas.add(...newGrid);
    newGrid.forEach(line => line.moveTo(1));
    
    // Make sure canvas area is at the back
    if (canvasArea) {
      canvasArea.sendToBack();
    }
    
    canvas.requestRenderAll();
  }, [width, height]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      const viewportWidth = window.innerWidth - 16;
      const viewportHeight = window.innerHeight - 24;
      
      // Update canvas dimensions
      canvas.setDimensions({ width: viewportWidth, height: viewportHeight });
      
      // Find and update the canvas area rectangle
      const canvasArea = canvas.getObjects().find(obj => 
        obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
      ) as fabric.Rect | undefined;
      
      if (canvasArea) {
        canvasArea.set({
          left: (viewportWidth - width) / 2,
          top: (viewportHeight - height) / 2
        });
      }
      
      // Update grid positions
      const gridLines = canvas.getObjects().filter(obj => 
        obj instanceof fabric.Line && !obj.selectable
      );
      
      canvas.remove(...gridLines);
      
      const newGrid = createGrid(
        width, 
        height, 
        (viewportWidth - width) / 2, 
        (viewportHeight - height) / 2
      );
      canvas.add(...newGrid);
      newGrid.forEach(line => line.moveTo(1));
      
      // Make sure canvas area is at the back
      if (canvasArea) {
        canvasArea.sendToBack();
      }
      
      canvas.requestRenderAll();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  // Handle zoom and pan
  useEffect(() => {
    if (!fabricCanvasRef.current || !containerRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Update zoom
    canvas.setZoom(zoom);
    
    // Handle mouse wheel for zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY;
        const newZoom = delta > 0 
          ? Math.max(0.1, zoom - 0.1) 
          : Math.min(5, zoom + 0.1);
        
        // Update zoom state
        setZoom(newZoom);
      }
    };
    
    // Handle mouse down for panning
    const handleMouseDown = (e: MouseEvent) => {
      console.log('handleMouseDown', e);
      // Middle mouse button (wheel) or space + left click for panning
      if (e.button === 1 || (e.button === 0 && e.getModifierState('Space'))) {
        e.preventDefault();
        setIsPanning(true);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        
        // Change cursor to grabbing
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grabbing';
        }
      }
    };
    
    // Handle mouse move for panning
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && lastPosRef.current && fabricCanvasRef.current) {
        e.preventDefault();
        
        const canvas = fabricCanvasRef.current;
        const vpt = canvas.viewportTransform!;
        
        // Calculate the delta movement
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        
        // Update the viewport transform
        vpt[4] += dx;
        vpt[5] += dy;
        
        // Update last position
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        
        // Apply the transform and render
        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();
      }
    };
    
    // Handle mouse up to stop panning
    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        lastPosRef.current = null;
        
        // Reset cursor
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default';
        }
      }
    };
    
    // Handle key down for space bar (pan mode)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    };
    
    // Handle key up for space bar
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    };
    
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleWheel);
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [zoom, isPanning]);

  const handleContextMenuAction = (action: string) => {
    if (!fabricCanvasRef.current) return;

    switch (action) {
      case 'front':
        moveToFront(fabricCanvasRef.current);
        break;
      case 'forward':
        moveForward(fabricCanvasRef.current);
        break;
      case 'backward':
        moveBackward(fabricCanvasRef.current);
        break;
      case 'back':
        moveToBack(fabricCanvasRef.current);
        break;
      case 'group':
        groupSelectedObjects(fabricCanvasRef.current);
        break;
      case 'ungroup':
        ungroupSelectedObjects(fabricCanvasRef.current);
        break;
    }

    setContextMenu(null);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleResetView = () => {
    if (!fabricCanvasRef.current) return;
    
    // Reset zoom
    setZoom(1);
    
    // Reset pan position
    const canvas = fabricCanvasRef.current;
    const vpt = canvas.viewportTransform!;
    vpt[4] = 0;
    vpt[5] = 0;
    canvas.setViewportTransform(vpt);
    canvas.requestRenderAll();
  };

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden">
      <div 
        ref={containerRef} 
        className="relative overflow-hidden w-full h-full"
        style={{ 
          cursor: isPanning ? 'grabbing' : (lastPosRef.current ? 'grab' : 'default'),
        }}
      >
        <canvas ref={canvasRef} />
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onAction={handleContextMenuAction}
            canvas={fabricCanvasRef.current}
          />
        )}
        {dimensions && <DimensionsLabel {...dimensions} />}
      </div>
      
      <ZoomControls 
        zoom={zoom} 
        onZoomChange={handleZoomChange} 
        onResetView={handleResetView} 
      />
    </div>
  );
}