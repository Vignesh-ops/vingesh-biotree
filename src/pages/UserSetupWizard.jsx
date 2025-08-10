import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import Setuserpath from '../components/Setuserpath';
import SelectedTheme from '../components/SelectedTheme';
import SelectedBioitems from '../components/SelectedBioitems';

function UserSetupWizard() {
    const user = useSelector((state) => state.auth.user);
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        username: '',
        biolinks: [],
        theme: '',
    });

    // Initialize user data when user is loaded
    useEffect(() => {
        if (user) {
            setUserData({
                username: user.username || '',
                biolinks: user.biolinks ? [...user.biolinks] : [],
                theme: user.theme || '',
            });
        }
        console.log('user',user)
    }, [user]);

    // Determine current step based on completed fields
    useEffect(() => {
        if (!userData.username) {
            setCurrentStep(1);
        } else if (!userData.theme) {
            setCurrentStep(2);
        } else if (!userData.biolinks || userData.biolinks.length === 0) {
            setCurrentStep(3);
        } else {
            setCurrentStep(4);
        }
    }, [userData]);

    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handlePrevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

    const handleDataUpdate = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    if (!user) {
        return <div className="p-4">Loading user data...</div>;
    }

    if (currentStep === 4) {
        return <Navigate to="/app/bio" replace />;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            {currentStep === 1 && (
                <Setuserpath
                    initialUsername={userData.username}
                    onComplete={(username) => {
                        handleDataUpdate('username', username);
                        handleNextStep();
                    }}
                    user={user}
                />
            )}

            {currentStep === 2 && (
                <SelectedTheme
                    initialTheme={userData.theme}
                    onComplete={(theme) => {
                        handleDataUpdate('theme', theme);
                        handleNextStep();
                    }}
                    onBack={handlePrevStep}
                />
            )}

            {currentStep === 3 && (
                <SelectedBioitems
                    initialBioLinks={userData.biolinks}
                    onComplete={(biolinks) => {
                        handleDataUpdate('biolinks', biolinks);
                        handleNextStep();
                    }}
                    onBack={handlePrevStep}
                />
            )}
        </div>
    );
}

export default UserSetupWizard;