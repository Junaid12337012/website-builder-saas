import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Code, FileText, Smartphone, Monitor } from 'lucide-react';
import { toast } from 'react-toastify';
import { exportAsHTML, exportAsReact } from '../utils/exportUtils';
import LoadingSpinner from './LoadingSpinner';

const ExportModal = ({ isOpen, onClose, project, onExport }) => {
  const [exportType, setExportType] = useState('html');
  const [options, setOptions] = useState({
    includeCSS: true,
    minify: false,
    responsive: true,
    typescript: false
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    if (!project) return;

    setIsExporting(true);
    try {
      if (exportType === 'html') {
        exportAsHTML(project);
        toast.success('HTML exported successfully!');
      } else if (exportType === 'react') {
        exportAsReact(project);
        toast.success('React component exported successfully!');
      } else if (onExport) {
        await onExport(exportType, options);
      }
      
      onClose();
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
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
        className="modal-content max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Type Selection */}
          <div>
            <label className="property-label">Export Format</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setExportType('html')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  exportType === 'html'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-6 w-6 mb-2 text-primary-600" />
                <h3 className="font-medium text-gray-900">HTML</h3>
                <p className="text-sm text-gray-500">Static HTML file</p>
              </button>

              <button
                onClick={() => setExportType('react')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  exportType === 'react'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Code className="h-6 w-6 mb-2 text-primary-600" />
                <h3 className="font-medium text-gray-900">React</h3>
                <p className="text-sm text-gray-500">React component</p>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="property-label">Options</label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeCSS"
                  checked={options.includeCSS}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeCSS: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeCSS" className="ml-2 text-sm text-gray-700">
                  Include CSS styles
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="responsive"
                  checked={options.responsive}
                  onChange={(e) => setOptions(prev => ({ ...prev, responsive: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="responsive" className="ml-2 text-sm text-gray-700">
                  Make responsive
                </label>
              </div>

              {exportType === 'html' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="minify"
                    checked={options.minify}
                    onChange={(e) => setOptions(prev => ({ ...prev, minify: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="minify" className="ml-2 text-sm text-gray-700">
                    Minify code
                  </label>
                </div>
              )}

              {exportType === 'react' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="typescript"
                    checked={options.typescript}
                    onChange={(e) => setOptions(prev => ({ ...prev, typescript: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="typescript" className="ml-2 text-sm text-gray-700">
                    Use TypeScript
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Format: {exportType.toUpperCase()}</p>
              <p>• Elements: {project?.elements?.length || 0}</p>
              <p>• Canvas: {project?.canvas?.width || 1200}×{project?.canvas?.height || 800}px</p>
              {exportType === 'react' && options.typescript && <p>• TypeScript: Yes</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-outline"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" className="text-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {exportType.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
