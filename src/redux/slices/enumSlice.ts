import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserPreferenceEnums } from "../../features/onboarding/types/userPreferences/userPreferenceEnums";

const initialState: UserPreferenceEnums = {
  educationLevels: [],
  year: [],
  grades: [],
  focusDays: [],
  dailyGoals: [],
  helpRequests: [],
};

export const enumsSlice = createSlice({
  name: "enums",
  initialState,
  reducers: {
   setEnums: (state, action: PayloadAction<UserPreferenceEnums>) => {
    state.educationLevels = action.payload.educationLevels;
    state.grades = action.payload.grades;
    state.year = action.payload.year;
    state.focusDays = action.payload.focusDays;
    state.dailyGoals = action.payload.dailyGoals;
    state.helpRequests = action.payload.helpRequests;
    },
    resetEnums: () => initialState,
  },
});

export const { setEnums, resetEnums } = enumsSlice.actions;
export default enumsSlice.reducer;