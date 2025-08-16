import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/authSlice';
import {
  Palette,
  Check,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Brush,
  Stars,
  Smile,
  Coffee,
  Leaf,
  Flame
} from 'lucide-react';

// Enhanced theme configurations with better previews
const ENHANCED_THEMES = {
  minimal: {
    name: 'Minimal Clean',
    description: 'Simple and professional',
    category: 'Professional',
    icon: Sun,
    preview: {
      bg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      bgSolid: '#ffffff',
      primary: '#6366f1',
      accent: '#ec4899',
      text: '#1f2937',
      cardBg: '#ffffff',
      cardBorder: '#e5e7eb'
    },
    config: {
      bgColor: "#ffffff",
      textColor: "#1f2937",
      primaryColor: "#6366f1",
      accentColor: "#ec4899",
      fontFamily: "Inter, sans-serif",
      linkStyle: "rounded",
      spacing: "comfortable"
    }
  },
  dark: {
    name: 'Dark Professional',
    description: 'Sleek and modern',
    category: 'Professional',
    icon: Moon,
    preview: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      bgSolid: '#0f172a',
      primary: '#a855f7',
      accent: '#06b6d4',
      text: '#f8fafc',
      cardBg: '#1e293b',
      cardBorder: '#334155'
    },
    config: {
      bgColor: "#0f172a",
      textColor: "#f8fafc",
      primaryColor: "#a855f7",
      accentColor: "#06b6d4",
      fontFamily: "Inter, sans-serif",
      linkStyle: "rounded",
      spacing: "comfortable"
    }
  },
  gradient: {
    name: 'Gradient Dreams',
    description: 'Vibrant and creative',
    category: 'Creative',
    icon: Brush,
    preview: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgSolid: '#667eea',
      primary: '#ffffff',
      accent: '#fbbf24',
      text: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      cardBorder: 'rgba(5, 150, 105, 0.3)'
    },
    config: {
      bgColor: "#a7f3d0",
      textColor: "#064e3b",
      primaryColor: "#059669",
      accentColor: "#0d9488",
      fontFamily: "Inter, sans-serif",
      linkStyle: "rounded",
      spacing: "comfortable"
    }
  },
  neon: {
    name: 'Neon Cyber',
    description: 'Futuristic and bold',
    category: 'Creative',
    icon: Zap,
    preview: {
      bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      bgSolid: '#0c0c0c',
      primary: '#00ff88',
      accent: '#ff0080',
      text: '#ffffff',
      cardBg: 'rgba(0, 255, 136, 0.1)',
      cardBorder: '#00ff88'
    },
    config: {
      bgColor: "#0c0c0c",
      textColor: "#ffffff",
      primaryColor: "#00ff88",
      accentColor: "#ff0080",
      fontFamily: "Fira Code, monospace",
      linkStyle: "square",
      spacing: "compact"
    }
  },
  ocean: {
    name: 'Ocean Blue',
    description: 'Calm and trustworthy',
    category: 'Professional',
    icon: Coffee,
    preview: {
      bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      bgSolid: '#0ea5e9',
      primary: '#ffffff',
      accent: '#fbbf24',
      text: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      cardBorder: 'rgba(255, 255, 255, 0.3)'
    },
    config: {
      bgColor: "#0ea5e9",
      textColor: "#ffffff",
      primaryColor: "#ffffff",
      accentColor: "#fbbf24",
      fontFamily: "Inter, sans-serif",
      linkStyle: "rounded",
      spacing: "comfortable"
    }
  },
  cotton: {
    name: 'Cotton Candy',
    description: 'Sweet and playful',
    category: 'Lifestyle',
    icon: Smile,
    preview: {
      bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      bgSolid: '#fdf2f8',
      primary: '#ec4899',
      accent: '#8b5cf6',
      text: '#831843',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(236, 72, 153, 0.2)'
    },
    config: {
      bgColor: "#fdf2f8",
      textColor: "#831843",
      primaryColor: "#ec4899",
      accentColor: "#8b5cf6",
      fontFamily: "Poppins, sans-serif",
      linkStyle: "rounded",
      spacing: "spacious"
    }
  },
  sunset: {
    name: 'Sunset Vibes',
    description: 'Warm and inviting',
    category: 'Creative',
    icon: Flame,
    preview: {
      bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      bgSolid: '#ff9a9e',
      primary: '#dc2626',
      accent: '#f59e0b',
      text: '#7c2d12',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(220, 38, 38, 0.2)'
    },
    config: {
      bgColor: "#ff9a9e",
      textColor: "#7c2d12",
      primaryColor: "#dc2626",
      accentColor: "#f59e0b",
      fontFamily: "Poppins, sans-serif",
      linkStyle: "rounded",
      spacing: "spacious"
    }
  },
  nature: {
    name: 'Nature Fresh',
    description: 'Clean and organic',
    category: 'Lifestyle',
    icon: Leaf,
    preview: {
      bg: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)',
      bgSolid: '#a7f3d0',
      primary: '#059669',
      accent: '#0d9488',
      text: '#064e3b',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(5, 150, 105, 0.2)'
    },
    config: {
      bgColor: "#a7f3d0",
      textColor: "#064e3b",
      primaryColor: "#059669",
      accentColor: "#0d9488",
      fontFamily: "Poppins, sans-serif",
      linkStyle: "rounded",
      spacing: "spacious"
    }
  }
};

const CATEGORIES = [
  { id: 'all', name: 'All Themes', icon: Stars },
  { id: 'Professional', name: 'Professional', icon: Sun },
  { id: 'Creative', name: 'Creative', icon: Brush },
  { id: 'Lifestyle', name: 'Lifestyle', icon: Smile }
];

const EnhancedThemeSelector = ({ initialTheme = 'minimal', onComplete, onBack }) => {
  const dispatch = useDispatch();
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Filter themes by category
  const filteredThemes = activeCategory === 'all' 
    ? Object.entries(ENHANCED_THEMES)
    : Object.entries(ENHANCED_THEMES).filter(([key, theme]) => theme.category === activeCategory);

  const handleThemeSelect = (themeKey) => {
    setSelectedTheme(themeKey);
    // Add a subtle haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await dispatch(updateUserProfile({
        theme: selectedTheme,
        themeConfig: ENHANCED_THEMES[selectedTheme].config
      })).unwrap();

      onComplete(selectedTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setLoading(false);
    }
  };

  // Theme Preview Component
  const ThemePreview = ({ themeKey, theme, isSelected, onClick, size = 'normal' }) => {
    const Icon = theme.icon;
    const isSmall = size === 'small';
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(themeKey)}
        className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-purple-500 ring-opacity-50 shadow-2xl'
            : 'hover:shadow-xl border border-gray-200'
        } ${isSmall ? 'h-32' : 'h-auto min-h-[280px]'}`}
        style={{ background: theme.preview.bg }}
      >
        {/* Theme Content Preview */}
        <div className="h-full p-6 relative">
          <div className="space-y-4">
            {/* Profile Avatar */}
            <motion.div 
              className={`${isSmall ? 'w-8 h-8' : 'w-16 h-16'} rounded-full mx-auto shadow-lg`}
              style={{ backgroundColor: theme.preview.primary }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            />
            
            {/* Profile Name */}
            <motion.h3 
              className={`font-bold text-center ${isSmall ? 'text-sm' : 'text-lg'}`}
              style={{ color: theme.preview.text }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isSmall ? theme.name : 'Your Name'}
            </motion.h3>
            
            {/* Bio Text */}
            {!isSmall && (
              <motion.p 
                className="text-center text-sm opacity-75"
                style={{ color: theme.preview.text }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                transition={{ delay: 0.3 }}
              >
                {theme.description}
              </motion.p>
            )}
            
            {/* Sample Links */}
            <div className="space-y-2 pt-2">
              {[1, 2].map(i => (
                <motion.div
                  key={i}
                  className={`${isSmall ? 'h-4 text-xs' : 'h-12 text-sm'} rounded-lg flex items-center justify-center font-semibold transition-all backdrop-blur-sm`}
                  style={{ 
                    backgroundColor: theme.preview.cardBg,
                    border: `2px solid ${theme.preview.cardBorder}`,
                    color: theme.preview.text
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  whileHover={{ scale: 1.02 }}
                >
                  {isSmall ? `Link ${i}` : `Sample Link ${i}`}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <motion.span 
            className="px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              backgroundColor: `${theme.preview.primary}20`,
              color: theme.preview.primary,
              border: `1px solid ${theme.preview.primary}40`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {theme.category}
          </motion.span>
        </div>

        {/* Theme Icon */}
        <div className="absolute top-3 right-3">
          <motion.div
            className="w-8 h-8 rounded-lg backdrop-blur-sm flex items-center justify-center"
            style={{ backgroundColor: `${theme.preview.primary}20` }}
            whileHover={{ rotate: 15 }}
          >
            <Icon className="w-4 h-4" style={{ color: theme.preview.primary }} />
          </motion.div>
        </div>

        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute bottom-3 right-3 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-200 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl"
          >
            <Palette className="w-10 h-10 text-white" />
          </motion.div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Theme
            </h1>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select a theme that matches your personality and style. Each theme is carefully crafted for the best user experience.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Grid View' : 'Preview Mode'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Theme Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          <AnimatePresence mode="wait">
            {filteredThemes.map(([themeKey, theme]) => (
              <motion.div
                key={themeKey}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ThemePreview
                  themeKey={themeKey}
                  theme={theme}
                  isSelected={selectedTheme === themeKey}
                  onClick={handleThemeSelect}
                />
                
                {/* Theme Info */}
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 text-lg">{theme.name}</h3>
                  <p className="text-gray-600 text-sm">{theme.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Selected Theme Preview */}
        {selectedTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Selected: {ENHANCED_THEMES[selectedTheme].name}
              </h3>
              <p className="text-gray-600">
                {ENHANCED_THEMES[selectedTheme].description}
              </p>
            </div>

            {/* Live Preview */}
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-900 rounded-[2.5rem] p-2">
                <div 
                  className="rounded-[2rem] p-8 h-[500px] overflow-y-auto"
                  style={{ background: ENHANCED_THEMES[selectedTheme].preview.bg }}
                >
                  {/* Mobile Preview Content */}
                  <div className="text-center space-y-6">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                      style={{ backgroundColor: ENHANCED_THEMES[selectedTheme].preview.primary }}
                    />
                    <div>
                      <h1 
                        className="text-xl font-bold mb-2"
                        style={{ color: ENHANCED_THEMES[selectedTheme].preview.text }}
                      >
                        @yourusername
                      </h1>
                      <p 
                        className="text-sm opacity-80"
                        style={{ color: ENHANCED_THEMES[selectedTheme].preview.text }}
                      >
                        Your bio will appear here and tell visitors about yourself
                      </p>
                    </div>
                    
                    {/* Sample Links */}
                    <div className="space-y-3">
                      {['Instagram', 'Twitter', 'Website', 'Contact'].map((linkName, index) => (
                        <motion.div
                          key={linkName}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl font-semibold text-center backdrop-blur-sm"
                          style={{ 
                            backgroundColor: ENHANCED_THEMES[selectedTheme].preview.cardBg,
                            border: `2px solid ${ENHANCED_THEMES[selectedTheme].preview.cardBorder}`,
                            color: ENHANCED_THEMES[selectedTheme].preview.text
                          }}
                        >
                          {linkName}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-4 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-800 transition-all font-semibold w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Links</span>
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Theme: <span className="font-semibold text-purple-600">{ENHANCED_THEMES[selectedTheme].name}</span>
            </p>
            <p className="text-xs text-gray-500">
              You can always change this later
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all w-full sm:w-auto justify-center ${
              loading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                />
                <span>Applying Theme...</span>
              </>
            ) : (
              <>
                <span>Complete Setup</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            Theme Selection Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Choose themes that reflect your personality or brand</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Consider your target audience and their preferences</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Dark themes work great for creative professionals</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Light themes are perfect for business and lifestyle</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedThemeSelector;