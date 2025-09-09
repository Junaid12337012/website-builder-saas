import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default theme configuration
const defaultTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6'
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Georgia, serif',
      mono: 'JetBrains Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  }
};

// Predefined theme presets
export const themePresets = {
  default: defaultTheme,
  dark: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: '#60A5FA',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151'
    }
  },
  minimal: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: '#000000',
      secondary: '#666666',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E0E0E0'
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: {
        primary: 'Helvetica Neue, Arial, sans-serif',
        secondary: 'Times New Roman, serif',
        mono: 'Monaco, monospace'
      }
    }
  },
  vibrant: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#2C3E50',
      textSecondary: '#7F8C8D'
    }
  },
  nature: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: '#27AE60',
      secondary: '#F39C12',
      accent: '#E67E22',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#2C3E50',
      textSecondary: '#7F8C8D'
    }
  },
  corporate: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#3498DB',
      background: '#FFFFFF',
      surface: '#ECEFF1',
      text: '#2C3E50',
      textSecondary: '#7F8C8D'
    },
    typography: {
      ...defaultTheme.typography,
      fontFamily: {
        primary: 'Roboto, Arial, sans-serif',
        secondary: 'Merriweather, serif',
        mono: 'Source Code Pro, monospace'
      }
    }
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme state
      currentTheme: defaultTheme,
      activePreset: 'default',
      customThemes: {},
      
      // Theme management
      setTheme: (theme) => {
        set({ currentTheme: theme });
      },
      
      setPreset: (presetName) => {
        const preset = themePresets[presetName];
        if (preset) {
          set({ 
            currentTheme: preset, 
            activePreset: presetName 
          });
        }
      },
      
      updateColors: (colors) => {
        const { currentTheme } = get();
        set({
          currentTheme: {
            ...currentTheme,
            colors: {
              ...currentTheme.colors,
              ...colors
            }
          },
          activePreset: 'custom'
        });
      },
      
      updateTypography: (typography) => {
        const { currentTheme } = get();
        set({
          currentTheme: {
            ...currentTheme,
            typography: {
              ...currentTheme.typography,
              ...typography
            }
          },
          activePreset: 'custom'
        });
      },
      
      updateSpacing: (spacing) => {
        const { currentTheme } = get();
        set({
          currentTheme: {
            ...currentTheme,
            spacing: {
              ...currentTheme.spacing,
              ...spacing
            }
          },
          activePreset: 'custom'
        });
      },
      
      // Save custom theme
      saveCustomTheme: (name, theme) => {
        const { customThemes } = get();
        set({
          customThemes: {
            ...customThemes,
            [name]: theme || get().currentTheme
          }
        });
      },
      
      // Delete custom theme
      deleteCustomTheme: (name) => {
        const { customThemes } = get();
        const newCustomThemes = { ...customThemes };
        delete newCustomThemes[name];
        set({ customThemes: newCustomThemes });
      },
      
      // Load custom theme
      loadCustomTheme: (name) => {
        const { customThemes } = get();
        const theme = customThemes[name];
        if (theme) {
          set({ 
            currentTheme: theme, 
            activePreset: name 
          });
        }
      },
      
      // Reset to default
      resetTheme: () => {
        set({ 
          currentTheme: defaultTheme, 
          activePreset: 'default' 
        });
      },
      
      // Generate CSS variables from current theme
      generateCSSVariables: () => {
        const { currentTheme } = get();
        const cssVars = {};
        
        // Colors
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
          cssVars[`--color-${key}`] = value;
        });
        
        // Typography
        Object.entries(currentTheme.typography.fontSize).forEach(([key, value]) => {
          cssVars[`--font-size-${key}`] = value;
        });
        
        Object.entries(currentTheme.typography.fontWeight).forEach(([key, value]) => {
          cssVars[`--font-weight-${key}`] = value;
        });
        
        Object.entries(currentTheme.typography.lineHeight).forEach(([key, value]) => {
          cssVars[`--line-height-${key}`] = value;
        });
        
        // Spacing
        Object.entries(currentTheme.spacing).forEach(([key, value]) => {
          cssVars[`--spacing-${key}`] = value;
        });
        
        // Border radius
        Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
          cssVars[`--border-radius-${key}`] = value;
        });
        
        // Shadows
        Object.entries(currentTheme.shadows).forEach(([key, value]) => {
          cssVars[`--shadow-${key}`] = value;
        });
        
        return cssVars;
      },
      
      // Apply theme to document
      applyThemeToDocument: () => {
        const cssVars = get().generateCSSVariables();
        const root = document.documentElement;
        
        Object.entries(cssVars).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      },
      
      // Get theme-aware styles for elements
      getElementStyles: (elementType, variant = 'default') => {
        const { currentTheme } = get();
        
        const baseStyles = {
          color: currentTheme.colors.text,
          fontFamily: currentTheme.typography.fontFamily.primary,
          fontSize: currentTheme.typography.fontSize.base,
          lineHeight: currentTheme.typography.lineHeight.normal
        };
        
        // Element-specific styles
        switch (elementType) {
          case 'heading':
            return {
              ...baseStyles,
              fontWeight: currentTheme.typography.fontWeight.bold,
              fontSize: variant === 'h1' ? currentTheme.typography.fontSize['4xl'] :
                       variant === 'h2' ? currentTheme.typography.fontSize['3xl'] :
                       variant === 'h3' ? currentTheme.typography.fontSize['2xl'] :
                       variant === 'h4' ? currentTheme.typography.fontSize.xl :
                       variant === 'h5' ? currentTheme.typography.fontSize.lg :
                       currentTheme.typography.fontSize.base,
              lineHeight: currentTheme.typography.lineHeight.tight
            };
          
          case 'button':
            return {
              ...baseStyles,
              backgroundColor: variant === 'primary' ? currentTheme.colors.primary :
                              variant === 'secondary' ? currentTheme.colors.secondary :
                              currentTheme.colors.surface,
              color: variant === 'primary' || variant === 'secondary' ? 
                     currentTheme.colors.background : currentTheme.colors.text,
              padding: `${currentTheme.spacing.sm} ${currentTheme.spacing.md}`,
              borderRadius: currentTheme.borderRadius.md,
              fontWeight: currentTheme.typography.fontWeight.medium,
              border: variant === 'outline' ? 
                     `1px solid ${currentTheme.colors.border}` : 'none'
            };
          
          case 'card':
            return {
              backgroundColor: currentTheme.colors.surface,
              borderRadius: currentTheme.borderRadius.lg,
              boxShadow: currentTheme.shadows.md,
              padding: currentTheme.spacing.lg,
              border: `1px solid ${currentTheme.colors.border}`
            };
          
          default:
            return baseStyles;
        }
      }
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        activePreset: state.activePreset,
        customThemes: state.customThemes
      })
    }
  )
);
