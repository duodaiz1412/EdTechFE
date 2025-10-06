import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {Enrollment} from "@/types";

export interface UserState {
  isAuthenticated: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    username: string;
    image: string | undefined;
    type: string;
    roles: string[];
    enrollments: Enrollment[];
  } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  data: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
    },
  },
});

export const {login, logout} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
