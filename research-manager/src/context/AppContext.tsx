import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Project, Experiment, Animal, Property, ProjectAnimalProperty } from '../types';

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  searchQuery: string;
  filters: { query: string; tags: string[] };
}

type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'ADD_EXPERIMENT'; payload: { projectId: string; experiment: Experiment } }
  | { type: 'UPDATE_EXPERIMENT'; payload: { projectId: string; experimentId: string; updates: Partial<Experiment> } }
  | { type: 'DELETE_EXPERIMENT'; payload: { projectId: string; experimentId: string } }
  | { type: 'ADD_ANIMAL'; payload: { projectId: string; animal: Animal } }
  | { type: 'UPDATE_ANIMAL'; payload: { projectId: string; animalId: string; updates: Partial<Animal> } }
  | { type: 'DELETE_ANIMAL'; payload: { projectId: string; animalId: string } }
  | { type: 'ADD_PROPERTY'; payload: { projectId: string; property: Property } }
  | { type: 'UPDATE_PROPERTY'; payload: { projectId: string; property: Property } }
  | { type: 'DELETE_PROPERTY'; payload: { projectId: string; propertyId: string } }
  | { type: 'UPDATE_EXPERIMENT_PROPERTY'; payload: { projectId: string; experimentId: string; propertyId: string; filePath?: string; fileName?: string; folderPath?: string } }
  | { type: 'LINK_ANIMAL_TO_EXPERIMENTS'; payload: { projectId: string; animalId: string; experimentIds: string[] } }
  | { type: 'ADD_ANIMAL_PROPERTY'; payload: { projectId: string; property: ProjectAnimalProperty } }
  | { type: 'UPDATE_ANIMAL_PROPERTY'; payload: { projectId: string; propertyId: string; updates: Partial<ProjectAnimalProperty> } }
  | { type: 'DELETE_ANIMAL_PROPERTY'; payload: { projectId: string; propertyId: string } }
  | { type: 'APPLY_ANIMAL_PROPERTIES_TO_ALL'; payload: { projectId: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: { query: string; tags: string[] } }
  | { type: 'CLEAR_SEARCH'; payload: void };

const initialState: AppState = {
  projects: [],
  currentProject: null,
  searchQuery: '',
  filters: { query: '', tags: [] },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...action.payload,
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p),
        currentProject: state.currentProject?.id === action.payload.id ? { ...state.currentProject, ...action.payload.updates } : state.currentProject,
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };
    
    case 'ADD_EXPERIMENT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, experiments: [...p.experiments, action.payload.experiment] }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, experiments: [...state.currentProject.experiments, action.payload.experiment] }
          : state.currentProject,
      };
    
    case 'UPDATE_EXPERIMENT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, experiments: p.experiments.map(e => e.id === action.payload.experimentId ? { ...e, ...action.payload.updates } : e) }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, experiments: state.currentProject.experiments.map(e => e.id === action.payload.experimentId ? { ...e, ...action.payload.updates } : e) }
          : state.currentProject,
      };
    
    case 'DELETE_EXPERIMENT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, experiments: p.experiments.filter(e => e.id !== action.payload.experimentId) }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, experiments: state.currentProject.experiments.filter(e => e.id !== action.payload.experimentId) }
          : state.currentProject,
      };
    
    case 'ADD_ANIMAL':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, animals: [...p.animals, action.payload.animal] }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, animals: [...state.currentProject.animals, action.payload.animal] }
          : state.currentProject,
      };
    
    case 'UPDATE_ANIMAL':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, animals: p.animals.map(a => a.id === action.payload.animalId ? { ...a, ...action.payload.updates } : a) }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, animals: state.currentProject.animals.map(a => a.id === action.payload.animalId ? { ...a, ...action.payload.updates } : a) }
          : state.currentProject,
      };
    
    case 'DELETE_ANIMAL':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, animals: p.animals.filter(a => a.id !== action.payload.animalId) }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, animals: state.currentProject.animals.filter(a => a.id !== action.payload.animalId) }
          : state.currentProject,
      };
    
    case 'ADD_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, properties: [...p.properties, action.payload.property] }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, properties: [...state.currentProject.properties, action.payload.property] }
          : state.currentProject,
      };
    
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, properties: p.properties.map(prop => prop.id === action.payload.property.id ? action.payload.property : prop) }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, properties: state.currentProject.properties.map(prop => prop.id === action.payload.property.id ? action.payload.property : prop) }
          : state.currentProject,
      };
    
    case 'DELETE_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                properties: p.properties.filter(prop => prop.id !== action.payload.propertyId),
                experiments: p.experiments.map(exp => ({
                  ...exp,
                  properties: exp.properties.filter(ep => ep.propertyId !== action.payload.propertyId)
                }))
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              properties: state.currentProject.properties.filter(prop => prop.id !== action.payload.propertyId),
              experiments: state.currentProject.experiments.map(exp => ({
                ...exp,
                properties: exp.properties.filter(ep => ep.propertyId !== action.payload.propertyId)
              }))
            }
          : state.currentProject,
      };
    
    case 'UPDATE_EXPERIMENT_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                experiments: p.experiments.map(e => 
                  e.id === action.payload.experimentId 
                    ? { 
                        ...e, 
                        properties: (() => {
                          // Check if property already exists
                          const existingProperty = e.properties.find(ep => ep.propertyId === action.payload.propertyId);
                          if (existingProperty) {
                            // Update existing property
                            return e.properties.map(ep => 
                              ep.propertyId === action.payload.propertyId 
                                ? { 
                                    ...ep, 
                                    filePath: action.payload.filePath, 
                                    fileName: action.payload.fileName,
                                    folderPath: action.payload.folderPath 
                                  }
                                : ep
                            );
                          } else {
                            // Add new property
                            return [...e.properties, {
                              propertyId: action.payload.propertyId,
                              filePath: action.payload.filePath,
                              fileName: action.payload.fileName,
                              folderPath: action.payload.folderPath
                            }];
                          }
                        })()
                      }
                    : e
                ) 
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              experiments: state.currentProject.experiments.map(e => 
                e.id === action.payload.experimentId 
                  ? { 
                      ...e, 
                      properties: (() => {
                        // Check if property already exists
                        const existingProperty = e.properties.find(ep => ep.propertyId === action.payload.propertyId);
                        if (existingProperty) {
                          // Update existing property
                          return e.properties.map(ep => 
                            ep.propertyId === action.payload.propertyId 
                              ? { ...ep, filePath: action.payload.filePath, fileName: action.payload.fileName }
                              : ep
                          );
                        } else {
                          // Add new property
                          return [...e.properties, {
                            propertyId: action.payload.propertyId,
                            filePath: action.payload.filePath,
                            fileName: action.payload.fileName
                          }];
                        }
                      })()
                    }
                  : e
              ) 
            }
          : state.currentProject,
      };
    
    case 'LINK_ANIMAL_TO_EXPERIMENTS':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                animals: p.animals.map(a => 
                  a.id === action.payload.animalId 
                    ? { ...a, experimentIds: action.payload.experimentIds }
                    : a
                )
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              animals: state.currentProject.animals.map(a => 
                a.id === action.payload.animalId 
                  ? { ...a, experimentIds: action.payload.experimentIds }
                  : a
              )
            }
          : state.currentProject,
      };
    
    case 'ADD_ANIMAL_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                animalProperties: [...(p.animalProperties || []), action.payload.property]
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              animalProperties: [...(state.currentProject.animalProperties || []), action.payload.property]
            }
          : state.currentProject,
      };
    
    case 'UPDATE_ANIMAL_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                animalProperties: (p.animalProperties || []).map(prop => 
                  prop.id === action.payload.propertyId 
                    ? { ...prop, ...action.payload.updates }
                    : prop
                )
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              animalProperties: (state.currentProject.animalProperties || []).map(prop => 
                prop.id === action.payload.propertyId 
                  ? { ...prop, ...action.payload.updates }
                  : prop
              )
            }
          : state.currentProject,
      };
    
    case 'DELETE_ANIMAL_PROPERTY':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                animalProperties: (p.animalProperties || []).filter(prop => prop.id !== action.payload.propertyId),
                // Track deleted built-in properties
                deletedBuiltInProperties: [
                  ...(p.deletedBuiltInProperties || []),
                  action.payload.propertyId
                ].filter((id, index, arr) => arr.indexOf(id) === index), // Remove duplicates
                // Also remove the property from all animals
                animals: p.animals.map(a => ({
                  ...a,
                  properties: a.properties.filter(prop => prop.name !== action.payload.propertyId && prop.id !== action.payload.propertyId)
                }))
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              animalProperties: (state.currentProject.animalProperties || []).filter(prop => prop.id !== action.payload.propertyId),
              // Track deleted built-in properties in current project
              deletedBuiltInProperties: [
                ...(state.currentProject.deletedBuiltInProperties || []),
                action.payload.propertyId
              ].filter((id, index, arr) => arr.indexOf(id) === index), // Remove duplicates
              // Also remove the property from all animals in current project
              animals: state.currentProject.animals.map(a => ({
                ...a,
                properties: a.properties.filter(prop => prop.name !== action.payload.propertyId && prop.id !== action.payload.propertyId)
              }))
            }
          : state.currentProject,
      };
    
    case 'APPLY_ANIMAL_PROPERTIES_TO_ALL':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { 
                ...p, 
                animals: p.animals.map(a => {
                  // Get the project's animal properties configuration
                  const projectProperties = p.animalProperties || [];
                  
                  // Create a map of existing animal properties
                  const existingPropsMap = new Map(a.properties.map(prop => [prop.name, prop]));
                  
                  // Create new properties array based on project configuration
                  const newProperties = projectProperties.map(projectProp => {
                    const existingProp = existingPropsMap.get(projectProp.name);
                    return {
                      id: existingProp?.id || `prop_${Date.now()}_${Math.random()}`,
                      name: projectProp.name,
                      value: existingProp?.value || projectProp.defaultValue || '',
                      type: projectProp.type,
                      required: projectProp.required
                    };
                  });
                  
                  return {
                    ...a,
                    properties: newProperties
                  };
                })
              }
            : p
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { 
              ...state.currentProject, 
              animals: state.currentProject!.animals.map(a => {
                // Get the project's animal properties configuration
                const projectProperties = state.currentProject!.animalProperties || [];
                
                // Create a map of existing animal properties
                const existingPropsMap = new Map(a.properties.map(prop => [prop.name, prop]));
                
                // Create new properties array based on project configuration
                const newProperties = projectProperties.map(projectProp => {
                  const existingProp = existingPropsMap.get(projectProp.name);
                  return {
                    id: existingProp?.id || `prop_${Date.now()}_${Math.random()}`,
                    name: projectProp.name,
                    value: existingProp?.value || projectProp.defaultValue || '',
                    type: projectProp.type,
                    required: projectProp.required
                  };
                });
                
                return {
                  ...a,
                  properties: newProperties
                };
              })
            }
          : state.currentProject,
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchQuery: '',
        filters: { query: '', tags: [] },
      };
    
    default:
      return state;
  }
}

// Migration function to convert old animal format to new format
function migrateAnimalData(animal: any): Animal {
  // Check if this is an old format animal (has age, weight, notes directly)
  if (animal.age !== undefined || animal.weight !== undefined || animal.notes !== undefined) {
    try {
      console.log('🔄 Migrating old animal format:', animal);
    } catch (e) {
      // Silently handle console errors
    }
    
    // Create new properties array based on available data
    const properties = [];
    
    // Add Animal ID property
    properties.push({
      id: `migrated_${animal.id}_name`,
      name: 'Animal ID',
      value: animal.name || '',
      type: 'text' as const,
      required: true
    });
    
    // Add Species property if exists
    if (animal.species) {
      properties.push({
        id: `migrated_${animal.id}_species`,
        name: 'Species',
        value: animal.species,
        type: 'text' as const
      });
    }
    
    // Add Age property if exists
    if (animal.age) {
      properties.push({
        id: `migrated_${animal.id}_age`,
        name: 'Date of Birth or Age',
        value: animal.age,
        type: 'text' as const
      });
    }
    
    // Add Weight property if exists
    if (animal.weight) {
      properties.push({
        id: `migrated_${animal.id}_weight`,
        name: 'Weight',
        value: animal.weight,
        type: 'text' as const
      });
    }
    
    // Add Notes property if exists
    if (animal.notes) {
      properties.push({
        id: `migrated_${animal.id}_notes`,
        name: 'Notes',
        value: animal.notes,
        type: 'textarea' as const
      });
    }
    
    // Create migrated animal
    const migratedAnimal: Animal = {
      id: animal.id,
      type: 'animal', // Default to animal type
      name: animal.name,
      species: animal.species,
      properties: properties,
      experimentIds: animal.experimentIds || [],
      displayProperties: animal.displayProperties || ['name', 'species'],
      createdAt: animal.createdAt ? new Date(animal.createdAt) : new Date()
    };
    
    try {
      console.log('✅ Migrated animal:', migratedAnimal);
    } catch (e) {
      // Silently handle console errors
    }
    return migratedAnimal;
  }
  
  // If it's already in new format, return as is
  return animal;
}

// Migration function to migrate all projects
function migrateProjectData(projects: any[]): Project[] {
  return projects.map(project => ({
    ...project,
    animals: project.animals ? project.animals.map(migrateAnimalData) : []
  }));
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getProjectById: (id: string) => Project | undefined;
  getExperimentById: (projectId: string, experimentId: string) => Experiment | undefined;
  getAnimalById: (projectId: string, animalId: string) => Animal | undefined;
  getPropertyById: (projectId: string, propertyId: string) => Property | undefined;
  searchProjects: (query: string, tags?: string[]) => Project[];
  searchExperiments: (projectId: string, query: string, tags?: string[]) => Experiment[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-save state whenever it changes (but not during initial load)
  useEffect(() => {
    // Skip saving during initial load or if state is empty
    if (!isInitialized || (state.projects.length === 0 && !state.currentProject)) {
      return;
    }

    try {
      if (window.electronAPI) {
        // In Electron: save to file system
        try {
      console.log('💾 Auto-saving state to file system:', state);
    } catch (e) {
      // Silently handle console errors
    }
        window.electronAPI.saveData(state).then((result: any) => {
          if (result) {
            try {
              console.log('✅ Successfully saved to file system');
            } catch (e) {
              // Silently handle console errors
            }
          } else {
            try {
              console.error('❌ Failed to save to file system - returned false');
            } catch (e) {
              // Silently handle console errors
            }
          }
        }).catch((error: any) => {
          try {
            console.error('❌ Error saving to file system:', error);
          } catch (e) {
            // Silently handle console errors
          }
        });
      } else {
        // In browser: save to localStorage
        try {
          console.log('💾 Auto-saving state to localStorage:', state);
        } catch (e) {
          // Silently handle console errors
        }
        localStorage.setItem('research-manager-state', JSON.stringify(state));
                  try {
            console.log('✅ Successfully saved to localStorage');
          } catch (e) {
            // Silently handle console errors
          }
      }
    } catch (error) {
      try {
        console.error('❌ Failed to save state:', error);
      } catch (e) {
        // Silently handle console errors
      }
    }
  }, [state, isInitialized]);
  
  // Load data on mount
  useEffect(() => {
    try {
      if (window.electronAPI) {
        // In Electron: load from file system
        try {
          console.log('🔍 Loading data from file system...');
        } catch (e) {
          // Silently handle console errors
        }
        window.electronAPI.loadData().then((savedState: any) => {
                      try {
              console.log('📦 Raw response from loadData:', savedState);
            } catch (e) {
              // Silently handle console errors
            }
          if (savedState && savedState.projects && savedState.projects.length > 0) {
                          try {
                console.log('📦 Loaded state from file system:', savedState);
              } catch (e) {
                // Silently handle console errors
              }
            // Apply migration if needed
            const migratedState = {
              ...savedState,
              projects: migrateProjectData(savedState.projects)
            };
                        try {
              console.log('🔄 Applied migration, dispatching migrated state');
            } catch (e) {
              // Silently handle console errors
            }
            dispatch({ type: 'LOAD_STATE', payload: migratedState });
          } else {
            try {
              console.log('📦 No valid data loaded from file system, using default state');
            } catch (e) {
              // Silently handle console errors
            }
          }
          // Mark as initialized after loading (regardless of whether data was loaded)
          setIsInitialized(true);
        }).catch((error: any) => {
          try {
            console.error('❌ Failed to load from file system:', error);
          } catch (e) {
            // Silently handle console errors
          }
          setIsInitialized(true);
        });
      } else {
        // In browser: load from localStorage
        try {
          console.log('🔍 Loading data from localStorage...');
        } catch (e) {
          // Silently handle console errors
        }
        const savedState = localStorage.getItem('research-manager-state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
                      try {
              console.log('📦 Loaded state from localStorage:', parsed);
            } catch (e) {
              // Silently handle console errors
            }
          // Apply migration if needed
          const migratedState = {
            ...parsed,
            projects: migrateProjectData(parsed.projects || [])
          };
          console.log('🔄 Applied migration, dispatching migrated state');
          dispatch({ type: 'LOAD_STATE', payload: migratedState });
        }
        setIsInitialized(true);
      }
    } catch (error) {
      try {
        console.error('❌ Failed to load saved state:', error);
      } catch (e) {
        // Silently handle console errors
      }
      setIsInitialized(true);
    }
  }, []);

  // Migration function for backward compatibility
  const migrateProjectData = (projects: any[]): Project[] => {
    return projects.map(project => ({
      ...project,
      // Ensure animalProperties field exists for backward compatibility
      animalProperties: project.animalProperties || [],
      // Ensure all animals have the required fields
      animals: (project.animals || []).map((animal: any) => ({
        ...animal,
        experimentIds: animal.experimentIds || [],
        displayProperties: animal.displayProperties || []
      }))
    }));
  };

  // Helper functions
  const getProjectById = (id: string) => state.projects.find(p => p.id === id);
  
  const getExperimentById = (projectId: string, experimentId: string) => {
    const project = getProjectById(projectId);
    return project?.experiments.find(e => e.id === experimentId);
  };
  
  const getAnimalById = (projectId: string, animalId: string) => {
    const project = getProjectById(projectId);
    return project?.animals.find(a => a.id === animalId);
  };
  
  const getPropertyById = (projectId: string, propertyId: string) => {
    const project = getProjectById(projectId);
    return project?.properties.find(p => p.id === propertyId);
  };
  
  const searchProjects = (query: string, tags: string[] = []) => {
    return state.projects.filter(project => {
      const matchesQuery = query === '' || 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesTags = tags.length === 0 || 
        tags.some(tag => project.experiments.some(exp => exp.tags.includes(tag)));
      
      return matchesQuery && matchesTags;
    });
  };
  
  const searchExperiments = (projectId: string, query: string, tags: string[] = []) => {
    const project = getProjectById(projectId);
    if (!project) return [];
    
    return project.experiments.filter(experiment => {
      const matchesQuery = query === '' || 
        experiment.name.toLowerCase().includes(query.toLowerCase()) ||
        experiment.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesTags = tags.length === 0 || 
        tags.some(tag => experiment.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      getProjectById, 
      getExperimentById, 
      getAnimalById, 
      getPropertyById,
      searchProjects,
      searchExperiments
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
