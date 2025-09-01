import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { formatDate } from '../utils/helpers';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from './ContextMenu';
import { EditProjectModal } from './EditModal';
import { useApp } from '../context/AppContext';
import { FolderIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      dispatch({ type: 'DELETE_PROJECT', payload: project.id });
    }
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  const handleSaveEdit = (updates: { name: string; description: string }) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { id: project.id, updates }
    });
  };

  return (
    <>
      <div 
        className="card cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="space-y-4">
                  {/* Project Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <FolderIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
                {project.name}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed break-words">
              {project.description}
            </p>
          </div>
        </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-medium">{project.experiments.length}</span>
              <span className="truncate">Experiments</span>
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-medium">{project.animals.length}</span>
              <span className="truncate">Animals/Samples</span>
            </div>
          </div>

          {/* Project Footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-400 dark:text-gray-500">
              <div className="min-w-0">
                <div className="truncate">Created: {formatDate(project.createdAt)}</div>
              </div>
              <div className="min-w-0">
                <div className="truncate">Updated: {formatDate(project.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
      >
        <ContextMenuItem onClick={handleEdit}>
          Edit Project
        </ContextMenuItem>
        <ContextMenuItem onClick={handleClick}>
          View Project
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          Delete Project
        </ContextMenuItem>
      </ContextMenu>

      {/* Edit Modal */}
      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        initialData={{ name: project.name, description: project.description }}
        title="Edit Project"
        size="sm"
      />
    </>
  );
}
