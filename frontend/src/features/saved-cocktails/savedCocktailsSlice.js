import { createSlice } from "@reduxjs/toolkit";

const savedCocktailsSlice = createSlice({
  name: "savedCocktails",
  initialState: [],
  reducers: {
    didGetCocktails(state, action) {
      return [...action.payload];
    },
    didSaveCocktail(state, action) {
      return [...state, action.payload];
    },
    didUnsaveCocktail(state, action) {
      return state.filter((cocktail) => cocktail.publicId !== action.payload);
    },
  },
});

export const {
  didGetCocktails,
  didSaveCocktail,
  didUnsaveCocktail,
} = savedCocktailsSlice.actions;

export default savedCocktailsSlice.reducer;
