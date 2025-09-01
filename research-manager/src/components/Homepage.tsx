import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ProjectCard } from './ProjectCard';
import { SearchBar } from './SearchBar';
import { useApp } from '../context/AppContext';
import { Project, Property } from '../types';
import { generateId } from '../utils/helpers';

export function Homepage() {
  const { state, dispatch, searchProjects } = useApp();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  const handleAddProject = () => {
    if (newProjectName.trim() && newProjectDescription.trim()) {
      const defaultProperties: Property[] = [
        { id: generateId(), name: 'Notes', type: 'notes' },
        { id: generateId(), name: 'Protocol', type: 'protocol' },
        { id: generateId(), name: 'Raw Data', type: 'rawData' },
      ];

      const newProject: Project = {
        id: generateId(),
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        properties: defaultProperties,
        experiments: [],
        animals: [],
        animalProperties: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_PROJECT', payload: newProject });

      setNewProjectName('');
      setNewProjectDescription('');
      setIsAddingProject(false);
    }
  };

  // Filter projects based on search query
  const filteredProjects = state.projects.filter(project => {
    const matchesQuery = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });



  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 h-full transition-colors">
      <Sidebar onAddProject={() => setIsAddingProject(true)} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Research Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your research projects and experiments
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search projects and experiments..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="max-w-md"
            />
          </div>

          {/* Add Project Modal */}
          {isAddingProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Create New Project
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> New projects will automatically include default properties: Notes, Protocol, and Raw Data. You can add more properties later.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProject}
                    className="btn-primary flex-1"
                  >
                    Create Project
                  </button>
                  <button
                    onClick={() => setIsAddingProject(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {state.projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {state.projects.length === 0 
                  ? 'Get started by creating your first research project'
                  : 'Try adjusting your search criteria or tags'
                }
              </p>
              {state.projects.length === 0 && (
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="btn-primary"
                >
                  Create Project
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
