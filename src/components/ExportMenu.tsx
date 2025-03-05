import React, { useRef, useEffect } from 'react';
import { ExportFormat, EXPORT_FORMATS, exportCanvas } from '../utils/canvasUtils';
import { fabric } from 'fabric';

interface ExportMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  canvas: fabric.Canvas | null;
}

export function ExportMenu({ x, y, onClose, canvas }: ExportMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleExport = (format: ExportFormat) => {
    if (!canvas) return;
    exportCanvas(canvas, format);
    onClose();
  };

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
    maxHeight: '80vh',
    overflowY: 'auto' as const
  };

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-[280px] z-50"
      style={menuStyle}
    >
      <div className="px-3 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Export Format</h3>
        <p className="text-xs text-gray-500 mt-1">Choose a size for your logo</p>
      </div>
      
      <div className="py-1">
        {EXPORT_FORMATS.map((format) => (
          <button
            key={format.name}
            onClick={() => handleExport(format)}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex flex-col"
          >
            <span className="text-sm font-medium text-gray-900">{format.description}</span>
            {format.name !== 'original' && (
              <span className="text-xs text-gray-500">
                {format.width} × {format.height}px
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}