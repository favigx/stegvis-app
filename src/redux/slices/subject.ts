import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSkolverketSubjectsForProgram } from "../../api/onboarding/skolverket/details";
import type { ProgramDetailsInterface } from "../../api/onboarding/skolverket/dto/programdetails";

interface SubjectsState {
  data: ProgramDetailsInterface | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchSubjectsForProgram = createAsyncThunk(
  "subjects/fetchSubjectsForProgram",
  async (programCode: string, { rejectWithValue }) => {
    try {
      const response = await getSkolverketSubjectsForProgram(programCode);
      return response.program; 
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Ett okänt fel inträffade");
    }
  }
);

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    resetSubjects: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectsForProgram.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsForProgram.fulfilled, (state, action: PayloadAction<ProgramDetailsInterface>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubjectsForProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Något gick fel vid hämtning av ämnen";
      });
  },
});

export const { resetSubjects } = subjectsSlice.actions;
export default subjectsSlice.reducer;