import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; description: string }) => void;
  initialData: { name: string; description: string };
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EditProjectModal({ isOpen, onClose, onSave, initialData, title, size = 'md' }: EditProjectModalProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="Enter name"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={3}
            placeholder="Enter description"
          />
        </div>

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
            disabled={!formData.name.trim()}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface EditExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; description: string; tags: string[] }) => void;
  initialData: { name: string; description: string; tags: string[] };
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EditExperimentModal({ isOpen, onClose, onSave, initialData, title, size = 'md' }: EditExperimentModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="Enter experiment name"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={3}
            placeholder="Enter experiment description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input flex-1"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary px-3"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

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
            disabled={!formData.name.trim()}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface EditAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; species: string; age?: string; weight?: string; notes?: string }) => void;
  initialData: { name: string; species: string; age?: string; weight?: string; notes?: string };
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EditAnimalModal({ isOpen, onClose, onSave, initialData, title, size = 'md' }: EditAnimalModalProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.species.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="Enter animal name"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species *
          </label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            className="input"
            placeholder="Enter species"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="text"
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="input"
              placeholder="e.g., 2 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="text"
              value={formData.weight || ''}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="input"
              placeholder="e.g., 25 kg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input"
            rows={3}
            placeholder="Enter additional notes"
          />
        </div>

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
            disabled={!formData.name.trim() || !formData.species.trim()}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
