import { configureStore } from '@reduxjs/toolkit';
import simulation from './slices/simulation';
import loader from './slices/loader';

const store = configureStore({
  reducer: {
    simulation,
    loader,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
