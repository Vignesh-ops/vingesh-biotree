import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserProfile } from '../features/userSlice'; // adjust path
import BasicTheme from '../components/Themes/BasicTheme'
import BusinessTheme from '../components/Themes/BusinessTheme'
import CreatorTheme from '../components/Themes/CreatorTheme'
import DeveloperTheme from '../components/Themes/DeveloperTheme'
import SingerTheme from '../components/Themes/SingerTheme'
import SportsTheme from '../components/Themes/SportsTheme'
const themes = {
  creator: {
    backgroundColor: '#ffecd1',
    color: '#8a2be2',
    fontFamily: "'Courier New', Courier, monospace",
  },
  basic: {
    backgroundColor: '#ffffff',
    color: '#333333',
    fontFamily: "'Arial', sans-serif",
  },
  business: {
    backgroundColor: '#f4f7f6',
    color: '#004085',
    fontFamily: "'Helvetica', sans-serif",
  },
  sports: {
    backgroundColor: '#1b262c',
    color: '#bbe1fa',
    fontFamily: "'Impact', sans-serif",
  },
  singer: {
    backgroundColor: '#fce4ec',
    color: '#880e4f',
    fontFamily: "'Georgia', serif",
  },
  developer: {
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: "'Georgia', serif",
  },
};

function ThemeSelector({initialTheme}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const userdata = user.user;
console.log('user',userdata)
  const saving = useSelector((state) => state.user.savingTheme);
  const error = useSelector((state) => state.user.themeError);

  const [selectedTheme, setSelectedTheme] = useState(user.theme || 'basic');

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    dispatch(saveUserProfile({ uid: user.user.uid, theme: newTheme }));
  };

  return (
    <div>
      <h2>Select Your Theme</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {Object.keys(themes).map((themeKey) => (
          <div
            key={themeKey}
            onClick={() => handleThemeChange(themeKey)}
            style={{
              cursor: 'pointer',
              border: selectedTheme === themeKey ? '3px solid #4caf50' : '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              width: '120px',
              ...themes[themeKey],
            }}
          >
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </p>
            <p style={{ fontSize: '0.8rem' }}>Preview</p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '2rem',
          borderRadius: '12px',
          ...themes[selectedTheme],
        }}
      >
        <h3>Live Preview.This is how your theme will look!</h3>

        {selectedTheme == 'basic' && <BasicTheme profile={userdata} /> }
        {selectedTheme == 'creator' && <CreatorTheme profile={userdata} /> }
        {selectedTheme == 'business' && <BusinessTheme profile={userdata} /> }
        {selectedTheme == 'sports' && <SportsTheme profile={userdata} /> }
        {selectedTheme == 'singer' && <SingerTheme profile={userdata} /> }
        {selectedTheme == 'developer' && <DeveloperTheme profile={userdata} /> }


      </div>

      {saving && <p>Saving your theme...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ThemeSelector;
