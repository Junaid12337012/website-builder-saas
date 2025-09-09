import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: null
  });
  const [errors, setErrors] = useState({});

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start from scratch with an empty canvas',
      thumbnail: null,
      elements: [],
      canvas: {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Perfect for product launches and marketing',
      thumbnail: null,
      elements: [
        {
          id: 'header-1',
          type: 'text',
          content: { text: 'Welcome to Our Product' },
          position: { x: 100, y: 50, z: 1 },
          dimensions: { width: 400, height: 60 },
          styles: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: { text: 'Build amazing things with our platform' },
          position: { x: 100, y: 120, z: 1 },
          dimensions: { width: 500, height: 30 },
          styles: {
            fontSize: '1.2rem',
            color: '#6b7280'
          }
        },
        {
          id: 'cta-button-1',
          type: 'button',
          content: { text: 'Get Started', href: '#' },
          position: { x: 100, y: 180, z: 1 },
          dimensions: { width: 150, height: 50 },
          styles: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500'
          }
        }
      ]
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase your work and skills',
      thumbnail: null,
      elements: [
        {
          id: 'name-1',
          type: 'text',
          content: { text: 'John Doe' },
          position: { x: 100, y: 50, z: 1 },
          dimensions: { width: 300, height: 50 },
          styles: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }
        },
        {
          id: 'title-1',
          type: 'text',
          content: { text: 'Creative Designer & Developer' },
          position: { x: 100, y: 110, z: 1 },
          dimensions: { width: 400, height: 30 },
          styles: {
            fontSize: '1.2rem',
            color: '#6b7280'
          }
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      template: template.id === 'blank' ? null : template
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      template: formData.template
    });
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', template: null });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="property-label">
                  Project Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="property-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="input resize-none"
                  placeholder="Describe your project (optional)"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="property-label">Choose a Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.template?.id === template.id || (template.id === 'blank' && !formData.template)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {template.id === 'blank' ? (
                        <FileText className="h-8 w-8 text-gray-400" />
                      ) : (
                        <div className="text-xs text-gray-500">Preview</div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Folder className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
