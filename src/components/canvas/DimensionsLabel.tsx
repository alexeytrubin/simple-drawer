import React from 'react';

interface DimensionsLabelProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

export function DimensionsLabel({ width, height, x, y }: DimensionsLabelProps) {
  const style = {
    position: 'absolute' as const,
    left: `${x}px`,
    top: `${y - 25}px`,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    pointerEvents: 'none' as const,
    zIndex: 1000,
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap' as const,
  };

  return (
    <div style={style}>
      {Math.round(width)} × {Math.round(height)} px
    </div>
  );
}