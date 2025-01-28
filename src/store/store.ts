import { configureStore } from '@reduxjs/toolkit';
import simulation from './slices/simulation';
import loader from './slices/loader';

// Determine if the current environment is a test environment
const isTest = process.env.NODE_ENV === 'test';

const store = configureStore({
  reducer: {
    simulation,
    loader,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: !isTest,
      immutableCheck: !isTest,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
