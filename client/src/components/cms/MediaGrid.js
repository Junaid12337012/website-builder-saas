import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, 
  Video, 
  FileText, 
  Download, 
  Trash2, 
  Edit,
  MoreVertical,
  Calendar,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCMSStore } from '../../stores/cmsStore';

const MediaGrid = ({ media, selectedIds, viewMode }) => {
  const [showMenu, setShowMenu] = useState(null);
  const { deleteMedia, updateMedia, toggleMediaSelection } = useCMSStore();

  const handleDelete = async (id, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      try {
        await deleteMedia(id);
        toast.success('Media deleted successfully');
      } catch (error) {
        toast.error('Failed to delete media');
      }
    }
    setShowMenu(null);
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {media.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleMediaSelection(item._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {item.mimeType.startsWith('image/') ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`${process.env.REACT_APP_API_URL}${item.url}`}
                            alt={item.alt || item.originalName}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getFileIcon(item.mimeType)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.originalName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.alt && `Alt: ${item.alt}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(item.mimeType)}
                      <span className="ml-2 text-sm text-gray-900">
                        {item.mimeType.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === item._id ? null : item._id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {showMenu === item._id && (
                        <MediaMenu
                          item={item}
                          onClose={() => setShowMenu(null)}
                          onDelete={() => handleDelete(item._id, item.originalName)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {media.map((item) => (
        <MediaCard
          key={item._id}
          item={item}
          isSelected={selectedIds.includes(item._id)}
          onSelect={() => toggleMediaSelection(item._id)}
          onDelete={() => handleDelete(item._id, item.originalName)}
        />
      ))}
      
      {media.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files</h3>
          <p className="text-gray-600">Upload your first media file to get started</p>
        </div>
      )}
    </div>
  );
};

const MediaCard = ({ item, isSelected, onSelect, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-8 w-8 text-purple-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-white rounded-lg border-2 transition-colors group ${
        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      </div>

      {/* Menu Button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>
        
        {showMenu && (
          <MediaMenu
            item={item}
            onClose={() => setShowMenu(false)}
            onDelete={onDelete}
          />
        )}
      </div>

      {/* Media Preview */}
      <div className="aspect-square p-4">
        {item.mimeType.startsWith('image/') ? (
          <img
            src={`${process.env.REACT_APP_API_URL}${item.url}`}
            alt={item.alt || item.originalName}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
            {getFileIcon(item.mimeType)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.originalName}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {item.mimeType.split('/')[1].toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {formatFileSize(item.size)}
          </span>
        </div>
        {item.alt && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            Alt: {item.alt}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const MediaMenu = ({ item, onClose, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_API_URL}${item.url}`;
    link.download = item.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleView = () => {
    window.open(`${process.env.REACT_APP_API_URL}${item.url}`, '_blank');
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
      <div className="py-1">
        <button
          onClick={handleView}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <Eye className="h-4 w-4 mr-3" />
          View
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <Download className="h-4 w-4 mr-3" />
          Download
        </button>
        <button
          onClick={() => {
            // TODO: Implement edit media
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <Edit className="h-4 w-4 mr-3" />
          Edit Details
        </button>
        <hr className="my-1" />
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
        >
          <Trash2 className="h-4 w-4 mr-3" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default MediaGrid;
