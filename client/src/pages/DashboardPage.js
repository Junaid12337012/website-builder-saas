import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Globe,
  Calendar,
  User,
  LogOut,
  Settings
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';
import projectService from '../services/projectService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projectsData, isLoading, error } = useQuery(
    ['projects', { search: searchTerm, status: filterStatus }],
    () => projectService.getProjects({ 
      search: searchTerm || undefined,
      status: filterStatus || undefined,
      limit: 50
    }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Create project mutation
  const createProjectMutation = useMutation(projectService.createProject, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('projects');
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      navigate(`/editor/${data.project._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation(projectService.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      toast.success('Project deleted successfully');
      setShowDeleteModal(false);
      setSelectedProject(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  });

  // Duplicate project mutation
  const duplicateProjectMutation = useMutation(projectService.duplicateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
      toast.success('Project duplicated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate project');
    }
  });

  const handleCreateProject = (projectData) => {
    createProjectMutation.mutate(projectData);
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProjectMutation.mutate(selectedProject._id);
    }
  };

  const handleDuplicateProject = (project) => {
    duplicateProjectMutation.mutate(project._id);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const projects = projectsData?.projects || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">WebBuilder</h1>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
              >
                <div className="text-right">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="py-1">
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h2>
          <p className="text-gray-600">Create and manage your website projects</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-auto"
          >
            <option value="">All Projects</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load projects</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm || filterStatus ? (
              <div>
                <p className="text-gray-500 mb-4">No projects match your search</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('');
                  }}
                  className="btn-outline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first project to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewMode={viewMode}
                onEdit={() => navigate(`/editor/${project._id}`)}
                onDuplicate={() => handleDuplicateProject(project)}
                onDelete={() => {
                  setSelectedProject(project);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {projectsData?.pagination && projectsData.pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {[...Array(projectsData.pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-2 rounded-lg ${
                    i + 1 === projectsData.pagination.current
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={createProjectMutation.isLoading}
        />
      )}

      {showDeleteModal && selectedProject && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProject(null);
          }}
          onConfirm={handleDeleteProject}
          loading={deleteProjectMutation.isLoading}
          title="Delete Project"
          message={`Are you sure you want to delete "${selectedProject.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default DashboardPage;
