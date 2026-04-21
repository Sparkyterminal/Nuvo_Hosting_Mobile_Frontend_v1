import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createEventAPI,
  getMyEventsAPI,
} from '../../services/api/eventService';

interface EventState {
  loading: boolean;
  event: any;
  error: string | null;
}

interface EventState {
  loading: boolean;
  event: any; // for create
  events: any[]; // 🔥 for list
  error: string | null;
}

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createEventAPI(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

export const getMyEvents = createAsyncThunk(
  'event/getMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyEventsAPI();
      return response.data.results;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);
const initialState: EventState = {
  loading: false,
  event: null,
  events: [],
  error: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMyEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventSlice.reducer;
