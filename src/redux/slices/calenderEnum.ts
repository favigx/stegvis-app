import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TypeEnum } from "../../interfaces/calender/task/enum/type"; 

const initialState: TypeEnum = {
  types: [],
};

export const enumsSlice = createSlice({
  name: "calenderenums",
  initialState,
  reducers: {
   setCalenderEnums: (state, action: PayloadAction<TypeEnum>) => {
    state.types = action.payload.types;
    },
    resetCalenderEnums: () => initialState,
  },
});

export const { setCalenderEnums, resetCalenderEnums } = enumsSlice.actions;
export default enumsSlice.reducer;