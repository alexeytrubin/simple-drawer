import React from 'react';
import { Palette, Plus, FolderOpen } from 'lucide-react';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { ProjectMenu } from './ProjectMenu';

interface HeaderProps {
  onNewProject: () => void;
  onProjectMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  isTextSelected: boolean;
  currentFont: string;
  currentFontSize: number;
  currentColor: string;
  projectMenu: { x: number; y: number } | null;
  onProjectMenuClose: () => void;
  onSaveProject: () => void;
  onLoadProject: (name: string) => void;
  savedProjects: string[];
}

export function Header({
  onNewProject,
  onProjectMenuClick,
  onFontChange,
  onFontSizeChange,
  onColorChange,
  isTextSelected,
  currentFont,
  currentFontSize,
  currentColor,
  projectMenu,
  onProjectMenuClose,
  onSaveProject,
  onLoadProject,
  savedProjects
}: HeaderProps) {
  return (
    <header className="h-auto bg-white border-b border-gray-200 flex flex-col justify-center px-4 shadow-sm">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
            <button
              onClick={onProjectMenuClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isTextSelected && (
            <FontPicker 
              onFontChange={onFontChange}
              onFontSizeChange={onFontSizeChange}
              currentFont={currentFont}
              currentFontSize={currentFontSize}
            />
          )}
          <ColorPicker onColorChange={onColorChange} currentColor={currentColor} />
        </div>
      </div>

      {projectMenu && (
        <ProjectMenu
          x={projectMenu.x}
          y={projectMenu.y}
          onClose={onProjectMenuClose}
          onSave={onSaveProject}
          onLoad={onLoadProject}
          onNew={onNewProject}
          savedProjects={savedProjects}
        />
      )}
    </header>
  );
}