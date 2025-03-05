import React from 'react';

interface ProjectSelectorProps {
  onNewProject: () => void;
  onLoadProject: (name: string) => void;
  savedProjects: string[];
}

export function ProjectSelector({
  onNewProject,
  onLoadProject,
  savedProjects
}: ProjectSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px]">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Project</h2>
          
          <div className="space-y-4">
            <button
              onClick={onNewProject}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create New Project
            </button>

            {savedProjects.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Projects</h3>
                <div className="space-y-2">
                  {savedProjects.map((name) => (
                    <button
                      key={name}
                      onClick={() => onLoadProject(name)}
                      className="w-full px-4 py-2 text-left border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-900">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}