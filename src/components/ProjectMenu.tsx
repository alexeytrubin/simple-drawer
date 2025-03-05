import React, { useRef, useEffect } from 'react';
import { FolderOpen, Plus, Save } from 'lucide-react';

interface ProjectMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSave: () => void;
  onLoad: (name: string) => void;
  onNew: () => void;
  savedProjects: string[];
}

export function ProjectMenu({ x, y, onClose, onSave, onLoad, onNew, savedProjects }: ProjectMenuProps) {
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
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-[200px] z-50"
      style={menuStyle}
    >
      <button className={buttonClass} onClick={onNew}>
        <Plus className="w-4 h-4" />
        <span>New Project</span>
      </button>
      <button className={buttonClass} onClick={onSave}>
        <Save className="w-4 h-4" />
        <span>Save Project</span>
      </button>
      
      {savedProjects.length > 0 && (
        <>
          <div className="h-px bg-gray-200 my-1" />
          <div className="py-1 px-3">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Saved Projects</h3>
          </div>
          {savedProjects.map((name) => (
            <button
              key={name}
              className={buttonClass}
              onClick={() => onLoad(name)}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="truncate">{name}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}