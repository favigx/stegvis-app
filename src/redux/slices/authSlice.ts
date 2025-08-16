import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../interfaces/user/auth";

const initialState: AuthState = {
    id: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSucess: (
            state,
            action: PayloadAction<{ id: string; user: string;}>
        ) => {
            state.id = action.payload.id;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.id = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginSucess, logout } = authSlice.actions;
export default authSlice.reducer;