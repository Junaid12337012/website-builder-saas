import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Monitor, Smartphone, Tablet, Eye, ExternalLink } from 'lucide-react';
import { generateHTML } from '../utils/exportUtils';

const PreviewModal = ({ isOpen, onClose, project }) => {
  const [viewMode, setViewMode] = useState('desktop');
  const [previewHTML, setPreviewHTML] = useState('');

  useEffect(() => {
    if (project && isOpen) {
      const html = generateHTML(project);
      setPreviewHTML(html);
    }
  }, [project, isOpen]);

  const viewModes = {
    desktop: { width: '100%', height: '100%', icon: Monitor },
    tablet: { width: '768px', height: '1024px', icon: Tablet },
    mobile: { width: '375px', height: '667px', icon: Smartphone }
  };

  const openInNewTab = () => {
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="modal-content max-w-6xl h-5/6"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Preview: {project?.name}
            </h2>
            
            {/* View Mode Toggles */}
            <div className="flex items-center space-x-2">
              {Object.entries(viewModes).map(([mode, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === mode
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={openInNewTab}
              className="btn-outline flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-4 bg-gray-100 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: viewModes[viewMode].width,
                height: viewModes[viewMode].height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {previewHTML ? (
                <iframe
                  srcDoc={previewHTML}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Generating preview...</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Viewing in {viewMode} mode ({viewModes[viewMode].width} × {viewModes[viewMode].height})
          </div>
          <div className="text-sm text-gray-500">
            {project?.elements?.length || 0} elements • Last saved {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PreviewModal;
