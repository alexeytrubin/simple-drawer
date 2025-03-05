import React, { useState } from 'react';
import { EXPORT_FORMATS } from '../utils/canvasUtils';

interface CanvasSizeDialogProps {
  onClose: () => void;
  onSizeSelect: (width: number, height: number) => void;
}

export function CanvasSizeDialog({ onClose, onSizeSelect }: CanvasSizeDialogProps) {
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);

  const handleCustomSizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSizeSelect(customWidth, customHeight);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Canvas Size</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preset Sizes</h3>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_FORMATS.filter(format => format.name !== 'original').map((format) => (
                  <button
                    key={format.name}
                    onClick={() => {
                      onSizeSelect(format.width, format.height);
                      onClose();
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="text-sm font-medium text-gray-900">{format.description}</div>
                    <div className="text-xs text-gray-500">{format.width} × {format.height}px</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Size</h3>
              <form onSubmit={handleCustomSizeSubmit} className="flex items-end gap-4">
                <div>
                  <label htmlFor="width" className="block text-xs text-gray-500 mb-1">Width (px)</label>
                  <input
                    type="number"
                    id="width"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, Math.min(4000, Number(e.target.value))))}
                    className="block w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                    max="4000"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-xs text-gray-500 mb-1">Height (px)</label>
                  <input
                    type="number"
                    id="height"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, Math.min(4000, Number(e.target.value))))}
                    className="block w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                    max="4000"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  Apply Size
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}