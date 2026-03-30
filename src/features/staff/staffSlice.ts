import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUpcomingEvents,
  getAssignedEvents,
  getCompletedEvents,
} from '../../services/api/staffService';

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

type StaffState = {
  upcoming: any[];
  assigned: any[];
  completed: any[];
  loading: boolean;
};

const initialState: StaffState = {
  upcoming: [],
  assigned: [],
  completed: [],
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
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
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export default staffSlice.reducer;
