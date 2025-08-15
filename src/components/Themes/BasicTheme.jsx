import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Calendar, Users, Star } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

export default function BasicTheme({ profile }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [linkClicks, setLinkClicks] = useState({});

  const links = profile?.bioLinks || [];
  const displayName = profile.displayName || profile.username || "Anonymous User";
  const bio = profile.bio || "This user hasn't written a bio yet.";
  
  // Get theme configuration with fallbacks
  const themeConfig = useMemo(() => ({
    bgColor: "#ffffff",
    textColor: "#1f2937",
    primaryColor: "#8b5cf6",
    accentColor: "#ec4899",
    fontFamily: "Inter, sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
    headingSize: "28px",
    textSize: "16px",
    iconStyle: "outlined",
    iconColor: "inherit",
    linkStyle: "rounded",
    darkMode: false,
    bgImage: null,
    cardStyle: "elevated",
    spacing: "comfortable",
    ...(profile?.themeConfig || {})
  }), [profile?.themeConfig]);

  // Calculate spacing based on config
  const spacingClasses = useMemo(() => {
    const spacing = themeConfig.spacing;
    return {
      container: spacing === 'compact' ? 'py-8' : spacing === 'spacious' ? 'py-16' : 'py-12',
      section: spacing === 'compact' ? 'mb-6' : spacing === 'spacious' ? 'mb-12' : 'mb-8',
      links: spacing === 'compact' ? 'space-y-2' : spacing === 'spacious' ? 'space-y-6' : 'space-y-4'
    };
  }, [themeConfig.spacing]);

  // Calculate card styles based on config
  const getCardStyles = useCallback((isLink = false, index = 0) => {
    const baseStyles = {
      borderRadius: themeConfig.linkStyle === 'square' ? '8px' : 
                    themeConfig.linkStyle === 'pill' ? '50px' : '12px',
      fontFamily: themeConfig.fontFamily,
      fontWeight: themeConfig.fontWeight,
      fontStyle: themeConfig.fontStyle
    };

    let specificStyles = {};
    
    switch (themeConfig.cardStyle) {
      case 'flat':
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'rgba(255,255,255,0.9)',
          border: `2px solid ${isLink ? 'transparent' : themeConfig.primaryColor + '30'}`,
          boxShadow: 'none'
        };
        break;
      case 'elevated':
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: 'none'
        };
        break;
      case 'gradient':
        const colors = index % 2 === 0 ? 
          [themeConfig.primaryColor, themeConfig.accentColor] :
          [themeConfig.accentColor, themeConfig.primaryColor];
        specificStyles = {
          background: isLink ? 
            `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` :
            'rgba(255,255,255,0.95)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        };
        break;
      case 'glass':
        specificStyles = {
          backgroundColor: isLink ? 
            `${themeConfig.primaryColor}20` : 
            'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isLink ? themeConfig.primaryColor : 'rgba(255,255,255,0.2)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        };
        break;
      case 'neon':
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'rgba(0,0,0,0.8)',
          border: `2px solid ${themeConfig.primaryColor}`,
          boxShadow: `0 0 20px ${themeConfig.primaryColor}40, inset 0 0 20px ${themeConfig.primaryColor}10`
        };
        break;
      default:
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: 'none'
        };
    }

    return { ...baseStyles, ...specificStyles };
  }, [themeConfig]);

  // Track link clicks for analytics
  const handleLinkClick = useCallback(async (linkId, url) => {
    setLinkClicks(prev => ({
      ...prev,
      [linkId]: (prev[linkId] || 0) + 1
    }));

    try {
      console.log(`Link clicked: ${linkId} -> ${url}`);
    } catch (error) {
      console.error('Failed to track link click:', error);
    }

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

  // Dynamic background styles
  const backgroundStyles = useMemo(() => {
    const baseStyle = {
      backgroundColor: themeConfig.bgColor,
      color: themeConfig.textColor,
      fontFamily: themeConfig.fontFamily,
      minHeight: '100vh'
    };

    if (themeConfig.bgImage) {
      return {
        ...baseStyle,
        backgroundImage: `url(${themeConfig.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    if (themeConfig.darkMode) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${themeConfig.bgColor} 0%, ${themeConfig.textColor}10 100%)`
      };
    }

    return {
      ...baseStyle,
      background: `linear-gradient(135deg, ${themeConfig.bgColor} 0%, ${themeConfig.primaryColor}05 100%)`
    };
  }, [themeConfig]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={backgroundStyles}
      className="flex flex-col items-center relative"
    >
      {/* Background overlay for better text readability */}
      {themeConfig.bgImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: `${themeConfig.bgColor}${themeConfig.darkMode ? '95' : '90'}`
          }}
        />
      )}

      <div className={`relative z-10 w-full max-w-md mx-auto px-6 ${spacingClasses.container}`}>
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className={`text-center ${spacingClasses.section}`}
        >
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 0.8, 
                opacity: imageLoaded ? 1 : 0.8 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-32 h-32 mx-auto rounded-full overflow-hidden relative"
              style={{
                ...getCardStyles(false),
                border: `4px solid ${themeConfig.primaryColor}`,
                boxShadow: `0 0 30px ${themeConfig.primaryColor}30`
              }}
            >
              <img
                src={profile.photoURL || "/avatar-placeholder.png"}
                alt={displayName}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {!imageLoaded && (
                <div 
                  className="absolute inset-0 animate-pulse"
                  style={{ backgroundColor: `${themeConfig.primaryColor}20` }}
                />
              )}
            </motion.div>
            
            {/* Online/Verified indicator */}
            {profile.verified ? (
              <div 
                className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
                style={{ backgroundColor: themeConfig.accentColor }}
              >
                <Star size={12} color="white" fill="white" />
              </div>
            ) : (
              <div 
                className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full shadow-lg"
                style={{
                  backgroundColor: '#10b981',
                  border: `4px solid ${themeConfig.bgColor}`
                }}
              />
            )}
          </div>

          <motion.h1 
            variants={itemVariants}
            className="font-bold mb-3"
            style={{
              fontSize: themeConfig.headingSize,
              color: themeConfig.textColor,
              fontFamily: themeConfig.fontFamily,
              fontWeight: themeConfig.fontWeight,
              fontStyle: themeConfig.fontStyle
            }}
          >
            {displayName}
          </motion.h1>
          
          {profile.location && (
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-1 mb-2"
              style={{ color: `${themeConfig.textColor}80` }}
            >
              <MapPin size={16} />
              <span style={{ fontSize: themeConfig.textSize }}>
                {profile.location}
              </span>
            </motion.div>
          )}

          <motion.p 
            variants={itemVariants}
            className="leading-relaxed max-w-sm mx-auto"
            style={{
              color: `${themeConfig.textColor}90`,
              fontSize: themeConfig.textSize,
              fontFamily: themeConfig.fontFamily
            }}
          >
            {bio}
          </motion.p>

          {/* Stats */}
          {profile.stats && (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center gap-6 mt-6 pt-6"
              style={{ borderTop: `1px solid ${themeConfig.textColor}20` }}
            >
              {profile.stats.followers && (
                <div className="text-center">
                  <div 
                    className="font-bold text-lg"
                    style={{ color: themeConfig.textColor }}
                  >
                    {profile.stats.followers}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: `${themeConfig.textColor}60` }}
                  >
                    Followers
                  </div>
                </div>
              )}
              {profile.stats.posts && (
                <div className="text-center">
                  <div 
                    className="font-bold text-lg"
                    style={{ color: themeConfig.textColor }}
                  >
                    {profile.stats.posts}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: `${themeConfig.textColor}60` }}
                  >
                    Posts
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Links Section */}
        <motion.div 
          variants={itemVariants}
          className={spacingClasses.links}
        >
          {links.length > 0 ? (
            links.map((link, index) => (
              <motion.div
                key={`${link.id}-${index}`}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                className="group"
              >
                <button
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="w-full p-4 transition-all duration-300 focus:outline-none focus:ring-4"
                  style={{
                    ...getCardStyles(true, index),
                    color: themeConfig.cardStyle === 'glass' || themeConfig.cardStyle === 'neon' ? 
                      themeConfig.textColor : 'white',
                    fontSize: themeConfig.textSize,
                    focusRingColor: `${themeConfig.primaryColor}40`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: themeConfig.cardStyle === 'glass' || themeConfig.cardStyle === 'neon' ?
                            `${themeConfig.primaryColor}30` : 'rgba(255,255,255,0.2)'
                        }}
                      >
                        <span 
                          className="font-bold text-sm"
                          style={{
                            color: themeConfig.cardStyle === 'glass' || themeConfig.cardStyle === 'neon' ?
                              themeConfig.primaryColor : 'white'
                          }}
                        >
                          {link.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div 
                          className="font-semibold transition-colors"
                          style={{ fontFamily: themeConfig.fontFamily }}
                        >
                          {link.id}
                        </div>
                        {linkClicks[link.id] && (
                          <div 
                            className="text-xs opacity-75"
                            style={{ fontSize: `calc(${themeConfig.textSize} * 0.75)` }}
                          >
                            {linkClicks[link.id]} click{linkClicks[link.id] !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <ExternalLink 
                      size={16} 
                      className="opacity-60 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 px-6 rounded-xl border-2 border-dashed"
              style={{
                borderColor: `${themeConfig.textColor}30`,
                backgroundColor: `${themeConfig.bgColor}50`
              }}
            >
              <div className="text-4xl mb-4">🔗</div>
              <h3 
                className="font-semibold mb-2"
                style={{
                  color: themeConfig.textColor,
                  fontSize: themeConfig.textSize,
                  fontFamily: themeConfig.fontFamily
                }}
              >
                No links yet
              </h3>
              <p 
                className="text-sm"
                style={{ color: `${themeConfig.textColor}60` }}
              >
                This user hasn't added any links to share.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div 
            className="text-xs flex items-center justify-center gap-2"
            style={{ color: `${themeConfig.textColor}50` }}
          >
            <Calendar size={12} />
            <span>
              Joined {profile.createdAt ? 
                new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 
                'recently'}
            </span>
          </div>
          
          {profile.verified && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: themeConfig.accentColor }}
              />
              <span style={{ color: themeConfig.accentColor }}>
                Verified Profile
              </span>
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
          className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-20"
          style={{
            backgroundColor: themeConfig.primaryColor,
            '&:hover': {
              backgroundColor: themeConfig.accentColor
            }
          }}
        >
          <span className="text-lg">✏️</span>
        </motion.a>
      )}
    </motion.div>
  );
}