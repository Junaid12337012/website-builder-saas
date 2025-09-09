import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Globe,
  FileText,
  MoreVertical,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCMSStore } from '../../stores/cmsStore';

const ContentTable = ({ content, collection, selectedIds, viewMode }) => {
  const [showMenu, setShowMenu] = useState(null);
  const { 
    deleteContent, 
    publishContent, 
    toggleContentSelection,
    setCurrentContent 
  } = useCMSStore();

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteContent(id);
        toast.success('Content deleted successfully');
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
    setShowMenu(null);
  };

  const handlePublish = async (id, currentStatus) => {
    const publish = currentStatus !== 'published';
    try {
      await publishContent(id, publish);
      toast.success(`Content ${publish ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update content status');
    }
    setShowMenu(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <ContentCard
            key={item._id}
            item={item}
            collection={collection}
            isSelected={selectedIds.includes(item._id)}
            onSelect={() => toggleContentSelection(item._id)}
            onEdit={() => setCurrentContent(item)}
            onDelete={() => handleDelete(item._id, item.title)}
            onPublish={() => handlePublish(item._id, item.status)}
          />
        ))}
        
        {content.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600">Create your first content item to get started</p>
          </div>
        )}
      </div>
    );
  }

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
                  onChange={(e) => {
                    // TODO: Implement select all
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleContentSelection(item._id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.updatedAt)}
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
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setCurrentContent(item);
                              setShowMenu(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handlePublish(item._id, item.status)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Globe className="h-4 w-4 mr-3" />
                            {item.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDelete(item._id, item.title)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {content.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-600">Create your first content item to get started</p>
        </div>
      )}
    </div>
  );
};

const ContentCard = ({ item, collection, isSelected, onSelect, onEdit, onDelete, onPublish }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
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
      className={`bg-white rounded-lg border-2 transition-colors ${
        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.slug}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon(item.status)}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(item.createdAt)}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            v{item.version}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            item.status === 'published' ? 'bg-green-100 text-green-800' :
            item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.status}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onPublish}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Globe className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentTable;
