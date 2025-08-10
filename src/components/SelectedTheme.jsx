import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserProfile } from '../features/userSlice';
import BasicTheme from '../components/Themes/BasicTheme';
import BusinessTheme from '../components/Themes/BusinessTheme';
import CreatorTheme from '../components/Themes/CreatorTheme';
import DeveloperTheme from '../components/Themes/DeveloperTheme';
import SingerTheme from '../components/Themes/SingerTheme';
import SportsTheme from '../components/Themes/SportsTheme';

const THEMES = {
    creator: {
        name: 'Creator',
        backgroundColor: '#ffecd1',
        color: '#8a2be2',
        fontFamily: "'Courier New', Courier, monospace",
    },
    basic: {
        name: 'Basic',
        backgroundColor: '#ffffff',
        color: '#333333',
        fontFamily: "'Arial', sans-serif",
    },
    business: {
        name: 'Business',
        backgroundColor: '#f4f7f6',
        color: '#004085',
        fontFamily: "'Helvetica', sans-serif",
    },
    sports: {
        name: 'Sports',
        backgroundColor: '#1b262c',
        color: '#bbe1fa',
        fontFamily: "'Impact', sans-serif",
    },
    singer: {
        name: 'Singer',
        backgroundColor: '#fce4ec',
        color: '#880e4f',
        fontFamily: "'Georgia', serif",
    },
    developer: {
        name: 'Developer',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: "'Georgia', serif",
    },
};

const ThemePreview = ({ themeKey, profile }) => {
    switch (themeKey) {
        case 'basic': return <BasicTheme profile={profile} />;
        case 'creator': return <CreatorTheme profile={profile} />;
        case 'business': return <BusinessTheme profile={profile} />;
        case 'sports': return <SportsTheme profile={profile} />;
        case 'singer': return <SingerTheme profile={profile} />;
        case 'developer': return <DeveloperTheme profile={profile} />;
        default: return <BasicTheme profile={profile} />;
    }
};

function SelectedTheme({ initialTheme = 'basic', onComplete, onBack }) {
  console.log('onComplete',onComplete,onBack)
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { savingTheme, themeError } = useSelector(state => state.user);
    
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);
    const [isSaving, setIsSaving] = useState(false);

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    };

    const handleContinue = async () => {
        if (!selectedTheme) return;
        if (typeof onComplete !== 'function') {
          console.error('onComplete is not a function - check parent component');
          return;
      }
        
        try {
            setIsSaving(true);
            await dispatch(saveUserProfile({ 
                uid: user.uid, 
                theme: selectedTheme 
            })).unwrap();
            
            onComplete(selectedTheme);
        } catch (error) {
            console.error("Failed to save theme:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select Your Theme</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(THEMES).map(([key, theme]) => (
                    <div
                        key={key}
                        onClick={() => handleThemeSelect(key)}
                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                            selectedTheme === key 
                                ? 'border-green-500 scale-105' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                            backgroundColor: theme.backgroundColor,
                            color: theme.color,
                            fontFamily: theme.fontFamily,
                        }}
                    >
                        <p className="font-bold">{theme.name}</p>
                        <p className="text-sm">Preview</p>
                    </div>
                ))}
            </div>

            <div 
                className="p-6 rounded-xl mt-6"
                style={{
                    backgroundColor: THEMES[selectedTheme]?.backgroundColor,
                    color: THEMES[selectedTheme]?.color,
                    fontFamily: THEMES[selectedTheme]?.fontFamily,
                }}
            >
                <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
                <ThemePreview themeKey={selectedTheme} profile={user} />
            </div>

            {isSaving && <p className="text-blue-500">Saving your theme...</p>}
            {themeError && <p className="text-red-500">{themeError}</p>}

            <div className="flex justify-between mt-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={handleContinue}
                    disabled={!selectedTheme || isSaving}
                    className={`px-6 py-2 rounded-lg transition ${
                        selectedTheme && !isSaving
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isSaving ? 'Saving...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}

export default SelectedTheme;