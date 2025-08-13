import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import enumsReducer from './slices/enumSlice';
import userPreferenceReducer from './slices/userPreferenceSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
    key: "auth",
    storage,
};

const enumsPersistConfig = {
    key: "enum",
    storage,
};

const preferencesPersistConfig = {
    key: "preferences",
    storage,
};

export const store = configureStore({
    reducer: {
        auth: persistReducer(authPersistConfig, authReducer),
        enums: persistReducer(enumsPersistConfig, enumsReducer),
        preferences: persistReducer(preferencesPersistConfig, userPreferenceReducer),
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;