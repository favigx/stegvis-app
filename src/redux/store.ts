import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import userPreferenceReducer from "./slices/userPreferenceSlice";
import profileReducer from "./slices/profileSlice";

const createPersistConfig = (key: string) => ({
  key,
  storage,
});

const rootReducer = {
  auth: persistReducer(createPersistConfig("auth"), authReducer),
  profile: persistReducer(createPersistConfig("profile"), profileReducer),
  preferences: persistReducer(createPersistConfig("preferences"), userPreferenceReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;