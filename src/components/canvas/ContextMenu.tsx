import React, { useRef, useEffect } from 'react';
import { ArrowUpToLine, MoveUp, MoveDown, ArrowDownToLine, Group, Ungroup } from 'lucide-react';
import { isGroupSelected, isMultipleObjectsSelected } from '../../utils/toolbar/groupUtils';
import { fabric } from 'fabric';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
  canvas: fabric.Canvas | null;
}

export function ContextMenu({ x, y, onClose, onAction, canvas }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isGroup = isGroupSelected(canvas);
  const isMultipleSelected = isMultipleObjectsSelected(canvas);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
  };

  const buttonClass = "w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 text-sm";

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-md shadow-lg border border-gray-200 py-1 w-[140px] z-50"
      style={menuStyle}
    >
      <button className={buttonClass} onClick={() => onAction('front')}>
        <ArrowUpToLine className="w-4 h-4" />
        <span>To Front</span>
      </button>
      <button className={buttonClass} onClick={() => onAction('forward')}>
        <MoveUp className="w-4 h-4" />
        <span>Forward</span>
      </button>
      <button className={buttonClass} onClick={() => onAction('backward')}>
        <MoveDown className="w-4 h-4" />
        <span>Backward</span>
      </button>
      <button className={buttonClass} onClick={() => onAction('back')}>
        <ArrowDownToLine className="w-4 h-4" />
        <span>To Back</span>
      </button>
      
      {(isMultipleSelected || isGroup) && (
        <>
          <div className="h-px bg-gray-200 my-1"></div>
          
          {isMultipleSelected && (
            <button className={buttonClass} onClick={() => onAction('group')}>
              <Group className="w-4 h-4" />
              <span>Group</span>
            </button>
          )}
          
          {isGroup && (
            <button className={buttonClass} onClick={() => onAction('ungroup')}>
              <Ungroup className="w-4 h-4" />
              <span>Ungroup</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}