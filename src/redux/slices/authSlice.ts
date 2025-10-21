// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../features/auth/types/auth";
import { apiClient } from "../../api/apiClient";

// Typen ska matcha din backend UserAuthResponse
export interface UserAuthResponse {
  id: string | null;
  user: string | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
}

const initialState: AuthState = {
  id: null,
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
};

// 🔄 Async thunk – kolla auth-status
export const checkAuth = createAsyncThunk<UserAuthResponse, void, { rejectValue: string }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<UserAuthResponse>("/user/check");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Not authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        id: string;
        user: string;
        hasCompletedOnboarding: boolean;
      }>
    ) => {
      state.id = action.payload.id;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.hasCompletedOnboarding = action.payload.hasCompletedOnboarding;
    },
    logout: (state) => {
      state.id = null;
      state.user = null;
      state.isAuthenticated = false;
      state.hasCompletedOnboarding = false;
    },
    setHasCompletedOnboarding: (state, action: PayloadAction<boolean>) => {
      state.hasCompletedOnboarding = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.hasCompletedOnboarding = action.payload.hasCompletedOnboarding;
    });

    builder.addCase(checkAuth.rejected, (state) => {
      state.id = null;
      state.user = null;
      state.isAuthenticated = false;
      state.hasCompletedOnboarding = false;
    });
  },
});

export const { loginSuccess, logout, setHasCompletedOnboarding } = authSlice.actions;
export default authSlice.reducer;
