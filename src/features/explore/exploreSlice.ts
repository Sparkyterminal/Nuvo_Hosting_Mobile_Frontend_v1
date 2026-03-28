import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExploreState {
  themes: any[];
  modals: any[];
  loading: boolean;
}

const initialState: ExploreState = {
  themes: [],
  modals: [],
  loading: false,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setThemes: (state, action: PayloadAction<any[]>) => {
      state.themes = action.payload;
    },
    setModals: (state, action: PayloadAction<any[]>) => {
      state.modals = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setThemes, setModals, setLoading } = exploreSlice.actions;
export default exploreSlice.reducer;
