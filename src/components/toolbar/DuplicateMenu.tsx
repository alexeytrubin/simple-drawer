import React from 'react';
import { fabric } from 'fabric';
import { LayoutGrid } from 'lucide-react';
import { duplicateInRow, duplicateInGrid } from '../../utils/toolbar/positionUtils';

interface DuplicateMenuProps {
  canvas: fabric.Canvas | null;
}

export function DuplicateMenu({ canvas }: DuplicateMenuProps) {
  return (
    <div className="absolute left-16 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Duplicate in Row</h3>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(count => (
              <button
                key={count}
                onClick={() => duplicateInRow(canvas, count)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                {count}x
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Duplicate in Grid</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { rows: 2, cols: 2 },
              { rows: 2, cols: 3 },
              { rows: 3, cols: 2 },
              { rows: 3, cols: 3 }
            ].map(({ rows, cols }) => (
              <button
                key={`${rows}x${cols}`}
                onClick={() => duplicateInGrid(canvas, rows, cols)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-1"
              >
                <LayoutGrid className="w-4 h-4" />
                {rows}×{cols}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}