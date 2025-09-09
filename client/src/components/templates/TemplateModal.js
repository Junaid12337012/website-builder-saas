import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, ShoppingBag, Briefcase, Check, AlertCircle, Plus } from 'lucide-react';
import { useToasts } from 'react-toast-notifications';
import { templates, templateCategories, getTemplate, applyTemplate, checkTemplateRequirements } from '../../templates';
import { useCMSStore } from '../../stores/cmsStore';

const TemplateModal = ({ isOpen, onClose, onApplyTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('blog');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { collections, fetchCollections } = useCMSStore();
  const { addToast } = useToasts();

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen, fetchCollections]);

  const getIconComponent = (iconName) => {
    const icons = {
      FileText,
      ShoppingBag,
      Briefcase
    };
    return icons[iconName] || FileText;
  };

  const handleTemplateSelect = (templateKey) => {
    const template = getTemplate(activeCategory, templateKey);
    setSelectedTemplate({ key: templateKey, ...template });
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;

    const templateData = applyTemplate(selectedTemplate);
    const requirements = checkTemplateRequirements(selectedTemplate, collections);

    if (!requirements.isCompatible) {
      addToast(
        `Template requires missing collections: ${requirements.missingCollections.join(', ')}`,
        { appearance: 'warning' }
      );
      return;
    }

    onApplyTemplate(templateData);
    addToast(`Template "${selectedTemplate.name}" applied successfully`, { appearance: 'success' });
    onClose();
  };

  const filteredTemplates = () => {
    const categoryTemplates = templates[activeCategory] || {};
    if (!searchQuery) return categoryTemplates;

    return Object.fromEntries(
      Object.entries(categoryTemplates).filter(([key, template]) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Choose Template</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 bg-gray-50">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Categories */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {templateCategories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSelectedTemplate(null);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">
                          {category.templates.length} templates
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Templates Grid */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(filteredTemplates()).map(([key, template]) => (
                  <TemplateCard
                    key={key}
                    templateKey={key}
                    template={template}
                    isSelected={selectedTemplate?.key === key}
                    onSelect={() => handleTemplateSelect(key)}
                    collections={collections}
                  />
                ))}
              </div>

              {Object.keys(filteredTemplates()).length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                </div>
              )}
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
                <TemplatePreview
                  template={selectedTemplate}
                  collections={collections}
                  onApply={handleApplyTemplate}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TemplateCard = ({ templateKey, template, isSelected, onSelect, collections }) => {
  const requirements = checkTemplateRequirements(template, collections);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      {/* Template Preview Image */}
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Preview</div>
      </div>

      {/* Template Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900">{template.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>

        {/* Requirements Status */}
        <div className="flex items-center space-x-2">
          {requirements.isCompatible ? (
            <div className="flex items-center text-green-600 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Compatible
            </div>
          ) : (
            <div className="flex items-center text-amber-600 text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Missing CMS data
            </div>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

const TemplatePreview = ({ template, collections, onApply }) => {
  const requirements = checkTemplateRequirements(template, collections);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
        <p className="text-sm text-gray-600">{template.description}</p>
      </div>

      {/* Requirements */}
      {template.cmsRequirements && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">CMS Requirements</h4>
          
          {/* Collections */}
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">Collections:</div>
            <div className="space-y-1">
              {template.cmsRequirements.collections?.map((collectionSlug) => {
                const hasCollection = collections.some(col => col.slug === collectionSlug);
                return (
                  <div key={collectionSlug} className="flex items-center text-xs">
                    {hasCollection ? (
                      <Check className="h-3 w-3 text-green-500 mr-2" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-2" />
                    )}
                    <span className={hasCollection ? 'text-green-700' : 'text-red-700'}>
                      {collectionSlug}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fields */}
          {Object.keys(template.cmsRequirements.fields || {}).length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">Required Fields:</div>
              <div className="space-y-2">
                {Object.entries(template.cmsRequirements.fields).map(([collectionSlug, fields]) => (
                  <div key={collectionSlug} className="text-xs">
                    <div className="font-medium text-gray-600 mb-1">{collectionSlug}:</div>
                    <div className="pl-2 space-y-1">
                      {fields.map((fieldName) => {
                        const collection = collections.find(col => col.slug === collectionSlug);
                        const hasField = collection?.fields?.some(field => field.name === fieldName);
                        return (
                          <div key={fieldName} className="flex items-center">
                            {hasField ? (
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-2" />
                            )}
                            <span className={hasField ? 'text-green-700' : 'text-red-700'}>
                              {fieldName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onApply}
          disabled={!requirements.isCompatible}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            requirements.isCompatible
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {requirements.isCompatible ? 'Apply Template' : 'Missing Requirements'}
        </button>

        {!requirements.isCompatible && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            Create the required CMS collections first
          </p>
        )}
      </div>
    </div>
  );
};

export default TemplateModal;
