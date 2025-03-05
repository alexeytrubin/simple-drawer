import { fabric } from 'fabric';
import { GRID_SIZE } from '../canvasUtils';

export const handleObjectScaling = (
  target: fabric.Object,
  originalScale: { scaleX: number; scaleY: number; left: number; top: number },
  isCorner: boolean,
  canvas: fabric.Canvas
) => {
  // Calculate the original center point
  const originalCenter = {
    x: originalScale.left + (target.width! * originalScale.scaleX!) / 2,
    y: originalScale.top + (target.height! * originalScale.scaleY!) / 2
  };

  if (target instanceof fabric.Circle) {
    const maxScale = Math.max(Math.abs(target.scaleX!), Math.abs(target.scaleY!));
    const newRadius = target.radius! * maxScale;
    target.set({
      radius: newRadius,
      scaleX: 1,
      scaleY: 1
    });
  } else if (target instanceof fabric.Ellipse) {
    const scaleX = Math.abs(target.scaleX!);
    const scaleY = Math.abs(target.scaleY!);
    target.set({
      rx: target.rx! * scaleX,
      ry: target.ry! * scaleY,
      scaleX: 1,
      scaleY: 1
    });
  } else if (target instanceof fabric.Polygon) {
    const scaleX = Math.abs(target.scaleX!);
    const scaleY = Math.abs(target.scaleY!);
    const points = target.points!.map(point => ({
      x: point.x * scaleX,
      y: point.y * scaleY
    }));
    target.set({
      points: points,
      scaleX: 1,
      scaleY: 1,
      width: target.width! * scaleX,
      height: target.height! * scaleY
    });
  } else {
    const width = target.getScaledWidth();
    const height = target.getScaledHeight();
    target.set({
      width: Math.round(width / GRID_SIZE) * GRID_SIZE,
      height: Math.round(height / GRID_SIZE) * GRID_SIZE,
      scaleX: 1,
      scaleY: 1
    });
  }

  // If scaling from a corner, maintain the center point
  if (isCorner) {
    target.set({
      left: originalCenter.x - (target.width! * target.scaleX!) / 2,
      top: originalCenter.y - (target.height! * target.scaleY!) / 2
    });
  }

  canvas.requestRenderAll();
};