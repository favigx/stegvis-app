import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { UserPreference } from "../../features/onboarding/types/userPreferences/userPreferences";
import { getUserPreferences, setUserPreferences as apiSetUserPreferences } from "../../features/onboarding/api/userPreferences/userPreferencesAPI";
import type { AddOnboardingPreferencesDTO } from "../../features/onboarding/types/userPreferences/addOnboardingPreferencesDTO";
import type { UserPreferenceResponse } from "../../features/auth/types/preferenceResponse"; 

// Default state matchar nya typer
const initialState: UserPreference & { loading: boolean; error: string | null } = {
  educationLevel: null,
  program: null,
  orientation: null,
  year: null,
  subjects: null,
  gradedSubjects: null,
  meritValue: null,
  meritValueBasedOnGoal: null,
  loading: false,
  error: null,
};

// Async thunk för att spara preferences
export const saveUserPreferences = createAsyncThunk(
  "preferences/saveUserPreferences",
  async (payload: AddOnboardingPreferencesDTO, { rejectWithValue }) => {
    try {
      const response = await apiSetUserPreferences(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk för att hämta preferences
export const fetchUserPreferences = createAsyncThunk<
  UserPreferenceResponse, 
  void, 
  { rejectValue: string }
>(
  "preferences/fetchUserPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserPreferences();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<Partial<UserPreference>>) => {
      Object.assign(state, action.payload);
    },
    resetPreferences: () => initialState,
  },
  extraReducers: (builder) => {
    // Save
    builder
      .addCase(saveUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserPreferences.fulfilled, (state, action: PayloadAction<UserPreference>) => {
        Object.assign(state, action.payload);
        state.loading = false;
      })
      .addCase(saveUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action: PayloadAction<UserPreferenceResponse>) => {
        const normalizedPrefs: UserPreference = {
          ...action.payload.userPreference,
          educationLevel: action.payload.userPreference?.educationLevel ?? null,
        };
        Object.assign(state, normalizedPrefs);
        state.loading = false;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPreferences, resetPreferences } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;
