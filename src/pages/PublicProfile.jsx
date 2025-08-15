import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  collectionGroup,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import BasicTheme from '../components/Themes/BasicTheme';
import BusinessTheme from '../components/Themes/BusinessTheme';
import CreatorTheme from '../components/Themes/CreatorTheme';
import DeveloperTheme from '../components/Themes/DeveloperTheme';
import SingerTheme from '../components/Themes/SingerTheme';
import SportsTheme from '../components/Themes/SportsTheme';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';
import { Share2, Heart } from 'lucide-react';

// Theme component mapping for better performance
const THEME_COMPONENTS = {
  basic: BasicTheme,
  creator: CreatorTheme,
  business: BusinessTheme,
  sports: SportsTheme,
  singer: SingerTheme,
  developer: DeveloperTheme,
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewTracked, setViewTracked] = useState(false);

  // Memoized theme component selection
  const ThemeComponent = useMemo(() => {
    return THEME_COMPONENTS[profile?.theme] || BasicTheme;
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
      // Create analytics document if it doesn't exist
      try {
        await setDoc(analyticsRef, {
          totalViews: 1,
          lastViewedAt: new Date(),
          createdAt: new Date(),
        });
        setViewTracked(true);
      } catch (createError) {
        console.error("Failed to track view:", createError);
      }
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
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        // You could show a toast here
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could show a toast here
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  }, [profile]);

  // Load profile data with better error handling and performance
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
        // Search across all profile subcollections for username
        const profileInfosRef = collection(db, "users");
        const q = query(
          profileInfosRef,
          where("username", "==", username.toLowerCase())
        );
        const snap = await getDocs(q);

        console.log('profileSnapshot',snap)

        // const profileSnapshot = await getDocs(profileQuery);
        if (snap.empty) {
          setError("Profile not found");
          setProfile(null);
          setLoading(false);
          return;
        }

        // Get the profile document
        const profileDoc = snap.docs[0];
        const profileData = profileDoc.data();

        // Extract UID from document path
        const pathSegments = profileDoc.ref.path.split("/");
        const uid = pathSegments[1];

        const enrichedProfile = {
          ...profileData,
          uid,
          // Add SEO-friendly data
          metaTitle: `${profileData.displayName || profileData.username} - Bio Links`,
          metaDescription: profileData.bio || `Check out ${profileData.displayName || profileData.username}'s links and content`,
        };

        setProfile(enrichedProfile);

        // Track view asynchronously
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
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = profile.metaDescription;

      // Add Open Graph tags for better social sharing
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

    // Cleanup function
    return () => {
      document.title = 'Linkbrew - Create Your Bio Page';
    };
  }, [profile]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  // Error state with better UX
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

  // Render the appropriate theme component
  return (
    <div className="relative">
      {/* Share Button - Fixed position */}
      <button
        onClick={handleShare}
        className="fixed top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        aria-label="Share this profile"
      >
        <Share2 size={20} className="text-gray-600 group-hover:text-purple-600" />
      </button>

      {/* Analytics tracking pixel (invisible) */}
      <div 
        className="absolute w-1 h-1 opacity-0 pointer-events-none"
        data-profile-view={profile.uid}
      />

      {/* Theme Component */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ThemeComponent profile={profile} />
      </motion.div>

      {/* Powered by footer (optional) */}
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