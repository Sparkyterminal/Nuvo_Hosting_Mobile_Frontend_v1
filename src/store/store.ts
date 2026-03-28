import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exploreReducer from '../features/explore/exploreSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    explore: exploreReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
