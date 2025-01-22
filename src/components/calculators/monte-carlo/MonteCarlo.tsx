import React, { useContext } from 'react';
import MonteCarloFCFIntrinsicValueCalculator from '../../../utils/valuations/monte-carlo/MonteCarloFCFIntrinsicValueCalculator';
import { InvestmentContext } from '../InvestmentContext';
import { ValuationData } from '../types';
import ValuationResults from '../ValuationResults';

export default function MonteCarlo() {
  const data = useContext(InvestmentContext);

  if (!data) return null;

  const params = {
    method: 'fcf',
    sharePrice: data.inputs.sharePrice,
    fcf: data.inputs.initialFCF ?? 0,
    growthRate: data.inputs.initialGrowthRate / 100,
    terminalGrowthRate: data.inputs.terminalGrowthRate / 100,
    discountRate: data.inputs.discountRate / 100,
    projectionYears: data.inputs.projectionYears,
    marginOfSafety: data.inputs.marginOfSafety / 100,
    outstandingShares: data.inputs.outstandingShares ?? 0,
  } as const;

  const numSimulations = 10000;

  const monteCarloCalculator = new MonteCarloFCFIntrinsicValueCalculator(
    params,
    numSimulations,
  );
  const monteCarloResult = monteCarloCalculator.runSimulations();

  console.log('Monte Carlo Simulation Result:', monteCarloResult);

  if (Number.isNaN(monteCarloResult.median)) return null;

  const valuation: ValuationData = {
    intrinsicValue: monteCarloResult.median,
    marginOfSafetyPrice: monteCarloResult.median * (1 - params.marginOfSafety),
  };
  return <ValuationResults valuation={valuation} selection="montecarlo" />;
}
