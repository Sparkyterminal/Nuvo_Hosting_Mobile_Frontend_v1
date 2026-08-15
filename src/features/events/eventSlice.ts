import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createEventAPI, getMyEventsAPI } from '../../services/api/eventService';
import { EventDetail, MyEventListItem } from '../../types';

interface EventState {
  loading: boolean;
  event: EventDetail | null; // result of the last create
  events: MyEventListItem[]; // the client's event list
  error: string | null;
}

const extractError = (error: unknown): string => {
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message || 'Something went wrong';
};

export const createEvent = createAsyncThunk<
  EventDetail,
  Record<string, unknown>,
  { rejectValue: string }
>('event/createEvent', async (payload, { rejectWithValue }) => {
  try {
    const response = await createEventAPI(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const getMyEvents = createAsyncThunk<
  MyEventListItem[],
  void,
  { rejectValue: string }
>('event/getMyEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await getMyEventsAPI();
    return response.data.results;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

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
        state.error = action.payload ?? 'Something went wrong';
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
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default eventSlice.reducer;
