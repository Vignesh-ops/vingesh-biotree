// src/components/themes/index.js
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

// Base theme component wrapper
const BaseThemeWrapper = ({ children, themeConfig, className = "" }) => (
  <div 
    className={`min-h-screen transition-all duration-300 ${className}`}
    style={{ 
      background: themeConfig.background,
      fontFamily: themeConfig.fontFamily 
    }}
  >
    {children}
  </div>
);

// Minimal Clean Theme Component
export const MinimalTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            @{userProfile.username}
          </h1>
          
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-gray-400">
            Powered by BioLink
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Dark Professional Theme Component
export const DarkTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-xl"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-purple-500"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            @{userProfile.username}
          </h1>
          
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full p-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl hover:border-purple-500 hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-gray-500">
            Powered by BioLink
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Gradient Dreams Theme Component
export const GradientTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-2xl border-4 border-white/30"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            @{userProfile.username}
          </h1>
          
          <p className="text-white/90 text-sm leading-relaxed max-w-xs mx-auto drop-shadow">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="block w-full p-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl hover:bg-white/30 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white drop-shadow group-hover:scale-105 transition-transform">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-white/60">
            Powered by BioLink
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Neon Cyber Theme Component
export const NeonTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
    fontFamily: 'Fira Code, monospace'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(0, 255, 136, 0.5)',
                '0 0 30px rgba(255, 0, 128, 0.5)',
                '0 0 20px rgba(0, 255, 136, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-lg border-2 border-green-400"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-green-400 to-pink-600 flex items-center justify-center text-black text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold text-green-400 mb-2"
            animate={{ textShadow: ['0 0 10px rgba(0, 255, 136, 0.8)', '0 0 20px rgba(0, 255, 136, 0.8)', '0 0 10px rgba(0, 255, 136, 0.8)'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            &gt; {userProfile.username}_
          </motion.h1>
          
          <p className="text-white text-sm leading-relaxed max-w-xs mx-auto font-mono">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-3 relative z-10">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                className="block w-full p-3 bg-black/50 border border-green-400/50 rounded-sm hover:border-green-400 hover:bg-green-400/10 transition-all group font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-green-400 to-pink-600 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-black" />
                    </div>
                    <span className="font-semibold text-white group-hover:text-green-400 transition-colors text-sm">
                      [{link.name.toUpperCase()}]
                    </span>
                  </div>
                  <span className="text-green-400 text-xs">&gt;&gt;</span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Terminal Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 relative z-10"
        >
          <p className="text-xs text-green-400/60 font-mono">
            ~/biolink $ connected
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Ocean Blue Theme Component
export const OceanTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-2xl border-4 border-white/30"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            @{userProfile.username}
          </h1>
          
          <p className="text-white/90 text-sm leading-relaxed max-w-xs mx-auto">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4 relative z-10">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full p-4 bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl hover:bg-white/25 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-white group-hover:scale-105 transition-transform">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 relative z-10"
        >
          <p className="text-xs text-white/60">
            Powered by BioLink
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Cotton Candy Theme Component
export const CottonTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-xl border-4 border-pink-200"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-pink-800 mb-2">
            @{userProfile.username}
          </h1>
          
          <p className="text-pink-600 text-sm leading-relaxed max-w-xs mx-auto">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4 relative z-10">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full p-4 bg-white/80 backdrop-blur border-2 border-pink-200 rounded-3xl hover:border-pink-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-pink-800 group-hover:text-pink-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-pink-400 group-hover:text-pink-600 transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 relative z-10"
        >
          <p className="text-xs text-pink-400">
            Made with ♡ BioLink
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};

// Sunset Vibes Theme Component
export const SunsetTheme = ({ userProfile, bioLinks }) => {
  const themeConfig = {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <BaseThemeWrapper themeConfig={themeConfig}>
      <div className="max-w-md mx-auto px-6 py-12 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-2xl border-4 border-orange-200"
          >
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.displayName?.[0] || userProfile.username?.[0] || 'U'}
              </div>
            )}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-orange-900 mb-2">
            @{userProfile.username}
          </h1>
          
          <p className="text-orange-700 text-sm leading-relaxed max-w-xs mx-auto">
            {userProfile.bio}
          </p>
        </motion.div>

        {/* Bio Links */}
        <div className="space-y-4 relative z-10">
          {bioLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full p-4 bg-white/80 backdrop-blur border-2 border-orange-200 rounded-2xl hover:border-orange-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-orange-800 group-hover:text-orange-600 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-orange-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 relative z-10"
        >
          <p className="text-xs text-orange-600/60">
            Powered by BioLink ☀️
          </p>
        </motion.div>
      </div>
    </BaseThemeWrapper>
  );
};