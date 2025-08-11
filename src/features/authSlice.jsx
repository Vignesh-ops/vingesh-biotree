// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { fetchUserProfile, clearUserProfile } from "./userSlice";

// Sign in with Google
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      // Ensure user doc exists
      const userRef = doc(db, "users", fbUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const raw = (fbUser.displayName || fbUser.email || "user").toLowerCase();
        const username = raw.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        await setDoc(userRef, {
          uid: fbUser.uid,
          displayName: fbUser.displayName || "",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || "",
          username,
          bioLinks: [],
          theme: "basic",
          createdAt: serverTimestamp(),
        });
      }

      // Fetch profile right after login
      thunkAPI.dispatch(fetchUserProfile(fbUser.uid));

      return {
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Sign out
export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, thunkAPI) => {
    try {
      await firebaseSignOut(auth);
      thunkAPI.dispatch(clearUserProfile());
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // { uid, displayName, email, photoURL }
    status: "loading",
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    setAuthLoading: (state) => {
      state.status = "loading";
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { setUser, clearUser,setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
