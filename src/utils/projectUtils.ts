import { fabric } from 'fabric';

const PROJECT_PREFIX = 'logo_maker_project_';

export function saveProject(canvas: fabric.Canvas, name: string) {
  // Remove grid lines before saving
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  
  const json = JSON.stringify({
    objects: objects.map(obj => obj.toJSON()),
    background: canvas.backgroundColor
  });
  
  localStorage.setItem(`${PROJECT_PREFIX}${name}`, json);
}

export function loadProject(canvas: fabric.Canvas, name: string) {
  const savedProject = localStorage.getItem(`${PROJECT_PREFIX}${name}`);
  if (!savedProject) return;
  
  const projectData = JSON.parse(savedProject);
  
  // Clear current canvas (except grid)
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);
  
  // Restore background
  canvas.setBackgroundColor(projectData.background, canvas.renderAll.bind(canvas));
  
  // Restore objects
  fabric.util.enlivenObjects(projectData.objects, (enlivenedObjects) => {
    canvas.add(...enlivenedObjects);
    canvas.requestRenderAll();
  });
}

export function createNewProject(canvas: fabric.Canvas) {
  // Remove all objects except grid
  const objects = canvas.getObjects().filter(obj => 
    !(obj instanceof fabric.Line && !obj.selectable)
  );
  canvas.remove(...objects);
  
  // Reset background
  canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
}

export function getSavedProjects(): string[] {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(PROJECT_PREFIX))
    .map(key => key.replace(PROJECT_PREFIX, ''));
}

export function deleteProject(name: string) {
  localStorage.removeItem(`${PROJECT_PREFIX}${name}`);
}