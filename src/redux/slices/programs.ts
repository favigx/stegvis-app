import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSkolverketPrograms } from "../../features/onboarding/api/skolverket/skolverketAPI";
import type { ProgramInterface } from "../../features/onboarding/types/skolverket/program";

interface ProgramsState {
  data: ProgramInterface[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgramsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPrograms = createAsyncThunk(
  "programs/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSkolverketPrograms();
      return response.programs;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Ett okänt fel inträffade");
    }
  }
);

export const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    resetPrograms: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action: PayloadAction<ProgramInterface[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Något gick fel";
      });
  },
});

export const { resetPrograms } = programsSlice.actions;
export default programsSlice.reducer;