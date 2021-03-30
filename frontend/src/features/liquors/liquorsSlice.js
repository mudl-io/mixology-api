import { createSlice } from "@reduxjs/toolkit";

const liquorsSlice = createSlice({
  name: "liquors",
  initialState: [],
  reducers: {
    didGetLiquors(state, action) {
      state.push(...action.payload);
    },
    // can "mutate" state here bc using the redux toolkit
    // which users Immer library under the hood
    didCreateLiquor(state, action) {
      return [...state, action.payload];
    },
  },
});

export const { didGetLiquors, didCreateLiquor } = liquorsSlice.actions;

export default liquorsSlice.reducer;
