import { configureStore } from "@reduxjs/toolkit";

import linksReducer from '../features/linkSlice'
import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice'

export const store = configureStore({
    reducer: {
      user: userReducer,
      links: linksReducer,
      auth: authReducer,
    //   theme: themeReducer,
    },
  });