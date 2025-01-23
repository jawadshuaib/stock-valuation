import { configureStore } from '@reduxjs/toolkit';
import simulation from './slices/simulation';

const store = configureStore({
  reducer: {
    simulation,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
