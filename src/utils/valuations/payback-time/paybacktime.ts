interface StockData {
  initialInvestment: number;
  annualCashFlows: number[];
}

class PaybackTimeCalculator {
  private initialInvestment: number;

  private annualCashFlows: number[];

  constructor(stockData: StockData) {
    this.initialInvestment = stockData.initialInvestment;
    this.annualCashFlows = stockData.annualCashFlows;
  }

  public calculatePaybackTime(): number {
    let cumulativeCashFlow = 0;
    for (let year = 0; year < this.annualCashFlows.length; year++) {
      cumulativeCashFlow += this.annualCashFlows[year];
      if (cumulativeCashFlow >= this.initialInvestment) {
        return year + 1; // Adding 1 as years are 0-indexed.
      }
    }
    return -1; // Return -1 if payback time is not achieved within the provided cash flows.
  }
}

export default PaybackTimeCalculator;
