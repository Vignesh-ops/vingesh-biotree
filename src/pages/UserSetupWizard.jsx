import { useState, useEffect } from 'react';
import Setuserpath from '../components/Setuserpath';
import SelectedTheme from '../components/SelectedTheme';
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import SelectedBioitems from '../components/SelectedBioitems'

function UserSetupWizard() {
    console.log('hiiiii')
    const user = useSelector((s) => s.auth.user);
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        username: '',
        biolinks: [],
        theme: '',
    });

    // Update userData when `user` from redux changes
    useEffect(() => {
        if (user) {
          setUserData({
            username: user.username || '',
            biolinks: user.biolinks ? [...user.biolinks] : [],  // create new array copy so it's fresh
            theme: user.theme || '',
          });
        }
      }, [user]);
      
      
    // Decide step based on missing fields once userData updates
    useEffect(() => {
        const newStep = !userData.username
          ? 1
          : !userData.theme
          ? 2
          : (userData.biolinks && userData.biolinks.length > 0)
          ? 3
          : 4;
      
        if (newStep !== step) {
          setStep(newStep);
        }
      }, [userData, step]);
      
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

    const updateUserData = (field, value) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    // If all steps done, redirect to dashboard or bio page
    if (step === 4) {
        return <Navigate to="/app/bio" replace />;
    }

    if (!user) {
        return <div>Loading user data...</div>; // Optional loading UI while user is fetched
    }

    return (
        <div>
            {step === 1 && (
                <Setuserpath
                    initialUsername={userData.username}
                    onUsernameSet={(username) => {
                        updateUserData('username', username);
                        nextStep();
                    }} user={user}
                />
            )}

            {step === 2 && (
                <SelectedTheme
                    initialTheme={userData.theme}
                    onThemeSet={(theme) => {
                        updateUserData('theme', theme);
                        nextStep();
                    }}
                    onBack={prevStep}
                />
            )}

            {step === 3 && (
                <SelectedBioitems
                    initialBioLinks={userData.biolinks || {}}
                    onBioLinksSet={(bioLinks) => {
                        updateUserData('bioLinks', bioLinks);
                        nextStep();
                    }}
                    onBack={prevStep}
                />
            )}

        </div>
    );
}

export default UserSetupWizard;
