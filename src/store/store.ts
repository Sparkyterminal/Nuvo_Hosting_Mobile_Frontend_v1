import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exploreReducer from '../features/explore/exploreSlice';
import uniformReducer from '../features/uniform/uniformSlice';
import staffReducer from '../features/staff/staffSlice';
// import eventReducer from '../features/event/eventSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    explore: exploreReducer,
    uniform: uniformReducer,
    staff: staffReducer,
    event: eventReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
