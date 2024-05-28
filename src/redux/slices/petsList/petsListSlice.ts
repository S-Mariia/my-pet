import { createSlice } from '@reduxjs/toolkit';
import {PetData} from "@/types/petData";

type petsListType = {
  petsList: PetData[]
};

const initialState: petsListType = {
  petsList: [],
};

export const petsListSlice = createSlice({
  name: 'petsList',
  initialState,
  reducers: {
    setPetsListA: (state, { payload }) => {
      state.petsList = payload;
    },
  },
});

export const { setPetsListA } = petsListSlice.actions;
export default petsListSlice.reducer;
