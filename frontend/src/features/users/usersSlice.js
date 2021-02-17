import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser(state, action) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { loginUser, logoutUser } = usersSlice.actions;

export default usersSlice.reducer;
