import { useRef, useEffect } from 'react';
import { Square, Circle, Triangle, Star, Hexagon } from 'lucide-react';

interface ShapeMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onShapeSelect: (shape: string) => void;
}

export function ShapeMenu({ x, y, onClose, onShapeSelect }: ShapeMenuProps) {
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

  const menuStyle = {
    position: 'fixed' as const,
    left: `${x}px`,
    top: `${y}px`,
  };

  const buttonClass = "w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm";

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-[160px] z-50"
      style={menuStyle}
    >
      <button className={buttonClass} onClick={() => onShapeSelect('rectangle')}>
        <Square className="w-4 h-4" />
        <span>Rectangle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('circle')}>
        <Circle className="w-4 h-4" />
        <span>Circle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('ellipse')}>
        <Circle className="w-4 h-4 scale-x-150" />
        <span>Ellipse</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('triangle')}>
        <Triangle className="w-4 h-4" />
        <span>Triangle</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('hexagon')}>
        <Hexagon className="w-4 h-4" />
        <span>Hexagon</span>
      </button>
      <button className={buttonClass} onClick={() => onShapeSelect('star')}>
        <Star className="w-4 h-4" />
        <span>Star</span>
      </button>
    </div>
  );
}