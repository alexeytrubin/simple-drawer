import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetView: () => void;
}

export function ZoomControls({ zoom, onZoomChange, onResetView }: ZoomControlsProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(5, zoom + 0.1));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.1, zoom - 0.1));
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center p-1 z-10">
      <button
        onClick={handleZoomOut}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      
      <div className="px-2 min-w-16 text-center">
        {Math.round(zoom * 100)}%
      </div>
      
      <button
        onClick={handleZoomIn}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 mx-1"></div>
      
      <button
        onClick={onResetView}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Reset View"
      >
        <Maximize className="w-5 h-5" />
      </button>
    </div>
  );
}