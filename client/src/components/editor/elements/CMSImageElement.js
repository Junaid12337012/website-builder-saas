import React from 'react';
import { motion } from 'framer-motion';
import { Database, Link, Image } from 'lucide-react';

const CMSImageElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate, 
  isDragging,
  style 
}) => {
  const { content, styles, cmsBinding } = element;
  
  // Get display image data - prioritize CMS binding over static content
  const getImageData = () => {
    if (cmsBinding && cmsBinding.data) {
      if (cmsBinding.field) {
        const fieldValue = cmsBinding.data[cmsBinding.field];
        if (typeof fieldValue === 'object' && fieldValue.url) {
          return {
            src: fieldValue.url,
            alt: fieldValue.alt || content.alt || 'CMS Image'
          };
        } else if (typeof fieldValue === 'string') {
          return {
            src: fieldValue,
            alt: content.alt || 'CMS Image'
          };
        }
      }
      // Look for common image field names
      const imageFields = ['image', 'thumbnail', 'photo', 'picture', 'featuredImage'];
      for (const field of imageFields) {
        if (cmsBinding.data[field]) {
          const fieldValue = cmsBinding.data[field];
          if (typeof fieldValue === 'object' && fieldValue.url) {
            return {
              src: fieldValue.url,
              alt: fieldValue.alt || content.alt || 'CMS Image'
            };
          } else if (typeof fieldValue === 'string') {
            return {
              src: fieldValue,
              alt: content.alt || 'CMS Image'
            };
          }
        }
      }
    }
    return {
      src: content.src || 'https://via.placeholder.com/200x100?text=Image',
      alt: content.alt || 'Image Element'
    };
  };

  const imageData = getImageData();
  const isCMSBound = !!cmsBinding;

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
          {cmsBinding.field && (
            <>
              <span>•</span>
              <span>{cmsBinding.field}</span>
            </>
          )}
        </div>
      )}

      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: styles.borderRadius || '0px',
          border: styles.border || 'none',
          ...styles
        }}
      >
        <img
          src={imageData.src}
          alt={imageData.alt}
          className="w-full h-full object-cover"
          style={{
            objectFit: styles.objectFit || 'cover',
            objectPosition: styles.objectPosition || 'center',
            filter: styles.filter || 'none',
            opacity: styles.opacity || 1
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x100?text=Image+Not+Found';
          }}
        />
      </div>

      {/* Live Preview Badge */}
      {isCMSBound && (
        <div className="absolute -bottom-6 -right-1 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Link className="h-3 w-3" />
          <span>Live</span>
        </div>
      )}

      {/* Placeholder overlay for empty images */}
      {!imageData.src || imageData.src.includes('placeholder') ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Image className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">
              {isCMSBound ? 'CMS Image' : 'Add Image'}
            </p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default CMSImageElement;
