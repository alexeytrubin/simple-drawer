import React from 'react';
import { Type } from 'lucide-react';

interface FontPickerProps {
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  currentFont: string;
  currentFontSize: number;
}

const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Trebuchet MS',
  'Impact'
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];

export function FontPicker({ onFontChange, onFontSizeChange, currentFont, currentFontSize }: FontPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Type className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600">Font:</span>
      </div>
      <select
        value={currentFont}
        onChange={(e) => onFontChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        style={{ fontFamily: currentFont }}
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Size:</span>
        <select
          value={currentFontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-20"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}