import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { motion } from 'framer-motion';
import { Share2, Heart } from 'lucide-react';
import { 
  MinimalTheme, 
  DarkTheme, 
  GradientTheme, 
  NeonTheme, 
  OceanTheme, 
  CottonTheme, 
  SunsetTheme 
} from '../components/Themes';

// Theme component mapping
const THEME_COMPONENTS = {
  minimal: MinimalTheme,
  dark: DarkTheme,
  gradient: GradientTheme,
  neon: NeonTheme,
  ocean: OceanTheme,
  cotton: CottonTheme,
  sunset: SunsetTheme,
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewTracked, setViewTracked] = useState(false);

  // Memoized theme component selection
  const ThemeComponent = useMemo(() => {
    return THEME_COMPONENTS[profile?.theme] || MinimalTheme;
  }, [profile?.theme]);

  // Track profile view (analytics)
  const trackProfileView = useCallback(async (uid) => {
    if (!uid || viewTracked) return;
    
    try {
      const analyticsRef = doc(db, "users", uid, "analytics", "views");
      await updateDoc(analyticsRef, {
        totalViews: increment(1),
        lastViewedAt: new Date(),
      });
      setViewTracked(true);
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  }, [viewTracked]);

  // Share profile function
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `Check out ${profile?.displayName || profile?.username}'s profile`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        await navigator.clipboard.writeText(url);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  }, [profile]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setError("No username provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const profileInfosRef = collection(db, "users");
        const q = query(
          profileInfosRef,
          where("username", "==", username.toLowerCase())
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setError("Profile not found");
          setProfile(null);
          setLoading(false);
          return;
        }

        const profileDoc = snap.docs[0];
        const profileData = profileDoc.data();
        const uid = profileDoc.id;

        // Format bioLinks to match theme component expectations
        const formattedBioLinks = profileData.bioLinks?.map(link => ({
          id: link.id,
          url: link.url,
          name: link.id.charAt(0).toUpperCase() + link.id.slice(1), // Capitalize first letter
          icon: () => <span>{link.id.charAt(0).toUpperCase()}</span> // Simple fallback icon
        })) || [];

        const enrichedProfile = {
          ...profileData,
          uid,
          bioLinks: formattedBioLinks,
          metaTitle: `${profileData.displayName || profileData.username} - Bio Links`,
          metaDescription: profileData.bio || `Check out ${profileData.displayName || profileData.username}'s links and content`,
        };

        setProfile(enrichedProfile);
        setTimeout(() => trackProfileView(uid), 1000);

      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, trackProfileView]);

  // SEO Meta tags effect
  useEffect(() => {
    if (profile) {
      document.title = profile.metaTitle;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = profile.metaDescription;

      const ogTags = [
        { property: 'og:title', content: profile.metaTitle },
        { property: 'og:description', content: profile.metaDescription },
        { property: 'og:image', content: profile.photoURL || '/default-avatar.png' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'profile' },
      ];

      ogTags.forEach(({ property, content }) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.content = content;
      });
    }

    return () => {
      document.title = 'Linkbrew - Create Your Bio Page';
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">😔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the profile you're looking for. 
            The username might be incorrect or the profile may have been removed.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <a 
              href="/" 
              className="block w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Go Home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // Prepare userProfile object for theme components
  const userProfile = {
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio,
    photoURL: profile.photoURL
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="fixed top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        aria-label="Share this profile"
      >
        <Share2 size={20} className="text-gray-600 group-hover:text-purple-600" />
      </button>

      <div 
        className="absolute w-1 h-1 opacity-0 pointer-events-none"
        data-profile-view={profile.uid}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ThemeComponent 
          userProfile={userProfile} 
          bioLinks={profile.bioLinks} 
        />
      </motion.div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-xs text-gray-600 hover:text-purple-600"
        >
          <Heart size={12} className="text-red-500" />
          Made with Linkbrew
        </a>
      </div>
    </div>
  );
}