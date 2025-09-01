import React from 'react';
import { HomeIcon, PlusIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  onAddProject?: () => void;
  onAddExperiment?: () => void;
  onAddProperty?: () => void;
  onAddAnimal?: () => void;
  showExperimentActions?: boolean;
}

export function Sidebar({ 
  onAddProject, 
  onAddExperiment, 
  onAddProperty, 
  onAddAnimal, 
  showExperimentActions = false 
}: SidebarProps) {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleExportData = () => {
    try {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        data: state
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `research-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      try {
        console.log('✅ Data exported successfully');
      } catch (e) {
        // Silently handle console errors
      }
    } catch (error) {
              try {
          console.error('❌ Failed to export data:', error);
        } catch (e) {
          // Silently handle console errors
        }
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate the imported data structure
        if (importedData.data && importedData.data.projects) {
          const confirmed = window.confirm(
            'This will replace all your current data with the imported data. Are you sure you want to continue?'
          );
          
          if (confirmed) {
            dispatch({ type: 'LOAD_STATE', payload: importedData.data });
            try {
              console.log('✅ Data imported successfully');
            } catch (e) {
              // Silently handle console errors
            }
            alert('Data imported successfully!');
          }
        } else {
          alert('Invalid file format. Please select a valid Research Manager backup file.');
        }
      } catch (error) {
        try {
          console.error('❌ Failed to import data:', error);
        } catch (e) {
          // Silently handle console errors
        }
        alert('Failed to import data. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const generateBackup = () => {
    let backupText = 'Lab File Map - Backup Report\n';
    backupText += 'Generated: ' + new Date().toLocaleString() + '\n\n';

    state.projects.forEach(project => {
      backupText += `Project: ${project.name}\n`;
      backupText += `Description: ${project.description}\n`;
      backupText += `Created: ${new Date(project.createdAt).toLocaleString()}\n`;
      backupText += `Updated: ${new Date(project.updatedAt).toLocaleString()}\n\n`;

      if (project.experiments.length > 0) {
        backupText += 'Experiments:\n';
        project.experiments.forEach(experiment => {
          backupText += `  ${experiment.name}\n`;
          backupText += `  Description: ${experiment.description}\n`;
          backupText += `  Tags: ${experiment.tags?.join(', ') || 'None'}\n`;
          
          if (experiment.properties.length > 0) {
            backupText += '  Properties:\n';
            experiment.properties.forEach(expProperty => {
              const property = project.properties.find(p => p.id === expProperty.propertyId);
              const propertyName = property ? property.name : 'Unknown Property';
              backupText += `    ${propertyName}: ${expProperty.filePath || 'No file linked'}\n`;
            });
          }

          // Find animals associated with this experiment
          const associatedAnimals = project.animals.filter(animal => 
            animal.experimentIds.includes(experiment.id)
          );
          
          if (associatedAnimals.length > 0) {
            backupText += '  Associated Animals/Samples:\n';
            associatedAnimals.forEach(animal => {
              const notesProperty = animal.properties.find(prop => prop.name === 'Notes');
              const notes = notesProperty?.value || 'No notes';
              backupText += `    - ${animal.name} (${animal.species || animal.type}): ${notes}\n`;
            });
          }
          backupText += '\n';
        });
      }

              if (project.animals.length > 0) {
          backupText += 'Animals/Samples:\n';
          project.animals.forEach(animal => {
            const notesProperty = animal.properties.find(prop => prop.name === 'Notes');
            const notes = notesProperty?.value || 'No notes';
            backupText += `  ${animal.name} (${animal.type === 'animal' ? 'Animal' : 'Sample'}${animal.species ? ` - ${animal.species}` : ''})\n`;
            backupText += `  Notes: ${notes}\n`;
            backupText += `  Associated Experiments: ${animal.experimentIds.map(id => {
              const exp = project.experiments.find(e => e.id === id);
              return exp ? exp.name : 'Unknown';
            }).join(', ') || 'None'}\n\n`;
          });
        }
      backupText += '─'.repeat(50) + '\n\n';
    });

    // Create and download the backup file
    const blob = new Blob([backupText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-file-map-backup-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sidebar w-64 flex-shrink-0 h-full bg-white dark:bg-gray-800 transition-colors">
      <div className="flex flex-col h-full">
        <div className="space-y-6 flex-1">
        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <HomeIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Home</span>
        </button>

        {/* Add Project Button */}
        {onAddProject && (
          <button
            onClick={onAddProject}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <PlusIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Add Project</span>
          </button>
        )}

        {/* Experiment Actions */}
        {showExperimentActions && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Experiment Actions
            </h3>
            
            {onAddExperiment && (
              <button
                onClick={onAddExperiment}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Add Experiment</span>
              </button>
            )}

            {onAddProperty && (
              <button
                onClick={onAddProperty}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Add Property</span>
              </button>
            )}

            {onAddAnimal && (
              <button
                onClick={onAddAnimal}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Add Animal/Sample</span>
              </button>
            )}
          </div>
        )}

        </div>

        {/* Settings & Data Management - At Bottom */}
        <div className="mt-auto pt-6 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings & Data
          </h3>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          
          <button
            onClick={handleExportData}
            className="flex items-center space-x-3 w-full p-3 rounded-lg bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">Export Data</span>
          </button>
          
          <label className="flex items-center space-x-3 w-full p-3 rounded-lg bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer">
            <ArrowUpTrayIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          

        </div>
      </div>
    </div>
  );
}
