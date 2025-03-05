import { fabric } from 'fabric';

let isDrawing = false;
let startPoint: { x: number; y: number } | null = null;
let drawingLine: fabric.Line | null = null;
let isDrawingMode = false;

export const toggleLineDrawing = (canvas: fabric.Canvas, enabled: boolean, color: string) => {
  if (!canvas) return;

  isDrawingMode = enabled;

  canvas.selection = !enabled;
  canvas.forEachObject((obj) => {
    if (obj.selectable) {
      obj.selectable = !enabled;
      obj.evented = !enabled;
    }
  });

  if (enabled) {
    canvas.on('mouse:down', startDrawing);
    canvas.on('mouse:move', drawLine);
    canvas.on('mouse:up', finishDrawing);
  } else {
    canvas.off('mouse:down', startDrawing);
    canvas.off('mouse:move', drawLine);
    canvas.off('mouse:up', finishDrawing);

    isDrawing = false;
    startPoint = null;
    if (drawingLine) {
      canvas.remove(drawingLine);
      drawingLine = null;
    }

    canvas.forEachObject((obj) => {
      if (!(obj instanceof fabric.Line && !obj.selectable)) {
        obj.selectable = true;
        obj.evented = true;
      }
    });
  }

  function startDrawing(event: fabric.IEvent) {
    if (!isDrawingMode) return;

    isDrawing = true;
    const pointer = canvas.getPointer(event.e);
    startPoint = { x: pointer.x, y: pointer.y };

    drawingLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: color,
      strokeWidth: 2,
      selectable: true,
      evented: true,
    });

    canvas.add(drawingLine);
  }

  function drawLine(event: fabric.IEvent) {
    if (!isDrawingMode || !isDrawing || !drawingLine || !startPoint) return;

    const pointer = canvas.getPointer(event.e);
    drawingLine.set({
      x2: pointer.x,
      y2: pointer.y
    });
    canvas.requestRenderAll();
  }

  function finishDrawing() {
    if (!isDrawingMode) return;

    isDrawing = false;
    if (drawingLine) {
      canvas.setActiveObject(drawingLine);
      canvas.fire('selection:created', { selected: [drawingLine] });
    }
    startPoint = null;
    drawingLine = null;
  }
};

export const deleteSelected = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  const activeObjects = canvas.getActiveObjects();
  canvas.remove(...activeObjects);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

export const duplicateSelected = (canvas: fabric.Canvas) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  // Store original object properties
  const originalLeft = activeObject.left;
  const originalTop = activeObject.top;
  const originalScaleX = activeObject.scaleX;
  const originalScaleY = activeObject.scaleY;
  const originalWidth = activeObject.width;
  const originalHeight = activeObject.height;

  // Clone the object with a promise to ensure proper handling
  return new Promise<void>((resolve) => {
    activeObject.clone((cloned: fabric.Object) => {
      const offset = 20;
      let newLeft: number;
      let newTop: number;

      if (activeObject instanceof fabric.Line) {
        // For lines, calculate the actual dimensions
        const dx = activeObject.x2! - activeObject.x1!;
        const dy = activeObject.y2! - activeObject.y1!;

        // Calculate new starting point
        newLeft = originalLeft! + offset;
        newTop = originalTop! + offset;

        // Ensure the line stays within canvas bounds
        if (newLeft + dx > canvas.width!) {
          newLeft = originalLeft! - offset;
        }
        if (newTop + dy > canvas.height!) {
          newTop = originalTop! - offset;
        }

        // Set new coordinates for the line
        (cloned as fabric.Line).set({
          x1: newLeft,
          y1: newTop,
          x2: newLeft + dx,
          y2: newTop + dy,
          left: newLeft,
          top: newTop
        });
      } else {
        // For other objects, calculate dimensions with scale
        const objectWidth = originalWidth! * (originalScaleX || 1);
        const objectHeight = originalHeight! * (originalScaleY || 1);

        // Calculate new position
        newLeft = originalLeft! + offset;
        newTop = originalTop! + offset;

        // Adjust position if it would go outside the canvas
        if (newLeft + objectWidth > canvas.width!) {
          newLeft = originalLeft! - offset;
        }
        if (newTop + objectHeight > canvas.height!) {
          newTop = originalTop! - offset;
        }

        // Ensure the object doesn't go beyond the left or top edges
        newLeft = Math.max(0, Math.min(canvas.width! - objectWidth, newLeft));
        newTop = Math.max(0, Math.min(canvas.height! - objectHeight, newTop));

        // Set the position of the cloned object
        cloned.set({
          left: newLeft,
          top: newTop,
          scaleX: originalScaleX,
          scaleY: originalScaleY
        });
      }

      // Ensure the object is interactive
      cloned.set({
        evented: true,
        selectable: true,
        hasControls: true,
        hasBorders: true
      });

      // If it's a group, ensure all objects in the group are interactive
      if (cloned instanceof fabric.Group) {
        cloned.getObjects().forEach((obj) => {
          obj.set({
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true
          });
        });
      }

      // Add the cloned object to the canvas
      canvas.add(cloned);

      // Deselect the original object and select the clone
      canvas.discardActiveObject();
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();

      resolve();
    });
  });
};