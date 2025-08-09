import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path


export const saveTheme = createAsyncThunk(
  'user/saveTheme',
  async ({ uid, theme }, thunkAPI) => {
    try {
      await setDoc(doc(db, 'users', uid), { theme }, { merge: true });
      return theme; // return theme so it can be saved in redux
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  username: null,
  bio: null,
  theme: 'basic', // default theme
  // ... other fields
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      return initialState;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTheme.pending, (state) => {
        state.savingTheme = true;
        state.themeError = null;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.savingTheme = false;
        state.theme = action.payload;
      })
      .addCase(saveTheme.rejected, (state, action) => {
        state.savingTheme = false;
        state.themeError = action.payload;
      });
  },
});

export const { setUser, clearUser, setTheme } = userSlice.actions;
export default userSlice.reducer;

