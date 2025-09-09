import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chrome } from '@uiw/react-color';
import { 
  Palette,
  Layers,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

const AdvancedStylePanel = ({ selectedElement, onUpdateElement }) => {
  const [expandedSections, setExpandedSections] = useState({
    gradients: false,
    shadows: false,
    borders: false,
    transforms: false,
    filters: false
  });
  const [activeColorPicker, setActiveColorPicker] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateStyle = (property, value) => {
    if (!selectedElement || !onUpdateElement) return;
    
    onUpdateElement(selectedElement.id, {
      ...selectedElement,
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    });
  };

  const addGradientStop = () => {
    const currentGradient = selectedElement?.styles?.background || 'linear-gradient(90deg, #000000 0%, #ffffff 100%)';
    // Add logic to parse and add gradient stop
    updateStyle('background', currentGradient);
  };

  const addShadow = () => {
    const currentShadows = selectedElement?.styles?.boxShadow || '';
    const newShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    const updatedShadows = currentShadows ? `${currentShadows}, ${newShadow}` : newShadow;
    updateStyle('boxShadow', updatedShadows);
  };

  const presetGradients = [
    { name: 'Sunset', value: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Gold', value: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' }
  ];

  const presetShadows = [
    { name: 'Subtle', value: '0 1px 3px rgba(0, 0, 0, 0.12)' },
    { name: 'Medium', value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    { name: 'Large', value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
    { name: 'Glow', value: '0 0 20px rgba(59, 130, 246, 0.5)' },
    { name: 'Inset', value: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }
  ];

  return (
    <div className="space-y-4">
      {/* Gradients Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('gradients')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900">Gradients</span>
          </div>
          {expandedSections.gradients ? 
            <ChevronDown className="w-4 h-4 text-gray-500" /> : 
            <ChevronRight className="w-4 h-4 text-gray-500" />
          }
        </button>
        
        {expandedSections.gradients && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-3 space-y-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {presetGradients.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => updateStyle('background', gradient.value)}
                  className="h-8 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                  style={{ background: gradient.value }}
                  title={gradient.name}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={addGradientStop}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Stop</span>
              </button>
              <button
                onClick={() => updateStyle('background', 'transparent')}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Shadows Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('shadows')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">Shadows & Effects</span>
          </div>
          {expandedSections.shadows ? 
            <ChevronDown className="w-4 h-4 text-gray-500" /> : 
            <ChevronRight className="w-4 h-4 text-gray-500" />
          }
        </button>
        
        {expandedSections.shadows && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-3 space-y-3"
          >
            <div className="grid grid-cols-1 gap-2">
              {presetShadows.map((shadow, index) => (
                <button
                  key={index}
                  onClick={() => updateStyle('boxShadow', shadow.value)}
                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                >
                  <span className="text-sm text-gray-700">{shadow.name}</span>
                  <div 
                    className="w-6 h-6 bg-white rounded border"
                    style={{ boxShadow: shadow.value }}
                  />
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={addShadow}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Shadow</span>
              </button>
              <button
                onClick={() => updateStyle('boxShadow', 'none')}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Transforms Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('transforms')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-900">Transforms</span>
          </div>
          {expandedSections.transforms ? 
            <ChevronDown className="w-4 h-4 text-gray-500" /> : 
            <ChevronRight className="w-4 h-4 text-gray-500" />
          }
        </button>
        
        {expandedSections.transforms && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-3 space-y-3"
          >
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rotate</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  defaultValue="0"
                  onChange={(e) => updateStyle('transform', `rotate(${e.target.value}deg)`)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  onChange={(e) => updateStyle('transform', `scale(${e.target.value})`)}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('filters')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          {expandedSections.filters ? 
            <ChevronDown className="w-4 h-4 text-gray-500" /> : 
            <ChevronRight className="w-4 h-4 text-gray-500" />
          }
        </button>
        
        {expandedSections.filters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 p-3 space-y-3"
          >
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  defaultValue="0"
                  onChange={(e) => updateStyle('filter', `blur(${e.target.value}px)`)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  onChange={(e) => updateStyle('filter', `brightness(${e.target.value})`)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  onChange={(e) => updateStyle('filter', `contrast(${e.target.value})`)}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedStylePanel;
