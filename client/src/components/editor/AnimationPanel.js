import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Eye, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { animationPresets, scrollAnimations, hoverAnimations, durations } from '../../utils/animations';

const AnimationPanel = () => {
  const [expandedSections, setExpandedSections] = useState({
    entrance: true,
    scroll: false,
    hover: false,
    advanced: false
  });
  const [previewAnimation, setPreviewAnimation] = useState(null);

  const { selectedElement, updateElement } = useEditorStore();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyAnimation = (animationType, category) => {
    if (!selectedElement) return;

    let animationConfig = {};
    
    switch (category) {
      case 'entrance':
        animationConfig = {
          entrance: {
            type: animationType,
            ...animationPresets[animationType]
          }
        };
        break;
      case 'scroll':
        animationConfig = {
          scroll: {
            type: animationType,
            ...scrollAnimations[animationType]
          }
        };
        break;
      case 'hover':
        animationConfig = {
          hover: {
            type: animationType,
            ...hoverAnimations[animationType]
          }
        };
        break;
    }

    updateElement(selectedElement.id, {
      animations: {
        ...selectedElement.animations,
        ...animationConfig
      }
    });
  };

  const removeAnimation = (category) => {
    if (!selectedElement) return;

    const newAnimations = { ...selectedElement.animations };
    delete newAnimations[category];

    updateElement(selectedElement.id, {
      animations: newAnimations
    });
  };

  const previewAnimationEffect = (animationType, category) => {
    setPreviewAnimation({ type: animationType, category });
    setTimeout(() => setPreviewAnimation(null), 1000);
  };

  const AnimationSection = ({ title, section, animations, category }) => (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {expandedSections[section] ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {expandedSections[section] && (
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(animations).map((animationType) => (
              <motion.button
                key={animationType}
                onClick={() => applyAnimation(animationType, category)}
                onMouseEnter={() => previewAnimationEffect(animationType, category)}
                className="p-2 text-sm border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">{animationType.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <Eye 
                    className="w-3 h-3 text-gray-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      previewAnimationEffect(animationType, category);
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
          
          {selectedElement?.animations?.[category] && (
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  Active: {selectedElement.animations[category].type}
                </span>
                <button
                  onClick={() => removeAnimation(category)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const AnimationControls = () => (
    <div className="border border-gray-200 rounded-lg p-3">
      <h4 className="font-medium text-gray-900 mb-3">Animation Controls</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            value={selectedElement?.animations?.duration || 'normal'}
            onChange={(e) => {
              if (!selectedElement) return;
              updateElement(selectedElement.id, {
                animations: {
                  ...selectedElement.animations,
                  duration: e.target.value
                }
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="fast">Fast (0.2s)</option>
            <option value="normal">Normal (0.3s)</option>
            <option value="slow">Slow (0.5s)</option>
            <option value="slower">Slower (0.8s)</option>
            <option value="slowest">Slowest (1.2s)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delay (ms)
          </label>
          <input
            type="number"
            min="0"
            max="5000"
            step="100"
            value={selectedElement?.animations?.delay || 0}
            onChange={(e) => {
              if (!selectedElement) return;
              updateElement(selectedElement.id, {
                animations: {
                  ...selectedElement.animations,
                  delay: parseInt(e.target.value) || 0
                }
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Easing
          </label>
          <select
            value={selectedElement?.animations?.easing || 'easeOut'}
            onChange={(e) => {
              if (!selectedElement) return;
              updateElement(selectedElement.id, {
                animations: {
                  ...selectedElement.animations,
                  easing: e.target.value
                }
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="easeOut">Ease Out</option>
            <option value="easeIn">Ease In</option>
            <option value="easeInOut">Ease In Out</option>
            <option value="linear">Linear</option>
            <option value="bounce">Bounce</option>
            <option value="elastic">Elastic</option>
          </select>
        </div>
      </div>
    </div>
  );

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Zap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>Select an element to add animations</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-primary-600" />
          Animations
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add motion and life to your elements
        </p>
      </div>

      <div className="p-4 space-y-4">
        <AnimationSection
          title="Entrance Animations"
          section="entrance"
          animations={animationPresets}
          category="entrance"
        />

        <AnimationSection
          title="Scroll Animations"
          section="scroll"
          animations={scrollAnimations}
          category="scroll"
        />

        <AnimationSection
          title="Hover Effects"
          section="hover"
          animations={hoverAnimations}
          category="hover"
        />

        <AnimationControls />

        {/* Preview Animation */}
        {previewAnimation && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-600 rounded-lg z-50"
            {...(previewAnimation.category === 'entrance' 
              ? animationPresets[previewAnimation.type]
              : previewAnimation.category === 'scroll'
              ? scrollAnimations[previewAnimation.type]
              : hoverAnimations[previewAnimation.type]
            )}
          />
        )}
      </div>
    </div>
  );
};

export default AnimationPanel;
