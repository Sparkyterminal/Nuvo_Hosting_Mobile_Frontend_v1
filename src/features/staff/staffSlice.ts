import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUpcomingEvents,
  getAssignedEvents,
  getCompletedEvents,
  updateOnlineStatus,
} from '../../services/api/staffService';

export const STAFF_ONLINE_KEY = 'staff_is_online';

// 🔥 THUNKS
export const fetchUpcomingEvents = createAsyncThunk(
  'staff/upcoming',
  async () => await getUpcomingEvents(),
);

export const fetchAssignedEvents = createAsyncThunk(
  'staff/assigned',
  async () => await getAssignedEvents(),
);

export const fetchCompletedEvents = createAsyncThunk(
  'staff/completed',
  async () => await getCompletedEvents(),
);

export const setOnlineStatus = createAsyncThunk(
  'staff/onlineStatus',
  async (isOnline: boolean) => {
    const result = await updateOnlineStatus(isOnline);
    // Persist so the status survives app restarts.
    await AsyncStorage.setItem(STAFF_ONLINE_KEY, isOnline ? 'true' : 'false');
    return result;
  },
);

type StaffState = {
  upcoming: any[];
  assigned: any[];
  completed: any[];
  loading: boolean;
  isOnline: boolean;
  lastOnline: string | null;
};

const initialState: StaffState = {
  upcoming: [],
  assigned: [],
  completed: [],
  loading: false,
  isOnline: false,
  lastOnline: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    // Restores persisted online status without making an API call.
    restoreOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcoming = action.payload.results;
        state.loading = false;
      })
      .addCase(fetchAssignedEvents.fulfilled, (state, action) => {
        state.assigned = action.payload.results;
      })
      .addCase(fetchCompletedEvents.fulfilled, (state, action) => {
        state.completed = action.payload.results;
      })

      .addCase(setOnlineStatus.pending, (state, action) => {
        state.isOnline = action.meta.arg;
      })
      .addCase(setOnlineStatus.fulfilled, (state, action) => {
        state.isOnline = action.payload.data.is_online;
        state.lastOnline = action.payload.data.last_online;
      })
      .addCase(setOnlineStatus.rejected, (state, action) => {
        state.isOnline = !action.meta.arg;
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export const { restoreOnlineStatus } = staffSlice.actions;
export default staffSlice.reducer;
