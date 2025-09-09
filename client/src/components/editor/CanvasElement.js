import React, { useState, useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Trash2, Copy, MoreVertical } from 'lucide-react';
import CMSTextElement from './elements/CMSTextElement';
import CMSImageElement from './elements/CMSImageElement';
import CMSListElement from './elements/CMSListElement';

const CanvasElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onUpdate, 
  snapToGrid, 
  gridSize 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const elementRef = useRef(null);

  // Drag functionality
  const [{ isDragActive }, drag] = useDrag(() => ({
    type: 'canvas-element',
    item: { id: element.id },
    collect: (monitor) => ({
      isDragActive: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setIsDragging(false);
      if (monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          let newX = element.position.x + delta.x;
          let newY = element.position.y + delta.y;

          // Snap to grid if enabled
          if (snapToGrid) {
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
          }

          onUpdate({
            position: {
              ...element.position,
              x: Math.max(0, newX),
              y: Math.max(0, newY)
            }
          });
        }
      }
    },
  }));

  // Handle element click
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onSelect();
  }, [onSelect]);

  // Handle double click for editing
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (element.type === 'text') {
      // Enable text editing
      const textElement = elementRef.current?.querySelector('.element-text');
      if (textElement) {
        textElement.contentEditable = true;
        textElement.focus();
        
        const handleBlur = () => {
          textElement.contentEditable = false;
          onUpdate({
            content: {
              ...element.content,
              text: textElement.textContent
            }
          });
          textElement.removeEventListener('blur', handleBlur);
        };
        
        textElement.addEventListener('blur', handleBlur);
      }
    }
  }, [element, onUpdate]);

  // Resize handles
  const handleResize = useCallback((direction, deltaX, deltaY) => {
    const newDimensions = { ...element.dimensions };
    const newPosition = { ...element.position };

    switch (direction) {
      case 'se': // Southeast
        newDimensions.width = Math.max(20, element.dimensions.width + deltaX);
        newDimensions.height = Math.max(20, element.dimensions.height + deltaY);
        break;
      case 'sw': // Southwest
        newDimensions.width = Math.max(20, element.dimensions.width - deltaX);
        newDimensions.height = Math.max(20, element.dimensions.height + deltaY);
        newPosition.x = element.position.x + deltaX;
        break;
      case 'ne': // Northeast
        newDimensions.width = Math.max(20, element.dimensions.width + deltaX);
        newDimensions.height = Math.max(20, element.dimensions.height - deltaY);
        newPosition.y = element.position.y + deltaY;
        break;
      case 'nw': // Northwest
        newDimensions.width = Math.max(20, element.dimensions.width - deltaX);
        newDimensions.height = Math.max(20, element.dimensions.height - deltaY);
        newPosition.x = element.position.x + deltaX;
        newPosition.y = element.position.y + deltaY;
        break;
    }

    onUpdate({
      dimensions: newDimensions,
      position: newPosition
    });
  }, [element, onUpdate]);

  // Check if element has CMS binding
  const hasCMSBinding = element.cmsBinding && element.cmsBinding.type === 'cms';

  // If element has CMS binding, render with CMS component
  if (hasCMSBinding) {
    const elementStyle = {
      left: element.position.x,
      top: element.position.y,
      width: element.dimensions.width,
      height: element.dimensions.height,
      zIndex: element.position.z || 1,
      ...element.styles
    };

    switch (element.type) {
      case 'text':
        return (
          <CMSTextElement
            element={element}
            isSelected={isSelected}
            onSelect={handleClick}
            onUpdate={onUpdate}
            isDragging={isDragActive}
            style={elementStyle}
          />
        );
      
      case 'image':
        return (
          <CMSImageElement
            element={element}
            isSelected={isSelected}
            onSelect={handleClick}
            onUpdate={onUpdate}
            isDragging={isDragActive}
            style={elementStyle}
          />
        );
      
      case 'list':
        return (
          <CMSListElement
            element={element}
            isSelected={isSelected}
            onSelect={handleClick}
            onUpdate={onUpdate}
            isDragging={isDragActive}
            style={elementStyle}
          />
        );
      
      default:
        break;
    }
  }

  // Render element content based on type (non-CMS elements)
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            className="element-text w-full h-full flex items-center"
            style={{
              fontSize: element.styles?.fontSize || '16px',
              color: element.styles?.color || '#000000',
              fontFamily: element.styles?.fontFamily || 'Inter, sans-serif',
              fontWeight: element.styles?.fontWeight || '400',
              textAlign: element.styles?.textAlign || 'left',
              lineHeight: element.styles?.lineHeight || '1.5',
              padding: element.styles?.padding || '0px'
            }}
          >
            {element.content?.text || 'Text Element'}
          </div>
        );

      case 'image':
        return (
          <img
            src={element.content?.src || 'https://via.placeholder.com/200x100'}
            alt={element.content?.alt || 'Image'}
            className="w-full h-full object-cover"
            style={{
              borderRadius: element.styles?.borderRadius || '0px',
              objectFit: element.styles?.objectFit || 'cover'
            }}
          />
        );

      case 'button':
        return (
          <button
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#3b82f6',
              color: element.styles?.color || '#ffffff',
              borderRadius: element.styles?.borderRadius || '6px',
              fontSize: element.styles?.fontSize || '14px',
              fontWeight: element.styles?.fontWeight || '500',
              border: element.styles?.border || 'none',
              cursor: 'pointer'
            }}
          >
            {element.content?.text || 'Button'}
          </button>
        );

      case 'list':
        return (
          <div
            className="w-full h-full overflow-y-auto"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#f9fafb',
              border: element.styles?.border || '1px solid #e5e7eb',
              borderRadius: element.styles?.borderRadius || '8px',
              padding: element.styles?.padding || '16px'
            }}
          >
            <div className="space-y-2">
              {(element.content?.items || []).map((item, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  <div className="font-medium text-sm">{item.title || `Item ${index + 1}`}</div>
                  {item.description && (
                    <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                  )}
                </div>
              ))}
              {(!element.content?.items || element.content.items.length === 0) && (
                <div className="text-center text-gray-400 py-4">
                  <div className="text-sm">Empty list</div>
                  <div className="text-xs">Bind to CMS or add items</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'section':
      case 'container':
        return (
          <div
            className="w-full h-full flex items-center justify-center text-gray-400"
            style={{
              backgroundColor: element.styles?.backgroundColor || 'transparent',
              border: element.styles?.border || '2px dashed #d1d5db',
              borderRadius: element.styles?.borderRadius || '4px',
              padding: element.styles?.padding || '16px'
            }}
          >
            {element.children?.length ? `${element.children.length} items` : 'Empty container'}
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Unknown element
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={(node) => {
        elementRef.current = node;
        drag(node);
      }}
      className={`absolute cursor-move select-none ${
        isSelected ? 'element-selected z-50' : 'z-auto'
      } ${isDragActive ? 'element-dragging' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.dimensions.width,
        height: element.dimensions.height,
        zIndex: element.position.z || 1
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
    >
      {/* Element Content */}
      <div className="w-full h-full relative">
        {renderContent()}

        {/* Selection Outline */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-primary-500 pointer-events-none">
            {/* Resize Handles */}
            <ResizeHandle direction="nw" onResize={handleResize} />
            <ResizeHandle direction="ne" onResize={handleResize} />
            <ResizeHandle direction="sw" onResize={handleResize} />
            <ResizeHandle direction="se" onResize={handleResize} />
          </div>
        )}

        {/* Element Menu */}
        {isSelected && (
          <div className="absolute -top-8 -right-2 flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700"
            >
              <MoreVertical className="h-3 w-3" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-6 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="py-1 min-w-[120px]">
                  <button className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 w-full">
                    <Copy className="h-3 w-3 mr-2" />
                    Duplicate
                  </button>
                  <button className="flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Resize Handle Component
const ResizeHandle = ({ direction, onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      onResize(direction, deltaX, deltaY);
      startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getPositionClasses = () => {
    switch (direction) {
      case 'nw': return 'top-0 left-0 cursor-nw-resize';
      case 'ne': return 'top-0 right-0 cursor-ne-resize';
      case 'sw': return 'bottom-0 left-0 cursor-sw-resize';
      case 'se': return 'bottom-0 right-0 cursor-se-resize';
      default: return '';
    }
  };

  return (
    <div
      className={`absolute w-2 h-2 bg-primary-600 border border-white -translate-x-1/2 -translate-y-1/2 ${getPositionClasses()}`}
      onMouseDown={handleMouseDown}
    />
  );
};

export default CanvasElement;
