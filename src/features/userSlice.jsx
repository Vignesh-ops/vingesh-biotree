// src/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Fetch profile from Firestore
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (uid, thunkAPI) => {
    try {
      if (!uid) throw new Error("User ID is missing!");
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        return snap.data();
      } else {
        return {}; // no profile yet
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const saveUserProfile = createAsyncThunk(
  "user/saveUserProfile",
  async ({ uid, ...updates }) => {
    console.log('save',uid,'dat====>',updates)
    if (!uid) throw new Error("Missing user UID");
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, updates);
    return updates;
  }
);

const initialState = {
  theme: "basic",
  bioLinks: [],
  bio:'',
  displayName: "",
  username: "",
  email: "",
  photoURL: "",
  createdAt: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        return { ...state, ...action.payload };
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        if (!state.profile) state.profile = {};
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.error = action.payload
        console.log(action, 'error')
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
