import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, FileText, Image, Calendar, Type } from 'lucide-react';
import { useToasts } from 'react-toast-notifications';
import { useCMSStore } from '../../stores/cmsStore';
import LoadingSpinner from '../LoadingSpinner';

const CreateContentModal = ({ isOpen, onClose, collection }) => {
  const [formData, setFormData] = useState({
    title: '',
    data: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createContent } = useCMSStore();
  const { addToast } = useToasts();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      addToast('Title is required', { appearance: 'error' });
      return;
    }

    if (!collection) {
      addToast('No collection selected', { appearance: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await createContent({
        title: formData.title,
        collectionId: collection._id,
        data: formData.data,
        status: 'draft'
      });
      addToast('Content created successfully', { appearance: 'success' });
      onClose();
      setFormData({ title: '', data: {} });
    } catch (error) {
      addToast(error.message || 'Failed to create content', { appearance: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const value = formData.data[field.name] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            rows={4}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'richtext':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${field.label} (Rich text editor would go here)`}
            rows={6}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="property-input"
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
        
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );
        
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder="Image URL"
              className="property-input"
              required={field.required}
            />
            <p className="text-xs text-gray-500">
              Enter image URL or use media library (feature coming soon)
            </p>
          </div>
        );
        
      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="property-input"
            required={field.required}
          />
        );
        
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="property-input"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        
      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleFieldChange(field.name, newValues);
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="property-input"
            required={field.required}
          />
        );
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
        className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Content</h2>
              {collection && (
                <p className="text-sm text-gray-600">in {collection.name}</p>
              )}
            </div>
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
            {/* Title */}
            <div>
              <label className="property-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter content title"
                className="property-input"
                required
              />
            </div>

            {/* Dynamic Fields */}
            {collection?.fields?.map((field, index) => (
              <div key={index}>
                <label className="property-label">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.type === 'richtext' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Rich text editor integration coming soon
                  </p>
                )}
              </div>
            ))}

            {!collection && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No collection selected</p>
              </div>
            )}
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
              disabled={isLoading || !collection}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Content
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateContentModal;
