import { fabric } from 'fabric';

export const moveToFront = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  activeObject.bringToFront();
  canvas.requestRenderAll();
};

export const moveForward = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  activeObject.bringForward();
  canvas.requestRenderAll();
};

export const moveToBack = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  activeObject.sendToBack();
  canvas.requestRenderAll();
};

export const moveBackward = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  activeObject.sendBackwards();
  canvas.requestRenderAll();
};