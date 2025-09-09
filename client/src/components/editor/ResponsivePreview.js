import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Eye,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';

const ResponsivePreview = ({ canvas, onCanvasUpdate }) => {
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const devices = {
    mobile: {
      name: 'Mobile',
      icon: <Smartphone className="w-4 h-4" />,
      width: 375,
      height: 667,
      breakpoint: 'sm'
    },
    tablet: {
      name: 'Tablet',
      icon: <Tablet className="w-4 h-4" />,
      width: 768,
      height: 1024,
      breakpoint: 'md'
    },
    desktop: {
      name: 'Desktop',
      icon: <Monitor className="w-4 h-4" />,
      width: 1200,
      height: 800,
      breakpoint: 'lg'
    }
  };

  const handleDeviceChange = (device) => {
    setActiveDevice(device);
    if (onCanvasUpdate) {
      onCanvasUpdate({
        ...canvas,
        activeBreakpoint: devices[device].breakpoint
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Responsive Preview
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {Object.entries(devices).map(([key, device]) => (
          <motion.button
            key={key}
            onClick={() => handleDeviceChange(key)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeDevice === key
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {device.icon}
            <span>{device.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{
            width: devices[activeDevice].width,
            height: devices[activeDevice].height,
            maxWidth: '100%',
            maxHeight: '400px'
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Monitor className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Canvas Preview</p>
              <p className="text-xs">{devices[activeDevice].width} × {devices[activeDevice].height}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Breakpoint: {devices[activeDevice].breakpoint}</span>
        <span>Scale: Auto</span>
      </div>
    </div>
  );
};

export default ResponsivePreview;
