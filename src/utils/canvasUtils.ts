import { fabric } from 'fabric';

export const GRID_SIZE = 10;

export const createGrid = (
  width: number,
  height: number,
  offsetX: number = 0,
  offsetY: number = 0
) => {
  const gridLines: fabric.Line[] = [];

  // Create vertical lines
  for (let i = 0; i <= width; i += GRID_SIZE) {
    gridLines.push(new fabric.Line(
      [offsetX + i, offsetY, offsetX + i, offsetY + height],
      {
        stroke: '#ddd',
        selectable: false,
        evented: false,
        strokeWidth: i % 100 === 0 ? 2 : 1,
      }
    ));
  }

  // Create horizontal lines
  for (let i = 0; i <= height; i += GRID_SIZE) {
    gridLines.push(new fabric.Line(
      [offsetX, offsetY + i, offsetX + width, offsetY + i],
      {
        stroke: '#ddd',
        selectable: false,
        evented: false,
        strokeWidth: i % 100 === 0 ? 2 : 1,
      }
    ));
  }

  return gridLines;
};

export const snapToGrid = (
  target: fabric.Object,
  offsetX: number = 0,
  offsetY: number = 0
) => {
  const snapPoint = (value: number, offset: number) =>
    offset + Math.round((value - offset) / GRID_SIZE) * GRID_SIZE;

  target.set({
    left: snapPoint(target.left!, offsetX),
    top: snapPoint(target.top!, offsetY),
  });
};

export const handleKeyboardEvents = (canvas: fabric.Canvas, e: KeyboardEvent, canvasStateStack: CanvasStateStack) => {
  const activeObject = canvas.getActiveObject();

  // Don't handle keyboard events if we're editing text or focused on an input
  if (
    (activeObject instanceof fabric.IText && activeObject.isEditing) ||
    (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
  ) {
    return;
  }
  // Handle Ctrl+Z (Undo)
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    if (canvasStateStack.checkUndo()) {
      canvas.clear();
      canvas.loadFromJSON(canvasStateStack.undo(), function () {
        canvas.renderAll();
      });
      canvas.requestRenderAll();
    }
  }

  // Handle Ctrl+Y (Redo)
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    if (canvasStateStack.checkRedo()) {
      canvas.clear();
      canvas.loadFromJSON(canvasStateStack.redo(), function () {
        canvas.renderAll();
      });
      canvas.requestRenderAll();
    }
  }

  // Handle Delete/Backspace only when an object is selected
  if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
    e.preventDefault();
    const activeObjects = canvas.getActiveObjects();
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  // Handle + and - for zooming
  if (e.key === '=' || e.key === '+') {
    e.preventDefault();
    const zoom = canvas.getZoom();
    canvas.setZoom(Math.min(5, zoom + 0.1));
    canvas.requestRenderAll();
  }

  if (e.key === '-' || e.key === '_') {
    e.preventDefault();
    const zoom = canvas.getZoom();
    canvas.setZoom(Math.max(0.1, zoom - 0.1));
    canvas.requestRenderAll();
  }

  // Handle 0 to reset zoom and position
  if (e.key === '0') {
    e.preventDefault();
    canvas.setZoom(1);
    canvas.viewportTransform![4] = 0;
    canvas.viewportTransform![5] = 0;
    canvas.requestRenderAll();
  }
};

export interface ExportFormat {
  name: string;
  width: number;
  height: number;
  description: string;
}

export const EXPORT_FORMATS: ExportFormat[] = [
  { name: 'original', width: 0, height: 0, description: 'Original Size' },
  { name: 'instagram-square', width: 1080, height: 1080, description: 'Instagram Square (1:1)' },
  { name: 'instagram-portrait', width: 1080, height: 1350, description: 'Instagram Portrait (4:5)' },
  { name: 'instagram-landscape', width: 1080, height: 608, description: 'Instagram Landscape (1.91:1)' },
  { name: 'facebook-profile', width: 170, height: 170, description: 'Facebook Profile Picture' },
  { name: 'facebook-cover', width: 851, height: 315, description: 'Facebook Cover Photo' },
  { name: 'twitter-profile', width: 400, height: 400, description: 'Twitter Profile Picture' },
  { name: 'twitter-header', width: 1500, height: 500, description: 'Twitter Header' },
  { name: 'youtube-channel', width: 800, height: 800, description: 'YouTube Channel Picture' },
  { name: 'linkedin-profile', width: 400, height: 400, description: 'LinkedIn Profile Picture' },
  { name: 'linkedin-cover', width: 1584, height: 396, description: 'LinkedIn Cover Photo' }
];

export class CanvasStateStack {
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private readonly maxStackSize = 50;

  public save(data: string) {
    // Add to undo stack
    this.undoStack.push(data);

    // Clear redo stack since we have a new state
    this.redoStack = [];

    // Remove oldest state if stack gets too big
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

  }

  public undo(): string | null {
    if (this.undoStack.length <= 1) return null;

    // Move current state to redo stack
    const currentState = this.undoStack.pop();
    if (currentState) this.redoStack.push(currentState);
    console.log('redoStack', this.redoStack);
    // Return previous state
    return this.undoStack[this.undoStack.length - 1];
  }

  public redo(): string | null {
    console.log('redoStack', this.redoStack);
    if (this.redoStack.length === 0) return null;

    // Get next state from redo stack
    const nextState = this.redoStack.pop();
    if (!nextState) return null;

    // Add it to undo stack
    this.undoStack.push(nextState);

    // Return the state
    return nextState;
  }

  public checkUndo(): boolean {
    return this.undoStack.length > 1;
  }

  public checkRedo(): boolean {
    return this.redoStack.length >= 0;
  }
}



export const exportCanvas = (canvas: fabric.Canvas, format: ExportFormat) => {
  if (!canvas) return;

  // Find the canvas area rectangle
  const canvasArea = canvas.getObjects().find(obj =>
    obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
  ) as fabric.Rect | undefined;

  if (!canvasArea) return;

  // Get the actual canvas dimensions
  const actualWidth = canvasArea.width!;
  const actualHeight = canvasArea.height!;
  const canvasLeft = canvasArea.left!;
  const canvasTop = canvasArea.top!;

  // Store original canvas state
  const originalVisibility = canvasArea.visible;

  // Temporarily hide grid lines and canvas area
  const gridLines = canvas.getObjects().filter(obj =>
    obj instanceof fabric.Line && !obj.selectable
  );
  const gridVisibility = gridLines.map(line => line.visible);
  gridLines.forEach(line => line.set('visible', false));
  canvasArea.set('visible', false);

  // If using original size, export as is
  if (format.name === 'original') {
    // Create a temporary canvas for the export
    const tempCanvas = new fabric.Canvas(document.createElement('canvas'));
    tempCanvas.setWidth(actualWidth);
    tempCanvas.setHeight(actualHeight);

    // Clone all objects to the temporary canvas
    const objects = canvas.getObjects().filter(obj =>
      obj.selectable !== false // Exclude non-selectable objects (grid, canvas area)
    );

    const clonedObjects: fabric.Object[] = [];
    let objectsProcessed = 0;

    objects.forEach(obj => {
      obj.clone((cloned: fabric.Object) => {
        // Adjust position relative to the canvas area
        cloned.set({
          left: (obj.left! - canvasLeft),
          top: (obj.top! - canvasTop)
        });

        clonedObjects.push(cloned);
        objectsProcessed++;

        // When all objects are processed, add them to the temp canvas
        if (objectsProcessed === objects.length) {
          tempCanvas.add(...clonedObjects);

          // Export after objects are added
          setTimeout(() => {
            const dataURL = tempCanvas.toDataURL({
              format: 'png',
              quality: 1
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `logo-${format.name}.png`;
            link.href = dataURL;
            link.click();

            // Clean up
            tempCanvas.dispose();

            // Restore original canvas state
            gridLines.forEach((line, i) => line.set('visible', gridVisibility[i]));
            canvasArea.set('visible', originalVisibility);
            canvas.requestRenderAll();
          }, 100);
        }
      });
    });

    // If there are no objects, just export the empty canvas
    if (objects.length === 0) {
      const dataURL = tempCanvas.toDataURL({
        format: 'png',
        quality: 1
      });

      const link = document.createElement('a');
      link.download = `logo-${format.name}.png`;
      link.href = dataURL;
      link.click();

      tempCanvas.dispose();

      // Restore original canvas state
      gridLines.forEach((line, i) => line.set('visible', gridVisibility[i]));
      canvasArea.set('visible', originalVisibility);
      canvas.requestRenderAll();
    }
  } else {
    // Create a temporary canvas for the export with the target dimensions
    const tempCanvas = new fabric.Canvas(document.createElement('canvas'));
    tempCanvas.setWidth(format.width);
    tempCanvas.setHeight(format.height);

    // Calculate scaling to fit the content
    const scaleX = format.width / actualWidth;
    const scaleY = format.height / actualHeight;
    const scale = Math.min(scaleX, scaleY);

    // Center the content
    const left = (format.width - (actualWidth * scale)) / 2;
    const top = (format.height - (actualHeight * scale)) / 2;

    // Clone all objects to the temporary canvas
    const objects = canvas.getObjects().filter(obj =>
      obj.selectable !== false // Exclude non-selectable objects (grid, canvas area)
    );

    const clonedObjects: fabric.Object[] = [];
    let objectsProcessed = 0;

    objects.forEach(obj => {
      obj.clone((cloned: fabric.Object) => {
        // Adjust position relative to the canvas area and apply scaling
        cloned.scale(scale);
        cloned.set({
          left: left + ((obj.left! - canvasLeft) * scale),
          top: top + ((obj.top! - canvasTop) * scale)
        });

        clonedObjects.push(cloned);
        objectsProcessed++;

        // When all objects are processed, add them to the temp canvas
        if (objectsProcessed === objects.length) {
          tempCanvas.add(...clonedObjects);

          // Export after objects are added
          setTimeout(() => {
            const dataURL = tempCanvas.toDataURL({
              format: 'png',
              quality: 1
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `logo-${format.name}.png`;
            link.href = dataURL;
            link.click();

            // Clean up
            tempCanvas.dispose();

            // Restore original canvas state
            gridLines.forEach((line, i) => line.set('visible', gridVisibility[i]));
            canvasArea.set('visible', originalVisibility);
            canvas.requestRenderAll();
          }, 100);
        }
      });
    });

    // If there are no objects, just export the empty canvas
    if (objects.length === 0) {
      const dataURL = tempCanvas.toDataURL({
        format: 'png',
        quality: 1
      });

      const link = document.createElement('a');
      link.download = `logo-${format.name}.png`;
      link.href = dataURL;
      link.click();

      tempCanvas.dispose();

      // Restore original canvas state
      gridLines.forEach((line, i) => line.set('visible', gridVisibility[i]));
      canvasArea.set('visible', originalVisibility);
      canvas.requestRenderAll();
    }
  }
};