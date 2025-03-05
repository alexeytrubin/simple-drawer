interface BackgroundColorMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

export function BackgroundColorMenu({ x, y, onClose, onColorSelect }: BackgroundColorMenuProps) {
  const colors = [
    '#FFFFFF', // White
    '#F8F9FA', // Light gray
    '#E9ECEF', // Lighter gray
    '#DEE2E6', // Light blue-gray
    '#CED4DA', // Blue-gray
    '#ADB5BD', // Medium gray
    '#6C757D', // Dark gray
    '#343A40', // Very dark gray
    '#212529', // Almost black
    '#FFF3CD', // Light yellow
    '#D1E7DD', // Light green
    '#F8D7DA', // Light red
    '#CFE2FF', // Light blue
    '#FFE5D0', // Light orange
    '#D7F5FC', // Light cyan
    '#FCE7F3', // Light pink
  ];

  const transparentOption = 'transparent';

  return (
    <div 
      className="absolute bg-white shadow-lg rounded-md p-3 z-50"
      style={{ left: x, top: y }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium mb-2">Background Color</h3>
        
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <button
            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform bg-white relative"
            onClick={() => onColorSelect(transparentOption)}
            title="Transparent"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
            </div>
          </button>
          <span className="text-xs">Transparent</span>
        </div>
        
        <div className="mt-2">
          <label className="text-xs block mb-1">Custom Color:</label>
          <input 
            type="color" 
            className="w-full h-8"
            onChange={(e) => onColorSelect(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 