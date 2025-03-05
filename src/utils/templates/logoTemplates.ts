import { fabric } from 'fabric';

interface LogoTemplate {
  name: string;
  description: string;
  category: 'Minimal' | 'Modern' | 'Abstract' | 'Geometric';
  create: (canvas: fabric.Canvas) => void;
}

const createMinimalCircleLogo = (canvas: fabric.Canvas) => {
  // Clear existing objects except grid
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);

  // Create outer circle
  const outerCircle = new fabric.Circle({
    radius: 40,
    fill: '#4f46e5',
    left: canvas.width! / 2 - 40,
    top: canvas.height! / 2 - 40,
  });

  // Create inner circle
  const innerCircle = new fabric.Circle({
    radius: 25,
    fill: '#ffffff',
    left: canvas.width! / 2 - 25,
    top: canvas.height! / 2 - 25,
  });

  // Create text
  const text = new fabric.IText('BRAND', {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#1f2937',
    left: canvas.width! / 2 - 35,
    top: canvas.height! / 2 + 50,
  });

  canvas.add(outerCircle, innerCircle, text);
  canvas.requestRenderAll();
};

const createGeometricLogo = (canvas: fabric.Canvas) => {
  // Clear existing objects except grid
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);

  // Create hexagon
  const hexagonPoints = [];
  const sides = 6;
  const radius = 40;
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    hexagonPoints.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  
  const hexagon = new fabric.Polygon(hexagonPoints, {
    fill: '#8b5cf6',
    left: canvas.width! / 2 - radius,
    top: canvas.height! / 2 - radius,
  });

  // Create triangle
  const triangle = new fabric.Triangle({
    width: 40,
    height: 40,
    fill: '#ffffff',
    left: canvas.width! / 2 - 20,
    top: canvas.height! / 2 - 20,
  });

  // Create text
  const text = new fabric.IText('HEXO', {
    fontSize: 28,
    fontFamily: 'Arial',
    fontWeight: '800',
    fill: '#1f2937',
    left: canvas.width! / 2 - 35,
    top: canvas.height! / 2 + 50,
  });

  canvas.add(hexagon, triangle, text);
  canvas.requestRenderAll();
};

const createAbstractLogo = (canvas: fabric.Canvas) => {
  // Clear existing objects except grid
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);

  // Create abstract shapes
  const rect1 = new fabric.Rect({
    width: 60,
    height: 60,
    fill: '#ec4899',
    angle: 45,
    left: canvas.width! / 2 - 50,
    top: canvas.height! / 2 - 50,
  });

  const rect2 = new fabric.Rect({
    width: 60,
    height: 60,
    fill: '#8b5cf6',
    angle: 45,
    left: canvas.width! / 2 - 30,
    top: canvas.height! / 2 - 30,
    opacity: 0.8,
  });

  // Create text
  const text = new fabric.IText('FUSION', {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#1f2937',
    left: canvas.width! / 2 - 40,
    top: canvas.height! / 2 + 50,
  });

  canvas.add(rect1, rect2, text);
  canvas.requestRenderAll();
};

const createModernLogo = (canvas: fabric.Canvas) => {
  // Clear existing objects except grid
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);

  // Create main shape
  const mainRect = new fabric.Rect({
    width: 80,
    height: 80,
    rx: 20,
    ry: 20,
    fill: '#10b981',
    left: canvas.width! / 2 - 40,
    top: canvas.height! / 2 - 40,
  });

  // Create accent shape
  const accentRect = new fabric.Rect({
    width: 40,
    height: 40,
    rx: 10,
    ry: 10,
    fill: '#ffffff',
    left: canvas.width! / 2 - 20,
    top: canvas.height! / 2 - 20,
  });

  // Create text
  const text = new fabric.IText('CUBE', {
    fontSize: 28,
    fontFamily: 'Arial',
    fontWeight: '800',
    fill: '#1f2937',
    left: canvas.width! / 2 - 35,
    top: canvas.height! / 2 + 50,
  });

  canvas.add(mainRect, accentRect, text);
  canvas.requestRenderAll();
};

export const logoTemplates: LogoTemplate[] = [
  {
    name: 'Minimal Circle',
    description: 'Clean and minimal circular design',
    category: 'Minimal',
    create: createMinimalCircleLogo,
  },
  {
    name: 'Geometric Hex',
    description: 'Modern hexagonal pattern',
    category: 'Geometric',
    create: createGeometricLogo,
  },
  {
    name: 'Abstract Fusion',
    description: 'Overlapping shapes with gradient effect',
    category: 'Abstract',
    create: createAbstractLogo,
  },
  {
    name: 'Modern Cube',
    description: 'Contemporary rounded square design',
    category: 'Modern',
    create: createModernLogo,
  },
];