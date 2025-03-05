import React, { useState } from 'react';
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  AlignStartVertical,
  CopyIcon
} from 'lucide-react';
import { fabric } from 'fabric';

interface AlignmentToolbarProps {
  canvas: fabric.Canvas | null;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function AlignmentToolbar({ canvas }: AlignmentToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const alignObject = (alignType: string) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const objectBounds = activeObject.getBoundingRect(true);
    
    // Find the canvas area rectangle
    const canvasArea = canvas.getObjects().find(obj => 
      obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
    ) as fabric.Rect | undefined;

    console.log('canvasArea', canvasArea);
    
    let canvasLeft = 0;
    let canvasTop = 0;
    let canvasWidth = canvas.width!;
    let canvasHeight = canvas.height!;

    // If we have a canvas area, use its dimensions
    if (canvasArea) {
      canvasLeft = canvasArea.left!;
      canvasTop = canvasArea.top!;
      canvasWidth = canvasArea.width!;
      canvasHeight = canvasArea.height!;
    }
    
    const canvasCenter = {
      x: canvasLeft + canvasWidth / 2,
      y: canvasTop + canvasHeight / 2
    };

    let left = activeObject.left;
    let top = activeObject.top;

    if (activeObject.group) {
      // If object is in a group, align relative to group bounds
      const groupBounds = activeObject.group.getBoundingRect(true);
      switch (alignType) {
        case 'left':
          left = groupBounds.left;
          break;
        case 'center':
          left = groupBounds.left + (groupBounds.width / 2) - (objectBounds.width / 2);
          break;
        case 'right':
          left = groupBounds.left + groupBounds.width - objectBounds.width;
          break;
        case 'top':
          top = groupBounds.top;
          break;
        case 'middle':
          top = groupBounds.top + (groupBounds.height / 2) - (objectBounds.height / 2);
          break;
        case 'bottom':
          top = groupBounds.top + groupBounds.height - objectBounds.height;
          break;
      }
    } else {
      // If object is on canvas, align relative to canvas bounds
      switch (alignType) {
        case 'left':
          left = canvasLeft;
          break;
        case 'center':
          left = canvasCenter.x - objectBounds.width / 2;
          break;
        case 'right':
          left = canvasLeft + canvasWidth - objectBounds.width;
          break;
        case 'top':
          top = canvasTop;
          break;
        case 'middle':
          top = canvasCenter.y - objectBounds.height / 2;
          break;
        case 'bottom':
          top = canvasTop + canvasHeight - objectBounds.height;
          break;
      }
    }

    activeObject.set({
      left: left,
      top: top
    });
    canvas.fire('object:modified');
    canvas.requestRenderAll();
    setShowMenu(false);
  };

  const createSymmetry = (axis: 'horizontal' | 'vertical') => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Find the canvas area rectangle
    const canvasArea = canvas.getObjects().find(obj => 
      obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
    ) as fabric.Rect | undefined;
    
    let canvasLeft = 0;
    let canvasTop = 0;
    let canvasWidth = canvas.width!;
    let canvasHeight = canvas.height!;

    // If we have a canvas area, use its dimensions
    if (canvasArea) {
      canvasLeft = canvasArea.left!;
      canvasTop = canvasArea.top!;
      canvasWidth = canvasArea.width!;
      canvasHeight = canvasArea.height!;
    }
    
    const canvasCenter = {
      x: canvasLeft + canvasWidth / 2,
      y: canvasTop + canvasHeight / 2
    };

    // Clone the object
    activeObject.clone((clonedObj: fabric.Object) => {
      // Calculate the distance from center
      const objectLeft = activeObject.left!;
      const objectTop = activeObject.top!;
      const distanceFromCenterY = objectTop - canvasCenter.y;
      
      // Get object dimensions
      const objectWidth = activeObject.getScaledWidth();
      const objectHeight = activeObject.getScaledHeight();
      
      // Position on the opposite side with the same distance from center
      let newLeft, newTop;
      
      if (axis === 'horizontal') {
        // For horizontal mirroring, calculate the position from the right side of the canvas
        // The formula: 2 * canvasCenter.x - objectLeft - objectWidth
        newLeft = 2 * canvasCenter.x - objectLeft - objectWidth;
        newTop = objectTop;
        clonedObj.set('flipX', !activeObject.flipX);
      } else { // vertical
        // For vertical mirroring, we need to account for the height
        newLeft = objectLeft;
        newTop = canvasCenter.y - distanceFromCenterY - objectHeight;
        clonedObj.set('flipY', !activeObject.flipY);
      }
      
      // Set the position and other properties
      clonedObj.set({
        left: newLeft,
        top: newTop,
        originX: activeObject.originX,
        originY: activeObject.originY,
        angle: activeObject.angle,
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY
      });
      
      // For groups, we need to handle them differently
      if (activeObject instanceof fabric.Group) {
        // Create a new group with the same properties
        const objects = (clonedObj as fabric.Group).getObjects();
        canvas.discardActiveObject(); // Important to prevent issues
        
        // Add all objects from the cloned group
        objects.forEach(obj => {
          canvas.add(obj);
        });
        
        // Create a new group from these objects
        const newGroup = new fabric.Group(objects, {
          left: newLeft,
          top: newTop,
          originX: activeObject.originX,
          originY: activeObject.originY,
          angle: activeObject.angle,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          flipX: axis === 'horizontal' ? !activeObject.flipX : activeObject.flipX,
          flipY: axis === 'vertical' ? !activeObject.flipY : activeObject.flipY
        });
        
        canvas.add(newGroup);
        canvas.setActiveObject(newGroup);
      } else {
        // For regular objects, just add them
        canvas.add(clonedObj);
        canvas.setActiveObject(clonedObj);
      }
      
      canvas.requestRenderAll();
    });
    
    setShowMenu(false);
  };

  const handleButtonClick = () => {
    setMenuPosition({ x: 50, y: 0 });
    setShowMenu(!showMenu);
  };

  const buttonClass = "p-1.5 hover:bg-gray-100 rounded-lg transition-colors";
  const menuItemClass = "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer";

  return (
    <div className="relative">
      <div className="flex gap-1 items-center">
        <span className="text-sm text-gray-600 mr-1">Align:</span>
        <button
          onClick={handleButtonClick}
          className={buttonClass}
          title="Alignment Options"
        >
          <AlignStartVertical className="w-4 h-4" />
        </button>
      </div>

      {showMenu && (
        <div 
          className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className={menuItemClass} onClick={() => alignObject('left')}>
            <AlignHorizontalJustifyStartIcon className="w-4 h-4" />
            <span>Align Left</span>
          </div>
          <div className={menuItemClass} onClick={() => alignObject('center')}>
            <AlignHorizontalJustifyCenterIcon className="w-4 h-4" />
            <span>Align Center</span>
          </div>
          <div className={menuItemClass} onClick={() => alignObject('right')}>
            <AlignHorizontalJustifyEndIcon className="w-4 h-4" />
            <span>Align Right</span>
          </div>
          <div className="h-px bg-gray-200 my-1" />
          <div className={menuItemClass} onClick={() => alignObject('top')}>
            <AlignVerticalJustifyStartIcon className="w-4 h-4" />
            <span>Align Top</span>
          </div>
          <div className={menuItemClass} onClick={() => alignObject('middle')}>
            <AlignVerticalJustifyCenterIcon className="w-4 h-4" />
            <span>Align Middle</span>
          </div>
          <div className={menuItemClass} onClick={() => alignObject('bottom')}>
            <AlignVerticalJustifyEndIcon className="w-4 h-4" />
            <span>Align Bottom</span>
          </div>
          
          <div className="h-px bg-gray-200 my-1" />
          <div className={menuItemClass} onClick={() => createSymmetry('horizontal')}>
            <CopyIcon className="w-4 h-4" />
            <span>Mirror Horizontally</span>
          </div>
          <div className={menuItemClass} onClick={() => createSymmetry('vertical')}>
            <CopyIcon className="w-4 h-4 rotate-90" />
            <span>Mirror Vertically</span>
          </div>
        </div>
      )}
    </div>
  );
}