import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types";
import { RootState } from "../store";
import { setHeaderConfigAxios } from "@/services/api/axios";

export type AuthState = {
  loggedin: boolean;
  user?: IUser;
  access_token?: string;
};

const initialState: AuthState = {
  loggedin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.loggedin = true;
      state.user = action.payload;
    },
    setCredential: (state, action: PayloadAction<string>) => {
      state.loggedin = true;
      state.access_token = action.payload;
    },
    logout: (state, action: PayloadAction) => {
      setHeaderConfigAxios();
      state.loggedin = false;
      state.user = undefined;
      state.access_token = undefined;
    },
  },
});

export const authSelector = (state: RootState) => state.auth;

export const { logout, setUser, setCredential } = authSlice.actions;
export default authSlice.reducer;
