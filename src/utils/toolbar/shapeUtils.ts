import { fabric } from 'fabric';

const createDefaultShapeProps = (canvas: fabric.Canvas, color: string) => {
  // Find the canvas area rectangle
  const canvasArea = canvas.getObjects().find(obj => 
    obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
  ) as fabric.Rect | undefined;
  
  let centerX = canvas.width! / 2;
  let centerY = canvas.height! / 2;
  
  // If we have a canvas area, use its center
  if (canvasArea) {
    centerX = canvasArea.left! + canvasArea.width! / 2;
    centerY = canvasArea.top! + canvasArea.height! / 2;
  }
  
  return {
    left: centerX - 50,
    top: centerY - 50,
    strokeWidth: 0,
    stroke: '#000000',
    fill: color,
  };
};

export const addImage = (canvas: fabric.Canvas, file: File) => {
  if (!canvas) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imgUrl = event.target?.result as string;
    
    // Create an actual image element to get the natural dimensions
    const img = new Image();
    img.onload = () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      
      // Find the canvas area rectangle
      const canvasArea = canvas.getObjects().find(obj => 
        obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
      ) as fabric.Rect | undefined;
      
      let maxWidth = canvas.width! * 0.8;
      let maxHeight = canvas.height! * 0.8;
      let centerX = canvas.width! / 2;
      let centerY = canvas.height! / 2;
      
      // If we have a canvas area, use its dimensions
      if (canvasArea) {
        maxWidth = canvasArea.width! * 0.8;
        maxHeight = canvasArea.height! * 0.8;
        centerX = canvasArea.left! + canvasArea.width! / 2;
        centerY = canvasArea.top! + canvasArea.height! / 2;
      }
      
      // Calculate scale to fit within the canvas area while maintaining aspect ratio
      let scale = 1;
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const scaleX = maxWidth / originalWidth;
        const scaleY = maxHeight / originalHeight;
        scale = Math.min(scaleX, scaleY);
      }
      
      // Create the fabric image with the correct dimensions
      fabric.Image.fromURL(imgUrl, (fabricImg) => {
        // Set the image dimensions and position
        fabricImg.set({
          left: centerX - (originalWidth * scale) / 2,
          top: centerY - (originalHeight * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          cornerSize: 10,
          transparentCorners: false,
          selectable: true,
          hasControls: true
        });
        
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.requestRenderAll();
        canvas.fire('selection:created', { selected: [fabricImg] });
      }, { crossOrigin: 'anonymous' });
    };
    
    img.src = imgUrl;
  };
  reader.readAsDataURL(file);
};

export const addRectangle = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  const rect = new fabric.Rect({
    ...createDefaultShapeProps(canvas, color),
    width: 100,
    height: 100,
    rx: 0,
    ry: 0,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.fire('selection:created', { selected: [rect] });
};

export const addCircle = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  const circle = new fabric.Circle({
    ...createDefaultShapeProps(canvas, color),
    radius: 50,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.fire('selection:created', { selected: [circle] });
};

export const addEllipse = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  
  // Find the canvas area rectangle
  const canvasArea = canvas.getObjects().find(obj => 
    obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
  ) as fabric.Rect | undefined;
  
  let centerX = canvas.width! / 2;
  let centerY = canvas.height! / 2;
  
  // If we have a canvas area, use its center
  if (canvasArea) {
    centerX = canvasArea.left! + canvasArea.width! / 2;
    centerY = canvasArea.top! + canvasArea.height! / 2;
  }
  
  const ellipse = new fabric.Ellipse({
    ...createDefaultShapeProps(canvas, color),
    rx: 60,
    ry: 40,
    left: centerX - 60,
    top: centerY - 40,
  });
  canvas.add(ellipse);
  canvas.setActiveObject(ellipse);
  canvas.fire('selection:created', { selected: [ellipse] });
};

export const addTriangle = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  
  // Create a path for a rounded triangle
  const size = 100;
  const radius = 0; // Initial radius
  const height = size * (Math.sqrt(3) / 2);
  
  // Calculate points for an equilateral triangle
  const points = [
    { x: 0, y: -height / 2 },           // Top
    { x: size / 2, y: height / 2 },     // Bottom right
    { x: -size / 2, y: height / 2 },    // Bottom left
  ];
  
  // Create the path string for a rounded triangle
  const path = createRoundedTrianglePath(points, radius);
  
  const triangle = new fabric.Path(path, {
    ...createDefaultShapeProps(canvas, color),
    width: size,
    height: height,
    left: createDefaultShapeProps(canvas, color).left - size / 2 + 50,
    top: createDefaultShapeProps(canvas, color).top - height / 2 + 50,
  });

  // Add custom properties for radius control
  triangle.set('cornerRadius', radius);
  triangle.set('originalPoints', points);

  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.fire('selection:created', { selected: [triangle] });
};

// Helper function to create rounded triangle path
export const createRoundedTrianglePath = (points: { x: number; y: number }[], radius: number) => {
  if (radius === 0) {
    // If no radius, create a regular triangle path
    return `M ${points[0].x} ${points[0].y} 
            L ${points[1].x} ${points[1].y} 
            L ${points[2].x} ${points[2].y} Z`;
  }

  // Calculate the vectors between points
  const vectors = points.map((point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    return {
      x: nextPoint.x - point.x,
      y: nextPoint.y - point.y
    };
  });

  // Calculate the lengths of the sides
  const lengths = vectors.map(v => Math.sqrt(v.x * v.x + v.y * v.y));

  // Normalize vectors and calculate corner points
  const corners = points.map((point, i) => {
    const prevIndex = (i + points.length - 1) % points.length;
    const vector = vectors[i];
    const prevVector = vectors[prevIndex];
    
    // Normalize current and previous vectors
    const norm1 = {
      x: vector.x / lengths[i],
      y: vector.y / lengths[i]
    };
    const norm2 = {
      x: prevVector.x / lengths[prevIndex],
      y: prevVector.y / lengths[prevIndex]
    };

    return {
      point: point,
      norm1: norm1,
      norm2: norm2
    };
  });

  // Create the path
  let path = '';
  corners.forEach((corner, i) => {
    const nextCorner = corners[(i + 1) % corners.length];
    
    if (i === 0) {
      path += `M ${corner.point.x + corner.norm1.x * radius} ${corner.point.y + corner.norm1.y * radius}`;
    }
    
    path += ` L ${nextCorner.point.x + nextCorner.norm2.x * radius} ${nextCorner.point.y + nextCorner.norm2.y * radius}`;
    path += ` Q ${nextCorner.point.x} ${nextCorner.point.y} ${nextCorner.point.x + nextCorner.norm1.x * radius} ${nextCorner.point.y + nextCorner.norm1.y * radius}`;
  });
  
  return path + ' Z';
};

export const addPolygon = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  const sides = 6;
  const radius = 50;
  const points = [];
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  
  const polygon = new fabric.Polygon(points, {
    ...createDefaultShapeProps(canvas, color),
    width: radius * 2,
    height: radius * 2,
  });
  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.fire('selection:created', { selected: [polygon] });
};

export const addStar = (canvas: fabric.Canvas, color: string) => {
  if (!canvas) return;
  const points = [];
  const spikes = 5;
  const outerRadius = 50;
  const innerRadius = 25;
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  
  const star = new fabric.Polygon(points, {
    ...createDefaultShapeProps(canvas, color),
    width: outerRadius * 2,
    height: outerRadius * 2,
  });
  canvas.add(star);
  canvas.setActiveObject(star);
  canvas.fire('selection:created', { selected: [star] });
};

export const addText = (canvas: fabric.Canvas | null) => {
  if (!canvas) return;
  
  // Find the canvas area rectangle
  const canvasArea = canvas.getObjects().find(obj => 
    obj instanceof fabric.Rect && !obj.selectable && obj.fill === '#ffffff'
  ) as fabric.Rect | undefined;
  
  let centerX = canvas.width! / 2;
  let centerY = canvas.height! / 2;
  
  // If we have a canvas area, use its center
  if (canvasArea) {
    centerX = canvasArea.left! + canvasArea.width! / 2;
    centerY = canvasArea.top! + canvasArea.height! / 2;
  }
  
  const text = new fabric.IText('Edit Text', {
    left: centerX - 50,
    top: centerY - 20,
    fontFamily: 'Arial',
    fontSize: 40,
    fill: '#000000',
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.fire('selection:created', { selected: [text] });
};