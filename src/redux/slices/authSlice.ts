import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../features/auth/types/auth";

const initialState: AuthState = {
    id: null,
    user: null,
    isAuthenticated: false,
    hasCompletedOnboarding: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSucess: (
            state,
            action: PayloadAction<{ id: string; user: string; hasCompletedOnboarding: boolean; }>
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
});

export const { loginSucess, logout, setHasCompletedOnboarding } = authSlice.actions;
export default authSlice.reducer;
