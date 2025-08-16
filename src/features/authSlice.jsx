import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { fetchUserProfile, clearUserProfile } from "./userSlice";

// Enhanced error messages for better UX
const getErrorMessage = (error) => {
  const errorMessages = {
    'auth/popup-closed-by-user': 'Sign in was cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups and try again.',
    'auth/cancelled-popup-request': 'Multiple sign-in attempts detected. Please try again.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'firestore/permission-denied': 'Permission denied. Please try signing in again.',
    'firestore/unavailable': 'Service temporarily unavailable. Please try again.',
  };
  
  return errorMessages[error.code] || error.message || 'An unexpected error occurred. Please try again.';
};

// Set persistence before sign in
const initializeAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.warn('Failed to set auth persistence:', error);
  }
};

// Enhanced sign in with Google
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Initialize auth if needed
      await initializeAuth();
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account',
        access_type: 'offline'
      });

      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.uid) {
        throw new Error('No user data received from Google');
      }

      // Check if profile exists, create if not
      const profileRef = doc(db, "users", fbUser.uid);
      const profileSnap = await getDoc(profileRef);
      
      const defaultProfileData = {
        displayName: fbUser.displayName || "",
        email: fbUser.email || "",
        photoURL: fbUser.photoURL || "",
        username: "", // You'd need to implement this
        bio: "",
        theme: "basic",
        bioLinks: [],
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        profileComplete: false,
        themeConfig: {
          bgColor: "#ffffff",
          textColor: "#000000",
          primaryColor: "#4285f4", // Google blue
          accentColor: "#34a853", // Google green
          fontFamily: "Roboto, sans-serif",
          fontWeight: "normal",
          fontStyle: "normal",
          headingSize: "24px",
          textSize: "16px",
          iconStyle: "filled",
          iconColor: "inherit",
          linkStyle: "underline",
          darkMode: false,
          bgImage: null
        }
      };

      if (profileSnap.exists()) {
        // Update existing profile
        await updateDoc(profileRef, {
          lastLoginAt: serverTimestamp(),
          photoURL: fbUser.photoURL || profileSnap.data().photoURL || "",
          displayName: fbUser.displayName || profileSnap.data().displayName || ""
        });
      } else {
        // Create new profile
        await setDoc(profileRef, defaultProfileData);
      }

      // Fetch complete user profile
      dispatch(fetchUserProfile(fbUser.uid));

      return {
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        ...(profileSnap.exists() ? profileSnap.data() : defaultProfileData)
      };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Handle specific errors differently if needed
      if (error.code === 'auth/popup-closed-by-user') {
        return rejectWithValue('Sign-in was canceled');
      }
      
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
// Enhanced sign out
export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      dispatch(clearUserProfile());
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastAuthState');
      }
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update user profile data
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const uid = auth.user?.uid;
      
      if (!uid) {
        throw new Error('User not authenticated');
      }

      const profileRef = doc(db, "users", uid);
      console.log('Update',profileRef,'dat====>',updates)

      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return updates;
    } catch (error) {
      console.error('Profile update error:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Check if username is available
export const checkUsernameAvailability = createAsyncThunk(
  "auth/checkUsernameAvailability",
  async (username, { rejectWithValue }) => {
    try {
      if (!username || username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Sanitize username
      const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      
      if (sanitizedUsername !== username.toLowerCase()) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", sanitizedUsername));
      const snapshot = await getDocs(q);

      return {
        username: sanitizedUsername,
        available: snapshot.empty,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  user: null,
  status: "loading", // loading, idle, succeeded, failed
  error: null,
  isInitialized: false,
  lastActivity: null,
  usernameCheck: {
    status: "idle",
    username: "",
    available: false,
    error: null,
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user data from auth state listener
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
      state.isInitialized = true;
      state.lastActivity = Date.now();
      
      // Cache auth state for persistence
      if (typeof window !== 'undefined' && action.payload) {
        localStorage.setItem('lastAuthState', JSON.stringify({
          timestamp: Date.now(),
          userId: action.payload.uid
        }));
      }
    },
    
    // Clear user data
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.lastActivity = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastAuthState');
      }
    },
    
    // Set loading state
    setAuthLoading: (state, action) => {
      console.log('auth',action)
      // state.status = action.payload;

      state.error = null;
      // Don't clear user data immediately to prevent flash
      if (action.payload !== false) {
        state.isInitialized = false;
        state.status = 'loading'
      }else{state.status='succeeded'}
    },
    
    // Set auth error
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
      state.isInitialized = true;
    },
    
    // Mark auth as initialized
    setAuthInitialized: (state) => {
      state.isInitialized = true;
      if (state.status === "loading") {
        state.status = "idle";
      }
    },
    
    // Clear errors
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === "failed") {
        state.status = state.user ? "succeeded" : "idle";
      }
    },
    
    // Update last activity
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    
    // Clear username check
    clearUsernameCheck: (state) => {
      state.usernameCheck = {
        status: "idle",
        username: "",
        available: false,
        error: null,
      };
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log('authpending')
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('authdone')

        state.user = action.payload;
        state.error = null;
        state.isInitialized = true;
        state.lastActivity = Date.now();
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
        state.isInitialized = true;
      })
      
      // Sign out
      .addCase(signOutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.lastActivity = null;
        state.isInitialized = true;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // Don't clear user on sign out failure
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        // Don't change main status for profile updates
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          state.lastActivity = Date.now();
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Username availability check
      .addCase(checkUsernameAvailability.pending, (state) => {
        state.usernameCheck.status = "loading";
        state.usernameCheck.error = null;
      })
      .addCase(checkUsernameAvailability.fulfilled, (state, action) => {
        state.usernameCheck.status = "succeeded";
        state.usernameCheck.username = action.payload.username;
        state.usernameCheck.available = action.payload.available;
        state.usernameCheck.error = null;
      })
      .addCase(checkUsernameAvailability.rejected, (state, action) => {
        state.usernameCheck.status = "failed";
        state.usernameCheck.error = action.payload;
        state.usernameCheck.available = false;
      });
  },
});

export const { 
  setUser, 
  clearUser, 
  setAuthLoading, 
  setAuthError, 
  setAuthInitialized,
  clearAuthError,
  updateLastActivity,
  clearUsernameCheck
} = authSlice.actions;

// Selectors for better performance
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsLoading = (state) => state.auth.status === "loading";
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectUsernameCheck = (state) => state.auth.usernameCheck;

export default authSlice.reducer;