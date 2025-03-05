import React from 'react';
import { Sliders, Layers, Droplets, Move, CornerDownRight } from 'lucide-react';
import { AlignmentToolbar } from './canvas/AlignmentToolbar';

interface ShapePropertiesProps {
  onStrokeWidthChange: (width: number) => void;
  onStrokeColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onGradientChange: (gradient: { color1: string; color2: string }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onCornerRadiusChange?: (radius: number) => void;
  strokeWidth: number;
  strokeColor: string;
  opacity: number;
  gradient: { color1: string; color2: string };
  showGradient: boolean;
  objectSize: { width: number; height: number };
  isCircle?: boolean;
  cornerRadius?: number;
  showCornerRadius?: boolean;
  canvas?: fabric.Canvas | null;
}

export function ShapeProperties({
  onStrokeWidthChange,
  onStrokeColorChange,
  onOpacityChange,
  onGradientChange,
  onSizeChange,
  onCornerRadiusChange,
  strokeWidth,
  strokeColor,
  opacity,
  gradient,
  showGradient,
  objectSize,
  isCircle,
  cornerRadius = 0,
  showCornerRadius = false,
  canvas
}: ShapePropertiesProps) {
  const safeWidth = isFinite(objectSize.width) ? Math.round(objectSize.width) : 100;
  const safeHeight = isFinite(objectSize.height) ? Math.round(objectSize.height) : 100;
  const safeRadius = isFinite(objectSize.width) ? Math.round(objectSize.width / 2) : 50;
  const safeStrokeWidth = isFinite(strokeWidth) ? strokeWidth : 0;
  const safeOpacity = isFinite(opacity) ? opacity : 1;
  const safeCornerRadius = isFinite(cornerRadius) ? cornerRadius : 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Move className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Size:</span>
        </div>
        <div className="flex items-center gap-2">
          {isCircle ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Radius:</span>
              <input
                type="number"
                value={safeRadius}
                onChange={(e) => {
                  const radius = Math.max(1, Number(e.target.value));
                  onSizeChange({ width: radius * 2, height: radius * 2 });
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="1"
                max="500"
              />
              <span className="text-sm text-gray-600">px</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">W:</span>
                <input
                  type="number"
                  value={safeWidth}
                  onChange={(e) => onSizeChange({ ...objectSize, width: Math.max(1, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="1"
                  max="1000"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">H:</span>
                <input
                  type="number"
                  value={safeHeight}
                  onChange={(e) => onSizeChange({ ...objectSize, height: Math.max(1, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="1"
                  max="1000"
                />
                <span className="text-sm text-gray-600">px</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Border:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={safeStrokeWidth}
            onChange={(e) => onStrokeWidthChange(Math.max(0, Math.min(20, Number(e.target.value))))}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
            min="0"
            max="20"
          />
          <span className="text-sm text-gray-600">px</span>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Border Color"
          />
        </div>
      </div>

      {showCornerRadius && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Corner Radius:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={safeCornerRadius}
              onChange={(e) => onCornerRadiusChange?.(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-600">px</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Opacity:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={Math.round(safeOpacity * 100)}
            onChange={(e) => onOpacityChange(Math.max(0, Math.min(100, Number(e.target.value))) / 100)}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
            min="0"
            max="100"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
      </div>

      {canvas && <div className="ml-2"><AlignmentToolbar canvas={canvas} /></div>}

      {showGradient && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Gradient:</span>
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={gradient.color1}
              onChange={(e) => onGradientChange({ ...gradient, color1: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="color"
              value={gradient.color2}
              onChange={(e) => onGradientChange({ ...gradient, color2: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}