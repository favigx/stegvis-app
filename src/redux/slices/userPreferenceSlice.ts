import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserPreference } from "../../interfaces/user/preferences"; 

const initialState: UserPreference = {
  educationLevel: null,
  year: null,
  fieldOfStudy: null,
  subjects: [],
  focusDays: [],
  dailyGoal: null,
  helpRequests: [],
};

export const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<Partial<UserPreference>>) => {
      Object.assign(state, action.payload);
    },
    resetPreferences: () => initialState,
  },
});

export const { setPreferences, resetPreferences } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;