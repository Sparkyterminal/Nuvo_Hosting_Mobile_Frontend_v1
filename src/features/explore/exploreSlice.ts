import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Only `loading` remains in use (read by BookEventFlowScreen's footer). The old
// `themes`/`modals` state and their actions were dead after the Explore screen
// was removed, so they've been dropped.
interface ExploreState {
  loading: boolean;
}

const initialState: ExploreState = {
  loading: false,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = exploreSlice.actions;
export default exploreSlice.reducer;
