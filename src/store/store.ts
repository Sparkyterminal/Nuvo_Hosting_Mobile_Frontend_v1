import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exploreReducer from '../features/explore/exploreSlice';
import uniformReducer from '../features/uniform/uniformSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    explore: exploreReducer,
    uniform: uniformReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
