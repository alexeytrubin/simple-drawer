import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Header } from './components/Header';
import { MainCanvas } from './components/MainCanvas';
import { CanvasSizeDialog } from './components/CanvasSizeDialog';
import { ProjectSelector } from './components/ProjectSelector';
import { saveProject, loadProject, createNewProject, getSavedProjects } from './utils/projectUtils';
import { ShapeProperties } from './components/ShapeProperties';

function App() {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
  const [currentColor, setCurrentColor] = useState('#4f46e5');
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentFontSize, setCurrentFontSize] = useState(40);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);
  const [gradient, setGradient] = useState({ color1: '#4f46e5', color2: '#9333ea' });
  const [showShapeProperties, setShowShapeProperties] = useState(false);
  const [showGradient, setShowGradient] = useState(false);
  const [objectSize, setObjectSize] = useState({ width: 100, height: 100 });
  const [isCircle, setIsCircle] = useState(false);
  const [projectMenu, setProjectMenu] = useState<{ x: number; y: number } | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [showSizeDialog, setShowSizeDialog] = useState(true);
  const [showProjectSelector, setShowProjectSelector] = useState(true);

  useEffect(() => {
    const projects = getSavedProjects();
    setSavedProjects(projects);
    
    if (projects.length === 0) {
      setShowProjectSelector(false);
    } else {
      setShowSizeDialog(false);
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const updateProperties = (obj: fabric.Object | undefined) => {
      if (!obj) {
        setShowShapeProperties(false);
        setIsTextSelected(false);
        return;
      }

      setShowShapeProperties(true);
      setStrokeWidth(obj.strokeWidth || 0);
      setStrokeColor(obj.stroke as string || '#000000');
      setOpacity(obj.opacity || 1);
      
      setIsTextSelected('text' in obj || obj instanceof fabric.IText);
      
      if (obj instanceof fabric.Circle) {
        setIsCircle(true);
        const diameter = obj.radius! * 2;
        setObjectSize({ width: diameter, height: diameter });
      } else {
        setIsCircle(false);
        setObjectSize({
          width: obj.width! * obj.scaleX!,
          height: obj.height! * obj.scaleY!
        });
      }
      
      if ('fill' in obj) {
        setCurrentColor(obj.fill as string);
        if (obj.fill instanceof fabric.Gradient) {
          setShowGradient(true);
          const colorStops = obj.fill.colorStops;
          setGradient({
            color1: colorStops![0].color,
            color2: colorStops![colorStops!.length - 1].color
          });
        } else {
          setShowGradient(false);
        }
      }

      if ('fontFamily' in obj && 'fontSize' in obj) {
        setCurrentFont(obj.fontFamily as string);
        setCurrentFontSize(obj.fontSize as number);
      }
    };

    canvas.on('selection:created', (e) => updateProperties(e.selected?.[0]));
    canvas.on('selection:updated', (e) => updateProperties(e.selected?.[0]));
    canvas.on('selection:cleared', () => updateProperties(undefined));
    canvas.on('object:modified', (e) => {
      if (e.target) {
        updateProperties(e.target);
      }
    });
  }, [canvas]);

  const handleColorChange = (color: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && 'fill' in activeObject) {
      activeObject.set('fill', color);
      canvas.requestRenderAll();
    }
    setCurrentColor(color);
  };

  const handleFontChange = (font: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && 'fontFamily' in activeObject) {
      activeObject.set('fontFamily', font);
      canvas.requestRenderAll();
    }
    setCurrentFont(font);
  };

  const handleFontSizeChange = (size: number) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && 'fontSize' in activeObject) {
      activeObject.set('fontSize', size);
      canvas.requestRenderAll();
    }
    setCurrentFontSize(size);
  };

  const handleStrokeWidthChange = (width: number) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('strokeWidth', width);
      if (width > 0 && !activeObject.stroke) {
        activeObject.set('stroke', strokeColor);
      }
      canvas.requestRenderAll();
    }
    setStrokeWidth(width);
  };

  const handleStrokeColorChange = (color: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('stroke', color);
      canvas.requestRenderAll();
    }

    setStrokeColor(color);
  };

  const handleOpacityChange = (value: number) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('opacity', value);
      canvas.requestRenderAll();
    }
    setOpacity(value);
  };

  const handleGradientChange = (newGradient: { color1: string; color2: string }) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && 'fill' in activeObject) {
      const gradientFill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: activeObject.width!, y2: activeObject.height! },
        colorStops: [
          { offset: 0, color: newGradient.color1 },
          { offset: 1, color: newGradient.color2 }
        ]
      });
      activeObject.set('fill', gradientFill);
      canvas.requestRenderAll();
    }
    setGradient(newGradient);
  };

  const handleSizeChange = (newSize: { width: number; height: number }) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const centerX = activeObject.left! + (activeObject.width! * activeObject.scaleX!) / 2;
    const centerY = activeObject.top! + (activeObject.height! * activeObject.scaleY!) / 2;

    if (activeObject instanceof fabric.Circle) {
      const newRadius = newSize.width / 2;
      activeObject.set({
        radius: newRadius,
        left: centerX - newRadius,
        top: centerY - newRadius,
        scaleX: 1,
        scaleY: 1
      });
    } else if (activeObject instanceof fabric.Ellipse) {
      activeObject.set({
        rx: newSize.width / 2,
        ry: newSize.height / 2,
        left: centerX - newSize.width / 2,
        top: centerY - newSize.height / 2,
        scaleX: 1,
        scaleY: 1
      });
    } else {
      activeObject.set({
        width: newSize.width,
        height: newSize.height,
        left: centerX - newSize.width / 2,
        top: centerY - newSize.height / 2,
        scaleX: 1,
        scaleY: 1
      });
    }
    
    canvas.requestRenderAll();
    setObjectSize(newSize);
  };

  const handleProjectMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProjectMenu({ x: rect.right + 8, y: rect.top });
  };

  const handleSaveProject = () => {
    if (!canvas) return;
    
    const name = prompt('Enter a name for your project:');
    if (!name) return;
    
    saveProject(canvas, name);
    setSavedProjects(getSavedProjects());
    setProjectMenu(null);
  };

  const handleLoadProject = (name: string) => {
    if (!canvas) return;
    
    loadProject(canvas, name);
    setProjectMenu(null);
    setShowProjectSelector(false);
  };

  const handleNewProject = () => {
    setShowSizeDialog(true);
  };

  const handleCanvasSizeSelect = (width: number, height: number) => {
    setCanvasSize({ width, height });
    if (canvas) {
      createNewProject(canvas);
    }
    setShowSizeDialog(false);
    setShowProjectSelector(false);
  };

  if (!canvasSize && !showProjectSelector) {
    return (
      <CanvasSizeDialog
        onClose={() => setShowSizeDialog(false)}
        onSizeSelect={handleCanvasSizeSelect}
      />
    );
  }

  if (showProjectSelector) {
    return (
      <ProjectSelector
        onNewProject={() => {
          setShowProjectSelector(false);
          setShowSizeDialog(true);
        }}
        onLoadProject={handleLoadProject}
        savedProjects={savedProjects}
      />
    );
  }

  const shapePropertiesProps = {
    onStrokeWidthChange: handleStrokeWidthChange,
    onStrokeColorChange: handleStrokeColorChange,
    onOpacityChange: handleOpacityChange,
    onGradientChange: handleGradientChange,
    onSizeChange: handleSizeChange,
    strokeWidth,
    strokeColor,
    opacity,
    gradient,
    showGradient,
    objectSize,
    isCircle,
    canvas
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        onNewProject={handleNewProject}
        onProjectMenuClick={handleProjectMenuClick}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        onColorChange={handleColorChange}
        isTextSelected={isTextSelected}
        currentFont={currentFont}
        currentFontSize={currentFontSize}
        currentColor={currentColor}
        projectMenu={projectMenu}
        onProjectMenuClose={() => setProjectMenu(null)}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        savedProjects={savedProjects}
      />

       {showShapeProperties && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[72px] border-b border-gray-200 bg-white shadow-sm rounded-b-lg z-10 fit-content p-3">
          <ShapeProperties {...shapePropertiesProps} />
        </div>
      )}

      <MainCanvas
        canvas={canvas}
        onCanvasReady={setCanvas}
        currentColor={currentColor}
        canvasSize={canvasSize}
      />

      {showSizeDialog && (
        <CanvasSizeDialog
          onClose={() => setShowSizeDialog(false)}
          onSizeSelect={handleCanvasSizeSelect}
        />
      )}
    </div>
  );
}

export default App;