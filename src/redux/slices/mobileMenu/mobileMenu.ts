import { createSlice } from '@reduxjs/toolkit';

type mobileMenuType = {
  mobileMenu: boolean
};

const initialState: mobileMenuType = {
  mobileMenu: false,
};

export const mobileMenu = createSlice({
  name: 'mobileMenu',
  initialState,
  reducers: {
    setMobileMenu: (state, { payload }) => {
      state.mobileMenu = payload;
    },
  },
});

export const { setMobileMenu } = mobileMenu.actions;
export default mobileMenu.reducer;
