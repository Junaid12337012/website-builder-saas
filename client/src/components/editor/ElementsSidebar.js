import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  Image, 
  Square, 
  MousePointer,
  Layout,
  Layers,
  Search,
  Plus,
  List,
  Database
} from 'lucide-react';

const ElementsSidebar = ({ onAddElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('basic');

  const elementTypes = {
    basic: [
      {
        type: 'text',
        name: 'Text',
        icon: <Type className="h-5 w-5" />,
        description: 'Add headings, paragraphs, and text content'
      },
      {
        type: 'image',
        name: 'Image',
        icon: <Image className="h-5 w-5" />,
        description: 'Upload or link images'
      },
      {
        type: 'button',
        name: 'Button',
        icon: <MousePointer className="h-5 w-5" />,
        description: 'Interactive buttons and links'
      },
      {
        type: 'list',
        name: 'List',
        icon: <List className="h-5 w-5" />,
        description: 'Display lists of items or content'
      }
    ],
    layout: [
      {
        type: 'section',
        name: 'Section',
        icon: <Layout className="h-5 w-5" />,
        description: 'Container for grouping elements'
      },
      {
        type: 'container',
        name: 'Container',
        icon: <Square className="h-5 w-5" />,
        description: 'Flexible container for layouts'
      },
      {
        type: 'grid',
        name: 'Grid',
        icon: <Layers className="h-5 w-5" />,
        description: 'CSS Grid layout container'
      },
      {
        type: 'flexbox',
        name: 'Flexbox',
        icon: <Layout className="h-5 w-5" />,
        description: 'Flexible box layout container'
      }
    ],
    cms: [
      {
        type: 'text',
        name: 'CMS Text',
        icon: <Database className="h-5 w-5" />,
        description: 'Text element that can bind to CMS content',
        isCMS: true
      },
      {
        type: 'image',
        name: 'CMS Image',
        icon: <Database className="h-5 w-5" />,
        description: 'Image element that can bind to CMS content',
        isCMS: true
      },
      {
        type: 'list',
        name: 'CMS List',
        icon: <Database className="h-5 w-5" />,
        description: 'Dynamic list that displays CMS collection items',
        isCMS: true
      }
    ]
  };

  const categories = [
    { id: 'basic', name: 'Basic', count: elementTypes.basic.length },
    { id: 'layout', name: 'Layout', count: elementTypes.layout.length },
    { id: 'cms', name: 'CMS', count: elementTypes.cms.length }
  ];

  const filteredElements = elementTypes[activeCategory]?.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Elements</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredElements.map((element) => (
            <DraggableElement
              key={element.type}
              element={element}
              onAddElement={onAddElement}
            />
          ))}
        </div>

        {filteredElements.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No elements found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="mb-1">💡 <strong>Tip:</strong> Drag elements to the canvas</p>
          <p>or click to add at default position</p>
        </div>
      </div>
    </div>
  );
};

const DraggableElement = ({ element, onAddElement }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { elementType: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 border border-gray-200 rounded-lg cursor-move hover:border-primary-300 hover:bg-primary-50 transition-all group ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onAddElement(element.type)}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-100 transition-colors">
          {element.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {element.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {element.description}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddElement(element.type);
          }}
          className="p-1 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ElementsSidebar;
