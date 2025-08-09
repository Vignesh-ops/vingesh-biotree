// src/features/linksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc as firestoreDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Fetch links for current logged-in user
export const fetchLinks = createAsyncThunk(
  "links/fetchLinks",
  async (uid, thunkAPI) => {
    if (!uid) return [];

    const linksCol = collection(db, "users", uid, "links");
    const q = query(linksCol, orderBy("createdAt", "desc"));
    const qSnap = await getDocs(q);

    return qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
);


// Add a new link
export const addLink = createAsyncThunk(
  "links/addLink",
  async (newLink, thunkAPI) => {
    const { auth } = thunkAPI.getState();
    const uid = auth.user?.uid;
    if (!uid) throw new Error("Not authenticated");

    const path = newLink.path?.trim();

    console.log('path')
    if (!path) throw new Error("Path is required");

    // 1️⃣ Check if path already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("path", "==", path));
    const qSnap = await getDocs(q);

    if (!qSnap.empty) {
      throw new Error("This path is already taken. Please choose another.");
    }

    // 2️⃣ Save path to user's profile
    await setDoc(
      doc(db, "users", uid),
      {
        path,
        displayName: auth.user.displayName || "",
        photoURL: auth.user.photoURL || "",
      },
      { merge: true }
    );

    // 3️⃣ Save link inside subcollection
    const linkData = {
      title: String(newLink.title || "").trim(),
      url: String(newLink.url || "").trim(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "users", uid, "links"), linkData);

    return { id: docRef.id, ...linkData, createdAt: new Date().toISOString() };
  }
);


// Delete a link
export const deleteLink = createAsyncThunk(
  "links/deleteLink",
  async (id, thunkAPI) => {
    const { auth } = thunkAPI.getState();
    const uid = auth.user?.uid;
    if (!uid) throw new Error("Not authenticated");

    await deleteDoc(firestoreDoc(db, "users", uid, "links", id));
    return id;
  }
);

const linksSlice = createSlice({
  name: "links",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch links
      .addCase(fetchLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add link
      .addCase(addLink.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addLink.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(addLink.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete link
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
      });
  },
});

export default linksSlice.reducer;
