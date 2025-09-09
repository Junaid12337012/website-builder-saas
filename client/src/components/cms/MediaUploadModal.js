import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image, Video, FileText, Trash2 } from 'lucide-react';
import { useToasts } from 'react-toast-notifications';
import { useCMSStore } from '../../stores/cmsStore';
import LoadingSpinner from '../LoadingSpinner';

const MediaUploadModal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadMedia } = useCMSStore();
  const { addToast } = useToasts();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        alt: '',
        caption: '',
        tags: ''
      }))]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        alt: '',
        caption: '',
        tags: ''
      }))]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileMetadata = (id, field, value) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      addToast('Please select files to upload', { appearance: 'error' });
      return;
    }

    setIsUploading(true);
    try {
      for (const fileData of files) {
        await uploadMedia(fileData.file, {
          alt: fileData.alt,
          caption: fileData.caption,
          tags: fileData.tags
        });
      }
      addToast(`${files.length} file(s) uploaded successfully`, { appearance: 'success' });
      onClose();
      setFiles([]);
    } catch (error) {
      addToast(error.message || 'Failed to upload files', { appearance: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-8 w-8 text-purple-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            <Upload className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Support for images, videos, and documents up to 5MB each
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              Select Files
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Files to Upload ({files.length})
              </h3>
              
              <div className="space-y-4">
                {files.map((fileData) => (
                  <div key={fileData.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        {fileData.file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(fileData.file)}
                            alt={fileData.file.name}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
                            {getFileIcon(fileData.file.type)}
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {fileData.file.name}
                          </h4>
                          <button
                            onClick={() => removeFile(fileData.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-3">
                          {fileData.file.type} • {formatFileSize(fileData.file.size)}
                        </div>
                        
                        {/* Metadata Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={fileData.alt}
                              onChange={(e) => updateFileMetadata(fileData.id, 'alt', e.target.value)}
                              placeholder="Describe the image"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Caption
                            </label>
                            <input
                              type="text"
                              value={fileData.caption}
                              onChange={(e) => updateFileMetadata(fileData.id, 'caption', e.target.value)}
                              placeholder="Optional caption"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Tags
                            </label>
                            <input
                              type="text"
                              value={fileData.tags}
                              onChange={(e) => updateFileMetadata(fileData.id, 'tags', e.target.value)}
                              placeholder="tag1, tag2, tag3"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-outline"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="btn-primary flex items-center"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="sm" className="text-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length} File{files.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MediaUploadModal;
