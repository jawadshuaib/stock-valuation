import PresentValueCalculator from '../../../utils/valuations/PresentValueCalculator';

interface FCFForFreeData {
  premium: number;
  annualCashFlows: number[];
  discountRate: number;
}

class FCFForFreeCalculator {
  private premium: number;

  private annualCashFlows: number[];

  private pvCalculator: PresentValueCalculator;

  constructor(data: FCFForFreeData) {
    this.premium = data.premium;
    this.annualCashFlows = data.annualCashFlows;
    this.pvCalculator = new PresentValueCalculator(data.discountRate);
  }

  public calculateFCFForFreeTime(): number {
    let accumulatedCashFlow = 0;
    for (let year = 0; year < this.annualCashFlows.length; year++) {
      accumulatedCashFlow += this.pvCalculator.calculatePresentValue(
        this.annualCashFlows[year],
        year + 1,
      );
      if (accumulatedCashFlow >= this.premium) {
        return year + 1; // Adding 1 as years are 0-indexed.
      }
    }
    return -1; // Return -1 if FCF for Free time is not achieved within the provided cash flows.
  }
}

export default FCFForFreeCalculator;
