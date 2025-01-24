import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LoaderState = {
  show: boolean;
};

const initialState: LoaderState = {
  show: false,
};

const slice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader(state, action: PayloadAction<boolean>) {
      state.show = !action.payload;
    },
  },
});

export default slice.reducer;
export const { showLoader } = slice.actions;
