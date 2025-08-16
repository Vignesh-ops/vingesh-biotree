import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux'; // Added missing Redux imports
import { collection, query, serverTimestamp, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { saveUserProfile } from '../features/userSlice'; // Import the action
import { updateUserProfile } from '../features/authSlice'; // Import auth action
import {
    User,
    Link,
    Palette,
    Check,
    ArrowRight,
    ArrowLeft,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Mail,
    Globe,
    Phone,
    MessageCircle,
    Music,
    Github,
    Twitch,
    Facebook,
    Plus,
    X,
    ExternalLink,
    Eye,
    Save,
    Zap,
    Sparkles,
    Rocket, Camera, Circle, Layers
} from 'lucide-react';

const Discord = MessageCircle;
const TikTok = Music;
const Snapchat = Camera;
const Dribbble = Circle;
const Behance = Layers;

// Enhanced social platforms with better categorization and icons
const SOCIAL_PLATFORMS = {
    social: {
        name: 'Social Media',
        icon: Instagram,
        color: 'from-pink-500 to-rose-500',
        platforms: [
            { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-600 to-pink-600', placeholder: 'https://instagram.com/username' },
            { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-gradient-to-br from-blue-400 to-blue-600', placeholder: 'https://twitter.com/username' },
            { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-gradient-to-br from-blue-600 to-blue-800', placeholder: 'https://facebook.com/username' },
            { id: 'tiktok', name: 'TikTok', icon: TikTok, color: 'bg-gradient-to-br from-black to-gray-800', placeholder: 'https://tiktok.com/@username' },
            { id: 'snapchat', name: 'Snapchat', icon: Snapchat, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600', placeholder: 'https://snapchat.com/add/username' },
            { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-gradient-to-br from-blue-600 to-blue-800', placeholder: 'https://linkedin.com/in/username' },
        ]
    },
    content: {
        name: 'Content & Media',
        icon: Youtube,
        color: 'from-red-500 to-orange-500',
        platforms: [
            { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-gradient-to-br from-red-600 to-red-700', placeholder: 'https://youtube.com/@username' },
            { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'bg-gradient-to-br from-purple-600 to-purple-800', placeholder: 'https://twitch.tv/username' },
            { id: 'music', name: 'Apple Music', icon: Music, color: 'bg-gradient-to-br from-red-500 to-pink-600', placeholder: 'https://music.apple.com/...' }
        ]
    },
    professional: {
        name: 'Professional',
        icon: Linkedin,
        color: 'from-blue-500 to-indigo-500',
        platforms: [
            { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gradient-to-br from-gray-800 to-black', placeholder: 'https://github.com/username' },
            { id: 'dribbble', name: 'Dribbble', icon: Dribbble, color: 'bg-gradient-to-br from-pink-500 to-pink-700', placeholder: 'https://dribbble.com/username' },
            { id: 'behance', name: 'Behance', icon: Behance, color: 'bg-gradient-to-br from-blue-600 to-indigo-600', placeholder: 'https://behance.net/username' }
        ]
    },
    communication: {
        name: 'Communication',
        icon: Mail,
        color: 'from-green-500 to-emerald-500',
        platforms: [
            { id: 'email', name: 'Email', icon: Mail, color: 'bg-gradient-to-br from-blue-500 to-blue-700', placeholder: 'your@email.com' },
            { id: 'phone', name: 'Phone', icon: Phone, color: 'bg-gradient-to-br from-green-500 to-green-700', placeholder: '+1234567890' },
            { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-gradient-to-br from-green-500 to-green-600', placeholder: 'https://wa.me/1234567890' },
            { id: 'discord', name: 'Discord', icon: Discord, color: 'bg-gradient-to-br from-indigo-600 to-indigo-800', placeholder: 'discord.gg/invite' },
            { id: 'website', name: 'Website', icon: Globe, color: 'bg-gradient-to-br from-gray-600 to-gray-800', placeholder: 'https://yourwebsite.com' }
        ]
    }
};

// Enhanced themes with better visual representation
const ENHANCED_THEMES = {
    minimal: {
        name: 'Minimal Clean',
        description: 'Simple and elegant',
        preview: { bg: '#ffffff', primary: '#8b5cf6', accent: '#ec4899', text: '#1f2937' },
        category: 'Professional'
    },
    neon: {
        name: 'Neon Glow',
        description: 'Vibrant and energetic',
        preview: { bg: '#0f172a', primary: '#22d3ee', accent: '#10b981', text: '#e2e8f0' },
        category: 'Creative'
    },
    gradient: {
        name: 'Gradient Dreams',
        description: 'Colorful and modern',
        preview: { bg: '#fef2f2', primary: '#ec4899', accent: '#f59e0b', text: '#7c2d12' },
        category: 'Creative'
    },
    dark: {
        name: 'Dark Professional',
        description: 'Sleek and modern',
        preview: { bg: '#1e1b4b', primary: '#a855f7', accent: '#ec4899', text: '#f8fafc' },
        category: 'Professional'
    },
    nature: {
        name: 'Nature Calm',
        description: 'Earthy and peaceful',
        preview: { bg: '#f0fdf4', primary: '#16a34a', accent: '#eab308', text: '#14532d' },
        category: 'Lifestyle'
    },
    sunset: {
        name: 'Sunset Vibes',
        description: 'Warm and inviting',
        preview: { bg: '#fff7ed', primary: '#ea580c', accent: '#dc2626', text: '#9a3412' },
        category: 'Creative'
    }
};

const UserSetupFlow = () => {
    const dispatch = useDispatch(); // Added dispatch
    const { user } = useSelector(state => state.auth);
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        username: '',
        bio: '',
        selectedPlatforms: [],
        theme: 'minimal'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [saving, setSaving] = useState(false); // Added missing state

    // Step 1: Username Setup
    const UsernameStep = () => {
        const [username, setUsername] = useState('');
        const [isChecking, setIsChecking] = useState(false);
        const [isAvailable, setIsAvailable] = useState(null);
        
        const checkUsernameExists = async (uname) => {
            try {
                if (!uname || uname.length < 3) return false;

                const usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", uname.toLowerCase()));
                const snap = await getDocs(q);
                
                return !snap.empty;
            } catch (error) {
                console.error("Error checking username:", error);
                return true;
            }
        };

        const checkUsername = async (uname) => {
            if (!uname || uname.length < 3) {
                setIsAvailable(null);
                return false;
            }
            
            setIsChecking(true);
            const exists = await checkUsernameExists(uname);
            setIsChecking(false);
            
            if (exists) {
                setIsAvailable(false);
                return;
            } else {
                setIsAvailable(true);
            }
        };

        useEffect(() => {
            const timer = setTimeout(() => checkUsername(username), 500);
            return () => clearTimeout(timer);
        }, [username]);

        const handleNext = () => {
            if (username && isAvailable) {
                setUserData(prev => ({ ...prev, username }));
                setCurrentStep(2);
            }
        };

        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                    >
                        <User className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900">Choose your username</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        This will be your unique link that you can share with others
                    </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                yourapp.com/
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                placeholder="username"
                                className="w-full text-gray-700 pl-24 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                maxLength={20}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isChecking && (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                                    </motion.div>
                                )}
                                {isAvailable === true && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                )}
                                {isAvailable === false && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <X className="w-5 h-5 text-red-500" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        {isAvailable === false && (
                            <p className="text-sm text-red-600">Username is not available</p>
                        )}
                        {isAvailable === true && (
                            <p className="text-sm text-green-600">Username is available!</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            value={userData.bio}
                            onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell people about yourself..."
                            rows={4}
                            className="w-full text-gray-700 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            maxLength={150}
                        />
                        <p className="text-sm text-gray-500 text-right">{userData.bio.length}/150</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={!username || !isAvailable || !userData.bio.trim()}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${username && isAvailable && userData.bio.trim()
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Continue
                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </motion.button>
                </div>
            </div>
        );
    };

    // Step 2: Social Links Selection
    const SocialLinksStep = () => {
        const [selectedPlatforms, setSelectedPlatforms] = useState(userData.selectedPlatforms);
        const [activeCategory, setActiveCategory] = useState('social');
        const [linkData, setLinkData] = useState({});

        const togglePlatform = (platform) => {
            setSelectedPlatforms(prev => {
                if (prev.find(p => p.id === platform.id)) {
                    return prev.filter(p => p.id !== platform.id);
                } else {
                    return [...prev, platform];
                }
            });
            console.log('selectedPlatforms',selectedPlatforms)
        };

        const updateLinkData = (platformId, url) => {
            setLinkData(prev => ({ ...prev, [platformId]: url }));
        };

        const handleNext = () => {
            const validLinks = selectedPlatforms.filter(platform =>
                linkData[platform.id]?.trim()
            ).map(platform => ({
                ...platform,
                url: linkData[platform.id]
            }));

            setUserData(prev => ({ ...prev, selectedPlatforms: validLinks }));
            setCurrentStep(3);
        };

        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center"
                    >
                        <Link className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900">Add your links</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Select the platforms you want to showcase and add your links
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {Object.entries(SOCIAL_PLATFORMS).map(([key, category]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === key
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platform Grid */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
                    >
                        {SOCIAL_PLATFORMS[activeCategory].platforms.map((platform) => {
                            const isSelected = selectedPlatforms.find(p => p.id === platform.id);
                            const Icon = platform.icon;

                            return (
                                <motion.div
                                    key={platform.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => togglePlatform(platform)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-center">{platform.name}</span>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Selected Platforms Form */}
                    {selectedPlatforms.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 bg-white p-6 rounded-xl border border-gray-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add your links</h3>
                            {selectedPlatforms.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <div key={platform.id} className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <input
                                            type={platform.id === 'email' ? 'email' : 'url'}
                                            placeholder={platform.placeholder}
                                            value={linkData[platform.id] || ''}
                                            onChange={(e) => updateLinkData(platform.id, e.target.value)}
                                            className="flex-1 text-gray-700 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>

                <div className="flex justify-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft className="inline-block w-5 h-5 mr-2" />
                        Back
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={selectedPlatforms.length === 0}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedPlatforms.length > 0
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Continue
                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </motion.button>
                </div>
            </div>
        );
    };

    // Step 3: Theme Selection
    const ThemeStep = () => {
        const [selectedTheme, setSelectedTheme] = useState(userData.theme);

        const handleNext = () => {
            setUserData(prev => ({ ...prev, theme: selectedTheme }));
            setCurrentStep(4);
        };

        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                    >
                        <Palette className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900">Choose your theme</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Select a theme that matches your style and personality
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(ENHANCED_THEMES).map(([key, theme]) => (
                        <motion.div
                            key={key}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTheme(key)}
                            className={`relative p-1 rounded-xl cursor-pointer transition-all ${selectedTheme === key
                                ? 'ring-4 ring-purple-500 ring-opacity-50'
                                : 'hover:shadow-lg'
                                }`}
                        >
                            <div
                                className="h-48 rounded-lg p-6 relative overflow-hidden"
                                style={{ backgroundColor: theme.preview.bg }}
                            >
                                {/* Theme Preview Content */}
                                <div className="space-y-4">
                                    <div
                                        className="w-12 h-12 rounded-full mx-auto"
                                        style={{ backgroundColor: theme.preview.primary }}
                                    />
                                    <div
                                        className="text-center font-bold"
                                        style={{ color: theme.preview.text }}
                                    >
                                        Your Name
                                    </div>
                                    <div
                                        className="text-center text-sm opacity-75"
                                        style={{ color: theme.preview.text }}
                                    >
                                        {theme.description}
                                    </div>
                                    <div className="space-y-2">
                                        <div
                                            className="h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                            style={{ backgroundColor: theme.preview.primary }}
                                        >
                                            Link 1
                                        </div>
                                        <div
                                            className="h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                            style={{ backgroundColor: theme.preview.accent }}
                                        >
                                            Link 2
                                        </div>
                                    </div>
                                </div>

                                {/* Selection Indicator */}
                                {selectedTheme === key && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-5 h-5 text-white" />
                                    </motion.div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: theme.preview.primary }}
                                    >
                                        {theme.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                                <p className="text-sm text-gray-600">{theme.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft className="inline-block w-5 h-5 mr-2" />
                        Back
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        Continue
                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </motion.button>
                </div>
            </div>
        );
    };

    // Step 4: Preview & Complete
    const PreviewStep = () => {
        const handleComplete = async () => {
            if (!user?.uid) {
                alert('User not authenticated. Please sign in again.');
                return;
            }

            setIsLoading(true);
            setSaving(true);
            
            try {
                // Prepare the data to save
                let biodto = userData.selectedPlatforms
                const biopayload = biodto.map(({ icon, ...rest }) => rest);
                console.log('biopayload',biopayload)
                const profileData = {
                    username: userData.username,
                    bio: userData.bio,
                    theme: userData.theme,
                    bioLinks: biopayload, // Save the selected platforms as bioLinks
                    profileComplete: true,
                    themeConfig: {
                        ...ENHANCED_THEMES[userData.theme].preview,
                        name: ENHANCED_THEMES[userData.theme].name,
                        description: ENHANCED_THEMES[userData.theme].description,
                        category: ENHANCED_THEMES[userData.theme].category
                    },
                    updatedAt: serverTimestamp()
                };

                // Save to both user profile and auth
                await Promise.all([
                   
                    dispatch(updateUserProfile({
                        ...profileData
                    })).unwrap()
                ]);

                // Show success feedback
                setTimeout(() => {
                    setSaving(false);
                    setIsLoading(false);
                    // You can navigate to dashboard here
                    navigate('/app/bio');
                }, 1000);

            } catch (error) {
                console.error('Failed to save profile:', error);
                setSaving(false);
                setIsLoading(false);
                alert(`Failed to save profile: ${error.message || 'Unknown error'}`);
            }
        };

        const selectedTheme = ENHANCED_THEMES[userData.theme];

        return (
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                        <Eye className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900">Preview your profile</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Here's how your bio link page will look to your visitors
                    </p>
                </div>

                {/* Mobile Preview */}
                <div className="max-w-sm mx-auto">
                    <div className="bg-gray-900 rounded-[2.5rem] p-2">
                        <div
                            className="rounded-[2rem] p-8 h-[600px] overflow-y-auto"
                            style={{ backgroundColor: selectedTheme.preview.bg }}
                        >
                            {/* Profile Header */}
                            <div className="text-center space-y-4 mb-8">
                                <div
                                    className="w-20 h-20 rounded-full mx-auto"
                                    style={{ backgroundColor: selectedTheme.preview.primary }}
                                />
                                <div>
                                    <h1
                                        className="text-xl font-bold"
                                        style={{ color: selectedTheme.preview.text }}
                                    >
                                        @{userData.username}
                                    </h1>
                                    <p
                                        className="text-sm mt-2 opacity-80"
                                        style={{ color: selectedTheme.preview.text }}
                                    >
                                        {userData.bio}
                                    </p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-3">
                                {userData.selectedPlatforms.map((platform, index) => {
                                    const Icon = platform.icon;
                                    return (
                                        <div
                                            key={platform.id}
                                            className="flex items-center p-4 rounded-xl text-white font-medium shadow-sm"
                                            style={{
                                                backgroundColor: index % 2 === 0
                                                    ? selectedTheme.preview.primary
                                                    : selectedTheme.preview.accent
                                            }}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {platform.name}
                                            <ExternalLink className="w-4 h-4 ml-auto" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Profile Summary</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Username:</span>
                            <span className="font-medium">@{userData.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bio:</span>
                            <span className="font-medium text-right max-w-[200px] truncate">{userData.bio}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Links:</span>
                            <span className="font-medium">{userData.selectedPlatforms.length} platforms</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Theme:</span>
                            <span className="font-medium">{selectedTheme.name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft className="inline-block w-5 h-5 mr-2" />
                        Back
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        disabled={isLoading}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${isLoading
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="inline-block w-5 h-5 mr-2"
                                >
                                    <Zap className="w-5 h-5" />
                                </motion.div>
                                Creating Profile...
                            </>
                        ) : (
                            <>
                                <Rocket className="inline-block w-5 h-5 mr-2" />
                                Launch Profile
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        );
    };

    // Progress Indicator
    const ProgressIndicator = () => {
        const steps = [
            { number: 1, title: 'Username', icon: User },
            { number: 2, title: 'Links', icon: Link },
            { number: 3, title: 'Theme', icon: Palette },
            { number: 4, title: 'Preview', icon: Eye }
        ];

        return (
            <div className="mb-12">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.number;
                        const isCompleted = currentStep > step.number;

                        return (
                            <div key={step.number} className="flex items-center">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-purple-500 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                    }
                `}>
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="ml-2 hidden sm:block">
                                    <div className={`text-xs font-medium ${isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-4 transition-all duration-300 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-200 rounded-full opacity-10 blur-3xl" />
            </div>

            <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center space-x-2 mb-4"
                        >
                            <Sparkles className="w-6 h-6 text-purple-500" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Create Your Bio Link
                            </h1>
                            <Sparkles className="w-6 h-6 text-pink-500" />
                        </motion.div>
                        <p className="text-gray-600">Set up your personalized bio link in just a few steps</p>
                    </div>

                    <ProgressIndicator />

                    {/* Step Content */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    >
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && <UsernameStep />}
                            {currentStep === 2 && <SocialLinksStep />}
                            {currentStep === 3 && <ThemeStep />}
                            {currentStep === 4 && <PreviewStep />}
                        </AnimatePresence>
                    </motion.div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-sm text-gray-500">
                        <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSetupFlow;