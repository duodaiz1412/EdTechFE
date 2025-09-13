import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {XCookie} from "@/lib/cookies";
import {StorageService} from "@/lib/storage";
import {User, AuthState} from "@/types";

const initialState: AuthState = {
  user: XCookie.getUser() || null,
  token: XCookie.getAccessToken() || null,
  refreshToken: XCookie.getRefreshToken() || null,
  isAuthenticated: !!XCookie.getAccessToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials after successful login/verify
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const {user, accessToken, refreshToken} = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Save to cookies
      XCookie.setAccessToken(accessToken);
      XCookie.setRefreshToken(refreshToken);
      XCookie.setUser(user);
    },

    // Set credentials from refresh token response
    setCredentialsFromRefreshToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const {accessToken, refreshToken} = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // Update cookies
      XCookie.setAccessToken(accessToken);
      XCookie.setRefreshToken(refreshToken);
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear cookies and storage
      XCookie.clearAllCookies();
      StorageService.clear();
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
        XCookie.setUser(state.user);
      }
    },
  },
});

export const {
  setCredentials,
  setCredentialsFromRefreshToken,
  logout,
  setLoading,
  setError,
  clearError,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
