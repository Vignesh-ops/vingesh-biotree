import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Calendar, Users } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function BasicTheme({ profile }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [linkClicks, setLinkClicks] = useState({});

  const Links = profile?.bioLinks || [];
  const displayName = profile.displayName || profile.username || "Anonymous User";
  const bio = profile.bio || "This user hasn't written a bio yet.";

  // Track link clicks for analytics
  const handleLinkClick = useCallback(async (linkId, url) => {
    // Update local state for immediate feedback
    setLinkClicks(prev => ({
      ...prev,
      [linkId]: (prev[linkId] || 0) + 1
    }));

    // Track click in analytics (implement based on your analytics solution)
    try {
      // Example: await trackLinkClick(profile.uid, linkId);
      console.log(`Link clicked: ${linkId} -> ${url}`);
    } catch (error) {
      console.error('Failed to track link click:', error);
    }

    // Open link
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [profile?.uid]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center font-sans"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8B5CF6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #EC4899 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12">
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 0.8, 
                opacity: imageLoaded ? 1 : 0.8 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-32 h-32 mx-auto rounded-full bg-white shadow-xl overflow-hidden border-4 border-white relative"
            >
              <img
                src={profile.photoURL || "/avatar-placeholder.png"}
                alt={displayName}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
            </motion.div>
            
            {/* Online indicator */}
            <div className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
          </div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold mb-3 text-gray-900"
          >
            {displayName}
          </motion.h1>
          
          {profile.location && (
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-1 text-gray-600 mb-2"
            >
              <MapPin size={16} />
              <span className="text-sm">{profile.location}</span>
            </motion.div>
          )}

          <motion.p 
            variants={itemVariants}
            className="text-gray-700 leading-relaxed max-w-sm mx-auto"
          >
            {bio}
          </motion.p>

          {/* Stats */}
          {profile.stats && (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200"
            >
              {profile.stats.followers && (
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">{profile.stats.followers}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
              )}
              {profile.stats.posts && (
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-900">{profile.stats.posts}</div>
                  <div className="text-xs text-gray-500">Posts</div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Links Section */}
        <motion.div 
          variants={itemVariants}
          className="space-y-4"
        >
          {Links.length > 0 ? (
            Links.map((link, index) => (
              <motion.div
                key={`${link.id}-${index}`}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                className="group"
              >
                <button
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {link.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {link.id}
                        </div>
                        {linkClicks[link.id] && (
                          <div className="text-xs text-gray-500">
                            {linkClicks[link.id]} click{linkClicks[link.id] !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <ExternalLink 
                      size={16} 
                      className="text-gray-400 group-hover:text-purple-500 transition-colors" 
                    />
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 px-6 bg-white/50 rounded-xl border-2 border-dashed border-gray-300"
            >
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-semibold text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600 text-sm">This user hasn't added any links to share.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Calendar size={12} />
            <span>Joined {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'recently'}</span>
          </div>
          
          {profile.verified && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Verified Profile
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button for Admin */}
      {profile.isOwner && (
        <motion.a
          href="/app/bio"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-20"
        >
          <span className="text-lg">✏️</span>
        </motion.a>
      )}
    </motion.div>
  );
}