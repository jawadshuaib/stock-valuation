import { ProjectionData } from '../../../components/calculators/types';

export default class OwnerEarningsYieldCalculator {
  data: ProjectionData;

  constructor(data: ProjectionData) {
    this.data = data;
  }

  calculateOwnerEarnings(): number {
    const { yearByYearProjections } = this.data;
    let totalOwnerEarnings = 0;

    yearByYearProjections.forEach((projection) => {
      if (projection.fcf !== undefined) {
        totalOwnerEarnings += projection.fcf;
      }
    });

    return totalOwnerEarnings;
  }

  calculateYield(): number {
    const ownerEarnings = this.calculateOwnerEarnings();
    const marketCapitalization =
      this.data.inputs.sharePrice * (this.data.inputs.outstandingShares || 1);
    return (ownerEarnings / marketCapitalization) * 100;
  }
}
