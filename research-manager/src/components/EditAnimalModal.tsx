import React, { useState, useEffect } from 'react';
import { Animal, ProjectAnimalProperty } from '../types';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { UserIcon, BeakerIcon } from '@heroicons/react/24/outline';

interface EditAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  projectId: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EditAnimalModal({ 
  isOpen, 
  onClose, 
  animal, 
  projectId,
  title = 'Edit Animal',
  size = 'md' 
}: EditAnimalModalProps) {
  const { state, dispatch } = useApp();
  const project = state.projects.find(p => p.id === projectId);
  
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (animal && project) {
      // Initialize form data with current animal properties
      const initialData: Record<string, string> = {};
      
      // Add built-in properties
      initialData['name'] = animal.name;
      
      // Add all configured properties from the project
      const allProperties = [
        { name: 'name', label: 'Animal ID / Sample ID', type: 'text', required: true },
        { name: 'birthDate', label: 'Birth Date', type: 'date', required: false },
        { name: 'age', label: 'Age', type: 'text', required: false },
        { name: 'weight', label: 'Weight', type: 'text', required: false },
        { name: 'sex', label: 'Sex', type: 'text', required: false },
        { name: 'condition', label: 'Condition', type: 'text', required: false },
        { name: 'notes', label: 'Notes', type: 'textarea', required: false },
        ...(project.animalProperties || []).filter(prop => 
          prop.appliesTo === 'both' || 
          prop.appliesTo === (animal.type === 'animal' ? 'animal' : 'sample')
        ).map(prop => ({
          name: prop.name,
          label: prop.name,
          type: prop.type,
          required: prop.required
        }))
      ];
      
      allProperties.forEach(prop => {
        const existingProp = animal.properties.find(p => p.name === prop.name);
        initialData[prop.name] = existingProp?.value || '';
      });
      
      setFormData(initialData);
    }
  }, [animal, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) return;

    // Update animal properties
    const updatedProperties = animal.properties.map(prop => {
      const newValue = formData[prop.name];
      if (newValue !== undefined) {
        return { ...prop, value: newValue };
      }
      return prop;
    });

    // Add new properties that don't exist yet
    const existingPropNames = new Set(animal.properties.map(p => p.name));
    const allProperties = [
      { name: 'name', type: 'text' as const, required: true },
      { name: 'birthDate', type: 'date' as const, required: false },
      { name: 'age', type: 'text' as const, required: false },
      { name: 'weight', type: 'text' as const, required: false },
      { name: 'sex', type: 'text' as const, required: false },
      { name: 'condition', type: 'text' as const, required: false },
      { name: 'notes', type: 'textarea' as const, required: false },
      ...(project.animalProperties || []).filter(prop => 
        prop.appliesTo === 'both' || 
        prop.appliesTo === (animal.type === 'animal' ? 'animal' : 'sample')
      ).map(prop => ({
        name: prop.name,
        type: prop.type,
        required: prop.required || false
      }))
    ];

    allProperties.forEach(projectProp => {
      if (!existingPropNames.has(projectProp.name) && formData[projectProp.name]) {
        updatedProperties.push({
          id: `prop_${Date.now()}_${Math.random()}`,
          name: projectProp.name,
          value: formData[projectProp.name],
          type: projectProp.type,
          required: projectProp.required || false
        });
      }
    });

    dispatch({
      type: 'UPDATE_ANIMAL',
      payload: { 
        projectId, 
        animalId: animal.id, 
        updates: { 
          name: formData['name'] || animal.name,
          species: formData['species'] || animal.species,
          properties: updatedProperties
        }
      }
    });
    
    onClose();
  };

  const handleInputChange = (propertyName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [propertyName]: value
    }));
  };

  if (!project) return null;

  // Get all properties to display
  const allProperties = [
    { name: 'name', label: 'Animal ID / Sample ID', type: 'text' as const, required: true },
    { name: 'species', label: 'Species / Type', type: 'text' as const, required: true },
    { name: 'birthDate', label: 'Birth Date', type: 'date' as const, required: false },
    { name: 'age', label: 'Age', type: 'text' as const, required: false },
    { name: 'weight', label: 'Weight', type: 'text' as const, required: false },
    { name: 'sex', label: 'Sex', type: 'text' as const, required: false },
    { name: 'condition', label: 'Condition', type: 'text' as const, required: false },
    { name: 'notes', label: 'Notes', type: 'textarea' as const, required: false },
    ...(project.animalProperties || []).filter(prop => 
      prop.appliesTo === 'both' || 
      prop.appliesTo === (animal.type === 'animal' ? 'animal' : 'sample')
    ).map(prop => ({
      name: prop.name,
      label: prop.name,
      type: prop.type,
      required: prop.required
    }))
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center space-x-2">
          {animal.type === 'animal' ? (
            <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <BeakerIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          )}
          <span>{title}</span>
        </div>
      } 
      size={size}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {allProperties.map((prop) => (
          <div key={prop.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {prop.label} {prop.required && <span className="text-red-500">*</span>}
            </label>
            
            {prop.type === 'textarea' ? (
              <textarea
                value={formData[prop.name] || ''}
                onChange={(e) => handleInputChange(prop.name, e.target.value)}
                className="input"
                rows={3}
                placeholder={`Enter ${prop.label.toLowerCase()}`}
                required={prop.required}
              />
            ) : prop.type === 'date' ? (
              <input
                type="date"
                value={formData[prop.name] || ''}
                onChange={(e) => handleInputChange(prop.name, e.target.value)}
                className="input"
                required={prop.required}
              />
            ) : (
              <input
                type="text"
                value={formData[prop.name] || ''}
                onChange={(e) => handleInputChange(prop.name, e.target.value)}
                className="input"
                placeholder={`Enter ${prop.label.toLowerCase()}`}
                required={prop.required}
                autoFocus={prop.name === 'name'}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData['name']?.trim()}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

