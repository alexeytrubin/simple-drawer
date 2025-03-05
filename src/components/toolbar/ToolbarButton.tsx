import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ToolbarButton({ 
  onClick, 
  icon: Icon, 
  title, 
  isActive, 
  disabled = false,
  className = '' 
}: ToolbarButtonProps) {
  const baseClass = "w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors";
  const activeClass = isActive ? 'bg-indigo-100 text-indigo-600' : '';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClass} ${activeClass} ${className}`}
      title={title}
      disabled={disabled}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}