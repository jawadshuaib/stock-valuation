/**
 * @file store.ts
 * @description This file sets up the Redux store for the stock valuation application using Redux Toolkit.
 * It imports the necessary slices and configures the store with middleware settings.
 */
import { configureStore } from '@reduxjs/toolkit';
import simulation from './slices/simulation';
import loader from './slices/loader';

// Determine if the current environment is a test environment
// This flag is set automatically by Jest
const isTest = process.env.NODE_ENV === 'test';

const store = configureStore({
  reducer: {
    simulation,
    loader,
  },
  // This code configures the Redux store's middleware to disable
  // serializable and immutable checks when the application is
  // running in a test environment
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: !isTest,
      immutableCheck: !isTest,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
