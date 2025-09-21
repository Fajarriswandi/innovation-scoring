import { configureStore } from '@reduxjs/toolkit';
// contoh slice kosong, nanti ditambah per fitur
export const store = configureStore({
  reducer: {},
  middleware: (getDefault) => getDefault(),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;