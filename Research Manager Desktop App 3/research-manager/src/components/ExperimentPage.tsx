import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ExperimentCard } from './ExperimentCard';
import { ExperimentRow } from './ExperimentRow';

import { SearchBar, TagFilter } from './SearchBar';
import { AnimalCard } from './AnimalCard';
import { AnimalPropertiesManager } from './AnimalPropertiesManager';

import { useApp } from '../context/AppContext';
import { Experiment, Animal, Property } from '../types';
import { generateId } from '../utils/helpers';
import { IdentificationIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export function ExperimentPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const [isAddingExperiment, setIsAddingExperiment] = useState(false);
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'row'>('card');

  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [newExperimentName, setNewExperimentName] = useState('');
  const [newExperimentDescription, setNewExperimentDescription] = useState('');
  const [newExperimentStartDate, setNewExperimentStartDate] = useState('');
  const [newExperimentEndDate, setNewExperimentEndDate] = useState('');
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [newAnimalName, setNewAnimalName] = useState('');
  const [newAnimalType, setNewAnimalType] = useState<'animal' | 'sample'>('animal');
  const [newAnimalSpecies, setNewAnimalSpecies] = useState('');
  const [newAnimalBirthDate, setNewAnimalBirthDate] = useState('');
  const [newAnimalWeight, setNewAnimalWeight] = useState('');
  const [newAnimalSex, setNewAnimalSex] = useState('');
  const [newAnimalCondition, setNewAnimalCondition] = useState('');
  const [newAnimalDate, setNewAnimalDate] = useState('');
  const [newAnimalNotes, setNewAnimalNotes] = useState('');
  const [customProperties, setCustomProperties] = useState<Array<{name: string, type: 'text' | 'date' | 'select' | 'textarea', value: string}>>([]);
  const [showCustomPropertyForm, setShowCustomPropertyForm] = useState(false);
  const [isManagingAnimalProperties, setIsManagingAnimalProperties] = useState(false);

  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyType, setNewPropertyType] = useState<'notes' | 'protocol' | 'rawData' | 'results' | 'custom' | 'folder'>('notes');

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMs = today.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    const ageInMonths = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageInYears > 0) {
      return `${ageInYears} year${ageInYears > 1 ? 's' : ''}`;
    } else if (ageInMonths > 0) {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`;
    } else {
      const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
      return `${ageInDays} day${ageInDays > 1 ? 's' : ''}`;
    }
  };

  // Custom property management functions
  const handleCustomPropertyChange = (index: number, field: 'name' | 'type', value: string) => {
    const updated = [...customProperties];
    updated[index] = { ...updated[index], [field]: value };
    setCustomProperties(updated);
  };

  const removeCustomProperty = (index: number) => {
    setCustomProperties(customProperties.filter((_, i) => i !== index));
  };

  const addCustomProperty = () => {
    setCustomProperties([...customProperties, { name: '', type: 'text' as const, value: '' }]);
  };
  const [customTypeName, setCustomTypeName] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Animal search state
  const [animalSearchQuery, setAnimalSearchQuery] = useState('');
  


  const project = state.projects.find(p => p.id === projectId);

  useEffect(() => {
    if (project) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    }
  }, [project, dispatch]);

  useEffect(() => {
    if (!project && state.projects.length > 0) {
      navigate('/');
    }
  }, [project, state.projects, navigate]);

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Project not found
          </h3>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddExperiment = () => {
    if (newExperimentName.trim() && newExperimentDescription.trim()) {
      const newExperiment: Experiment = {
        id: generateId(),
        name: newExperimentName.trim(),
        description: newExperimentDescription.trim(),
        properties: [],
        tags: [],
        startDate: newExperimentStartDate || undefined,
        endDate: newExperimentEndDate || undefined,
        linkedAnimalIds: selectedAnimalIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({
        type: 'ADD_EXPERIMENT',
        payload: { projectId: project.id, experiment: newExperiment }
      });

      setNewExperimentName('');
      setNewExperimentDescription('');
      setNewExperimentStartDate('');
      setNewExperimentEndDate('');
      setSelectedAnimalIds([]);
      setIsAddingExperiment(false);
    }
  };

  const handleAddAnimal = () => {
    if (newAnimalName.trim()) {
      // Create properties based on project-level configuration
      const builtInProperties = [
        { name: 'name', value: newAnimalName.trim(), type: 'text' as const, required: true },
        { name: 'species', value: newAnimalSpecies.trim() || '', type: 'text' as const, required: true },
        { name: 'birthDate', value: newAnimalBirthDate || '', type: 'date' as const, required: false },
        { name: 'age', value: calculateAge(newAnimalBirthDate), type: 'text' as const, required: false },
        { name: 'weight', value: newAnimalWeight.trim() || '', type: 'text' as const, required: false },
        { name: 'sex', value: newAnimalSex.trim() || '', type: 'select' as const, required: false },
        { name: 'condition', value: newAnimalCondition.trim() || '', type: 'text' as const, required: false },
        { name: 'notes', value: newAnimalNotes.trim() || '', type: 'textarea' as const, required: false }
      ];

      // Add project-level custom properties that apply to this type
      const customProperties = (project.animalProperties || [])
        .filter(prop => 
          prop.appliesTo === 'both' || 
          prop.appliesTo === newAnimalType
        )
        .map(prop => ({
          name: prop.name,
          value: prop.defaultValue || '',
          type: prop.type,
          required: prop.required || false
        }));

      // Combine built-in and custom properties
      const allProperties = [...builtInProperties, ...customProperties];

      // Convert to the format expected by Animal.properties
      const defaultProperties = allProperties.map(prop => ({
        id: generateId(),
        name: prop.name,
        value: prop.value,
        type: prop.type,
        required: prop.required
      }));

      const newAnimal: Animal = {
        id: generateId(),
        type: newAnimalType,
        name: newAnimalName.trim(),
        species: newAnimalSpecies.trim() || undefined,
        properties: defaultProperties,
        experimentIds: [],
        createdAt: new Date(),
      };

      dispatch({
        type: 'ADD_ANIMAL',
        payload: { projectId: project.id, animal: newAnimal }
      });

      setNewAnimalName('');
      setNewAnimalType('animal');
      setNewAnimalSpecies('');
      setNewAnimalBirthDate('');
      setNewAnimalWeight('');
      setNewAnimalSex('');
      setNewAnimalCondition('');
      setNewAnimalDate('');
      setNewAnimalNotes('');
      setCustomProperties([]);
      setIsAddingAnimal(false);
    }
  };

  const handleAddProperty = () => {
    if (newPropertyName.trim()) {
      const propertyType = newPropertyType === 'custom' ? 'custom' : newPropertyType;
      const customType = newPropertyType === 'custom' ? customTypeName : undefined;
      
      const newProperty: Property = {
        id: generateId(),
        name: newPropertyName.trim(),
        type: propertyType,
        customType,
      };

      dispatch({
        type: 'ADD_PROPERTY',
        payload: { projectId: project.id, property: newProperty }
      });

      setNewPropertyName('');
      setNewPropertyType('notes');
      setCustomTypeName('');
      setIsAddingProperty(false);
    }
  };



  // Get animals linked to specific experiments
  const getAnimalsForExperiment = (experimentId: string) => {
    return project.animals.filter(animal => animal.experimentIds?.includes(experimentId));
  };

  // Get all unique tags from experiments in this project
  const allTags = Array.from(new Set(
    project.experiments.flatMap(experiment => experiment.tags || [])
  ));

  // Filter experiments based on search query and tags
  const filteredExperiments = project.experiments.filter(experiment => {
    const matchesQuery = searchQuery === '' || 
      experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (experiment.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getAnimalsForExperiment(experiment.id).some(animal => 
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (animal.species && animal.species.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => experiment.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });

  // Filter animals based on search query
  const filteredAnimals = project.animals.filter(animal => {
    return animalSearchQuery === '' || 
      animal.name.toLowerCase().includes(animalSearchQuery.toLowerCase()) ||
      (animal.species && animal.species.toLowerCase().includes(animalSearchQuery.toLowerCase())) ||
      animal.properties.some(prop => 
        prop.value.toLowerCase().includes(animalSearchQuery.toLowerCase())
      );
  });

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 h-full transition-colors">
      <Sidebar 
        showExperimentActions={true}
        onAddExperiment={() => setIsAddingExperiment(true)}
        onAddProperty={() => setIsAddingProperty(true)}
        onAddAnimal={() => setIsAddingAnimal(true)}
      />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {project.description}
            </p>
            <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span>{project.experiments.length} Experiments</span>
              <span>{project.properties.length} Properties</span>
              <span>{project.animals.length} Animals/Samples</span>
            </div>
          </div>

          {/* Add Property Modal */}
          {isAddingProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Add New Property
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Name
                    </label>
                    <input
                      type="text"
                      value={newPropertyName}
                      onChange={(e) => setNewPropertyName(e.target.value)}
                      placeholder="e.g., Notes, Protocol, Raw Data"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Type
                    </label>
                    <select
                      value={newPropertyType}
                      onChange={(e) => setNewPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      <option value="notes">Notes</option>
                      <option value="protocol">Protocol</option>
                      <option value="rawData">Raw Data</option>
                      <option value="results">Results</option>
                      <option value="folder">Folder</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {newPropertyType === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Custom Type Name
                      </label>
                      <input
                        type="text"
                        value={customTypeName}
                        onChange={(e) => setCustomTypeName(e.target.value)}
                        placeholder="e.g., Images, Videos, Documents"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProperty}
                    className="btn-primary flex-1"
                  >
                    Add Property
                  </button>
                  <button
                    onClick={() => setIsAddingProperty(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Experiment Modal */}
          {isAddingExperiment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Create New Experiment
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experiment Name
                    </label>
                    <input
                      type="text"
                      value={newExperimentName}
                      onChange={(e) => setNewExperimentName(e.target.value)}
                      placeholder="Enter experiment name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newExperimentDescription}
                      onChange={(e) => setNewExperimentDescription(e.target.value)}
                      placeholder="Enter experiment description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newExperimentStartDate}
                        onChange={(e) => setNewExperimentStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={newExperimentEndDate}
                        onChange={(e) => setNewExperimentEndDate(e.target.value)}
                        min={newExperimentStartDate}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Animal Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Link Animals/Samples (Optional)
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 space-y-1 bg-white dark:bg-gray-700 transition-colors">
                      {project.animals.length > 0 ? (
                        project.animals.map((animal) => (
                          <label key={animal.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedAnimalIds.includes(animal.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAnimalIds([...selectedAnimalIds, animal.id]);
                                } else {
                                  setSelectedAnimalIds(selectedAnimalIds.filter(id => id !== animal.id));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {animal.name} ({animal.type === 'animal' ? 'Animal' : 'Sample'})
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No animals/samples available</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddExperiment}
                    className="btn-primary flex-1"
                  >
                    Create Experiment
                  </button>
                  <button
                    onClick={() => setIsAddingExperiment(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Animal Modal */}
          {isAddingAnimal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 transition-colors">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Add Animal/Sample
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewAnimalType('animal')}
                        className={`flex-1 py-2 px-3 rounded-md border transition-colors ${
                          newAnimalType === 'animal'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        Animal
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAnimalType('sample')}
                        className={`flex-1 py-2 px-3 rounded-md border transition-colors ${
                          newAnimalType === 'sample'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        Sample
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {newAnimalType === 'animal' ? 'Animal ID' : 'Sample ID'}
                    </label>
                    <input
                      type="text"
                      value={newAnimalName}
                      onChange={(e) => setNewAnimalName(e.target.value)}
                      placeholder={newAnimalType === 'animal' ? 'Enter animal ID' : 'Enter sample ID'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                  
                  {newAnimalType === 'animal' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Species
                      </label>
                      <input
                        type="text"
                        value={newAnimalSpecies}
                        onChange={(e) => setNewAnimalSpecies(e.target.value)}
                        placeholder="Enter species"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                  )}

                  {newAnimalType === 'animal' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Birth Date
                          </label>
                          <input
                            type="date"
                            value={newAnimalBirthDate || ''}
                            onChange={(e) => setNewAnimalBirthDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Weight
                          </label>
                          <input
                            type="text"
                            value={newAnimalWeight}
                            onChange={(e) => setNewAnimalWeight(e.target.value)}
                            placeholder="e.g., 25g"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sex
                        </label>
                        <select
                          value={newAnimalSex || ''}
                          onChange={(e) => setNewAnimalSex(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        >
                          <option value="">Select sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Condition
                        </label>
                        <input
                          type="text"
                          value={newAnimalCondition || ''}
                          onChange={(e) => setNewAnimalCondition(e.target.value)}
                          placeholder="e.g., Healthy, Sick, etc."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        />
                      </div>

                      {/* Project Custom Properties Section */}
                      {project.animalProperties && project.animalProperties.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom Properties</h4>
                          <div className="space-y-3">
                            {project.animalProperties
                              .filter(prop => prop.appliesTo === newAnimalType || prop.appliesTo === 'both')
                              .map((projectProp) => (
                                <div key={projectProp.id}>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {projectProp.name} {projectProp.required && <span className="text-red-500 dark:text-red-400">*</span>}
                                  </label>
                                  {projectProp.type === 'textarea' ? (
                                    <textarea
                                      value={customProperties.find(p => p.name === projectProp.name)?.value || ''}
                                      onChange={(e) => {
                                        const updatedProps = [...customProperties];
                                        const existingIndex = updatedProps.findIndex(p => p.name === projectProp.name);
                                        if (existingIndex >= 0) {
                                          updatedProps[existingIndex].value = e.target.value;
                                        } else {
                                          updatedProps.push({
                                            name: projectProp.name,
                                            value: e.target.value,
                                            type: projectProp.type
                                          });
                                        }
                                        setCustomProperties(updatedProps);
                                      }}
                                      placeholder={`Enter ${projectProp.name.toLowerCase()}`}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                      rows={3}
                                    />
                                  ) : projectProp.type === 'select' && projectProp.options && projectProp.options.length > 0 ? (
                                <select
                                      value={customProperties.find(p => p.name === projectProp.name)?.value || ''}
                                      onChange={(e) => {
                                        const updatedProps = [...customProperties];
                                        const existingIndex = updatedProps.findIndex(p => p.name === projectProp.name);
                                        if (existingIndex >= 0) {
                                          updatedProps[existingIndex].value = e.target.value;
                                        } else {
                                          updatedProps.push({
                                            name: projectProp.name,
                                            value: e.target.value,
                                            type: projectProp.type
                                          });
                                        }
                                        setCustomProperties(updatedProps);
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                    >
                                      <option value="">Select {projectProp.name.toLowerCase()}</option>
                                      {projectProp.options.map((option, idx) => (
                                        <option key={idx} value={option}>{option}</option>
                                      ))}
                                </select>
                                  ) : (
                                    <input
                                      type={projectProp.type === 'date' ? 'date' : 'text'}
                                      value={customProperties.find(p => p.name === projectProp.name)?.value || ''}
                                      onChange={(e) => {
                                        const updatedProps = [...customProperties];
                                        const existingIndex = updatedProps.findIndex(p => p.name === projectProp.name);
                                        if (existingIndex >= 0) {
                                          updatedProps[existingIndex].value = e.target.value;
                                        } else {
                                          updatedProps.push({
                                            name: projectProp.name,
                                            value: e.target.value,
                                            type: projectProp.type
                                          });
                                        }
                                        setCustomProperties(updatedProps);
                                      }}
                                      placeholder={`Enter ${projectProp.name.toLowerCase()}`}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    />
                                  )}
                              </div>
                            ))}
                          </div>
                      </div>
                      )}
                    </>
                  )}

                  {newAnimalType === 'sample' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newAnimalDate || ''}
                          onChange={(e) => setNewAnimalDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type of Sample
                        </label>
                        <input
                          type="text"
                          value={newAnimalSpecies}
                          onChange={(e) => setNewAnimalSpecies(e.target.value)}
                          placeholder="e.g., Blood, Tissue, etc."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newAnimalNotes}
                      onChange={(e) => setNewAnimalNotes(e.target.value)}
                      placeholder={newAnimalType === 'animal' ? 'Additional notes about the animal' : 'Additional notes about the sample'}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddAnimal}
                    className="btn-primary flex-1"
                  >
                    Add {newAnimalType === 'animal' ? 'Animal' : 'Sample'}
                  </button>
                  <button
                    onClick={() => setIsAddingAnimal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <SearchBar
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="max-w-md"
            />
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={(tag) => {
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
            />
          </div>

          {/* Experiments Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Experiments ({filteredExperiments.length})
              </h2>
              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'card'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Card View"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('row')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'row'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Row View"
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={() => setIsAddingExperiment(true)}
                  className="btn-primary"
                >
                  Add Experiment
                </button>
              </div>
            </div>
            
            {filteredExperiments.length > 0 ? (
              viewMode === 'card' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredExperiments.map((experiment) => (
                    <ExperimentCard 
                      key={experiment.id} 
                      experiment={experiment} 
                      projectId={project.id}
                      project={project}
                      globalProperties={project.properties}
                      linkedAnimals={getAnimalsForExperiment(experiment.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExperiments.map((experiment) => (
                    <ExperimentRow 
                      key={experiment.id} 
                      experiment={experiment} 
                      projectId={project.id}
                      project={project}
                      globalProperties={project.properties}
                      linkedAnimals={getAnimalsForExperiment(experiment.id)}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {project.experiments.length === 0 ? 'No experiments yet' : 'No experiments match your search'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {project.experiments.length === 0 
                    ? 'Start by creating your first experiment'
                    : 'Try adjusting your search criteria or tags'
                  }
                </p>
                {project.experiments.length === 0 && (
                  <button
                    onClick={() => setIsAddingExperiment(true)}
                    className="btn-primary"
                  >
                    Create Experiment
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Animals/Samples Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Animals/Samples
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsManagingAnimalProperties(true)}
                  className="btn-secondary"
                >
                  Manage Animal Properties
                </button>
                <button
                  onClick={() => setIsAddingAnimal(true)}
                  className="btn-primary"
                >
                  Add Animal/Sample
                </button>
              </div>
            </div>
            
            {/* Animal Search */}
            {project.animals.length > 0 && (
              <div className="mb-6">
                <SearchBar
                  placeholder="Search animals/samples..."
                  value={animalSearchQuery}
                  onChange={setAnimalSearchQuery}
                  className="max-w-md"
                />
                </div>
            )}
            
            {project.animals.length > 0 ? (
              filteredAnimals.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAnimals.map((animal) => {
                    const linkedExperiments = (animal.experimentIds || [])
                      .map(expId => project.experiments.find(e => e.id === expId))
                      .filter(Boolean)
                      .map(exp => ({ id: exp!.id, name: exp!.name }));
                    
                    return (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        projectId={project.id}
                        project={project}
                        linkedExperiments={linkedExperiments}
                      />
                    );
                  })}
                </div>
              </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <IdentificationIcon className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No animals/samples match your search
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your search criteria or clear the search to see all animals/samples.
                  </p>
                  <button
                    onClick={() => setAnimalSearchQuery('')}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <IdentificationIcon className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No animals/samples yet
                </h3>
                <p className="text-gray-500">
                  Use the "Add Animal/Sample" button above to get started
                </p>
              </div>
            )}
          </div>

          
        </div>
      </main>

      {/* Animal Properties Management Modal */}
      <AnimalPropertiesManager
        isOpen={isManagingAnimalProperties}
        onClose={() => setIsManagingAnimalProperties(false)}
          projectId={project.id}
      />

    </div>
  );
}
