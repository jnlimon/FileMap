import React, { useState } from 'react';
import { Experiment, Property, Animal, Project } from '../types';
import { formatDate, openFile, selectFileWithPermission } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { DocumentIcon, DocumentTextIcon, ClipboardDocumentIcon, ChartBarIcon, DocumentChartBarIcon, FolderIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from './ContextMenu';
import { EditExperimentModal } from './EditModal';
import { AnimalDetailModal } from './AnimalDetailModal';

interface ExperimentCardProps {
  experiment: Experiment;
  projectId: string;
  project: Project;
  globalProperties: Property[];
  linkedAnimals: Animal[];
}

export function ExperimentCard({ experiment, projectId, project, globalProperties, linkedAnimals }: ExperimentCardProps) {
  const { dispatch } = useApp();
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnimalDetailModal, setShowAnimalDetailModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAnimalLinkModal, setShowAnimalLinkModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [propertySelectionMenu, setPropertySelectionMenu] = useState<{ propertyId: string; x: number; y: number } | null>(null);

  const handlePropertyClick = async (property: Property, event: React.MouseEvent) => {
    // Always show the selection menu to allow changing file/folder selection
    setPropertySelectionMenu({ 
      propertyId: property.id, 
      x: event.clientX, 
      y: event.clientY 
    });
  };

  const handleSelectFile = async (propertyId: string) => {
    if (window.electronAPI?.selectFile) {
      const fileData = await window.electronAPI.selectFile();
      if (fileData && typeof fileData === 'object' && 'filePath' in fileData && 'fileName' in fileData) {
        const file = fileData as { filePath: string; fileName: string };
        dispatch({
          type: 'UPDATE_EXPERIMENT_PROPERTY',
          payload: { 
            projectId, 
            experimentId: experiment.id, 
            propertyId: propertyId, 
            filePath: file.filePath, 
            fileName: file.fileName 
          }
        });
      }
    }
    setPropertySelectionMenu(null);
  };

  const handleSelectFolder = async (propertyId: string) => {
    if (window.electronAPI?.selectFolder) {
      const folderData = await window.electronAPI.selectFolder();
      if (folderData && typeof folderData === 'object' && 'folderPath' in folderData && 'folderName' in folderData) {
        const folder = folderData as { folderPath: string; folderName: string };
        dispatch({
          type: 'UPDATE_EXPERIMENT_PROPERTY',
          payload: { 
            projectId, 
            experimentId: experiment.id, 
            propertyId: propertyId, 
            folderPath: folder.folderPath,
            fileName: folder.folderName || 'Selected Folder'
          }
        });
      }
    }
    setPropertySelectionMenu(null);
  };

  const handlePropertyDoubleClick = async (property: Property) => {
    // Double-click to open file or folder if it exists
    const existingProperty = experiment.properties.find(ep => ep.propertyId === property.id);
    if (existingProperty?.filePath) {
      await openFile(existingProperty.filePath, existingProperty.fileName || 'Unknown file');
    } else if (existingProperty?.folderPath) {
      await openFile(existingProperty.folderPath, existingProperty.fileName || 'Unknown folder');
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

  const handleEdit = () => {
    setShowEditModal(true);
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${experiment.name}"? This action cannot be undone.`)) {
      dispatch({ 
        type: 'DELETE_EXPERIMENT', 
        payload: { projectId, experimentId: experiment.id } 
      });
    }
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  const handleDeleteProperty = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the property click
    const isBuiltIn = ['notes', 'protocol', 'rawData', 'results'].includes(property.type);
    const warningMessage = isBuiltIn
      ? `Are you sure you want to delete the "${property.name}" property? This is a built-in property and will be removed from ALL experiment cards in this project. This action cannot be undone.`
      : `Are you sure you want to delete the "${property.name}" property? This will remove it from ALL experiment cards in this project. This action cannot be undone.`;
    
    if (window.confirm(warningMessage)) {
      dispatch({
        type: 'DELETE_PROPERTY',
        payload: { projectId, propertyId: property.id }
      });
    }
  };

  const handleSaveEdit = (updates: { name: string; description: string; tags: string[] }) => {
    dispatch({
      type: 'UPDATE_EXPERIMENT',
      payload: { projectId, experimentId: experiment.id, updates }
    });
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'notes':
        return <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      case 'protocol':
        return <ClipboardDocumentIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      case 'rawData':
        return <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      case 'results':
        return <DocumentChartBarIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      case 'folder':
        return <FolderIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      case 'custom':
        return <DocumentIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-600 dark:text-white" />;
    }
  };

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowAnimalDetailModal(true);
  };

  const getPropertyStatus = (property: Property) => {
    const existingProperty = experiment.properties.find(ep => ep.propertyId === property.id);
    return existingProperty;
  };

  return (
    <>
      <div className="card w-full" onContextMenu={handleContextMenu}>
        <div className="space-y-4">
          {/* Experiment Header */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                {experiment.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (!isEditMode) {
                      setShowEditModal(true);
                    } else {
                      setIsEditMode(false);
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded border transition-colors duration-200 whitespace-nowrap ${
                    isEditMode
                      ? 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {isEditMode ? 'Done Editing' : 'Edit'}
                </button>
                <button
                  onClick={() => setShowAnimalLinkModal(true)}
                  className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 flex-shrink-0 transition-colors"
                >
                  Link Animals/Samples
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm break-words">
              {experiment.description}
            </p>
            {(experiment.startDate || experiment.endDate) && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {experiment.startDate && experiment.endDate ? (
                  <span>{formatDate(new Date(experiment.startDate))} - {formatDate(new Date(experiment.endDate))}</span>
                ) : experiment.startDate ? (
                  <span>Started: {formatDate(new Date(experiment.startDate))}</span>
                ) : (
                  <span>Ended: {formatDate(new Date(experiment.endDate!))}</span>
                )}
              </div>
            )}
            {linkedAnimals.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Linked to {linkedAnimals.length} animal{linkedAnimals.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Properties</h4>
            <div className="space-y-2">
              {globalProperties.map((property) => {
                const propertyStatus = getPropertyStatus(property);
                const hasFile = propertyStatus?.filePath;
                const hasFolder = propertyStatus?.folderPath;
                const hasContent = hasFile || hasFolder;
                
                return (
                  <div
                    key={property.id}
                    onClick={(e) => handlePropertyClick(property, e)}
                    onDoubleClick={() => handlePropertyDoubleClick(property)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      hasContent 
                        ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50' 
                        : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    title={hasContent ? `Click to change or open: ${propertyStatus.fileName}` : 'Click to select file or folder'}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {hasFolder ? <FolderIcon className="h-5 w-5 text-gray-600 dark:text-white" /> : getPropertyIcon(property.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
                              {property.name}
                            </span>
                            {property.customType && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded flex-shrink-0">
                                {property.customType}
                              </span>
                            )}
                          </div>
                          {/* Show delete button only in edit mode - maintain consistent spacing */}
                          <div className="w-6 h-6 flex items-center justify-center">
                            {isEditMode && (
                              <button
                                onClick={(e) => handleDeleteProperty(property, e)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                title={`Delete ${property.name} property`}
                              >
                                <span className="text-xs">×</span>
                              </button>
                            )}
                          </div>
                        </div>
                        {hasContent ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-start space-x-2 min-w-0">
                              {hasFolder ? (
                                <FolderIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              ) : (
                                <DocumentIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              )}
                              <span className="break-all font-mono leading-relaxed word-break-all overflow-wrap-anywhere min-w-0 flex-1">
                                {propertyStatus.fileName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">Click to select file or folder</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {globalProperties.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No properties added yet. Use the sidebar to add properties.
                </div>
              )}
            </div>
          </div>

          {/* Linked Animals/Samples */}
          {linkedAnimals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Animals/Samples</h4>
              <div className="space-y-2">
                {linkedAnimals.map((animal) => (
                  <div 
                    key={animal.id} 
                    className={`flex items-center space-x-3 p-2 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      animal.type === 'animal'
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                        : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50'
                    }`}
                    onClick={() => handleAnimalClick(animal)}
                    title="Click to view details"
                  >
                    <IdentificationIcon className={`h-4 w-4 flex-shrink-0 ${
                      animal.type === 'animal' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
                          {animal.name}
                        </span>
                        <span className={`text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded flex-shrink-0 ${
                          animal.type === 'animal'
                            ? 'bg-blue-200 dark:bg-blue-800'
                            : 'bg-green-200 dark:bg-green-800'
                        }`}>
                          {animal.type === 'animal' ? 'Animal' : 'Sample'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h4>
            
            {/* Existing Tags */}
            {experiment.tags && experiment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {experiment.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        const updatedTags = experiment.tags.filter((_, i) => i !== index);
                        dispatch({
                          type: 'UPDATE_EXPERIMENT',
                          payload: { 
                            projectId, 
                            experimentId: experiment.id, 
                            updates: { tags: updatedTags } 
                          } 
                        });
                      }}
                      className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
                      title="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Quick Add Tag */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add tag..."
                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const newTag = e.currentTarget.value.trim();
                    if (!experiment.tags?.includes(newTag)) {
                      dispatch({
                        type: 'UPDATE_EXPERIMENT',
                        payload: { 
                          projectId, 
                          experimentId: experiment.id, 
                          updates: { 
                            tags: [...(experiment.tags || []), newTag] 
                          } 
                        }
                      });
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <span className="text-xs text-gray-400">Press Enter</span>
            </div>
          </div>

          {/* Experiment Footer */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Created: {formatDate(experiment.createdAt)}</span>
              <span>Updated: {formatDate(experiment.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
      >
        <ContextMenuItem onClick={handleEdit}>
          Edit Experiment
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          Delete Experiment
        </ContextMenuItem>
      </ContextMenu>

      {/* Edit Modal */}
      <EditExperimentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setIsEditMode(true); // Switch to inline edit mode after modal closes
        }}
        onSave={handleSaveEdit}
        initialData={{ 
          name: experiment.name, 
          description: experiment.description, 
          tags: experiment.tags || [] 
        }}
        title="Edit Experiment"
        size="sm"
      />

      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <AnimalDetailModal
          isOpen={showAnimalDetailModal}
          onClose={() => {
            setShowAnimalDetailModal(false);
            setSelectedAnimal(null);
          }}
          animal={selectedAnimal}
          project={project}
        />
      )}

      {/* Animal Link Modal */}
      {showAnimalLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Link Animals/Samples to {experiment.name}</h3>
            <button
              onClick={() => setShowAnimalLinkModal(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl transition-colors"
            >
              ×
            </button>
          </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {project.animals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No animals/samples available
                </p>
              ) : (
                project.animals.map(animal => {
                  const isLinked = animal.experimentIds?.includes(experiment.id) || false;
                  return (
                    <label
                      key={animal.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isLinked}
                        onChange={(e) => {
                          const experimentIds = animal.experimentIds || [];
                          const newExperimentIds = e.target.checked
                            ? [...experimentIds, experiment.id]
                            : experimentIds.filter(id => id !== experiment.id);
                          
                          dispatch({
                            type: 'LINK_ANIMAL_TO_EXPERIMENTS',
                            payload: {
                              projectId,
                              animalId: animal.id,
                              experimentIds: newExperimentIds
                            }
                          });
                        }}
                        className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{animal.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{animal.type === 'animal' ? 'Animal' : 'Sample'}</div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAnimalLinkModal(false)}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Selection Menu */}
      {propertySelectionMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setPropertySelectionMenu(null)}>
          <div 
            className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-48 transition-colors"
            style={{
              left: propertySelectionMenu.x,
              top: propertySelectionMenu.y,
              transform: 'translate(-50%, -100%)',
              marginTop: '-8px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
                         <div className="space-y-1">
               {(() => {
                 const existingProperty = experiment.properties.find(ep => ep.propertyId === propertySelectionMenu.propertyId);
                 const hasExisting = existingProperty?.filePath || existingProperty?.folderPath;
                 
                 return (
                   <>
                     {hasExisting && (
                       <button
                         onClick={async () => {
                           const pathToOpen = existingProperty?.filePath || existingProperty?.folderPath;
                           const nameToShow = existingProperty?.fileName || 'Unknown folder';
                           if (pathToOpen) {
                             await openFile(pathToOpen, nameToShow);
                           }
                           setPropertySelectionMenu(null);
                         }}
                         className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-2"
                       >
                         <DocumentIcon className="h-4 w-4" />
                         <span>Open Current: {existingProperty?.fileName || 'Unknown'}</span>
                       </button>
                     )}
                     <button
                       onClick={() => handleSelectFile(propertySelectionMenu.propertyId)}
                       className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-2"
                     >
                       <DocumentIcon className="h-4 w-4" />
                       <span>{hasExisting ? 'Change to File' : 'Select File'}</span>
                     </button>
                     <button
                       onClick={() => handleSelectFolder(propertySelectionMenu.propertyId)}
                       className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center space-x-2"
                     >
                       <FolderIcon className="h-4 w-4" />
                       <span>{hasExisting ? 'Change to Folder' : 'Select Folder'}</span>
                     </button>
                   </>
                 );
               })()}
             </div>
          </div>
        </div>
      )}
    </>
  );
}
