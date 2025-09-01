import React from 'react';
import { Modal } from './Modal';
import { Animal, Project } from '../types';

interface AnimalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  project: Project;
}

export function AnimalDetailModal({ isOpen, onClose, animal, project }: AnimalDetailModalProps) {
  const associatedExperiments = project.experiments.filter(experiment => 
    animal.experimentIds.includes(experiment.id)
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${animal.type === 'animal' ? 'Animal' : 'Sample'} Details`} size="md">
      <div className="space-y-6">
        {/* All Properties - matching EditAnimalModal structure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {animal.type === 'animal' ? 'Animal' : 'Sample'} Properties
          </label>
          <div className="space-y-3">
            {/* Built-in properties */}
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-colors">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {animal.type === 'animal' ? 'Animal ID' : 'Sample ID'}
              </label>
              <p className="text-gray-900 dark:text-white">{animal.name}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-colors">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {animal.type === 'animal' ? 'Species' : 'Type of Sample'}
              </label>
              <p className="text-gray-900 dark:text-white">{animal.species || 'Not specified'}</p>
            </div>

            {/* Other built-in properties */}
            {[
              { name: 'birthDate', label: 'Birth Date' },
              { name: 'age', label: 'Age' },
              { name: 'weight', label: 'Weight' },
              { name: 'sex', label: 'Sex' },
              { name: 'condition', label: 'Condition' },
              { name: 'notes', label: 'Notes' }
            ].map(({ name, label }) => {
              const property = animal.properties.find(p => p.name === name);
              
              return (
                <div key={name} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-colors">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  {property?.type === 'textarea' ? (
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{property.value || 'Not set'}</p>
                  ) : (
                    <p className="text-gray-900 dark:text-white">{property?.value || 'Not set'}</p>
                  )}
                </div>
              );
            })}

            {/* Custom properties from project configuration */}
            {project.animalProperties && project.animalProperties
              .filter(prop => prop.appliesTo === animal.type || prop.appliesTo === 'both')
              .map(projectProp => {
                const animalProp = animal.properties.find(p => p.name === projectProp.name);
                
                return (
                  <div key={projectProp.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-colors">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {projectProp.name}
                    </label>
                    {animalProp?.type === 'textarea' ? (
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{animalProp.value || 'Not set'}</p>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{animalProp?.value || 'Not set'}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Associated Experiments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Experiments ({associatedExperiments.length})
          </label>
          {associatedExperiments.length > 0 ? (
            <div className="space-y-2">
              {associatedExperiments.map(experiment => (
                <div key={experiment.id} className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200">{experiment.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 transition-colors">
              Not associated with any experiments
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-medium">Created:</span> {formatDate(animal.createdAt)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
