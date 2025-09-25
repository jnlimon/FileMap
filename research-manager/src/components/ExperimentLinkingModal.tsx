import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Animal } from '../types';

interface ExperimentLinkingModalProps {
  animal: Animal;
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ExperimentLinkingModal: React.FC<ExperimentLinkingModalProps> = ({
  animal,
  projectId,
  isVisible,
  onClose
}) => {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperimentIds, setSelectedExperimentIds] = useState<string[]>(
    animal.experimentIds || []
  );

  if (!isVisible) return null;

  const project = state.projects.find(p => p.id === projectId);
  if (!project) return null;

  const filteredExperiments = project.experiments.filter(exp =>
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExperimentToggle = (experimentId: string) => {
    setSelectedExperimentIds(prev =>
      prev.includes(experimentId)
        ? prev.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const handleSave = () => {
    dispatch({
      type: 'LINK_ANIMAL_TO_EXPERIMENTS',
      payload: {
        projectId,
        animalId: animal.id,
        experimentIds: selectedExperimentIds
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Link {animal.name} to Experiments</h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Experiments List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {filteredExperiments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {searchQuery ? 'No experiments found' : 'No experiments available'}
            </p>
          ) : (
            filteredExperiments.map(experiment => (
              <label
                key={experiment.id}
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedExperimentIds.includes(experiment.id)}
                  onChange={() => handleExperimentToggle(experiment.id)}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{experiment.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{experiment.description}</div>
                </div>
              </label>
            ))
          )}
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
            Save Links
          </button>
        </div>
      </div>
    </div>
  );
};