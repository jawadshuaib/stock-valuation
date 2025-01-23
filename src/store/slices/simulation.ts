// Use this slice to save monte carlo simulation data
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SIMULATION } from '../../utils/valuations/monte-carlo/MonteCarloIntrinsicValueCalculator';

export type SimulationState = {
  simulation: SIMULATION | null;
};

const initialState: SimulationState = {
  simulation: null,
};

const slice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    addSimulation(state, action: PayloadAction<SIMULATION>) {
      state.simulation = action.payload;
    },
    removeSimulation(state) {
      state.simulation = null;
    },
  },
});

export default slice.reducer;
export const { addSimulation, removeSimulation } = slice.actions;
