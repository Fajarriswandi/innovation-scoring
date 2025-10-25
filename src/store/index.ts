import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './layoutSlice';
import inboundReducer from './inboundSlice';

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    inbound: inboundReducer,
  },
  middleware: (getDefault) => getDefault(),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
