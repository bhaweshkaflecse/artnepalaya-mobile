// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // Add feature slices here later
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful if storing dates, though frowned upon
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;