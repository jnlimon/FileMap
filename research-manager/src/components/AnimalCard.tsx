import React, { useState } from 'react';
import { Animal, Project } from '../types';
import { formatDate } from '../utils/helpers';
import { AnimalContextMenu } from './AnimalContextMenu';
import { EditAnimalModal } from './EditAnimalModal';
import { AnimalDetailModal } from './AnimalDetailModal';
import { useApp } from '../context/AppContext';
import { BeakerIcon, UserIcon } from '@heroicons/react/24/outline';

interface AnimalCardProps {
  animal: Animal;
  projectId: string;
  project: Project;
  linkedExperiments?: { id: string; name: string }[];
}

export function AnimalCard({ 
  animal, 
  projectId, 
  project,
  linkedExperiments = []
}: AnimalCardProps) {
  const { dispatch } = useApp();
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${animal.name}"? This action cannot be undone.`)) {
      dispatch({ 
        type: 'DELETE_ANIMAL', 
        payload: { projectId, animalId: animal.id } 
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening detail modal when right-clicking
    if (e.button !== 2) {
      setShowDetailModal(true);
    }
  };

  // Get the main identifier property (Animal ID or Sample ID)
  const identifierProperty = animal.properties.find(prop => 
    prop.name === 'Animal ID' || prop.name === 'Sample ID'
  );

  // Helper function to get property value by display name
  const getPropertyValue = (displayName: string) => {
    switch (displayName) {
      case 'name':
        return animal.name;
      case 'species':
        return animal.species || animal.properties.find(p => p.name === 'species')?.value;
      case 'birthDate':
        return animal.properties.find(p => p.name === 'birthDate')?.value;
      case 'age':
        return animal.properties.find(p => p.name === 'age')?.value;
      case 'weight':
        return animal.properties.find(p => p.name === 'weight')?.value;
      case 'sex':
        return animal.properties.find(p => p.name === 'sex')?.value;
      case 'condition':
        return animal.properties.find(p => p.name === 'condition')?.value;
      case 'notes':
        return animal.properties.find(p => p.name === 'notes')?.value;
      default:
        // For custom properties, look by name
        return animal.properties.find(p => p.name === displayName)?.value;
    }
  };

  // Helper function to get property label
  const getPropertyLabel = (displayName: string) => {
    switch (displayName) {
      case 'name':
        return animal.name;
      case 'species':
        return getPropertyValue('species');
      case 'birthDate':
        return `Birth Date: ${getPropertyValue('birthDate') || 'Not set'}`;
      case 'age':
        return `Age: ${getPropertyValue('age') || 'Not set'}`;
      case 'weight':
        return `Weight: ${getPropertyValue('weight') || 'Not set'}`;
      case 'sex':
        return `Sex: ${getPropertyValue('sex') || 'Not set'}`;
      case 'condition':
        return `Condition: ${getPropertyValue('condition') || 'Not set'}`;
      case 'notes':
        return getPropertyValue('notes');
      default:
        // For custom properties
        const value = getPropertyValue(displayName);
        return value ? `${displayName}: ${value}` : null;
    }
  };

  return (
    <>
      <div 
        className="animal-card cursor-pointer"
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
        title="Click to view details, right-click for options"
      >
        {/* Header with type indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
              animal.type === 'animal' 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {animal.type === 'animal' ? (
                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <BeakerIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              animal.type === 'animal'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            }`}>
              {animal.type === 'animal' ? 'Animal' : 'Sample'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Display configured properties */}
          {animal.displayProperties && animal.displayProperties.length > 0 ? (
            animal.displayProperties.map((prop) => {
              const label = getPropertyLabel(prop);
              if (!label) return null;
              
              return (
                <div key={prop}>
                  {prop === 'name' ? (
                    <h4 className="font-semibold text-gray-900 dark:text-white">{label}</h4>
                  ) : prop === 'notes' ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{label}</p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  )}
                </div>
              );
            })
          ) : (
            // Default display if no properties configured
            <>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{animal.name}</h4>
              </div>
            </>
          )}
          
          {/* Footer with creation date */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>Created: {formatDate(animal.createdAt)}</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {animal.type === 'animal' ? 'Animal' : 'Sample'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <AnimalContextMenu
        animal={animal}
        projectId={projectId}
        isVisible={contextMenu.isVisible}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <EditAnimalModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        animal={animal}
        projectId={projectId}
        title={`Edit ${animal.type === 'animal' ? 'Animal' : 'Sample'}`}
        size="md"
      />

      {/* Detail Modal */}
      <AnimalDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        animal={animal}
        project={project}
      />
    </>
  );
}
