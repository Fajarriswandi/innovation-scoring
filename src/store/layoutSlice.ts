import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  smallTitle: string;
}

const initialState: LayoutState = {
  smallTitle: 'Dashboard', // Default title
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSmallTitle(state, action: PayloadAction<string>) {
      state.smallTitle = action.payload;
    },
  },
});

export const { setSmallTitle } = layoutSlice.actions;
export default layoutSlice.reducer;
