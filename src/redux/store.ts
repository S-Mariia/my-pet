import { configureStore } from '@reduxjs/toolkit';
import themeSlice from '@/redux/slices/Theme/themeSlice';
import userSlice from './slices/userAuth/userAuthSlice';
import loadingSlice from "@/redux/slices/loading/loadingSlice";
import petsListSlice from "@/redux/slices/petsList/petsListSlice";
import mobileMenuSlice from "@/redux/slices/mobileMenu/mobileMenu";

export const store = configureStore({
  reducer: {
    user: userSlice,
    theme: themeSlice,
    loading: loadingSlice,
    petsList: petsListSlice,
    mobileMenu: mobileMenuSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
