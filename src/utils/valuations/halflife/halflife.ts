import { ProjectionData } from '../../../components/calculators/types';

/**
 * This class calculates how many years it takes for the company's ratio
 * to reach half or below, considering both explicit yearly projections and
 * an extended phase with terminal growth.
 */
export class HalfLifeCalculator {
  /**
   * Private helper to calculate years until ratio <= 0.5, given a value accessor (EPS/FCF).
   * @param data ProjectionData
   * @param accessor Callback to retrieve the projected value (eps or fcf)
   * @returns Year in which ratio <= 0.5 or -1 if not reached
   */
  static calculateHalfLife(
    data: ProjectionData,
    accessor: (projection: { [key: string]: number }) => number | undefined,
  ): number {
    // Ensure there's at least one projection and sharePrice is valid
    if (!data?.yearByYearProjections?.length) return -1;
    const { sharePrice, initialEPS, initialFCF } = data.inputs;
    if (sharePrice <= 0) return -1;

    let initialRatio;
    if (data.method === 'eps') {
      if (initialEPS === undefined || initialEPS <= 0) return -1;
      initialRatio = sharePrice / initialEPS;
    } else if (data.method === 'fcf') {
      if (initialFCF === undefined || initialFCF <= 0) return -1;
      initialRatio = sharePrice / initialFCF;
    } else {
      return -1;
    }

    // Calculate the half-life
    for (let year = 0; year < data.yearByYearProjections.length; year++) {
      const projectedValue = accessor(data.yearByYearProjections[year]);
      console.log(projectedValue && sharePrice / projectedValue);
      if (
        projectedValue !== undefined &&
        sharePrice / projectedValue <= initialRatio / 2
      ) {
        return year + 1; // Adding 1 to convert index to year
      }
    }
    return -1;
  }
}
