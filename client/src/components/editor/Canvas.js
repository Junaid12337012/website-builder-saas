import React, { useRef, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import CanvasElement from './CanvasElement';
import GridBackground from './GridBackground';
import SelectionBox from './SelectionBox';

const Canvas = ({ 
  elements, 
  canvas, 
  selectedElement, 
  onSelectElement, 
  onUpdateElement, 
  onUpdateCanvas, 
  onAddElement 
}) => {
  const canvasRef = useRef(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drop zone for dragging elements from sidebar
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        
        // Create new element at drop position
        const newElement = createNewElement(item.elementType, x, y);
        onAddElement(newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Handle canvas click
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

  // Handle element selection
  const handleElementSelect = useCallback((element) => {
    onSelectElement(element);
  }, [onSelectElement]);

  // Handle element updates
  const handleElementUpdate = useCallback((id, updates) => {
    onUpdateElement(id, updates);
  }, [onUpdateElement]);

  // Combine refs
  const combinedRef = useCallback((node) => {
    canvasRef.current = node;
    drop(node);
  }, [drop]);

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="relative">
        {/* Canvas Container */}
        <motion.div
          ref={combinedRef}
          className={`relative bg-white shadow-lg border-2 transition-colors ${
            isOver && canDrop 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300'
          }`}
          style={{
            width: canvas.width || 1200,
            height: canvas.height || 800,
            backgroundColor: canvas.backgroundColor || '#ffffff',
            backgroundImage: canvas.backgroundImage ? `url(${canvas.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          onClick={handleCanvasClick}
        >
          {/* Grid Background */}
          <GridBackground 
            gridSize={canvas.gridSize || 10}
            show={canvas.snapToGrid}
          />

          {/* Drop Zone Indicator */}
          {isOver && canDrop && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-100 bg-opacity-50 border-2 border-dashed border-primary-400">
              <div className="text-primary-600 font-medium">
                Drop element here
              </div>
            </div>
          )}

          {/* Elements */}
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={() => handleElementSelect(element)}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
              snapToGrid={canvas.snapToGrid}
              gridSize={canvas.gridSize || 10}
            />
          ))}

          {/* Selection Box for multi-select (future feature) */}
          {selectionBox && (
            <SelectionBox {...selectionBox} />
          )}
        </motion.div>

        {/* Canvas Info */}
        <div className="absolute -bottom-8 left-0 text-sm text-gray-500">
          {canvas.width || 1200} × {canvas.height || 800}px
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <span className="text-sm font-medium">100%</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to create new elements
const createNewElement = (type, x, y) => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseElement = {
    id,
    type,
    position: { x: x - 100, y: y - 50, z: 1 }, // Center element on cursor
    dimensions: { width: 200, height: 100 },
    styles: {}
  };

  switch (type) {
    case 'text':
      return {
        ...baseElement,
        content: { text: 'New Text Element' },
        dimensions: { width: 200, height: 50 },
        styles: {
          fontSize: '16px',
          color: '#000000',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '400',
          textAlign: 'left',
          lineHeight: '1.5'
        }
      };
    
    case 'image':
      return {
        ...baseElement,
        content: { 
          src: 'https://via.placeholder.com/200x100/f0f0f0/666666?text=Image', 
          alt: 'Placeholder image' 
        },
        dimensions: { width: 200, height: 100 },
        styles: {
          borderRadius: '0px',
          objectFit: 'cover'
        }
      };
    
    case 'button':
      return {
        ...baseElement,
        content: { text: 'Button', href: '#' },
        dimensions: { width: 120, height: 40 },
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center',
          padding: '8px 16px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      };
    
    case 'section':
      return {
        ...baseElement,
        content: {},
        dimensions: { width: 400, height: 200 },
        styles: {
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        },
        children: []
      };

    case 'container':
      return {
        ...baseElement,
        content: {},
        dimensions: { width: 300, height: 150 },
        styles: {
          backgroundColor: 'transparent',
          border: '2px dashed #d1d5db',
          borderRadius: '4px',
          padding: '16px'
        },
        children: []
      };

    case 'list':
      return {
        ...baseElement,
        content: {
          items: [],
          maxItems: 5,
          showHeader: true,
          headerText: 'Items'
        },
        dimensions: { width: 300, height: 200 },
        styles: {
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px'
        }
      };
    
    default:
      return baseElement;
  }
};

export default Canvas;
