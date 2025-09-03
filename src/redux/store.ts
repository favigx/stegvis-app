import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import enumsReducer from "./slices/enumSlice";
import calenderEnumsReducer from "./slices/calenderEnum";
import userPreferenceReducer from "./slices/userPreferenceSlice";
import programReducer from "./slices/programs";
import subjectReducer from "./slices/subject";

const createPersistConfig = (key: string) => ({
  key,
  storage,
});

const rootReducer = {
  auth: persistReducer(createPersistConfig("auth"), authReducer),
  enums: persistReducer(createPersistConfig("enum"), enumsReducer),
  programs: persistReducer(createPersistConfig("programs"), programReducer),
  subjects: persistReducer(createPersistConfig("subjects"), subjectReducer),
  preferences: persistReducer(createPersistConfig("preferences"), userPreferenceReducer),
  calenderenums: persistReducer(createPersistConfig("calenderenums"), calenderEnumsReducer),
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