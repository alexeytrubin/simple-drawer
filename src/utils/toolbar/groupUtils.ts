import { fabric } from 'fabric';

/**
 * Groups selected objects in the canvas
 * @param canvas The Fabric.js canvas instance
 * @returns The newly created group or null if no objects are selected
 */
export const groupSelectedObjects = (canvas: fabric.Canvas | null): fabric.Group | null => {
  if (!canvas) return null;
  
  const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
  if (!activeSelection || !activeSelection.type || activeSelection.type !== 'activeSelection' || activeSelection.getObjects().length < 2) {
    return null;
  }
  
  // Create a group from the active selection
  const group = activeSelection.toGroup();
  
  // Ensure the group is selectable and has controls
  group.set({
    selectable: true,
    hasControls: true,
    lockScalingFlip: true,
  });
  
  // Update the canvas
  canvas.requestRenderAll();
  
  return group;
};

/**
 * Ungroups a selected group into individual objects
 * @param canvas The Fabric.js canvas instance
 * @returns Array of ungrouped objects or null if no group is selected
 */
export const ungroupSelectedObjects = (canvas: fabric.Canvas | null): fabric.Object[] | null => {
  if (!canvas) return null;
  
  const activeObject = canvas.getActiveObject();
  if (!activeObject || !(activeObject instanceof fabric.Group)) {
    return null;
  }
  
  // Ungroup the objects
  const ungroupedObjects = activeObject.toActiveSelection();
  
  // Ensure all objects are selectable and have controls
  ungroupedObjects.getObjects().forEach(obj => {
    obj.set({
      selectable: true,
      hasControls: true
    });
  });
  
  // Update the canvas
  canvas.requestRenderAll();
  
  return ungroupedObjects.getObjects();
};

/**
 * Checks if the current selection is a group
 * @param canvas The Fabric.js canvas instance
 * @returns Boolean indicating if the current selection is a group
 */
export const isGroupSelected = (canvas: fabric.Canvas | null): boolean => {
  if (!canvas) return false;
  
  const activeObject = canvas.getActiveObject();
  return activeObject instanceof fabric.Group && !(activeObject instanceof fabric.ActiveSelection);
};

/**
 * Checks if multiple objects are selected (active selection)
 * @param canvas The Fabric.js canvas instance
 * @returns Boolean indicating if multiple objects are selected
 */
export const isMultipleObjectsSelected = (canvas: fabric.Canvas | null): boolean => {
  if (!canvas) return false;
  
  const activeObject = canvas.getActiveObject();
  return activeObject instanceof fabric.ActiveSelection && activeObject.getObjects().length > 1;
};