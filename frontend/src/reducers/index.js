import { combineReducers } from "redux";

import usersReducer from "../features/users/usersSlice";

export default combineReducers({
  users: usersReducer,
});
