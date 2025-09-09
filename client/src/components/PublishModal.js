import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, ExternalLink, Settings, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import projectService from '../services/projectService';
import LoadingSpinner from './LoadingSpinner';

const PublishModal = ({ isOpen, onClose, project }) => {
  const [provider, setProvider] = useState('netlify');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [settings, setSettings] = useState({
    subdomain: '',
    customDomain: '',
    password: '',
    analytics: false
  });

  useEffect(() => {
    if (project?.publishInfo) {
      setProvider(project.publishInfo.provider || 'netlify');
      setPublishedUrl(project.publishInfo.url || '');
      setPublishStatus(project.publishInfo.status || null);
      setSettings(prev => ({
        ...prev,
        subdomain: project.publishInfo.subdomain || '',
        customDomain: project.publishInfo.customDomain || ''
      }));
    }
  }, [project]);

  const handlePublish = async () => {
    if (!project) return;

    setIsPublishing(true);
    try {
      const publishData = {
        provider,
        settings: {
          ...settings,
          subdomain: settings.subdomain || project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
        }
      };

      const response = await projectService.publishProject(project._id, publishData);
      
      if (response.success) {
        setPublishedUrl(response.url);
        setPublishStatus('published');
        toast.success('Project published successfully!');
      } else {
        throw new Error(response.message || 'Publishing failed');
      }
    } catch (error) {
      toast.error(error.message || 'Publishing failed. Please try again.');
      setPublishStatus('failed');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!project) return;

    setIsPublishing(true);
    try {
      await projectService.unpublishProject(project._id);
      setPublishedUrl('');
      setPublishStatus(null);
      toast.success('Project unpublished successfully!');
    } catch (error) {
      toast.error('Failed to unpublish project.');
    } finally {
      setIsPublishing(false);
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
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Publish Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          {publishStatus && (
            <div className={`p-4 rounded-lg flex items-center ${
              publishStatus === 'published' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {publishStatus === 'published' ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {publishStatus === 'published' ? 'Published' : 'Publishing Failed'}
                </p>
                {publishedUrl && (
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline flex items-center mt-1"
                  >
                    {publishedUrl}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Provider Selection */}
          <div>
            <label className="property-label">Hosting Provider</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setProvider('netlify')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  provider === 'netlify'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-8 bg-teal-500 rounded mb-2"></div>
                <h3 className="font-medium text-gray-900">Netlify</h3>
                <p className="text-sm text-gray-500">Fast & reliable</p>
              </button>

              <button
                onClick={() => setProvider('vercel')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  provider === 'vercel'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-8 bg-black rounded mb-2"></div>
                <h3 className="font-medium text-gray-900">Vercel</h3>
                <p className="text-sm text-gray-500">Edge network</p>
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div>
              <label className="property-label">Subdomain</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={settings.subdomain}
                  onChange={(e) => setSettings(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder={project?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  className="property-input rounded-r-none"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  .{provider === 'netlify' ? 'netlify.app' : 'vercel.app'}
                </span>
              </div>
            </div>

            <div>
              <label className="property-label">Custom Domain (Optional)</label>
              <input
                type="text"
                value={settings.customDomain}
                onChange={(e) => setSettings(prev => ({ ...prev, customDomain: e.target.value }))}
                placeholder="www.example.com"
                className="property-input"
              />
            </div>

            <div>
              <label className="property-label">Password Protection (Optional)</label>
              <input
                type="password"
                value={settings.password}
                onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leave empty for public access"
                className="property-input"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="analytics"
                checked={settings.analytics}
                onChange={(e) => setSettings(prev => ({ ...prev, analytics: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="analytics" className="ml-2 text-sm text-gray-700">
                Enable analytics
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Publishing Info
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Your website will be live in minutes</p>
              <p>• SSL certificate included automatically</p>
              <p>• Updates will deploy instantly</p>
              <p>• Free hosting with {provider === 'netlify' ? 'Netlify' : 'Vercel'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-outline"
            disabled={isPublishing}
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            {publishStatus === 'published' && (
              <button
                onClick={handleUnpublish}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                disabled={isPublishing}
              >
                {isPublishing ? 'Unpublishing...' : 'Unpublish'}
              </button>
            )}
            
            <button
              onClick={handlePublish}
              className="btn-primary flex items-center"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <LoadingSpinner size="sm" className="text-white mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  {publishStatus === 'published' ? 'Update' : 'Publish'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublishModal;
