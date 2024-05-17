import { createSlice } from '@reduxjs/toolkit';

type loadingType = {
  loading: boolean
};

const initialState: loadingType = {
  loading: true,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
