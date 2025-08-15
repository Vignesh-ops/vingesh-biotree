import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserProfile } from '../features/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paintbrush, 
  Check, 
  ChevronLeft, 
  Palette, 
  Type, 
  Layout,
  Moon,
  Sun,
  Eye,
  Save,
  RotateCcw,
  Zap
} from 'lucide-react';

// Enhanced theme configurations with all customization options
const ENHANCED_THEMES = {
  basic: {
    name: 'Minimal Clean',
    description: 'Simple and elegant design',
    category: 'Professional',
    config: {
      bgColor: "#ffffff",
      textColor: "#1f2937",
      primaryColor: "#8b5cf6",
      accentColor: "#ec4899",
      fontFamily: "Inter, sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      headingSize: "28px",
      textSize: "16px",
      iconStyle: "outlined",
      iconColor: "inherit",
      linkStyle: "rounded",
      darkMode: false,
      bgImage: null,
      cardStyle: "elevated",
      spacing: "comfortable"
    }
  },
  business: {
    name: 'Professional',
    description: 'Corporate and trustworthy',
    category: 'Professional',
    config: {
      bgColor: "#f8fafc",
      textColor: "#1e293b",
      primaryColor: "#3b82f6",
      accentColor: "#1d4ed8",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "medium",
      fontStyle: "normal",
      headingSize: "26px",
      textSize: "15px",
      iconStyle: "filled",
      iconColor: "inherit",
      linkStyle: "square",
      darkMode: false,
      bgImage: null,
      cardStyle: "flat",
      spacing: "compact"
    }
  },
  creator: {
    name: 'Creative Burst',
    description: 'Vibrant and artistic',
    category: 'Creative',
    config: {
      bgColor: "#fef2f2",
      textColor: "#7c2d12",
      primaryColor: "#ec4899",
      accentColor: "#f59e0b",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      headingSize: "32px",
      textSize: "17px",
      iconStyle: "filled",
      iconColor: "gradient",
      linkStyle: "rounded",
      darkMode: false,
      bgImage: null,
      cardStyle: "gradient",
      spacing: "spacious"
    }
  },
  developer: {
    name: 'Code Dark',
    description: 'Developer-focused dark theme',
    category: 'Tech',
    config: {
      bgColor: "#0f172a",
      textColor: "#e2e8f0",
      primaryColor: "#22d3ee",
      accentColor: "#10b981",
      fontFamily: "Fira Code, monospace",
      fontWeight: "normal",
      fontStyle: "normal",
      headingSize: "24px",
      textSize: "14px",
      iconStyle: "outlined",
      iconColor: "neon",
      linkStyle: "square",
      darkMode: true,
      bgImage: null,
      cardStyle: "neon",
      spacing: "comfortable"
    }
  },
  singer: {
    name: 'Artist Spotlight',
    description: 'Music and performance focused',
    category: 'Creative',
    config: {
      bgColor: "#1e1b4b",
      textColor: "#f8fafc",
      primaryColor: "#a855f7",
      accentColor: "#ec4899",
      fontFamily: "Playfair Display, serif",
      fontWeight: "bold",
      fontStyle: "italic",
      headingSize: "36px",
      textSize: "18px",
      iconStyle: "filled",
      iconColor: "gradient",
      linkStyle: "rounded",
      darkMode: true,
      bgImage: null,
      cardStyle: "glass",
      spacing: "spacious"
    }
  },
  sports: {
    name: 'Athletic Energy',
    description: 'Dynamic and energetic',
    category: 'Sports',
    config: {
      bgColor: "#065f46",
      textColor: "#ffffff",
      primaryColor: "#fbbf24",
      accentColor: "#f59e0b",
      fontFamily: "Roboto Condensed, sans-serif",
      fontWeight: "bold",
      fontStyle: "normal",
      headingSize: "30px",
      textSize: "16px",
      iconStyle: "filled",
      iconColor: "bright",
      linkStyle: "rounded",
      darkMode: false,
      bgImage: null,
      cardStyle: "sport",
      spacing: "comfortable"
    }
  }
};

const FONT_FAMILIES = [
  { label: 'Inter (Modern)', value: 'Inter, sans-serif' },
  { label: 'Roboto (Clean)', value: 'Roboto, sans-serif' },
  { label: 'Poppins (Friendly)', value: 'Poppins, sans-serif' },
  { label: 'Playfair Display (Elegant)', value: 'Playfair Display, serif' },
  { label: 'Fira Code (Code)', value: 'Fira Code, monospace' },
  { label: 'Roboto Condensed (Compact)', value: 'Roboto Condensed, sans-serif' },
  { label: 'Georgia (Classic)', value: 'Georgia, serif' },
  { label: 'Arial (Universal)', value: 'Arial, sans-serif' }
];

function ThemeSelector() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'basic');
  const [customizing, setCustomizing] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Initialize with current theme config or default
  const [customConfig, setCustomConfig] = useState(() => ({
    ...ENHANCED_THEMES[user?.theme || 'basic'].config,
    ...(user?.themeConfig || {})
  }));

  // Update config when theme changes
  useEffect(() => {
    if (selectedTheme && ENHANCED_THEMES[selectedTheme]) {
      setCustomConfig(prev => ({
        ...ENHANCED_THEMES[selectedTheme].config,
        ...prev // Keep any custom changes
      }));
    }
  }, [selectedTheme]);

  // Save theme configuration
  const handleSaveTheme = useCallback(async () => {
    try {
      setSaving(true);
      await dispatch(saveUserProfile({
        uid: user.uid,
        theme: selectedTheme,
        themeConfig: customConfig
      })).unwrap();
      
      // Show success feedback
      setTimeout(() => setSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save theme:', error);
      setSaving(false);
    }
  }, [dispatch, user.uid, selectedTheme, customConfig]);

  // Reset to default theme config
  const handleReset = useCallback(() => {
    setCustomConfig(ENHANCED_THEMES[selectedTheme].config);
  }, [selectedTheme]);

  // Update specific config value
  const updateConfig = useCallback((key, value) => {
    setCustomConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  // Toggle dark mode and adjust colors accordingly
  const toggleDarkMode = useCallback(() => {
    const isDark = !customConfig.darkMode;
    setCustomConfig(prev => ({
      ...prev,
      darkMode: isDark,
      bgColor: isDark ? '#0f172a' : '#ffffff',
      textColor: isDark ? '#e2e8f0' : '#1f2937'
    }));
  }, [customConfig.darkMode]);

  // Theme Preview Component
  const ThemePreview = ({ theme, config, isSelected, onClick, size = 'large' }) => {
    const isSmall = size === 'small';
    
    return (
      <motion.div
        whileHover={{ scale: isSmall ? 1.02 : 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative cursor-pointer rounded-xl overflow-auto transition-all ${
          isSelected 
            ? 'ring-4 ring-purple-500 ring-opacity-50 shadow-xl' 
            : 'hover:shadow-lg border border-gray-200'
        } ${isSmall ? 'h-32' : 'h-48'}`}
        style={{ backgroundColor: config.bgColor }}
      >
        {/* Preview Content */}
        <div className="h-full p-4 relative">
          <div className="space-y-2">
            {/* Avatar */}
            <div 
              className={`${isSmall ? 'w-8 h-8' : 'w-12 h-12'} rounded-full mx-auto`}
              style={{ backgroundColor: config.primaryColor }}
            />
            
            {/* Name */}
            <h3 
              className={`font-bold text-center ${isSmall ? 'text-sm' : 'text-lg'}`}
              style={{ 
                color: config.textColor,
                fontFamily: config.fontFamily,
                fontSize: isSmall ? '14px' : config.headingSize
              }}
            >
              {theme.name}
            </h3>
            
            {/* Bio */}
            <p 
              className={`text-center ${isSmall ? 'text-xs' : 'text-sm'} opacity-75`}
              style={{ 
                color: config.textColor,
                fontSize: isSmall ? '12px' : config.textSize
              }}
            >
              {isSmall ? 'Sample bio' : theme.description}
            </p>
            
            {/* Sample Links */}
            <div className="space-y-1 pt-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className={`${isSmall ? 'h-6 text-xs' : 'h-10 text-sm'} rounded flex items-center justify-center font-medium transition-colors`}
                  style={{ 
                    backgroundColor: i === 1 ? config.primaryColor : config.accentColor,
                    color: config.darkMode ? '#ffffff' : '#ffffff',
                    borderRadius: config.linkStyle === 'square' ? '6px' : '12px'
                  }}
                >
                  Link {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white p-1.5 rounded-full">
            <Check size={16} />
          </div>
        )}

        {/* Theme Category Badge */}
        <div className="absolute top-2 left-2">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${config.primaryColor}20`,
              color: config.primaryColor
            }}
          >
            {theme.category}
          </span>
        </div>
      </motion.div>
    );
  };

  if (!customizing) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Choose Your Perfect Theme
            </motion.h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a theme that matches your style. Each theme can be fully customized to make it uniquely yours.
            </p>
          </div>

          {/* Theme Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['All', 'Professional', 'Creative', 'Tech', 'Sports'].map(category => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ENHANCED_THEMES).map(([key, theme]) => (
              <ThemePreview
                key={key}
                theme={theme}
                config={theme.config}
                isSelected={selectedTheme === key}
                onClick={() => setSelectedTheme(key)}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCustomizing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-200 hover:border-purple-300 text-purple-700 rounded-xl font-medium transition-all"
            >
              <Paintbrush size={20} />
              Customize Theme
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveTheme}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg"
            >
              {saving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Zap size={20} />
                </motion.div>
              ) : (
                <Save size={20} />
              )}
              {saving ? 'Saving...' : 'Save Theme'}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Customization Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCustomizing(false)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Themes
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customize {ENHANCED_THEMES[selectedTheme]?.name}</h2>
              <p className="text-gray-600">Fine-tune every aspect of your theme</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye size={16} />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {customConfig.darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {customConfig.darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
              {[
                { id: 'colors', label: 'Colors', icon: Palette },
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'layout', label: 'Layout', icon: Layout }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Color Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={customConfig.bgColor}
                          onChange={(e) => updateConfig('bgColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customConfig.bgColor}
                          onChange={(e) => updateConfig('bgColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={customConfig.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customConfig.textColor}
                          onChange={(e) => updateConfig('textColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={customConfig.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customConfig.primaryColor}
                          onChange={(e) => updateConfig('primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={customConfig.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customConfig.accentColor}
                          onChange={(e) => updateConfig('accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Typography Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={customConfig.fontFamily}
                        onChange={(e) => updateConfig('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {FONT_FAMILIES.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Weight
                      </label>
                      <select
                        value={customConfig.fontWeight}
                        onChange={(e) => updateConfig('fontWeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="lighter">Lighter</option>
                        <option value="normal">Normal</option>
                        <option value="medium">Medium</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heading Size
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="16"
                          max="48"
                          value={parseInt(customConfig.headingSize)}
                          onChange={(e) => updateConfig('headingSize', `${e.target.value}px`)}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">{customConfig.headingSize}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Size
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={parseInt(customConfig.textSize)}
                          onChange={(e) => updateConfig('textSize', `${e.target.value}px`)}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">{customConfig.textSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Layout Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Style
                      </label>
                      <select
                        value={customConfig.linkStyle}
                        onChange={(e) => updateConfig('linkStyle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="rounded">Rounded</option>
                        <option value="square">Square</option>
                        <option value="pill">Pill</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Style
                      </label>
                      <select
                        value={customConfig.cardStyle}
                        onChange={(e) => updateConfig('cardStyle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="flat">Flat</option>
                        <option value="elevated">Elevated</option>
                        <option value="gradient">Gradient</option>
                        <option value="glass">Glass</option>
                        <option value="neon">Neon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spacing
                      </label>
                      <select
                        value={customConfig.spacing}
                        onChange={(e) => updateConfig('spacing', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="compact">Compact</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Style
                      </label>
                      <select
                        value={customConfig.iconStyle}
                        onChange={(e) => updateConfig('iconStyle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="outlined">Outlined</option>
                        <option value="filled">Filled</option>
                        <option value="duotone">Duotone</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
                <ThemePreview
                  theme={ENHANCED_THEMES[selectedTheme]}
                  config={customConfig}
                  isSelected={false}
                  onClick={() => {}}
                  size="large"
                />
              </div>
              
              {/* Preview Controls */}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={handleSaveTheme}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
                >
                  {saving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Zap size={16} />
                    </motion.div>
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;