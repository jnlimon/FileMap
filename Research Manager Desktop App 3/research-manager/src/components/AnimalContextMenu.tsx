import React, { useState } from 'react';
import { Animal } from '../types';
import { useApp } from '../context/AppContext';
import { ExperimentLinkingModal } from './ExperimentLinkingModal';
import { DisplayPropertiesModal } from './DisplayPropertiesModal';

interface AnimalContextMenuProps {
  animal: Animal;
  projectId: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AnimalContextMenu({ 
  animal, 
  projectId, 
  isVisible, 
  position, 
  onClose,
  onEdit,
  onDelete
}: AnimalContextMenuProps) {
  const { dispatch } = useApp();
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);



  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Main Context Menu */}
      <div 
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-48 transition-colors"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px'
        }}
      >
        <div className="space-y-1">
          {/* Edit Option */}
          <button
            onClick={() => {
              onEdit();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Edit
          </button>
          
          {/* Link to Experiments Option */}
          <button
            onClick={() => setShowExperimentModal(true)}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Link to Experiments
          </button>
          
          {/* Select Display Properties Option */}
          <button
            onClick={() => setShowPropertiesModal(true)}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Select Display Properties
          </button>

          {/* Delete Option */}
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Experiment Linking Modal */}
      <ExperimentLinkingModal
        isVisible={showExperimentModal}
        onClose={() => setShowExperimentModal(false)}
        animal={animal}
        projectId={projectId}
      />

      {/* Display Properties Modal */}
      <DisplayPropertiesModal
        isVisible={showPropertiesModal}
        onClose={() => setShowPropertiesModal(false)}
        animal={animal}
        projectId={projectId}
      />
    </>
  );
}
