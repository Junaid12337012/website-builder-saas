import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Edit, 
  Trash2, 
  Settings, 
  Eye,
  MoreVertical,
  Calendar,
  FileText
} from 'lucide-react';
import { useToasts } from 'react-toast-notifications';
import { useCMSStore } from '../../stores/cmsStore';

const CollectionCard = ({ collection, onSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [stats, setStats] = useState(null);
  const { deleteCollection } = useCMSStore();
  const { addToast } = useToasts();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This will also delete all content in this collection.`)) {
      try {
        await deleteCollection(collection._id);
        addToast('Collection deleted successfully', { appearance: 'success' });
      } catch (error) {
        addToast('Failed to delete collection', { appearance: 'error' });
      }
    }
    setShowMenu(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      onClick={() => onSelect(collection)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-gray-500">
                {collection.fields?.length || 0} fields
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(collection);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Eye className="h-4 w-4 mr-3" />
                    View Content
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit collection
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Edit className="h-4 w-4 mr-3" />
                    Edit Collection
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement collection settings
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Created {formatDate(collection.createdAt)}
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {collection.slug}
          </div>
        </div>

        {/* Fields Preview */}
        {collection.fields && collection.fields.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {collection.fields.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {field.label}
                </span>
              ))}
              {collection.fields.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                  +{collection.fields.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CollectionCard;
