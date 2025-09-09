import React from 'react';
import { motion } from 'framer-motion';
import { Database, Link } from 'lucide-react';

const CMSTextElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate, 
  isDragging,
  style 
}) => {
  const { content, styles, cmsBinding } = element;
  
  // Get display text - prioritize CMS binding over static content
  const getDisplayText = () => {
    if (cmsBinding && cmsBinding.data) {
      if (cmsBinding.field) {
        return cmsBinding.data[cmsBinding.field] || content.text || 'CMS Content';
      }
      return cmsBinding.data.title || content.text || 'CMS Content';
    }
    return content.text || 'Text Element';
  };

  const displayText = getDisplayText();
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
        className="w-full h-full flex items-center justify-center"
        style={{
          fontSize: styles.fontSize || '16px',
          fontFamily: styles.fontFamily || 'Inter, sans-serif',
          fontWeight: styles.fontWeight || '400',
          color: styles.color || '#000000',
          backgroundColor: styles.backgroundColor || 'transparent',
          textAlign: styles.textAlign || 'left',
          padding: styles.padding || '0px',
          margin: styles.margin || '0px',
          borderRadius: styles.borderRadius || '0px',
          border: styles.border || 'none',
          textDecoration: styles.textDecoration || 'none',
          lineHeight: styles.lineHeight || 'normal',
          letterSpacing: styles.letterSpacing || 'normal',
          ...styles
        }}
      >
        {displayText}
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

export default CMSTextElement;
