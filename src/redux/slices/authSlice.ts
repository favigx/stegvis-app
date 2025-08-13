import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../interfaces/user/auth";

const initialState: AuthState = {
    id: null,
    user: null,
    token: null,
    expiresIn: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSucess: (
            state,
            action: PayloadAction<{ id: string; user: string; token: string; expiresIn: number }>
        ) => {
            state.id = action.payload.id;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.expiresIn = action.payload.expiresIn;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.id = null;
            state.user = null;
            state.token = null;
            state.expiresIn = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginSucess, logout } = authSlice.actions;
export default authSlice.reducer;