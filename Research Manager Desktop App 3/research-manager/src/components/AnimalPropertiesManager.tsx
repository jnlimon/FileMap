import React, { useState, useEffect } from 'react';
import { ProjectAnimalProperty } from '../types';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';

interface AnimalPropertiesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AnimalPropertiesManager({ isOpen, onClose, projectId }: AnimalPropertiesManagerProps) {
  const { state, dispatch } = useApp();
  const project = state.projects.find(p => p.id === projectId);
  
  const [properties, setProperties] = useState<ProjectAnimalProperty[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState<Partial<ProjectAnimalProperty>>({
    name: '',
    type: 'text',
    required: false,
    isCustom: true,
    order: 0,
    appliesTo: 'both' // 'animal', 'sample', or 'both'
  });

  useEffect(() => {
    if (project) {
      // Define built-in properties
      const builtInProperties: ProjectAnimalProperty[] = [
        { id: 'birthDate', name: 'Birth Date', type: 'date', required: false, defaultValue: '', options: [], isCustom: false, order: -6, appliesTo: 'animal' },
        { id: 'age', name: 'Age', type: 'text', required: false, defaultValue: '', options: [], isCustom: false, order: -5, appliesTo: 'animal' },
        { id: 'weight', name: 'Weight', type: 'text', required: false, defaultValue: '', options: [], isCustom: false, order: -4, appliesTo: 'animal' },
        { id: 'sex', name: 'Sex', type: 'text', required: false, defaultValue: '', options: [], isCustom: false, order: -3, appliesTo: 'animal' },
        { id: 'condition', name: 'Condition', type: 'text', required: false, defaultValue: '', options: [], isCustom: false, order: -2, appliesTo: 'animal' },
        { id: 'notes', name: 'Notes', type: 'textarea', required: false, defaultValue: '', options: [], isCustom: false, order: -1, appliesTo: 'both' }
      ];
      
      // Filter out deleted built-in properties
      const deletedBuiltInIds = project.deletedBuiltInProperties || [];
      const activeBuiltInProperties = builtInProperties.filter(prop => !deletedBuiltInIds.includes(prop.id));
      
      // Combine active built-in and custom properties
      const customProperties = project.animalProperties || [];
      const allProperties = [...activeBuiltInProperties, ...customProperties].sort((a, b) => a.order - b.order);
      
      setProperties(allProperties);
    }
  }, [project]);

  const handleAddProperty = () => {
    if (!newProperty.name?.trim()) return;

    const property: ProjectAnimalProperty = {
      id: generateId(),
      name: newProperty.name.trim(),
      type: newProperty.type || 'text',
      required: newProperty.required || false,
      defaultValue: newProperty.defaultValue || '',
      options: newProperty.options || [],
      isCustom: true,
      order: properties.length,
      appliesTo: newProperty.appliesTo || 'both'
    };

    dispatch({
      type: 'ADD_ANIMAL_PROPERTY',
      payload: { projectId, property }
    });

    setNewProperty({
      name: '',
      type: 'text',
      required: false,
      isCustom: true,
      order: 0,
      appliesTo: 'both'
    });
    setShowAddForm(false);
  };

  const handleUpdateProperty = (propertyId: string, updates: Partial<ProjectAnimalProperty>) => {
    dispatch({
      type: 'UPDATE_ANIMAL_PROPERTY',
      payload: { projectId, propertyId, updates }
    });
  };

  const handleDeleteProperty = (propertyId: string, isBuiltIn: boolean) => {
    const warningMessage = isBuiltIn
      ? 'Are you sure you want to delete this built-in property? This will remove it from all animals in the project and cannot be easily restored.'
      : 'Are you sure you want to delete this property? This will remove it from all animals in the project.';
      
    if (window.confirm(warningMessage)) {
      dispatch({
        type: 'DELETE_ANIMAL_PROPERTY',
        payload: { projectId, propertyId }
      });
    }
  };

  const handleApplyToAll = () => {
    if (window.confirm('This will update all existing animals in the project to use the current property configuration. Continue?')) {
      dispatch({
        type: 'APPLY_ANIMAL_PROPERTIES_TO_ALL',
        payload: { projectId }
      });
      alert('Properties have been applied to all animals in the project!');
    }
  };

  const moveProperty = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === properties.length - 1) return;

    const newProperties = [...properties];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newProperties[index], newProperties[newIndex]] = [newProperties[newIndex], newProperties[index]];
    
    // Update order values
    newProperties.forEach((prop, idx) => {
      prop.order = idx - 6; // Adjust for built-in properties starting at -6
    });

    // Update properties in the state - only update custom properties
    newProperties.forEach(prop => {
      if (prop.isCustom) {
        dispatch({
          type: 'UPDATE_ANIMAL_PROPERTY',
          payload: { projectId, propertyId: prop.id, updates: { order: prop.order } }
        });
      }
    });
    
    // Update local state immediately
    setProperties(newProperties);
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto transition-colors">
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Animal/Sample Properties
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Configure properties that will be available for all animals and samples in this project.
            </p>
          </div>

          {/* Required Properties Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Required Properties</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Animal ID / Sample ID</span>
                <span className="text-xs text-blue-600 dark:text-blue-300 block">Always required, cannot be removed</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Species / Type of Sample</span>
                <span className="text-xs text-blue-600 dark:text-blue-300 block">Always required, cannot be removed</span>
              </div>
            </div>
          </div>

          {/* All Manageable Properties Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">All Properties</h4>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Custom Property
              </button>
            </div>
            
            {properties.length > 0 ? (
              <div className="space-y-3">
                {properties.map((prop, index) => (
                  <div key={prop.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    prop.isCustom ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveProperty(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:text-gray-200"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveProperty(index, 'down')}
                        disabled={index === properties.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:text-gray-200"
                      >
                        ↓
                      </button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={prop.name}
                        onChange={(e) => handleUpdateProperty(prop.id, { name: e.target.value })}
                        placeholder="Property name"
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        readOnly={!prop.isCustom}
                      />
                      <select
                        value={prop.type}
                        onChange={(e) => handleUpdateProperty(prop.id, { type: e.target.value as any })}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        disabled={!prop.isCustom}
                      >
                        <option value="text">Text</option>
                        <option value="date">Date</option>
                        <option value="select">Select</option>
                        <option value="textarea">Text Area</option>
                      </select>
                      <select
                        value={prop.appliesTo || 'both'}
                        onChange={(e) => handleUpdateProperty(prop.id, { appliesTo: e.target.value as any })}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        disabled={!prop.isCustom}
                      >
                        <option value="both">Animals & Samples</option>
                        <option value="animal">Animals Only</option>
                        <option value="sample">Samples Only</option>
                      </select>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={prop.required}
                            onChange={(e) => handleUpdateProperty(prop.id, { required: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            disabled={!prop.isCustom}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                        </label>
                        <span className={`text-xs px-2 py-1 rounded transition-colors ${
                          prop.isCustom ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        }`}>
                          {prop.isCustom ? 'Custom' : 'Built-in'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteProperty(prop.id, !prop.isCustom)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                      title={prop.isCustom ? 'Delete custom property' : 'Delete built-in property (Warning: this cannot be easily restored)'}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                No properties available. Click "Add Custom Property" to create one.
              </p>
            )}
          </div>

          {/* Add Property Form */}
          {showAddForm && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 transition-colors">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Add New Property</h5>
              <div className="grid grid-cols-4 gap-3 mb-3">
                                  <input
                    type="text"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    placeholder="Property name"
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                                  <select
                    value={newProperty.type}
                    onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value as any })}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                  >
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  <option value="textarea">Text Area</option>
                </select>
                                  <select
                    value={newProperty.appliesTo}
                    onChange={(e) => setNewProperty({ ...newProperty, appliesTo: e.target.value as any })}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                  >
                  <option value="both">Animals & Samples</option>
                  <option value="animal">Animals Only</option>
                  <option value="sample">Samples Only</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newProperty.required}
                    onChange={(e) => setNewProperty({ ...newProperty, required: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddProperty}
                  disabled={!newProperty.name?.trim()}
                  className="btn-primary text-sm px-3 py-2"
                >
                  Add Property
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleApplyToAll}
              className="btn-primary"
            >
              Apply Properties to All Animals
            </button>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
