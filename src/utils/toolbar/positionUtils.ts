import { fabric } from 'fabric';

export const duplicateInRow = (canvas: fabric.Canvas, count: number) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const spacing = 20;
  const objects: fabric.Object[] = [];

  for (let i = 1; i < count; i++) {
    const clone = fabric.util.object.clone(activeObject);
    clone.set({
      left: activeObject.left! + (activeObject.width! + spacing) * i * activeObject.scaleX!,
      top: activeObject.top,
    });
    objects.push(clone);
  }

  canvas.add(...objects);
  canvas.requestRenderAll();
};

export const duplicateInGrid = (canvas: fabric.Canvas, rows: number, cols: number) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const spacing = 20;
  const objects: fabric.Object[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 0 && col === 0) continue;
      const clone = fabric.util.object.clone(activeObject);
      clone.set({
        left: activeObject.left! + (activeObject.width! + spacing) * col * activeObject.scaleX!,
        top: activeObject.top! + (activeObject.height! + spacing) * row * activeObject.scaleY!,
      });
      objects.push(clone);
    }
  }

  canvas.add(...objects);
  canvas.requestRenderAll();
};