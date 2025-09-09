import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Database,
  FileText,
  Image,
  Settings,
  Trash2,
  Edit,
  Eye,
  Upload
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCMSStore } from '../stores/cmsStore';
import CollectionCard from '../components/cms/CollectionCard';
import ContentTable from '../components/cms/ContentTable';
import MediaGrid from '../components/cms/MediaGrid';
import CreateCollectionModal from '../components/cms/CreateCollectionModal';
import CreateContentModal from '../components/cms/CreateContentModal';
import MediaUploadModal from '../components/cms/MediaUploadModal';
import LoadingSpinner from '../components/LoadingSpinner';

const CMS = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    collections,
    content,
    media,
    currentCollection,
    collectionsLoading,
    contentLoading,
    mediaLoading,
    viewMode,
    filters,
    selectedContentIds,
    selectedMediaIds,
    fetchCollections,
    fetchContent,
    fetchMedia,
    setCurrentCollection,
    setViewMode,
    setFilters,
    clearSelections
  } = useCMSStore();
  

  useEffect(() => {
    fetchCollections();
    fetchMedia();
  }, [fetchCollections, fetchMedia]);

  useEffect(() => {
    if (currentCollection) {
      fetchContent(currentCollection._id);
    }
  }, [currentCollection, fetchContent]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters({ search: query });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleCollectionSelect = (collection) => {
    setCurrentCollection(collection);
    setActiveTab('content');
  };

  const tabs = [
    { id: 'collections', label: 'Collections', icon: Database },
    { id: 'content', label: 'Content', icon: FileText, disabled: !currentCollection },
    { id: 'media', label: 'Media', icon: Image }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CMS Manager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'content' && currentCollection && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {currentCollection.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Collections</h2>
                <p className="text-sm text-gray-600">Manage your content collections and schemas</p>
              </div>
              <button
                onClick={() => setShowCreateCollection(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </button>
            </div>

            {collectionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection._id}
                    collection={collection}
                    onSelect={handleCollectionSelect}
                  />
                ))}
                
                {collections.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                    <p className="text-gray-600 mb-4">Create your first collection to start managing content</p>
                    <button
                      onClick={() => setShowCreateCollection(true)}
                      className="btn-primary"
                    >
                      Create Collection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && currentCollection && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentCollection.name} Content
                </h2>
                <p className="text-sm text-gray-600">
                  Manage content items in this collection
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Filters */}
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                
                <button
                  onClick={() => setShowCreateContent(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Content
                </button>
              </div>
            </div>

            {contentLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ContentTable
                content={content}
                collection={currentCollection}
                selectedIds={selectedContentIds}
                viewMode={viewMode}
              />
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
                <p className="text-sm text-gray-600">Manage images, videos, and other media files</p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Media Type Filter */}
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
                
                <button
                  onClick={() => setShowMediaUpload(true)}
                  className="btn-primary flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </button>
              </div>
            </div>

            {mediaLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <MediaGrid
                media={media}
                selectedIds={selectedMediaIds}
                viewMode={viewMode}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCollectionModal
        isOpen={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
      />
      
      <CreateContentModal
        isOpen={showCreateContent}
        onClose={() => setShowCreateContent(false)}
        collection={currentCollection}
      />
      
      <MediaUploadModal
        isOpen={showMediaUpload}
        onClose={() => setShowMediaUpload(false)}
      />
    </div>
  );
};

export default CMS;
