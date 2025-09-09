import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Link, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCMSStore } from '../../stores/cmsStore';
import { useEditorStore } from '../../stores/editorStore';

const CMSPanel = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCollections, setExpandedCollections] = useState(new Set());

  const {
    collections,
    content,
    collectionsLoading,
    contentLoading,
    fetchCollections,
    fetchContent,
    setCurrentCollection
  } = useCMSStore();

  const {
    selectedElement,
    updateElement
  } = useEditorStore();


  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    if (selectedCollection) {
      fetchContent(selectedCollection._id, { status: 'published' });
    }
  }, [selectedCollection, fetchContent]);

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setCurrentCollection(collection);
    setActiveTab('content');
    
    // Expand collection in tree view
    setExpandedCollections(prev => new Set([...prev, collection._id]));
  };

  const handleContentSelect = (contentItem) => {
    setSelectedContent(contentItem);
  };

  const bindContentToElement = (contentItem, field = null) => {
    if (!selectedElement) {
      toast.error('Please select an element first');
      return;
    }

    const binding = {
      type: 'cms',
      collectionId: selectedCollection._id,
      collectionSlug: selectedCollection.slug,
      contentId: contentItem._id,
      contentSlug: contentItem.slug,
      field: field,
      data: contentItem.data
    };

    // Update element with CMS binding
    updateElement(selectedElement.id, {
      cmsBinding: binding,
      content: {
        ...selectedElement.content,
        text: field ? contentItem.data[field] : contentItem.title,
        boundField: field
      }
    });

    toast.success(`Element bound to ${contentItem.title}${field ? ` (${field})` : ''}`);
  };

  const toggleCollectionExpansion = (collectionId) => {
    setExpandedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            CMS Content
          </h3>
          <button
            onClick={() => {
              fetchCollections();
              if (selectedCollection) {
                fetchContent(selectedCollection._id, { status: 'published' });
              }
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex mt-3 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'collections'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab('content')}
            disabled={!selectedCollection}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'content' && selectedCollection
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            Content
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'collections' && (
          <CollectionsView
            collections={filteredCollections}
            loading={collectionsLoading}
            onCollectionSelect={handleCollectionSelect}
            expandedCollections={expandedCollections}
            onToggleExpansion={toggleCollectionExpansion}
            selectedCollection={selectedCollection}
          />
        )}

        {activeTab === 'content' && selectedCollection && (
          <ContentView
            collection={selectedCollection}
            content={filteredContent}
            loading={contentLoading}
            selectedElement={selectedElement}
            onContentSelect={handleContentSelect}
            onBindContent={bindContentToElement}
            selectedContent={selectedContent}
          />
        )}
      </div>

      {/* Footer Info */}
      {selectedElement?.cmsBinding && (
        <div className="p-3 bg-blue-50 border-t border-blue-200">
          <div className="text-xs text-blue-800">
            <div className="font-medium">Element Bound to CMS</div>
            <div className="mt-1">
              Collection: {selectedElement.cmsBinding.collectionSlug}
            </div>
            <div>
              Content: {selectedElement.cmsBinding.contentSlug}
            </div>
            {selectedElement.cmsBinding.field && (
              <div>
                Field: {selectedElement.cmsBinding.field}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CollectionsView = ({ 
  collections, 
  loading, 
  onCollectionSelect, 
  expandedCollections, 
  onToggleExpansion, 
  selectedCollection 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="p-4 text-center">
        <Database className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No collections found</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {collections.map((collection) => (
        <div key={collection._id} className="mb-2">
          <div
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
              selectedCollection?._id === collection._id
                ? 'bg-primary-100 text-primary-900'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onCollectionSelect(collection)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(collection._id);
              }}
              className="mr-1 p-1"
            >
              {expandedCollections.has(collection._id) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
            <Database className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {collection.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {collection.fields?.length || 0} fields
              </div>
            </div>
          </div>

          {expandedCollections.has(collection._id) && (
            <div className="ml-6 mt-1 space-y-1">
              {collection.fields?.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center p-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                >
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="font-medium">{field.label}</span>
                  <span className="ml-auto text-gray-400">({field.type})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ContentView = ({ 
  collection, 
  content, 
  loading, 
  selectedElement, 
  onContentSelect, 
  onBindContent, 
  selectedContent 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="p-4 text-center">
        <Eye className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No published content</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-3 text-xs text-gray-500 px-2">
        {collection.name} ({content.length} items)
      </div>

      {content.map((item) => (
        <ContentItem
          key={item._id}
          item={item}
          collection={collection}
          selectedElement={selectedElement}
          onSelect={onContentSelect}
          onBind={onBindContent}
          isSelected={selectedContent?._id === item._id}
        />
      ))}
    </div>
  );
};

const ContentItem = ({ item, collection, selectedElement, onSelect, onBind, isSelected }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`mb-2 border rounded-md ${isSelected ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`}>
      <div
        className="flex items-center p-2 cursor-pointer hover:bg-gray-50"
        onClick={() => {
          onSelect(item);
          setExpanded(!expanded);
        }}
      >
        <button className="mr-1 p-1">
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {item.title}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {item.slug}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBind(item);
          }}
          disabled={!selectedElement}
          className={`p-1 rounded text-xs ${
            selectedElement
              ? 'text-primary-600 hover:text-primary-800 hover:bg-primary-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title={selectedElement ? 'Bind to selected element' : 'Select an element first'}
        >
          <Link className="h-3 w-3" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 p-2 space-y-2">
          {/* Bind entire content */}
          <button
            onClick={() => onBind(item)}
            disabled={!selectedElement}
            className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium">Bind Title</div>
            <div className="text-gray-600 truncate">{item.title}</div>
          </button>

          {/* Bind individual fields */}
          {collection.fields?.map((field) => {
            const value = item.data[field.name];
            if (!value) return null;

            return (
              <button
                key={field.name}
                onClick={() => onBind(item, field.name)}
                disabled={!selectedElement}
                className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium">{field.label}</div>
                <div className="text-gray-600 truncate">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CMSPanel;
