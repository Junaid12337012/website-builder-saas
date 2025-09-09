import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const templateService = {
  // Get all templates with filtering
  getTemplates: async (params = {}) => {
    const response = await api.get('/templates', { params });
    return response.data;
  },

  // Get template categories
  getCategories: async () => {
    const response = await api.get('/templates/categories');
    return response.data;
  },

  // Get popular templates
  getPopularTemplates: async (limit = 10) => {
    const response = await api.get('/templates/popular', { params: { limit } });
    return response.data;
  },

  // Get templates by category
  getTemplatesByCategory: async (category, options = {}) => {
    const response = await api.get(`/templates/category/${category}`, { params: options });
    return response.data;
  },

  // Get single template
  getTemplate: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  // Use template (increment usage count)
  useTemplate: async (id) => {
    const response = await api.post(`/templates/${id}/use`);
    return response.data;
  },

  // Rate template
  rateTemplate: async (id, rating) => {
    const response = await api.post(`/templates/${id}/rate`, { rating });
    return response.data;
  },

  // Create new template
  createTemplate: async (templateData) => {
    const response = await api.post('/templates', templateData);
    return response.data;
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  // Get user's templates
  getMyTemplates: async (params = {}) => {
    const response = await api.get('/templates/user/my-templates', { params });
    return response.data;
  },

  // Search templates
  searchTemplates: async (searchTerm, filters = {}) => {
    const params = { search: searchTerm, ...filters };
    const response = await api.get('/templates', { params });
    return response.data;
  }
};

export default templateService;
