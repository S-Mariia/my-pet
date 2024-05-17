import { configureStore } from '@reduxjs/toolkit';
import themeSlice from '@/redux/slices/Theme/themeSlice';
import userSlice from './slices/userAuth/userAuthSlice';
import loadingSlice from "@/redux/slices/loading/loadingSlice";
import petsListSlice from "@/redux/slices/petsList/petsListSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    theme: themeSlice,
    loading: loadingSlice,
    petsList: petsListSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
