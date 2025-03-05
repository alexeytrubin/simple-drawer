import { fabric } from 'fabric';

export interface DrawingOptions {
  color: string;
  width: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export const enableBrushTool = (
  canvas: fabric.Canvas | null,
  options: DrawingOptions
) => {
  if (!canvas) return;

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = options.color;
  canvas.freeDrawingBrush.width = options.width;
  canvas.freeDrawingBrush.strokeLineCap = 'round';
  canvas.freeDrawingBrush.strokeLineJoin = 'round';

  if (options.shadow) {
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: options.shadow.color,
      blur: options.shadow.blur,
      offsetX: options.shadow.offsetX,
      offsetY: options.shadow.offsetY,
      affectStroke: true,
    });
  }
};

export const enablePencilTool = (
  canvas: fabric.Canvas | null,
  options: DrawingOptions
) => {
  if (!canvas) return;

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = options.color;
  canvas.freeDrawingBrush.width = options.width;
  canvas.freeDrawingBrush.strokeLineCap = 'square';
  canvas.freeDrawingBrush.strokeLineJoin = 'miter';

  if (options.shadow) {
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: options.shadow.color,
      blur: options.shadow.blur,
      offsetX: options.shadow.offsetX,
      offsetY: options.shadow.offsetY,
      affectStroke: true,
    });
  }
};

export const enableSprayBrush = (
  canvas: fabric.Canvas | null,
  options: DrawingOptions
) => {
  if (!canvas) return;

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.SprayBrush();
  canvas.freeDrawingBrush.color = options.color;
  canvas.freeDrawingBrush.width = options.width * 5; // Spray brush needs a larger width
  (canvas.freeDrawingBrush as fabric.SprayBrush).density = 20;
  (canvas.freeDrawingBrush as fabric.SprayBrush).dotWidth = options.width / 2;
  (canvas.freeDrawingBrush as fabric.SprayBrush).dotWidthVariance = options.width / 4;
  (canvas.freeDrawingBrush as fabric.SprayBrush).randomOpacity = true;

  if (options.shadow) {
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: options.shadow.color,
      blur: options.shadow.blur,
      offsetX: options.shadow.offsetX,
      offsetY: options.shadow.offsetY,
      affectStroke: true,
    });
  }
};

export const enableCircleBrush = (
  canvas: fabric.Canvas | null,
  options: DrawingOptions
) => {
  if (!canvas) return;

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
  canvas.freeDrawingBrush.color = options.color;
  canvas.freeDrawingBrush.width = options.width;

  if (options.shadow) {
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: options.shadow.color,
      blur: options.shadow.blur,
      offsetX: options.shadow.offsetX,
      offsetY: options.shadow.offsetY,
      affectStroke: true,
    });
  }
};

// Create pattern brushes based on the provided example code
export const createPatternBrushes = (canvas: fabric.Canvas) => {
  if (!fabric.PatternBrush) return null;

  // Vertical line pattern brush (appears as horizontal lines when drawn)
  const vLinePatternBrush = new fabric.PatternBrush(canvas);
  vLinePatternBrush.getPatternSrc = function () {
    const patternCanvas = fabric.util.createCanvasElement();
    patternCanvas.width = patternCanvas.height = 10;
    const ctx = patternCanvas.getContext('2d');

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };

  // Horizontal line pattern brush (appears as vertical lines when drawn)
  const hLinePatternBrush = new fabric.PatternBrush(canvas);
  hLinePatternBrush.getPatternSrc = function () {
    const patternCanvas = fabric.util.createCanvasElement();
    patternCanvas.width = patternCanvas.height = 10;
    const ctx = patternCanvas.getContext('2d');

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.stroke();

    return patternCanvas;
  };

  // Square pattern brush
  const squarePatternBrush = new fabric.PatternBrush(canvas);
  squarePatternBrush.getPatternSrc = function () {
    const squareWidth = 10;
    const squareDistance = 2;

    const patternCanvas = fabric.util.createCanvasElement();
    patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
    const ctx = patternCanvas.getContext('2d');

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, squareWidth, squareWidth);

    return patternCanvas;
  };

  // Diamond pattern brush
  const diamondPatternBrush = new fabric.PatternBrush(canvas);
  diamondPatternBrush.getPatternSrc = function () {
    const squareWidth = 10;
    const squareDistance = 5;
    const patternCanvas = fabric.util.createCanvasElement();
    const rect = new fabric.Rect({
      width: squareWidth,
      height: squareWidth,
      angle: 45,
      fill: this.color
    });

    const canvasWidth = rect.getBoundingRect().width;

    patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
    rect.set({
      left: canvasWidth / 2,
      top: canvasWidth / 2
    });

    const ctx = patternCanvas.getContext('2d');
    rect.render(ctx);

    return patternCanvas;
  };

  return {
    vLinePatternBrush,
    hLinePatternBrush,
    squarePatternBrush,
    diamondPatternBrush
  };
};

export const enablePatternBrush = (
  canvas: fabric.Canvas | null,
  options: DrawingOptions,
  patternType: 'vline' | 'hline' | 'square' | 'diamond'
) => {
  if (!canvas) return;

  // Create pattern brushes if they don't exist
  const brushes = createPatternBrushes(canvas);
  if (!brushes) return;

  // Select the appropriate brush
  let brush;
  switch (patternType) {
    case 'vline':
      brush = brushes.vLinePatternBrush;
      break;
    case 'hline':
      brush = brushes.hLinePatternBrush;
      break;
    case 'square':
      brush = brushes.squarePatternBrush;
      break;
    case 'diamond':
      brush = brushes.diamondPatternBrush;
      break;
    default:
      brush = brushes.vLinePatternBrush;
  }

  // Set brush properties
  brush.color = options.color;
  brush.width = options.width;

  if (options.shadow) {
    brush.shadow = new fabric.Shadow({
      color: options.shadow.color,
      blur: options.shadow.blur,
      offsetX: options.shadow.offsetX,
      offsetY: options.shadow.offsetY,
      affectStroke: true,
    });
  }

  // Enable drawing mode with the pattern brush
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = brush;
};

export const disableDrawingMode = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  canvas.isDrawingMode = false;
};

export const clearCanvas = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;

  // Find the canvas area rectangle
  const canvasArea = canvas.getObjects().find(obj =>
    obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
  ) as fabric.Rect | undefined;

  // Find grid lines
  const gridLines = canvas.getObjects().filter(obj =>
    obj instanceof fabric.Line && !obj.selectable
  );

  // Remove all objects except the canvas area and grid lines
  const objectsToRemove = canvas.getObjects().filter(obj =>
    obj !== canvasArea && !gridLines.includes(obj)
  );

  canvas.remove(...objectsToRemove);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

export const updateBrushSettings = (
  canvas: fabric.Canvas | null,
  options: Partial<DrawingOptions>
) => {
  if (!canvas || !canvas.freeDrawingBrush) return;

  if (options.color !== undefined) {
    canvas.freeDrawingBrush.color = options.color;
  }

  if (options.width !== undefined) {
    canvas.freeDrawingBrush.width = options.width;

    // Update specific brush properties
    if (canvas.freeDrawingBrush instanceof fabric.SprayBrush) {
      (canvas.freeDrawingBrush as fabric.SprayBrush).dotWidth = options.width / 2;
      (canvas.freeDrawingBrush as fabric.SprayBrush).dotWidthVariance = options.width / 4;
    }
  }

  if (options.shadow) {
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      color: options.shadow.color || '#000000',
      blur: options.shadow.blur || 0,
      offsetX: options.shadow.offsetX || 0,
      offsetY: options.shadow.offsetY || 0,
      affectStroke: true,
    });
  }
};