import { useState } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './toolbar/Toolbar';

interface MainCanvasProps {
  canvas: fabric.Canvas | null;
  onCanvasReady: (canvas: fabric.Canvas) => void;
  currentColor: string;
  canvasSize: { width: number; height: number } | null;
}

export function MainCanvas({
  canvas,
  onCanvasReady,
  currentColor,
  canvasSize
}: MainCanvasProps) {
  const [, setHasSelection] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      <Toolbar canvas={canvas} currentColor={currentColor} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="h-[calc(100vh-72px)] w-[calc(100vw-64px)]">
          {canvasSize && (
            <Canvas 
              onCanvasReady={onCanvasReady} 
              width={canvasSize.width} 
              height={canvasSize.height}
              onSelectionChange={setHasSelection}
            />
          )}
        </div>
      </main>
    </div>
  );
}