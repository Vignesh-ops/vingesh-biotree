import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { 
  User, 
  Link, 
  Palette, 
  Check, 
  ChevronRight,
  Sparkles,
  Rocket,
  ArrowLeft
} from 'lucide-react';

// Import your enhanced components
import UserSetupFlow from '../components/SetupUserPath';
import EnhancedSocialLinksSelection from '../components/EnhancedSocialLinksSelection';
import EnhancedThemeSelector from '../components/EnhancedThemeSelector';

const SETUP_STEPS = [
  {
    id: 1,
    title: 'Profile Setup',
    description: 'Create your username and bio',
    icon: User,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 2,
    title: 'Add Links',
    description: 'Connect your social platforms',
    icon: Link,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 3,
    title: 'Choose Theme',
    description: 'Customize your page style',
    icon: Palette,
    color: 'from-pink-500 to-orange-500'
  },
  {
    id: 4,
    title: 'Launch',
    description: 'Your profile is ready!',
    icon: Rocket,
    color: 'from-green-500 to-blue-500'
  }
];

const EnhancedUserSetupWizard = () => {
  const user = useSelector((state) => state.auth.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  // Determine current step based on user profile completion
  const getCurrentStep = (user) => {
    if (!user) return 1;
    
    if (!user.username || !user.bio || !user.biotitle) return 1;
    if (!user.bioLinks || user.bioLinks.length === 0) return 2;
    if (!user.theme) return 3;
    
    return 4;
  };
  useEffect(() => {
    // if (!user) return;
    // console.log('currentStep',currentStep)

    // const completed = [];
    // let nextStep = 1;

    // // Step 1: Username and bio
    // if (user.username && user.bio && user.biotitle) {
    //   completed.push(1);
    //   nextStep = 2;
    // }

    // // Step 2: Links
    // if (user.bioLinks && user.bioLinks.length > 0) {
    //   completed.push(2);
    //   nextStep = 3;
    // }

    // // Step 3: Theme
    // if (user.theme) {
    //   completed.push(3);
    //   nextStep = 4;
    // }

    // setCompletedSteps(completed);
    // setCurrentStep(nextStep);
    const nextStep = getCurrentStep(user);
    console.log('Determined next step:', nextStep, 'Current step:', currentStep);
    
    if (nextStep !== currentStep) {
      setCurrentStep(nextStep);
      
      // Update completed steps based on the new step
      const newCompletedSteps = [];
      if (nextStep >= 2) newCompletedSteps.push(1);
      if (nextStep >= 3) newCompletedSteps.push(2);
      if (nextStep >= 4) newCompletedSteps.push(3);
      setCompletedSteps(newCompletedSteps);
    }
  }, [user]);

  // Step completion handlers
  const handleStepComplete = (stepNumber, data) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, stepNumber]);
      setCurrentStep(stepNumber + 1);
      setIsTransitioning(false);
    }, 500);
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20"
      >
        <div className="flex items-center space-x-4">
          {SETUP_STEPS.slice(0, 3).map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isNext = currentStep < step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : isActive
                        ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`
                        : isNext
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                  
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl -z-10"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    />
                  )}
                </motion.div>

                {index < SETUP_STEPS.length - 2 && (
                  <div className="flex items-center mx-2">
                    <motion.div
                      className={`h-1 w-8 rounded-full transition-all duration-500 ${
                        completedSteps.includes(step.id) || currentStep > step.id
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                          : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Info */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-3"
        >
          <p className="text-sm font-semibold text-gray-900">
            Step {Math.min(currentStep, 3)} of 3
          </p>
          <p className="text-xs text-gray-600">
            {SETUP_STEPS[Math.min(currentStep - 1, 2)]?.description}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  // Loading/transition overlay
  const TransitionOverlay = () => (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Completion celebration
  const CompletionCelebration = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md mx-auto">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
        >
          <Rocket className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4"
        >
          🎉 Congratulations! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-700 mb-8"
        >
          Your bio link profile is ready to shine!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8"
        >
          <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Share your link with friends and followers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Add it to your social media bios</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Track your performance with analytics</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* <Navigate to="/app/bio" replace /> */}
        </motion.div>
      </div>

      {/* Confetti effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 ${
              ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][i % 5]
            } rounded-full`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: -10,
              rotate: 0
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
              rotate: 360,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  // Back button
  const BackButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleStepBack}
      className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-200"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
    </motion.button>
  );

  // Step content renderer
  const renderStepContent = () => {
    const stepProps = {
      onComplete: (data) => handleStepComplete(currentStep, data),
      isVisible: !isTransitioning
    };

    switch (currentStep) {
      case 1:
        return <UserSetupFlow {...stepProps} />;
      case 2:
        return <EnhancedSocialLinksSelection {...stepProps} />;
      case 3:
        return <EnhancedThemeSelector {...stepProps} />;
      case 4:
        return <CompletionCelebration />;
      default:
        return <UserSetupFlow {...stepProps} />;
    }
  };

  // Redirect if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Progress Indicator */}
      {currentStep < 4 && <ProgressIndicator />}
      
      {/* Back Button */}
      {currentStep > 1 && currentStep < 4 && <BackButton />}
      
      {/* Transition Overlay */}
      <TransitionOverlay />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Floating particles background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              ['bg-purple-300/20', 'bg-blue-300/20', 'bg-pink-300/20'][i % 3]
            }`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedUserSetupWizard; 