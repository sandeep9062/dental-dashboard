import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: { _id: string; name: string; email: string; role: string };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
