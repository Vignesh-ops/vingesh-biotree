import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/authSlice';
import {
  Link,
  Check,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Sparkles,
  GripVertical
} from 'lucide-react';

// Import social media icons (you'll need to install react-icons)
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaTiktok,
  FaSnapchatGhost,
  FaGithub,
  FaTwitch,
  FaSpotify,
  FaSoundcloud,
  FaDribbble,
  FaBehance,
  FaPinterest,
  FaDiscord,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaMusic
} from 'react-icons/fa';

// Enhanced social platforms with better categorization
const SOCIAL_PLATFORMS = {
  social: {
    name: 'Social Media',
    color: 'from-pink-500 to-rose-500',
    platforms: [
      { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'from-purple-600 to-pink-600', placeholder: 'https://instagram.com/username', pattern: /^https:\/\/(www\.)?instagram\.com\/.+/ },
      { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, color: 'from-blue-400 to-blue-600', placeholder: 'https://twitter.com/username', pattern: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/.+/ },
      { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'from-blue-600 to-blue-800', placeholder: 'https://facebook.com/username', pattern: /^https:\/\/(www\.)?facebook\.com\/.+/ },
      { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'from-black to-gray-800', placeholder: 'https://tiktok.com/@username', pattern: /^https:\/\/(www\.)?tiktok\.com\/.+/ },
      { id: 'snapchat', name: 'Snapchat', icon: FaSnapchatGhost, color: 'from-yellow-400 to-yellow-600', placeholder: 'https://snapchat.com/add/username', pattern: /^https:\/\/(www\.)?snapchat\.com\/.+/ },
      { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: 'from-blue-600 to-blue-800', placeholder: 'https://linkedin.com/in/username', pattern: /^https:\/\/(www\.)?linkedin\.com\/.+/ },
      { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: 'from-red-500 to-red-700', placeholder: 'https://pinterest.com/username', pattern: /^https:\/\/(www\.)?pinterest\.com\/.+/ }
    ]
  },
  content: {
    name: 'Content & Media',
    color: 'from-red-500 to-orange-500',
    platforms: [
      { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'from-red-600 to-red-700', placeholder: 'https://youtube.com/@username', pattern: /^https:\/\/(www\.)?youtube\.com\/.+/ },
      { id: 'twitch', name: 'Twitch', icon: FaTwitch, color: 'from-purple-600 to-purple-800', placeholder: 'https://twitch.tv/username', pattern: /^https:\/\/(www\.)?twitch\.tv\/.+/ },
      { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: 'from-green-500 to-green-700', placeholder: 'https://open.spotify.com/artist/...', pattern: /^https:\/\/open\.spotify\.com\/.+/ },
      { id: 'soundcloud', name: 'SoundCloud', icon: FaSoundcloud, color: 'from-orange-500 to-orange-700', placeholder: 'https://soundcloud.com/username', pattern: /^https:\/\/(www\.)?soundcloud\.com\/.+/ },
      { id: 'music', name: 'Apple Music', icon: FaMusic, color: 'from-red-500 to-pink-600', placeholder: 'https://music.apple.com/...', pattern: /^https:\/\/music\.apple\.com\/.+/ }
    ]
  },
  professional: {
    name: 'Professional',
    color: 'from-blue-500 to-indigo-500',
    platforms: [
      { id: 'github', name: 'GitHub', icon: FaGithub, color: 'from-gray-800 to-black', placeholder: 'https://github.com/username', pattern: /^https:\/\/(www\.)?github\.com\/.+/ },
      { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: 'from-pink-500 to-pink-700', placeholder: 'https://dribbble.com/username', pattern: /^https:\/\/(www\.)?dribbble\.com\/.+/ },
      { id: 'behance', name: 'Behance', icon: FaBehance, color: 'from-blue-600 to-indigo-600', placeholder: 'https://behance.net/username', pattern: /^https:\/\/(www\.)?behance\.net\/.+/ }
    ]
  },
  communication: {
    name: 'Communication',
    color: 'from-green-500 to-emerald-500',
    platforms: [
      { id: 'email', name: 'Email', icon: FaEnvelope, color: 'from-blue-500 to-blue-700', placeholder: 'your@email.com', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, type: 'email' },
      { id: 'phone', name: 'Phone', icon: FaPhone, color: 'from-green-500 to-green-700', placeholder: '+1234567890', pattern: /^[\+]?[1-9][\d]{0,15}$/, type: 'tel' },
      { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'from-green-500 to-green-600', placeholder: 'https://wa.me/1234567890', pattern: /^https:\/\/wa\.me\/.+/ },
      { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'from-indigo-600 to-indigo-800', placeholder: 'discord.gg/invite', pattern: /^https:\/\/discord\.(gg|com)\/.+/ },
      { id: 'website', name: 'Website', icon: FaGlobe, color: 'from-gray-600 to-gray-800', placeholder: 'https://yourwebsite.com', pattern: /^https?:\/\/.+/ }
    ]
  }
};

const EnhancedSocialLinksSelection = ({ initialBioLinks = [], onComplete, onBack, user }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('social');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [linkData, setLinkData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Initialize data from props
  useEffect(() => {
    if (initialBioLinks && initialBioLinks.length > 0) {
      const platforms = [];
      const data = {};
      
      initialBioLinks.forEach(link => {
        // Find platform across all categories
        for (const category of Object.values(SOCIAL_PLATFORMS)) {
          const platform = category.platforms.find(p => p.id === link.id);
          if (platform) {
            platforms.push(platform);
            data[link.id] = link.url;
            break;
          }
        }
      });
      
      setSelectedPlatforms(platforms);
      setLinkData(data);
    }
  }, [initialBioLinks]);

  // Validate URL format
  const validateUrl = (platform, url) => {
    if (!url.trim()) return { isValid: false, message: '' };
    
    if (platform.type === 'email') {
      return {
        isValid: platform.pattern.test(url),
        message: platform.pattern.test(url) ? '' : 'Please enter a valid email address'
      };
    }
    
    if (platform.type === 'tel') {
      return {
        isValid: platform.pattern.test(url),
        message: platform.pattern.test(url) ? '' : 'Please enter a valid phone number'
      };
    }
    
    if (platform.pattern) {
      return {
        isValid: platform.pattern.test(url),
        message: platform.pattern.test(url) ? '' : `Please enter a valid ${platform.name} URL`
      };
    }
    
    // General URL validation
    try {
      new URL(url);
      return { isValid: true, message: '' };
    } catch {
      return { isValid: false, message: 'Please enter a valid URL' };
    }
  };

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => {
      const exists = prev.find(p => p.id === platform.id);
      if (exists) {
        // Remove platform and its data
        setLinkData(current => {
          const { [platform.id]: removed, ...rest } = current;
          return rest;
        });
        setValidationErrors(current => {
          const { [platform.id]: removed, ...rest } = current;
          return rest;
        });
        return prev.filter(p => p.id !== platform.id);
      } else {
        return [...prev, platform];
      }
    });
  };

  const updateLinkData = (platformId, url) => {
    setLinkData(prev => ({ ...prev, [platformId]: url }));
    
    // Validate URL
    const platform = selectedPlatforms.find(p => p.id === platformId);
    if (platform) {
      const validation = validateUrl(platform, url);
      setValidationErrors(prev => ({
        ...prev,
        [platformId]: validation.isValid ? null : validation.message
      }));
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    setSelectedPlatforms(prev => {
      const newPlatforms = [...prev];
      const draggedPlatform = newPlatforms[dragIndex];
      newPlatforms.splice(dragIndex, 1);
      newPlatforms.splice(dropIndex, 0, draggedPlatform);
      return newPlatforms;
    });
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const canProceed = () => {
    const hasValidLinks = selectedPlatforms.some(platform => {
      const url = linkData[platform.id];
      if (!url?.trim()) return false;
      const validation = validateUrl(platform, url);
      return validation.isValid;
    });
    
    return hasValidLinks && Object.values(validationErrors).every(error => !error);
  };

  const handleSubmit = async () => {
    if (!canProceed() || loading) return;

    setLoading(true);
    try {
      const validLinks = selectedPlatforms
        .filter(platform => {
          const url = linkData[platform.id];
          if (!url?.trim()) return false;
          return validateUrl(platform, url).isValid;
        })
        .map(platform => ({
          id: platform.id,
          url: linkData[platform.id].trim()
        }));

      await dispatch(updateUserProfile({
        bioLinks: validLinks
      })).unwrap();

      onComplete(validLinks);
    } catch (error) {
      console.error('Failed to save links:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
          >
            <Link className="w-10 h-10 text-white" />
          </motion.div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add Your Links
            </h1>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the platforms you want to showcase and add your links. Your visitors will see them in this order.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Category Tabs */}
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(SOCIAL_PLATFORMS).map(([key, category]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                    activeCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Platform Grid */}
          <div className="p-6">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
            >
              {SOCIAL_PLATFORMS[activeCategory].platforms.map((platform) => {
                const isSelected = selectedPlatforms.find(p => p.id === platform.id);
                const Icon = platform.icon;
                
                return (
                  <motion.div
                    key={platform.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => togglePlatform(platform)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-center text-gray-900">
                        {platform.name}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Selected Platforms Form */}
            <AnimatePresence>
              {selectedPlatforms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Configure Your Links</h3>
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <GripVertical className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Drag to Reorder</h4>
                        <p className="text-sm text-blue-800">Links will appear in this order on your profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedPlatforms.map((platform, index) => {
                      const Icon = platform.icon;
                      const hasError = validationErrors[platform.id];
                      const hasValue = linkData[platform.id]?.trim();
                      
                      return (
                        <motion.div
                          key={platform.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            scale: draggedItem === index ? 1.02 : 1
                          }}
                          exit={{ opacity: 0, y: -20 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                            draggedItem === index
                              ? 'border-purple-300 bg-purple-50 shadow-lg'
                              : hasError
                                ? 'border-red-200 bg-red-50'
                                : hasValue
                                  ? 'border-green-200 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          {/* Drag Handle */}
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-5 h-5" />
                          </div>

                          {/* Platform Icon */}
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Form Fields */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="font-semibold text-gray-900">
                                {platform.name}
                              </label>
                              <button
                                onClick={() => togglePlatform(platform)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="relative">
                              <input
                                type={platform.type || 'url'}
                                placeholder={platform.placeholder}
                                value={linkData[platform.id] || ''}
                                onChange={(e) => updateLinkData(platform.id, e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
                                  hasError
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    : hasValue
                                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                } focus:ring-4 focus:outline-none`}
                              />
                              
                              {hasValue && !hasError && (
                                <a
                                  href={platform.type === 'email' ? `mailto:${linkData[platform.id]}` : linkData[platform.id]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {hasError && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center space-x-2 text-sm text-red-600"
                              >
                                <AlertCircle className="w-4 h-4" />
                                <span>{hasError}</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {selectedPlatforms.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No platforms selected</h3>
                <p className="text-gray-600 mb-4">Choose from the platforms above to get started</p>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-800 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedPlatforms.length > 0 
                    ? `${selectedPlatforms.filter(p => linkData[p.id]?.trim() && !validationErrors[p.id]).length} of ${selectedPlatforms.length} links configured`
                    : 'Select platforms to continue'
                  }
                </p>
              </div>

              <motion.button
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                  canProceed() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Theme</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            Pro Tips for Better Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use your exact profile URLs for better recognition</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Test each link to make sure it works correctly</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Order your most important links at the top</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Keep your profiles updated and active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSocialLinksSelection;