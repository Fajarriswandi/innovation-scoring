import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './layoutSlice';

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
  middleware: (getDefault) => getDefault(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
