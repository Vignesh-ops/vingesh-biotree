import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Settings, 
  Eye, 
  EyeOff,
  Globe,
  Lock,
  Users,
  BarChart3,
  Calendar,
  Crown,
  Zap,
  Palette,
  Link as LinkIcon,
  QrCode,
  Share2,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { updateUserProfile } from '../features/authSlice';

const ProfileManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || '',
    visibility: user?.visibility || 'public'
  });
  const [profileImage, setProfileImage] = useState(user?.photoURL || '');
  const [copySuccess, setCopySuccess] = useState('');
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Analytics mock data (you can replace with real data)
  const [analyticsData] = useState({
    totalViews: 1248,
    uniqueVisitors: 892,
    clickThroughRate: 12.5,
    topLink: 'Instagram',
    recentViews: [
      { date: '2024-01-15', views: 45 },
      { date: '2024-01-14', views: 38 },
      { date: '2024-01-13', views: 52 },
      { date: '2024-01-12', views: 41 },
      { date: '2024-01-11', views: 33 }
    ]
  });

  const profileUrl = `https://yourapp.com/${user?.username}`;

  // Handlers
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await dispatch(updateUserProfile({
        ...profileData,
        photoURL: profileImage
      })).unwrap();
      
      setIsEditing(false);
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaving(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopySuccess('copied');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = () => {
    // In a real app, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
  };

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'url', label: 'Profile URL', icon: LinkIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Profile Info Tab
  const ProfileInfoTab = () => (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            value={profileData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border-2 text-gray-700 rounded-xl transition-all ${
              isEditing 
                ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                : 'border-gray-100 bg-gray-50'
            }`}
            placeholder="Your display name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              disabled={!isEditing}
              className={`w-full pl-8 pr-4 py-3 text-gray-700 border-2 rounded-xl transition-all ${
                isEditing 
                  ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              placeholder="username"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-4 py-3 border-2 text-gray-700 rounded-xl transition-all resize-none ${
              isEditing 
                ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                : 'border-gray-100 bg-gray-50'
            }`}
            placeholder="Tell people about yourself..."
            maxLength={150}
          />
          <p className="text-sm text-gray-500 text-right">{profileData.bio.length}/150</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className={`w-full pl-12 pr-4 text-gray-700 py-3 border-2 rounded-xl transition-all ${
                isEditing 
                  ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className={`w-full pl-12 pr-4 py-3 text-gray-700 border-2 rounded-xl transition-all ${
                isEditing 
                  ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!isEditing}
              className={`w-full pl-12 pr-4 py-3 border-2 text-gray-700 rounded-xl transition-all ${
                isEditing 
                  ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`w-full pl-12 pr-4 py-3 border-2 text-gray-700 rounded-xl transition-all ${
                isEditing 
                  ? 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-100 bg-gray-50'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Profile URL Tab
  const ProfileUrlTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
          <LinkIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Your Profile URL</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Share your personalized link with others to showcase your bio and social links
        </p>
      </div>

      {/* URL Display */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Your Link</h4>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              profileData.visibility === 'public' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {profileData.visibility === 'public' ? (
                <>
                  <Globe className="w-3 h-3 inline mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 inline mr-1" />
                  Private
                </>
              )}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3">
            <span className="text-gray-900 font-mono">{profileUrl}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyUrl}
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            {copySuccess === 'copied' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open(profileUrl, '_blank')}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors flex flex-col items-center space-y-2"
        >
          <ExternalLink className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Preview</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setQrCodeVisible(true)}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors flex flex-col items-center space-y-2"
        >
          <QrCode className="w-6 h-6 text-green-500" />
          <span className="text-sm font-medium text-gray-700">QR Code</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${user?.displayName || user?.username}'s Profile`,
                url: profileUrl
              });
            }
          }}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors flex flex-col items-center space-y-2"
        >
          <Share2 className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors flex flex-col items-center space-y-2"
        >
          <Download className="w-6 h-6 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Export</span>
        </motion.button>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrCodeVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setQrCodeVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 mb-4">
                <img 
                  src={generateQRCode()} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code to visit your profile
              </p>
              <button
                onClick={() => setQrCodeVisible(false)}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Profile Analytics</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Track how your profile is performing and engaging with visitors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Views</p>
              <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Unique Visitors</p>
              <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Click Rate</p>
              <p className="text-2xl font-bold">{analyticsData.clickThroughRate}%</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Top Link</p>
              <p className="text-2xl font-bold">{analyticsData.topLink}</p>
            </div>
            <Crown className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Analytics chart would go here</p>
            <p className="text-sm">Integrate with your preferred chart library</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Profile Settings</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Manage your privacy, notifications, and other preferences
        </p>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Visibility</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Control who can see your profile</p>
            </div>
            <select
              value={profileData.visibility}
              onChange={(e) => handleInputChange('visibility', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Search Engine Indexing</p>
              <p className="text-sm text-gray-600">Allow search engines to find your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer text-gray-700" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h4>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">Reset Profile</p>
              <p className="text-sm text-gray-600">Reset all profile settings to defaults</p>
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
            <Download className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Download your profile data</p>
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600">
            <Trash2 className="w-5 h-5" />
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-red-500">Permanently delete your account and data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">Manage your profile information and settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && <ProfileInfoTab />}
                {activeTab === 'url' && <ProfileUrlTab />}
                {activeTab === 'analytics' && <AnalyticsTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </div>

                   {/* Action Buttons for Profile Tab */}
                   {activeTab === 'profile' && (
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-gray-100">
              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-70"
                    >
                      <div className="flex items-center space-x-2">
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;