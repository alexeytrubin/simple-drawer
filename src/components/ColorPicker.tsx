import React from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

const PRESET_COLORS = [
  '#4f46e5', // indigo
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#000000', // black
  '#ffffff', // white
];

export function ColorPicker({ onColorChange, currentColor }: ColorPickerProps) {
  // Ensure currentColor is never null or undefined
  const safeColor = currentColor || '#000000';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600">Color:</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <div className="flex items-center gap-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-6 h-6 rounded-md border ${
                color === safeColor ? 'ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
              } transition-all`}
              style={{
                backgroundColor: color,
                borderColor: color === '#ffffff' ? '#e5e7eb' : color,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}