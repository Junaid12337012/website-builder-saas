import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chrome } from '@uiw/react-color';
import { 
  Type, 
  Palette, 
  Layout, 
  Settings,
  Database,
  Zap,
  ChevronDown,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import CMSPanel from './CMSPanel';
import AnimationPanel from './AnimationPanel';
import ThemePanel from './ThemePanel';

const PropertiesSidebar = ({ 
  selectedElement, 
  canvas, 
  onUpdateElement, 
  onUpdateCanvas 
}) => {
  const [activeTab, setActiveTab] = useState('style');
  const [expandedSections, setExpandedSections] = useState({
    typography: true,
    colors: true,
    spacing: true,
    layout: true,
    canvas: true
  });
  const [showColorPicker, setShowColorPicker] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStyleUpdate = (styleKey, value) => {
    if (selectedElement) {
      onUpdateElement({
        styles: {
          ...selectedElement.styles,
          [styleKey]: value
        }
      });
    }
  };

  const handleContentUpdate = (contentKey, value) => {
    if (selectedElement) {
      onUpdateElement({
        content: {
          ...selectedElement.content,
          [contentKey]: value
        }
      });
    }
  };

  const handleCanvasUpdate = (canvasKey, value) => {
    onUpdateCanvas({
      [canvasKey]: value
    });
  };

  const tabs = [
    { id: 'style', name: 'Style', icon: <Palette className="h-4 w-4" /> },
    { id: 'layout', name: 'Layout', icon: <Layout className="h-4 w-4" /> },
    { id: 'content', name: 'Content', icon: <Type className="h-4 w-4" /> },
    { id: 'animations', name: 'Animations', icon: <Zap className="h-4 w-4" /> },
    { id: 'theme', name: 'Theme', icon: <Palette className="h-4 w-4" /> },
    { id: 'cms', name: 'CMS', icon: <Database className="h-4 w-4" /> },
    { id: 'canvas', name: 'Canvas', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Properties</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="ml-1.5 hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedElement && activeTab !== 'canvas' && activeTab !== 'cms' ? (
          <div className="text-center py-8 text-gray-500 p-4">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        ) : (
          <div className={activeTab === 'cms' ? '' : 'p-4'}>
            <div className="space-y-4">
              {activeTab === 'style' && selectedElement && (
                <StylePanel
                  element={selectedElement}
                  onUpdate={handleStyleUpdate}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  showColorPicker={showColorPicker}
                  setShowColorPicker={setShowColorPicker}
                />
              )}

              {activeTab === 'layout' && selectedElement && (
                <LayoutPanel
                  element={selectedElement}
                  onUpdate={onUpdateElement}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                />
              )}

              {activeTab === 'content' && selectedElement && (
                <ContentPanel
                  element={selectedElement}
                  onUpdate={handleContentUpdate}
                />
              )}

              {activeTab === 'animations' && (
                <AnimationPanel />
              )}

              {activeTab === 'theme' && (
                <ThemePanel />
              )}

              {activeTab === 'cms' && (
                <CMSPanel />
              )}

              {activeTab === 'canvas' && (
                <CanvasPanel
                  canvas={canvas}
                  onUpdate={handleCanvasUpdate}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Style Panel Component
const StylePanel = ({ 
  element, 
  onUpdate, 
  expandedSections, 
  onToggleSection,
  showColorPicker,
  setShowColorPicker
}) => {
  return (
    <div className="space-y-4">
      {/* Typography */}
      {(element.type === 'text' || element.type === 'button') && (
        <PropertySection
          title="Typography"
          icon={<Type className="h-4 w-4" />}
          expanded={expandedSections.typography}
          onToggle={() => onToggleSection('typography')}
        >
          <div className="space-y-3">
            <div>
              <label className="property-label">Font Family</label>
              <select
                value={element.styles?.fontFamily || 'Inter, sans-serif'}
                onChange={(e) => onUpdate('fontFamily', e.target.value)}
                className="input text-sm"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="property-label">Size</label>
                <input
                  type="text"
                  value={element.styles?.fontSize || '16px'}
                  onChange={(e) => onUpdate('fontSize', e.target.value)}
                  className="input text-sm"
                  placeholder="16px"
                />
              </div>
              <div>
                <label className="property-label">Weight</label>
                <select
                  value={element.styles?.fontWeight || '400'}
                  onChange={(e) => onUpdate('fontWeight', e.target.value)}
                  className="input text-sm"
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="property-label">Alignment</label>
              <div className="flex space-x-1">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => onUpdate('textAlign', align)}
                    className={`p-2 rounded border ${
                      element.styles?.textAlign === align
                        ? 'bg-primary-100 border-primary-300'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="h-4 w-4" />}
                    {align === 'center' && <AlignCenter className="h-4 w-4" />}
                    {align === 'right' && <AlignRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PropertySection>
      )}

      {/* Colors */}
      <PropertySection
        title="Colors"
        icon={<Palette className="h-4 w-4" />}
        expanded={expandedSections.colors}
        onToggle={() => onToggleSection('colors')}
      >
        <div className="space-y-3">
          <ColorInput
            label="Text Color"
            value={element.styles?.color || '#000000'}
            onChange={(color) => onUpdate('color', color)}
            showColorPicker={showColorPicker === 'color'}
            setShowColorPicker={() => setShowColorPicker(showColorPicker === 'color' ? null : 'color')}
          />
          
          <ColorInput
            label="Background"
            value={element.styles?.backgroundColor || 'transparent'}
            onChange={(color) => onUpdate('backgroundColor', color)}
            showColorPicker={showColorPicker === 'backgroundColor'}
            setShowColorPicker={() => setShowColorPicker(showColorPicker === 'backgroundColor' ? null : 'backgroundColor')}
          />
        </div>
      </PropertySection>

      {/* Spacing */}
      <PropertySection
        title="Spacing"
        icon={<Layout className="h-4 w-4" />}
        expanded={expandedSections.spacing}
        onToggle={() => onToggleSection('spacing')}
      >
        <div className="space-y-3">
          <div>
            <label className="property-label">Padding</label>
            <input
              type="text"
              value={element.styles?.padding || '0px'}
              onChange={(e) => onUpdate('padding', e.target.value)}
              className="input text-sm"
              placeholder="0px"
            />
          </div>
          
          <div>
            <label className="property-label">Margin</label>
            <input
              type="text"
              value={element.styles?.margin || '0px'}
              onChange={(e) => onUpdate('margin', e.target.value)}
              className="input text-sm"
              placeholder="0px"
            />
          </div>

          <div>
            <label className="property-label">Border Radius</label>
            <input
              type="text"
              value={element.styles?.borderRadius || '0px'}
              onChange={(e) => onUpdate('borderRadius', e.target.value)}
              className="input text-sm"
              placeholder="0px"
            />
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

// Layout Panel Component
const LayoutPanel = ({ element, onUpdate, expandedSections, onToggleSection }) => {
  return (
    <div className="space-y-4">
      <PropertySection
        title="Position & Size"
        icon={<Layout className="h-4 w-4" />}
        expanded={expandedSections.layout}
        onToggle={() => onToggleSection('layout')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="property-label">X Position</label>
              <input
                type="number"
                value={element.position?.x || 0}
                onChange={(e) => onUpdate({
                  position: { ...element.position, x: parseInt(e.target.value) }
                })}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="property-label">Y Position</label>
              <input
                type="number"
                value={element.position?.y || 0}
                onChange={(e) => onUpdate({
                  position: { ...element.position, y: parseInt(e.target.value) }
                })}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="property-label">Width</label>
              <input
                type="number"
                value={element.dimensions?.width || 0}
                onChange={(e) => onUpdate({
                  dimensions: { ...element.dimensions, width: parseInt(e.target.value) }
                })}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="property-label">Height</label>
              <input
                type="number"
                value={element.dimensions?.height || 0}
                onChange={(e) => onUpdate({
                  dimensions: { ...element.dimensions, height: parseInt(e.target.value) }
                })}
                className="input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="property-label">Z-Index</label>
            <input
              type="number"
              value={element.position?.z || 1}
              onChange={(e) => onUpdate({
                position: { ...element.position, z: parseInt(e.target.value) }
              })}
              className="input text-sm"
            />
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

// Content Panel Component
const ContentPanel = ({ element, onUpdate }) => {
  return (
    <div className="space-y-4">
      {element.type === 'text' && (
        <div>
          <label className="property-label">Text Content</label>
          <textarea
            value={element.content?.text || ''}
            onChange={(e) => onUpdate('text', e.target.value)}
            className="input resize-none"
            rows={4}
            placeholder="Enter text content..."
          />
        </div>
      )}

      {element.type === 'image' && (
        <div className="space-y-3">
          <div>
            <label className="property-label">Image URL</label>
            <input
              type="url"
              value={element.content?.src || ''}
              onChange={(e) => onUpdate('src', e.target.value)}
              className="input text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="property-label">Alt Text</label>
            <input
              type="text"
              value={element.content?.alt || ''}
              onChange={(e) => onUpdate('alt', e.target.value)}
              className="input text-sm"
              placeholder="Image description"
            />
          </div>
        </div>
      )}

      {element.type === 'button' && (
        <div className="space-y-3">
          <div>
            <label className="property-label">Button Text</label>
            <input
              type="text"
              value={element.content?.text || ''}
              onChange={(e) => onUpdate('text', e.target.value)}
              className="input text-sm"
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="property-label">Link URL</label>
            <input
              type="url"
              value={element.content?.href || ''}
              onChange={(e) => onUpdate('href', e.target.value)}
              className="input text-sm"
              placeholder="https://example.com"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Canvas Panel Component
const CanvasPanel = ({ canvas, onUpdate, expandedSections, onToggleSection }) => {
  return (
    <div className="space-y-4">
      <PropertySection
        title="Canvas Settings"
        icon={<Settings className="h-4 w-4" />}
        expanded={expandedSections.canvas}
        onToggle={() => onToggleSection('canvas')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="property-label">Width</label>
              <input
                type="number"
                value={canvas.width || 1200}
                onChange={(e) => onUpdate('width', parseInt(e.target.value))}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="property-label">Height</label>
              <input
                type="number"
                value={canvas.height || 800}
                onChange={(e) => onUpdate('height', parseInt(e.target.value))}
                className="input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="property-label">Background Color</label>
            <input
              type="color"
              value={canvas.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate('backgroundColor', e.target.value)}
              className="input h-10"
            />
          </div>

          <div>
            <label className="property-label">Grid Size</label>
            <input
              type="number"
              value={canvas.gridSize || 10}
              onChange={(e) => onUpdate('gridSize', parseInt(e.target.value))}
              className="input text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={canvas.snapToGrid || false}
              onChange={(e) => onUpdate('snapToGrid', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Snap to Grid</label>
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

// Property Section Component
const PropertySection = ({ title, icon, expanded, onToggle, children }) => {
  return (
    <div className="property-group">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-primary-600"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Color Input Component
const ColorInput = ({ label, value, onChange, showColorPicker, setShowColorPicker }) => {
  return (
    <div>
      <label className="property-label">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          onClick={setShowColorPicker}
          className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input text-sm flex-1"
        />
      </div>
      
      {showColorPicker && (
        <div className="absolute z-50 mt-2">
          <div
            className="fixed inset-0"
            onClick={() => setShowColorPicker(false)}
          />
          <Chrome
            color={value}
            onChange={(color) => onChange(color.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default PropertiesSidebar;
