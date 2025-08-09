// src/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// sign in with Google (popup)
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      // ensure user doc exists in Firestore (users/{uid})
      const userRef = doc(db, "users", fbUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // create a sensible default username (can be changed later)
        const raw = (fbUser.displayName || fbUser.email || "user").toLowerCase();
        const username = raw.replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        await setDoc(userRef, {
          uid: fbUser.uid,
          displayName: fbUser.displayName || "",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || "",
          username: username,
          bio: "",
          createdAt: serverTimestamp(),
        });
      }

      // return basic fb user info (we'll fetch user doc separately if needed)
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

// sign out
export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, thunkAPI) => {
    try {
      await firebaseSignOut(auth);
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // { uid, displayName, email, photoURL, username?, bio? }
    status: "idle",
    error: null,
  },
  reducers: {
    // used by onAuthStateChanged to sync instantly
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        console.log('loading')
        state.status = "loading";
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('action',action)
        // basic info set, we will enrich via onAuthStateChanged fetch
        state.user = { ...action.payload };
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.log('error',action)

      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
