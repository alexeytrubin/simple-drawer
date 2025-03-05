import { fabric } from 'fabric';

export const configureControls = () => {
  // Configure control points
  fabric.Object.prototype.controls = {
    ...fabric.Object.prototype.controls,
    mtr: new fabric.Control({ // Rotation control
      x: 0,
      y: -0.5,
      offsetY: -40,
      cursorStyle: 'crosshair',
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
    }),
    tl: new fabric.Control({ // Top-left corner
      x: -0.5,
      y: -0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
    }),
    tr: new fabric.Control({ // Top-right corner
      x: 0.5,
      y: -0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
    }),
    bl: new fabric.Control({ // Bottom-left corner
      x: -0.5,
      y: 0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
    }),
    br: new fabric.Control({ // Bottom-right corner
      x: 0.5,
      y: 0.5,
      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingEqually,
    }),
  };

  // Customize control rendering
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = '#00a0f5';
  fabric.Object.prototype.cornerStrokeColor = '#0063d1';
  fabric.Object.prototype.cornerSize = 10;
  fabric.Object.prototype.padding = 5;
};