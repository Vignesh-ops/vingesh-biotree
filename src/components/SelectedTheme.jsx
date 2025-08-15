import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserProfile } from '../features/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Palette, Check, ChevronLeft } from 'lucide-react';
import BasicTheme from '../components/Themes/BasicTheme';
import BusinessTheme from '../components/Themes/BusinessTheme';
import CreatorTheme from '../components/Themes/CreatorTheme';
import DeveloperTheme from '../components/Themes/DeveloperTheme';
import SingerTheme from '../components/Themes/SingerTheme';
import SportsTheme from '../components/Themes/SportsTheme';

const THEME_COMPONENTS = {
  basic: BasicTheme,
  business: BusinessTheme,
  creator: CreatorTheme,
  developer: DeveloperTheme,
  singer: SingerTheme,
  sports: SportsTheme
};

const DEFAULT_THEMES = {
  basic: {
    name: 'Minimal',
    bgColor: '#ffffff',
    textColor: '#333333',
    primaryColor: '#8b5cf6',
    fontFamily: 'Arial, sans-serif'
  },
  business: {
    name: 'Professional',
    bgColor: '#f8fafc',
    textColor: '#1e293b',
    primaryColor: '#3b82f6',
    fontFamily: 'Helvetica, sans-serif'
  },
  creator: {
    name: 'Creative',
    bgColor: '#fef2f2',
    textColor: '#7c2d12',
    primaryColor: '#ec4899',
    fontFamily: "'Courier New', monospace"
  },
  developer: {
    name: 'Dark Mode',
    bgColor: '#0f172a',
    textColor: '#e2e8f0',
    primaryColor: '#22d3ee',
    fontFamily: "'Fira Code', monospace"
  }
};

function ThemeSelector() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'basic');
  const [customizing, setCustomizing] = useState(false);
  const [customTheme, setCustomTheme] = useState(DEFAULT_THEMES[selectedTheme]);

  // Apply theme when changed
  useEffect(() => {
    if (user?.theme) {
      setSelectedTheme(user.theme);
      setCustomTheme(DEFAULT_THEMES[user.theme] || DEFAULT_THEMES.basic);
    }
  }, [user?.theme]);

  const handleSaveTheme = async () => {
    await dispatch(saveUserProfile({
      uid: user.uid,
      theme: selectedTheme,
      themeConfig: customTheme
    }));
  };

  const ThemePreview = THEME_COMPONENTS[selectedTheme] || BasicTheme;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {!customizing ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Choose Your Theme</h1>
            <button
              onClick={() => setCustomizing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Paintbrush size={16} />
              Customize
            </button>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(DEFAULT_THEMES).map(([key, theme]) => (
              <motion.div
                key={key}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedTheme(key)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  selectedTheme === key 
                    ? 'border-purple-500 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-48" style={{ backgroundColor: theme.bgColor }}>
                  <div className="p-4" style={{ color: theme.textColor }}>
                    <h3 className="font-bold">{theme.name}</h3>
                    <p style={{ fontFamily: theme.fontFamily }}>
                      Sample text in {theme.name.toLowerCase()} style
                    </p>
                  </div>
                </div>
                {selectedTheme === key && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="border rounded-xl overflow-hidden">
              <ThemePreview profile={user} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveTheme}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Save Theme
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setCustomizing(false)}
            className="flex items-center gap-2 text-purple-600"
          >
            <ChevronLeft size={16} />
            Back to Themes
          </button>

          <h2 className="text-2xl font-bold">Customize Your Theme</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Customizer */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Background Color</label>
                <input
                  type="color"
                  value={customTheme.bgColor}
                  onChange={(e) => setCustomTheme({...customTheme, bgColor: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-2">Text Color</label>
                <input
                  type="color"
                  value={customTheme.textColor}
                  onChange={(e) => setCustomTheme({...customTheme, textColor: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-2">Primary Color</label>
                <input
                  type="color"
                  value={customTheme.primaryColor}
                  onChange={(e) => setCustomTheme({...customTheme, primaryColor: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-2">Font Family</label>
                <select
                  value={customTheme.fontFamily}
                  onChange={(e) => setCustomTheme({...customTheme, fontFamily: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="Georgia, serif">Georgia</option>
                </select>
              </div>
            </div>
            
            {/* Live Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div 
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: customTheme.bgColor,
                  color: customTheme.textColor,
                  fontFamily: customTheme.fontFamily
                }}
              >
                <h3 className="text-xl font-bold mb-2">Sample Heading</h3>
                <p className="mb-4">This is how your text will appear.</p>
                <button 
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: customTheme.primaryColor, color: 'white' }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setCustomTheme(DEFAULT_THEMES[selectedTheme]);
                setCustomizing(false);
              }}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={() => {
                handleSaveTheme();
                setCustomizing(false);
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Save Custom Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;