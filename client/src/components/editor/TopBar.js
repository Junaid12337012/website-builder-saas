import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Download, 
  Globe,
  Layout,
  Monitor,
  Tablet,
  Smartphone,
  Code
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner';
import ExportModal from '../ExportModal';
import PreviewModal from '../PreviewModal';
import PublishModal from '../PublishModal';
import TemplateGallery from '../TemplateGallery';
import ResponsiveControls from './ResponsiveControls';

const TopBar = ({ 
  project, 
  onBack, 
  onSave, 
  onPreview, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  isSaving, 
  lastSaved 
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');

  const handleExport = (type) => {
    setShowExportModal(true);
    setShowExportMenu(false);
  };

  const handlePublish = (platform) => {
    setShowPublishModal(true);
    setShowPublishMenu(false);
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <div className="toolbar bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div>
          <h1 className="font-semibold text-gray-900">{project?.name}</h1>
          <div className="flex items-center text-xs text-gray-500">
            {isSaving ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-1" />
                Saving...
              </div>
            ) : lastSaved ? (
              `Saved ${lastSaved.toLocaleTimeString()}`
            ) : (
              'Not saved'
            )}
          </div>
        </div>
      </div>

      {/* Center Section - View Mode Toggle */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewMode('desktop')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'desktop' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Desktop View"
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode('tablet')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'tablet' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Tablet View"
        >
          <Tablet className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'mobile' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Mobile View"
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Preview */}
        <button
          onClick={handlePreview}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Preview"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </button>
          
          {showExportMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => handleExport('html')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Code className="h-4 w-4 mr-3" />
                  Export as HTML
                </button>
                <button
                  onClick={() => handleExport('react')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Code className="h-4 w-4 mr-3" />
                  Export as React
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Publish Menu */}
        <div className="relative">
          <button
            onClick={() => setShowPublishMenu(!showPublishMenu)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Publish"
          >
            <Globe className="h-4 w-4" />
          </button>
          
          {showPublishMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => handlePublish('netlify')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Globe className="h-4 w-4 mr-3" />
                  Publish to Netlify
                </button>
                <button
                  onClick={() => handlePublish('vercel')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Globe className="h-4 w-4 mr-3" />
                  Publish to Vercel
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Templates Button */}
        <button
          onClick={() => setShowTemplateGallery(true)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Browse Templates"
        >
          <Layout className="h-4 w-4" />
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn-primary flex items-center"
        >
          {isSaving ? (
            <LoadingSpinner size="sm" className="text-white mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </button>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        project={project}
      />
      
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        project={project}
      />
      
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        project={project}
      />
      
      {showTemplateGallery && (
        <TemplateGallery
          onSelectTemplate={(template) => {
            // Apply template structure to current project
            if (template.structure) {
              // This would need to be implemented in the parent component
              console.log('Applying template:', template);
            }
            setShowTemplateGallery(false);
          }}
          onClose={() => setShowTemplateGallery(false)}
        />
      )}
      
      <ResponsiveControls />
    </div>
  );
};

export default TopBar;
