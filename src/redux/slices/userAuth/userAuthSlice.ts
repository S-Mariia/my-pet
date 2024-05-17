import { createSlice } from '@reduxjs/toolkit';

type UserData = {
  displayName?: string,
  email: string,
  phoneNumber?: string,
  photoURL?: string,
  uid: string,
  emailVerified: boolean
};
type UserType = {
  user: UserData | null
};

const initialState: UserType = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
