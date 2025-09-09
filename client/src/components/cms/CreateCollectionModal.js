import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Database, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCMSStore } from '../../stores/cmsStore';
import cmsService from '../../services/cmsService';
import LoadingSpinner from '../LoadingSpinner';

const CreateCollectionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fields: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createCollection } = useCMSStore();

  const fieldTypes = [
    { value: 'text', label: 'Text', description: 'Single line text input' },
    { value: 'textarea', label: 'Textarea', description: 'Multi-line text input' },
    { value: 'richtext', label: 'Rich Text', description: 'WYSIWYG editor' },
    { value: 'number', label: 'Number', description: 'Numeric input' },
    { value: 'boolean', label: 'Boolean', description: 'True/false checkbox' },
    { value: 'date', label: 'Date', description: 'Date picker' },
    { value: 'image', label: 'Image', description: 'Image upload' },
    { value: 'url', label: 'URL', description: 'URL input with validation' },
    { value: 'email', label: 'Email', description: 'Email input with validation' },
    { value: 'select', label: 'Select', description: 'Dropdown selection' },
    { value: 'multiselect', label: 'Multi-select', description: 'Multiple choice selection' }
  ];

  const templates = [
    {
      name: 'Blog',
      description: 'Perfect for blog posts and articles',
      icon: '📝',
      template: cmsService.getBlogTemplate()
    },
    {
      name: 'Product',
      description: 'E-commerce product catalog',
      icon: '🛍️',
      template: cmsService.getProductTemplate()
    },
    {
      name: 'Portfolio',
      description: 'Showcase projects and work',
      icon: '🎨',
      template: cmsService.getPortfolioTemplate()
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: '',
          type: 'text',
          label: '',
          required: false,
          options: []
        }
      ]
    }));
  };

  const updateField = (index, field) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? field : f)
    }));
  };

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (template) => {
    setFormData({
      name: template.name,
      description: template.description,
      fields: template.fields
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    if (formData.fields.length === 0) {
      toast.error('At least one field is required');
      return;
    }

    // Validate fields
    for (let i = 0; i < formData.fields.length; i++) {
      const field = formData.fields[i];
      if (!field.name.trim() || !field.label.trim()) {
        toast.error(`Field ${i + 1} name and label are required`);
        return;
      }
    }

    setIsLoading(true);
    try {
      await createCollection(formData);
      toast.success('Collection created successfully');
      onClose();
      setFormData({ name: '', description: '', fields: [] });
    } catch (error) {
      toast.error(error.message || 'Failed to create collection');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Create Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Templates */}
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Quick Start Templates</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyTemplate(template.template)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="property-label">Collection Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Blog Posts"
                  className="property-input"
                  required
                />
              </div>
              <div>
                <label className="property-label">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this collection"
                  className="property-input"
                />
              </div>
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Fields</h3>
                <button
                  type="button"
                  onClick={addField}
                  className="btn-outline flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <FieldEditor
                    key={index}
                    field={field}
                    fieldTypes={fieldTypes}
                    onChange={(updatedField) => updateField(index, updatedField)}
                    onRemove={() => removeField(index)}
                  />
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No fields added yet</p>
                    <button
                      type="button"
                      onClick={addField}
                      className="btn-primary"
                    >
                      Add Your First Field
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Create Collection
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FieldEditor = ({ field, fieldTypes, onChange, onRemove }) => {
  const handleFieldChange = (key, value) => {
    onChange({ ...field, [key]: value });
  };

  const handleOptionsChange = (options) => {
    onChange({ ...field, options: options.split(',').map(opt => opt.trim()).filter(opt => opt) });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="property-label">Field Name *</label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="fieldName"
            className="property-input text-sm"
          />
        </div>
        <div>
          <label className="property-label">Label *</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            placeholder="Display Label"
            className="property-input text-sm"
          />
        </div>
        <div>
          <label className="property-label">Type</label>
          <select
            value={field.type}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            className="property-input text-sm"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${field.name}`}
            checked={field.required}
            onChange={(e) => handleFieldChange('required', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor={`required-${field.name}`} className="ml-2 text-sm text-gray-700">
            Required field
          </label>
        </div>

        {(field.type === 'select' || field.type === 'multiselect') && (
          <div>
            <label className="property-label">Options (comma-separated)</label>
            <input
              type="text"
              value={field.options?.join(', ') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              placeholder="Option 1, Option 2, Option 3"
              className="property-input text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCollectionModal;
