import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Animal } from '../types';

interface DisplayPropertiesModalProps {
  animal: Animal;
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const DisplayPropertiesModal: React.FC<DisplayPropertiesModalProps> = ({
  animal,
  projectId,
  isVisible,
  onClose
}) => {
  const { state, dispatch } = useApp();
  const [selectedProperties, setSelectedProperties] = useState<string[]>(
    animal.displayProperties || []
  );
  const [applyToAll, setApplyToAll] = useState(false);

  if (!isVisible) return null;

  const project = state.projects.find(p => p.id === projectId);
  if (!project) return null;

  // Get all available properties for this animal type
  const builtInProperties = animal.type === 'animal' 
    ? ['name', 'species', 'birthDate', 'age', 'weight', 'sex', 'condition', 'notes']
    : ['name', 'date', 'typeOfSample', 'notes'];

  const customProperties = (project.animalProperties || [])
    .filter(prop => prop.appliesTo === animal.type || prop.appliesTo === 'both')
    .map(prop => prop.name);

  const allProperties = [...builtInProperties, ...customProperties];

  const handlePropertyToggle = (propertyName: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyName)
        ? prev.filter(name => name !== propertyName)
        : [...prev, propertyName]
    );
  };

  const handleSave = () => {
    if (applyToAll) {
      // Apply to all animals/samples of the same type
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        const sameTypeAnimals = project.animals.filter(a => a.type === animal.type);
        sameTypeAnimals.forEach(a => {
          dispatch({
            type: 'UPDATE_ANIMAL',
            payload: {
              projectId,
              animalId: a.id,
              updates: {
                displayProperties: selectedProperties
              }
            }
          });
        });
      }
    } else {
      // Apply only to the selected animal
      dispatch({
        type: 'UPDATE_ANIMAL',
        payload: {
          projectId,
          animalId: animal.id,
          updates: {
            displayProperties: selectedProperties
          }
        }
      });
    }
    onClose();
  };

  const getPropertyDisplayName = (propertyName: string) => {
    switch (propertyName) {
      case 'name': return 'Name';
      case 'species': return 'Species';
      case 'birthDate': return 'Birth Date';
      case 'age': return 'Age';
      case 'weight': return 'Weight';
      case 'sex': return 'Sex';
      case 'condition': return 'Condition';
      case 'notes': return 'Notes';
      case 'date': return 'Date';
      case 'typeOfSample': return 'Type of Sample';
      default: return propertyName;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Display Properties</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Choose which properties to display on {applyToAll ? `all ${animal.type}` : animal.name} cards:
        </p>
        
        {/* Apply to all option */}
        <div className="mb-4">
          <label className="flex items-center p-3 border border-blue-200 rounded-md bg-blue-50 cursor-pointer">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-blue-900 font-medium">
              Apply to all {animal.type === 'animal' ? 'animals' : 'samples'} in this project
            </span>
          </label>
        </div>

        {/* Properties List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {allProperties.map(propertyName => (
            <label
              key={propertyName}
              className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedProperties.includes(propertyName)}
                onChange={() => handlePropertyToggle(propertyName)}
                className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-900">{getPropertyDisplayName(propertyName)}</span>
            </label>
          ))}
        </div>

        {/* Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div className="text-sm text-gray-600">
            {selectedProperties.length === 0 ? (
              <em>No properties selected</em>
            ) : (
              selectedProperties.map(prop => getPropertyDisplayName(prop)).join(', ')
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
};