import React from 'react';
import { motion } from 'framer-motion';
import { Database, Link, List } from 'lucide-react';

const CMSListElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate, 
  isDragging,
  style 
}) => {
  const { content, styles, cmsBinding } = element;
  
  // Get display items - prioritize CMS binding over static content
  const getDisplayItems = () => {
    if (cmsBinding && cmsBinding.collectionData) {
      return cmsBinding.collectionData.slice(0, content.maxItems || 5);
    }
    return content.items || [
      { title: 'Sample Item 1', description: 'This is a sample description' },
      { title: 'Sample Item 2', description: 'This is another sample description' },
      { title: 'Sample Item 3', description: 'This is a third sample description' }
    ];
  };

  const displayItems = getDisplayItems();
  const isCMSBound = !!cmsBinding;

  const renderItem = (item, index) => {
    const title = item.title || item.name || `Item ${index + 1}`;
    const description = item.description || item.excerpt || item.content?.substring(0, 100) || '';
    const image = item.image || item.thumbnail || item.featuredImage;

    return (
      <div
        key={index}
        className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white"
        style={{
          marginBottom: styles.itemSpacing || '8px',
          borderColor: styles.borderColor || '#e5e7eb',
          backgroundColor: styles.itemBackground || '#ffffff'
        }}
      >
        {image && (
          <div className="flex-shrink-0">
            <img
              src={typeof image === 'object' ? image.url : image}
              alt={typeof image === 'object' ? image.alt : title}
              className="w-12 h-12 object-cover rounded"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 
            className="font-medium truncate"
            style={{
              fontSize: styles.titleSize || '14px',
              color: styles.titleColor || '#111827',
              fontFamily: styles.fontFamily || 'Inter, sans-serif'
            }}
          >
            {title}
          </h4>
          {description && (
            <p 
              className="text-sm text-gray-600 mt-1 line-clamp-2"
              style={{
                fontSize: styles.descriptionSize || '12px',
                color: styles.descriptionColor || '#6b7280'
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className={`absolute cursor-pointer select-none ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={style}
      onClick={onSelect}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
    >
      {/* CMS Binding Indicator */}
      {isCMSBound && (
        <div className="absolute -top-6 -left-1 flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">
          <Database className="h-3 w-3" />
          <span>{cmsBinding.collectionSlug}</span>
          <span>•</span>
          <span>{displayItems.length} items</span>
        </div>
      )}

      <div
        className="w-full h-full overflow-y-auto"
        style={{
          backgroundColor: styles.backgroundColor || 'transparent',
          padding: styles.padding || '16px',
          borderRadius: styles.borderRadius || '8px',
          border: styles.border || '1px solid #e5e7eb',
          ...styles
        }}
      >
        {/* Header */}
        {content.showHeader && (
          <div className="mb-4 pb-2 border-b border-gray-200">
            <h3 
              className="font-semibold"
              style={{
                fontSize: styles.headerSize || '18px',
                color: styles.headerColor || '#111827',
                fontFamily: styles.fontFamily || 'Inter, sans-serif'
              }}
            >
              {content.headerText || (isCMSBound ? cmsBinding.collectionSlug : 'Items')}
            </h3>
          </div>
        )}

        {/* Items */}
        <div className="space-y-2">
          {displayItems.map((item, index) => renderItem(item, index))}
        </div>

        {/* Empty State */}
        {displayItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <List className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">
              {isCMSBound ? 'No content available' : 'Add list items'}
            </p>
          </div>
        )}
      </div>

      {/* Live Preview Badge */}
      {isCMSBound && (
        <div className="absolute -bottom-6 -right-1 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Link className="h-3 w-3" />
          <span>Live</span>
        </div>
      )}
    </motion.div>
  );
};

export default CMSListElement;
