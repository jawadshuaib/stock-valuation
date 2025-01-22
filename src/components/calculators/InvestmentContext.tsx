import React, { createContext } from 'react';
import { ProjectionData } from './types';
import FinancialRatios from './financial-ratios/FinancialRatios';
import PaybackTime from './payback-time/PaybackTime';
import FCFForFree from './fcf-for-free/FCFForFree';
import HalfLife from './half-life/HalfLife';
import InvestmentGrowth from './investment-growth/InvestmentGrowth';
import ProjectionChartAndTable from './ProjectionChartAndTable';
import MonteCarlo from './monte-carlo/MonteCarlo';

export const InvestmentContext = createContext<ProjectionData | null>(null);

interface InvestmentProps {
  data: ProjectionData;
  children: React.ReactNode;
}
const Investment = ({ data, children }: InvestmentProps) => {
  return (
    <InvestmentContext.Provider value={data}>
      {children}
    </InvestmentContext.Provider>
  );
};

Investment.Ratios = FinancialRatios;
Investment.ProjectionChartAndTable = ProjectionChartAndTable;
Investment.PaybackTime = PaybackTime;
Investment.FCFForFree = FCFForFree;
Investment.HalfLife = HalfLife;
Investment.Growth = InvestmentGrowth;
Investment.MonteCarlo = MonteCarlo;

export default Investment;
