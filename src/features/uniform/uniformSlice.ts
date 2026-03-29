import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUniforms } from '../../services/api/uniformService';

export const fetchUniforms = createAsyncThunk(
  'uniform/fetchUniforms',
  async () => {
    const res = await getUniforms();
    return res.data;
  },
);

type Uniform = {
  id: string;
  category_name: string;
  price: number;
  images: string[];
};

type UniformState = {
  uniforms: Uniform[];
  loading: boolean;
};

const initialState: UniformState = {
  uniforms: [],
  loading: false,
};

const uniformSlice = createSlice({
  name: 'uniform',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniforms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUniforms.fulfilled, (state, action) => {
        state.uniforms = action.payload;
        state.loading = false;
      })
      .addCase(fetchUniforms.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default uniformSlice.reducer;
