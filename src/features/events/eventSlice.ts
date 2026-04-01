import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createEventAPI } from '../../services/api/eventService';

interface EventState {
  loading: boolean;
  event: any;
  error: string | null;
}

const initialState: EventState = {
  loading: false,
  event: null,
  error: null,
};

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
      });
  },
});

export default eventSlice.reducer;
