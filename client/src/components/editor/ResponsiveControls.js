import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Settings,
  RotateCcw,
  Maximize,
  Minimize
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';

const ResponsiveControls = () => {
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [customDimensions, setCustomDimensions] = useState({ width: 1200, height: 800 });

  const { 
    canvas, 
    updateCanvas, 
    selectedElement, 
    updateElement,
    setViewportSize 
  } = useEditorStore();

  const devices = {
    desktop: {
      name: 'Desktop',
      icon: Monitor,
      width: 1200,
      height: 800,
      breakpoint: 'lg'
    },
    tablet: {
      name: 'Tablet',
      icon: Tablet,
      width: 768,
      height: 1024,
      breakpoint: 'md'
    },
    mobile: {
      name: 'Mobile',
      icon: Smartphone,
      width: 375,
      height: 667,
      breakpoint: 'sm'
    }
  };

  useEffect(() => {
    const device = devices[activeDevice];
    setViewportSize(device.width, device.height);
    updateCanvas({
      ...canvas,
      viewport: {
        width: device.width,
        height: device.height,
        device: activeDevice,
        breakpoint: device.breakpoint
      }
    });
  }, [activeDevice]);

  const handleDeviceChange = (deviceKey) => {
    setActiveDevice(deviceKey);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleCustomDimensions = () => {
    setViewportSize(customDimensions.width, customDimensions.height);
    updateCanvas({
      ...canvas,
      viewport: {
        width: customDimensions.width,
        height: customDimensions.height,
        device: 'custom',
        breakpoint: 'custom'
      }
    });
    setActiveDevice('custom');
  };

  const resetToDefault = () => {
    setActiveDevice('desktop');
    setIsPreviewMode(false);
  };

  // Responsive style management for selected element
  const updateResponsiveStyle = (property, value, breakpoint) => {
    if (!selectedElement) return;

    const responsiveStyles = selectedElement.responsiveStyles || {};
    
    updateElement(selectedElement.id, {
      responsiveStyles: {
        ...responsiveStyles,
        [breakpoint]: {
          ...responsiveStyles[breakpoint],
          [property]: value
        }
      }
    });
  };

  const ResponsiveStyleControls = () => {
    if (!selectedElement) return null;

    const currentBreakpoint = devices[activeDevice]?.breakpoint || 'lg';
    const currentStyles = selectedElement.responsiveStyles?.[currentBreakpoint] || {};

    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-3">
          {devices[activeDevice]?.name || 'Custom'} Styles
        </h4>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-blue-800 mb-1">
                Width
              </label>
              <input
                type="text"
                value={currentStyles.width || ''}
                onChange={(e) => updateResponsiveStyle('width', e.target.value, currentBreakpoint)}
                placeholder="auto"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-800 mb-1">
                Height
              </label>
              <input
                type="text"
                value={currentStyles.height || ''}
                onChange={(e) => updateResponsiveStyle('height', e.target.value, currentBreakpoint)}
                placeholder="auto"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-blue-800 mb-1">
                Font Size
              </label>
              <input
                type="text"
                value={currentStyles.fontSize || ''}
                onChange={(e) => updateResponsiveStyle('fontSize', e.target.value, currentBreakpoint)}
                placeholder="inherit"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-800 mb-1">
                Padding
              </label>
              <input
                type="text"
                value={currentStyles.padding || ''}
                onChange={(e) => updateResponsiveStyle('padding', e.target.value, currentBreakpoint)}
                placeholder="0"
                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-800 mb-1">
              Display
            </label>
            <select
              value={currentStyles.display || ''}
              onChange={(e) => updateResponsiveStyle('display', e.target.value, currentBreakpoint)}
              className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Default</option>
              <option value="block">Block</option>
              <option value="inline">Inline</option>
              <option value="inline-block">Inline Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="none">Hidden</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-primary-600" />
          Responsive Design
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePreviewMode}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isPreviewMode 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Eye className="w-4 h-4 mr-1 inline" />
            {isPreviewMode ? 'Exit Preview' : 'Preview'}
          </button>
          
          <button
            onClick={resetToDefault}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Reset to desktop view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Device Selection */}
      <div className="flex items-center space-x-2 mb-4">
        {Object.entries(devices).map(([key, device]) => {
          const IconComponent = device.icon;
          return (
            <motion.button
              key={key}
              onClick={() => handleDeviceChange(key)}
              className={`flex items-center px-3 py-2 rounded-lg border transition-all ${
                activeDevice === key
                  ? 'bg-primary-100 border-primary-300 text-primary-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{device.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                {device.width}×{device.height}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Dimensions */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Width"
            value={customDimensions.width}
            onChange={(e) => setCustomDimensions(prev => ({ ...prev, width: parseInt(e.target.value) || 1200 }))}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="text-gray-500">×</span>
          <input
            type="number"
            placeholder="Height"
            value={customDimensions.height}
            onChange={(e) => setCustomDimensions(prev => ({ ...prev, height: parseInt(e.target.value) || 800 }))}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            onClick={handleCustomDimensions}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Current Viewport Info */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Current: <span className="font-medium">{canvas.viewport?.width || 1200}×{canvas.viewport?.height || 800}</span>
          </span>
          <span className="text-sm text-gray-600">
            Breakpoint: <span className="font-medium">{canvas.viewport?.breakpoint || 'lg'}</span>
          </span>
        </div>
        
        {isPreviewMode && (
          <div className="flex items-center text-green-600">
            <Eye className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Preview Mode</span>
          </div>
        )}
      </div>

      {/* Responsive Style Controls */}
      <ResponsiveStyleControls />

      {/* Breakpoint Guide */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Breakpoint Guide</h4>
        <div className="text-xs text-yellow-800 space-y-1">
          <div>• <strong>sm (Mobile):</strong> 640px and up</div>
          <div>• <strong>md (Tablet):</strong> 768px and up</div>
          <div>• <strong>lg (Desktop):</strong> 1024px and up</div>
          <div>• <strong>xl (Large Desktop):</strong> 1280px and up</div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveControls;
