import { createSlice } from "@reduxjs/toolkit";

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState: [],
  reducers: {
    didGetIngredients(state, action) {
      state.push(...action.payload);
    },
    // can "mutate" state here bc using the redux toolkit
    // which users Immer library under the hood
    didCreateIngredient(state, action) {
      return [...state, action.payload];
    },
  },
});

export const {
  didGetIngredients,
  didCreateIngredient,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
