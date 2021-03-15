import { combineReducers } from "redux";

import usersReducer from "../features/users/usersSlice";
import liquorsReducer from "../features/liquors/liquorsSlice";
import ingredientsReducer from "../features/ingredients/ingredientsSlice";
import savedCocktailsReducer from "../features/saved-cocktails/savedCocktailsSlice";

export default combineReducers({
  users: usersReducer,
  liquors: liquorsReducer,
  ingredients: ingredientsReducer,
  savedCocktails: savedCocktailsReducer,
});
