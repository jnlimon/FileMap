export interface Property {
  id: string;
  name: string;
  type: 'notes' | 'protocol' | 'rawData' | 'results' | 'custom' | 'folder';
  customType?: string;
}

export interface ExperimentProperty {
  propertyId: string;
  filePath?: string;
  fileName?: string;
  folderPath?: string; // For folder properties
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  properties: ExperimentProperty[];
  tags: string[];
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string, for date ranges
  linkedAnimalIds: string[]; // Animals/samples linked to this experiment
  createdAt: Date;
  updatedAt: Date;
}

export interface AnimalProperty {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'date' | 'select' | 'textarea';
  required?: boolean;
}

// New interface for project-level animal property configuration
export interface ProjectAnimalProperty {
  id: string;
  name: string;
  type: 'text' | 'date' | 'select' | 'textarea';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // For select type
  isCustom: boolean; // Whether this is a custom property or built-in
  order: number; // Display order
  appliesTo: 'animal' | 'sample' | 'both'; // Which type of entity this property applies to
}

export interface Animal {
  id: string;
  type: 'animal' | 'sample';
  name: string;
  species?: string;
  properties: AnimalProperty[];
  experimentIds: string[]; // Link to multiple experiments
  displayProperties?: string[]; // Properties to show on the card
  createdAt: Date;
}

export interface AnimalCardSettings {
  id: string;
  projectId: string;
  displayProperties: string[]; // Default properties to show on animal cards
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  properties: Property[];
  experiments: Experiment[];
  animals: Animal[];
  animalProperties: ProjectAnimalProperty[]; // New: project-level animal property configuration
  deletedBuiltInProperties?: string[]; // Track which built-in properties have been deleted
  createdAt: Date;
  updatedAt: Date;
}
