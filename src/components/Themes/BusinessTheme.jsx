import { motion } from 'framer-motion';
import { ExternalLink, Building2, Mail, Phone, Globe, Award } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';

export default function BusinessTheme({ profile }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [linkClicks, setLinkClicks] = useState({});

  const links = profile?.bioLinks || [];
  const displayName = profile.displayName || profile.username || "Business Name";
  const bio = profile.bio || "Your business tagline or description goes here.";
  
  // Get theme configuration with business-focused defaults
  const themeConfig = useMemo(() => ({
    bgColor: "#f8fafc",
    textColor: "#1e293b",
    primaryColor: "#3b82f6",
    accentColor: "#1d4ed8",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "medium",
    fontStyle: "normal",
    headingSize: "clamp(1.5rem, 4vw, 1.75rem)",
    textSize: "clamp(0.875rem, 2.5vw, 0.9375rem)",
    iconStyle: "filled",
    iconColor: "inherit",
    linkStyle: "square",
    darkMode: false,
    bgImage: null,
    cardStyle: "flat",
    spacing: "compact",
    ...(profile?.themeConfig || {})
  }), [profile?.themeConfig]);

  // Calculate spacing based on config
  const spacingClasses = useMemo(() => {
    const spacing = themeConfig.spacing;
    return {
      container: spacing === 'compact' ? 'py-6 px-4 sm:py-8 sm:px-6' : 
                spacing === 'spacious' ? 'py-12 px-6 sm:py-16 sm:px-8' : 
                'py-8 px-5 sm:py-12 sm:px-6',
      section: spacing === 'compact' ? 'mb-4 sm:mb-6' : 
              spacing === 'spacious' ? 'mb-8 sm:mb-12' : 
              'mb-6 sm:mb-8',
      links: spacing === 'compact' ? 'space-y-2 sm:space-y-3' : 
            spacing === 'spacious' ? 'space-y-4 sm:space-y-6' : 
            'space-y-3 sm:space-y-4'
    };
  }, [themeConfig.spacing]);

  // Enhanced card styles for business theme
  const getCardStyles = useCallback((isLink = false, index = 0) => {
    const baseStyles = {
      borderRadius: themeConfig.linkStyle === 'square' ? '8px' : 
                    themeConfig.linkStyle === 'pill' ? '50px' : '12px',
      fontFamily: themeConfig.fontFamily,
      fontWeight: themeConfig.fontWeight,
      fontStyle: themeConfig.fontStyle,
      transition: 'all 0.3s ease'
    };

    let specificStyles = {};
    
    switch (themeConfig.cardStyle) {
      case 'flat':
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'white',
          border: `2px solid ${isLink ? 'transparent' : themeConfig.primaryColor + '20'}`,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: isLink ? themeConfig.accentColor : `${themeConfig.primaryColor}05`,
            borderColor: themeConfig.primaryColor
          }
        };
        break;
      case 'elevated':
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: 'none',
          '&:hover': {
            backgroundColor: isLink ? themeConfig.accentColor : 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }
        };
        break;
      case 'gradient':
        const colors = index % 2 === 0 ? 
          [themeConfig.primaryColor, themeConfig.accentColor] :
          [themeConfig.accentColor, themeConfig.primaryColor];
        specificStyles = {
          background: isLink ? 
            `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` :
            'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        };
        break;
      case 'glass':
        specificStyles = {
          backgroundColor: isLink ? 
            `${themeConfig.primaryColor}15` : 
            'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${themeConfig.primaryColor}30`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        };
        break;
      default:
        specificStyles = {
          backgroundColor: isLink ? themeConfig.primaryColor : 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: `1px solid ${themeConfig.primaryColor}20`
        };
    }

    return { ...baseStyles, ...specificStyles };
  }, [themeConfig]);

  const handleLinkClick = useCallback(async (linkId, url) => {
    setLinkClicks(prev => ({
      ...prev,
      [linkId]: (prev[linkId] || 0) + 1
    }));

    try {
      console.log(`Business link clicked: ${linkId} -> ${url}`);
    } catch (error) {
      console.error('Failed to track link click:', error);
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  // Dynamic background with professional patterns
  const backgroundStyles = useMemo(() => {
    let baseStyle = {
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

    // Professional gradient background
    return {
      ...baseStyle,
      background: `linear-gradient(135deg, ${themeConfig.bgColor} 0%, ${themeConfig.primaryColor}08 50%, ${themeConfig.accentColor}08 100%)`
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
      {/* Professional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${themeConfig.primaryColor} 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, ${themeConfig.accentColor} 0%, transparent 50%)`
        }}></div>
      </div>

      <div className={`relative z-10 w-full max-w-lg mx-auto ${spacingClasses.container}`}>
        {/* Business Header */}
        <motion.div 
          variants={itemVariants}
          className={`text-center ${spacingClasses.section}`}
        >
          {/* Company Logo/Profile */}
          <div className="relative mb-4 sm:mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 0.8, 
                opacity: imageLoaded ? 1 : 0.8 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto overflow-hidden relative"
              style={{
                ...getCardStyles(false),
                border: `3px solid ${themeConfig.primaryColor}`,
                borderRadius: themeConfig.linkStyle === 'square' ? '12px' : '50%'
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
                  className="absolute inset-0 animate-pulse flex items-center justify-center"
                  style={{ backgroundColor: `${themeConfig.primaryColor}10` }}
                >
                  <Building2 size={20} className="sm:w-6 sm:h-6" style={{ color: themeConfig.primaryColor }} />
                </div>
              )}
            </motion.div>
            
            {/* Business Badge */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: themeConfig.accentColor,
                color: 'white'
              }}
            >
              BUSINESS
            </div>
          </div>

          <motion.h1 
            variants={itemVariants}
            className="font-bold mb-2 sm:mb-3"
            style={{
              fontSize: themeConfig.headingSize,
              color: themeConfig.textColor,
              fontFamily: themeConfig.fontFamily,
              fontWeight: 'bold',
              letterSpacing: '-0.025em'
            }}
          >
            {displayName}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="leading-relaxed max-w-sm mx-auto mb-4 sm:mb-6 px-2 sm:px-0"
            style={{
              color: `${themeConfig.textColor}90`,
              fontSize: themeConfig.textSize,
              fontFamily: themeConfig.fontFamily,
              fontWeight: themeConfig.fontWeight
            }}
          >
            {bio}
          </motion.p>

          {/* Business Info */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
          >
            {profile.email && (
              <div 
                className="flex items-center justify-center gap-2 text-xs sm:text-sm p-2 rounded"
                style={{
                  color: themeConfig.textColor,
                  backgroundColor: `${themeConfig.primaryColor}10`
                }}
              >
                <Mail size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div 
                className="flex items-center justify-center gap-2 text-xs sm:text-sm p-2 rounded"
                style={{
                  color: themeConfig.textColor,
                  backgroundColor: `${themeConfig.accentColor}10`
                }}
              >
                <Phone size={14} className="sm:w-4 sm:h-4" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.website && (
              <div 
                className="flex items-center justify-center gap-2 text-xs sm:text-sm p-2 rounded"
                style={{
                  color: themeConfig.textColor,
                  backgroundColor: `${themeConfig.primaryColor}10`
                }}
              >
                <Globe size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {profile.awards && (
              <div 
                className="flex items-center justify-center gap-2 text-xs sm:text-sm p-2 rounded"
                style={{
                  color: themeConfig.textColor,
                  backgroundColor: `${themeConfig.accentColor}10`
                }}
              >
                <Award size={14} className="sm:w-4 sm:h-4" />
                <span className="truncate">{profile.awards}</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Business Links Section */}
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
                  className="w-full p-3 sm:p-4 transition-all duration-300 focus:outline-none focus:ring-4"
                  style={{
                    ...getCardStyles(true, index),
                    color: 'white',
                    fontSize: themeConfig.textSize,
                    focusRingColor: `${themeConfig.primaryColor}40`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)'
                        }}
                      >
                        <span 
                          className="font-bold text-sm"
                          style={{
                            color: 'white'
                          }}
                        >
                          {link.id.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div 
                          className="font-semibold transition-colors text-sm sm:text-base"
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
                      size={14}
                      className="sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={itemVariants}
              className="text-center py-8 sm:py-12 px-4 sm:px-6 rounded-xl border-2 border-dashed"
              style={{
                borderColor: `${themeConfig.textColor}30`,
                backgroundColor: `${themeConfig.bgColor}50`
              }}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔗</div>
              <h3 
                className="font-semibold mb-1 sm:mb-2"
                style={{
                  color: themeConfig.textColor,
                  fontSize: themeConfig.textSize,
                  fontFamily: themeConfig.fontFamily
                }}
              >
                No links yet
              </h3>
              <p 
                className="text-xs sm:text-sm"
                style={{ color: `${themeConfig.textColor}60` }}
              >
                Add your business links to showcase your services
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Business Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 sm:mt-8 text-center"
        >
          <div 
            className="text-xs flex items-center justify-center gap-2"
            style={{ color: `${themeConfig.textColor}50` }}
          >
            <Calendar size={12} />
            <span>
              Established {profile.createdAt ? 
                new Date(profile.createdAt.seconds * 1000).getFullYear() : 
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
                Verified Business
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
          className="fixed bottom-6 right-6 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-20"
          style={{
            backgroundColor: themeConfig.primaryColor,
            '&:hover': {
              backgroundColor: themeConfig.accentColor
            }
          }}
        >
          <span className="text-base sm:text-lg">✏️</span>
        </motion.a>
      )}
    </motion.div>
  );
}