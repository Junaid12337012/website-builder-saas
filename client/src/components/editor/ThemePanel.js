import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  Download, 
  Upload,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { useThemeStore, themePresets } from '../../stores/themeStore';
import { toast } from 'react-toastify';

const ThemePanel = () => {
  const [expandedSections, setExpandedSections] = useState({
    presets: true,
    colors: false,
    typography: false,
    spacing: false,
    custom: false
  });
  const [customThemeName, setCustomThemeName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(null);

  const {
    currentTheme,
    activePreset,
    customThemes,
    setPreset,
    updateColors,
    updateTypography,
    updateSpacing,
    saveCustomTheme,
    deleteCustomTheme,
    loadCustomTheme,
    resetTheme,
    applyThemeToDocument
  } = useThemeStore();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleColorChange = (colorKey, value) => {
    updateColors({ [colorKey]: value });
    applyThemeToDocument();
  };

  const handleTypographyChange = (category, key, value) => {
    updateTypography({
      [category]: {
        ...currentTheme.typography[category],
        [key]: value
      }
    });
    applyThemeToDocument();
  };

  const handleSaveCustomTheme = () => {
    if (!customThemeName.trim()) {
      toast.error('Please enter a theme name');
      return;
    }
    
    saveCustomTheme(customThemeName, currentTheme);
    setCustomThemeName('');
    toast.success(`Theme "${customThemeName}" saved successfully!`);
  };

  const handlePresetChange = (presetName) => {
    setPreset(presetName);
    applyThemeToDocument();
    toast.success(`Applied ${presetName} theme`);
  };

  const ColorPicker = ({ label, colorKey, value }) => (
    <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setShowColorPicker(showColorPicker === colorKey ? null : colorKey)}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-0 h-0 opacity-0"
        />
      </div>
      {showColorPicker === colorKey && (
        <div className="absolute z-10 mt-2">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            className="w-20 h-20"
          />
        </div>
      )}
    </div>
  );

  const PresetCard = ({ name, theme, isActive, isCustom = false }) => (
    <motion.div
      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
        isActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => isCustom ? loadCustomTheme(name) : handlePresetChange(name)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm capitalize">{name}</span>
        {isCustom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomTheme(name);
              toast.success(`Theme "${name}" deleted`);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* Theme preview */}
      <div className="space-y-1">
        <div className="flex space-x-1">
          <div 
            className="w-4 h-4 rounded-sm" 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="w-4 h-4 rounded-sm" 
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div 
            className="w-4 h-4 rounded-sm" 
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
        <div 
          className="w-full h-2 rounded-sm" 
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-primary-600" />
          Global Theme
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Customize colors, fonts, and spacing for your entire project
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Presets */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('presets')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <span className="font-medium text-gray-900">Theme Presets</span>
            {expandedSections.presets ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.presets && (
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(themePresets).map(([name, theme]) => (
                  <PresetCard
                    key={name}
                    name={name}
                    theme={theme}
                    isActive={activePreset === name}
                  />
                ))}
              </div>
              
              {Object.keys(customThemes).length > 0 && (
                <>
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Themes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(customThemes).map(([name, theme]) => (
                        <PresetCard
                          key={name}
                          name={name}
                          theme={theme}
                          isActive={activePreset === name}
                          isCustom={true}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <span className="font-medium text-gray-900">Colors</span>
            {expandedSections.colors ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.colors && (
            <div className="p-3 space-y-2">
              {Object.entries(currentTheme.colors).map(([key, value]) => (
                <ColorPicker
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  colorKey={key}
                  value={value}
                />
              ))}
            </div>
          )}
        </div>

        {/* Typography */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('typography')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <span className="font-medium text-gray-900">Typography</span>
            {expandedSections.typography ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.typography && (
            <div className="p-3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Font
                </label>
                <select
                  value={currentTheme.typography.fontFamily.primary}
                  onChange={(e) => handleTypographyChange('fontFamily', 'primary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="Roboto, Arial, sans-serif">Roboto</option>
                  <option value="Helvetica Neue, Arial, sans-serif">Helvetica</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Font Size
                </label>
                <select
                  value={currentTheme.typography.fontSize.base}
                  onChange={(e) => handleTypographyChange('fontSize', 'base', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="0.875rem">14px</option>
                  <option value="1rem">16px</option>
                  <option value="1.125rem">18px</option>
                  <option value="1.25rem">20px</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Spacing */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('spacing')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <span className="font-medium text-gray-900">Spacing & Layout</span>
            {expandedSections.spacing ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.spacing && (
            <div className="p-3 space-y-3">
              {Object.entries(currentTheme.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateSpacing({ [key]: e.target.value })}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Theme Actions */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-3">Save Custom Theme</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Theme name"
              value={customThemeName}
              onChange={(e) => setCustomThemeName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSaveCustomTheme}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <button
              onClick={resetTheme}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
            <button
              onClick={applyThemeToDocument}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
