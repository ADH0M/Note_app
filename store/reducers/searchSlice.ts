import { createSlice } from "@reduxjs/toolkit";

const openSearchSlice = createSlice({
  name: "search",
  initialState: { open: false },
  reducers: {
    toggleOpen: (state) => {
      state.open = !state.open;
    },
  },
});

export default openSearchSlice.reducer;
export const { toggleOpen } = openSearchSlice.actions;
