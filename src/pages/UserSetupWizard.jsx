import { useState } from 'react';
import Setuserpath from '../components/Setuserpath';
import SelectedTheme from '../components/SelectedTheme'; 
import { useSelector } from "react-redux";
// import Dashboard from './Dashboard';
function UserSetupWizard() {
    const user = useSelector((s) => s.auth.user);
console.log('user***',user)
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    username: user.username,
    bio: user.title,
    theme: user.theme
  });

  if (!userData.username) setStep(1);
  if (!userData.theme) setStep(2)
    if (!userData.bio) setStep(3)


  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  // Handlers to update data from each step
  const updateUserData = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {step === 1 && (
        <Setuserpath
          initialUsername={userData.username}
          onUsernameSet={(username) => {
            updateUserData('username', username);
            nextStep();
          }}
        />
      )}
    
      {step === 2 && (
        <SelectedTheme
          initialTheme={userData.theme}
          onThemeSet={(theme) => {
            updateUserData('theme', theme);
            // Final step - you can now save all userData or redirect
            console.log('User setup complete', { ...userData, theme });
            // e.g., redirect to dashboard or show success
          }}
          onBack={prevStep}
        />
      )}
        {step === 3 && (
         <Navigate to='/app/bio' />
      )}
    </div>
  );
}

export default UserSetupWizard;
