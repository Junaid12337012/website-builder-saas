import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { token } = JSON.parse(authStorage).state;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const projectService = {
  // Get all projects
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get project by ID
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Duplicate project
  duplicateProject: async (id) => {
    const response = await api.post(`/projects/${id}/duplicate`);
    return response.data;
  },

  // Update project elements (for real-time editor updates)
  updateElements: async (id, elements, action) => {
    const response = await api.put(`/projects/${id}/elements`, {
      elements,
      action,
    });
    return response.data;
  },

  // Get project history
  getProjectHistory: async (id, limit = 20) => {
    const response = await api.get(`/projects/${id}/history`, {
      params: { limit },
    });
    return response.data;
  },

  // Add collaborator
  addCollaborator: async (id, email, role) => {
    const response = await api.post(`/projects/${id}/collaborators`, {
      email,
      role,
    });
    return response.data;
  },

  // Export project as HTML
  exportHTML: async (id, options = {}) => {
    const response = await api.post(`/export/html/${id}`, options);
    return response.data;
  },

  // Export project as React
  exportReact: async (id, options = {}) => {
    const response = await api.post(`/export/react/${id}`, options);
    return response.data;
  },

  // Get preview URL
  getPreviewUrl: (id) => {
    return `${API_URL}/export/preview/${id}`;
  },

  // Publish to Netlify
  publishToNetlify: async (id, options = {}) => {
    const response = await api.post(`/publish/netlify/${id}`, options);
    return response.data;
  },

  // Publish to Vercel
  publishToVercel: async (id, options = {}) => {
    const response = await api.post(`/publish/vercel/${id}`, options);
    return response.data;
  },

  // Get publish status
  getPublishStatus: async (id) => {
    const response = await api.get(`/publish/status/${id}`);
    return response.data;
  },

  // Unpublish project
  unpublishProject: async (id) => {
    const response = await api.delete(`/publish/${id}`);
    return response.data;
  },
};

export default projectService;
