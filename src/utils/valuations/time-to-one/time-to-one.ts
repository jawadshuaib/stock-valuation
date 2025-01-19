import { ProjectionData } from '../../../components/calculators/types';

/**
 * This class calculates how many years it takes for the company's ratio
 * to reach 1 or below, considering both explicit yearly projections and
 * an extended phase with terminal growth.
 */
export class TimeToOneCalculator {
  /**
   * Private helper to calculate years until ratio <= 1, given a value accessor (EPS/FCF).
   * @param data ProjectionData
   * @param accessor Callback to retrieve the projected value (eps or fcf)
   * @returns Year in which ratio <= 1 or -1 if not reached
   */
  private static calculateTimeToOne(
    data: ProjectionData,
    accessor: (projection: { [key: string]: number }) => number | undefined,
  ): number {
    // Ensure there's at least one projection and sharePrice is valid
    if (!data?.yearByYearProjections?.length) return -1;
    const { sharePrice } = data.inputs;
    if (sharePrice <= 0) return -1;

    const { yearByYearProjections } = data;

    // 1) Check ratio with the "initial" value (if you want time=0 check)
    if (data.inputs.initialEPS && data.method === 'eps') {
      const r0 = sharePrice / data.inputs.initialEPS;
      if (r0 <= 1) return 0; // Already below 1 at time=0
    } else if (data.inputs.initialFCF && data.method === 'fcf') {
      const r0 = sharePrice / data.inputs.initialFCF;
      if (r0 <= 1) return 0;
    }

    // 2) Iterate over all yearly projections
    for (let i = 0; i < yearByYearProjections.length; i++) {
      const valThisYear = accessor(yearByYearProjections[i]);
      if (!valThisYear || valThisYear <= 0) continue;

      const ratioThisYear = sharePrice / valThisYear;
      console.log(
        `Year ${yearByYearProjections[i].year}: Ratio = ${ratioThisYear}`,
      );
      if (ratioThisYear <= 1) {
        // Ratio is already <= 1 at the start of this year
        return yearByYearProjections[i].year;
      }

      // If there's a next year to interpolate with, see if ratio crosses 1 in between
      if (i + 1 < yearByYearProjections.length) {
        const valNextYear = accessor(yearByYearProjections[i + 1]);
        if (valNextYear && valNextYear > 0) {
          const ratioNextYear = sharePrice / valNextYear;
          console.log(
            `Year ${
              yearByYearProjections[i + 1].year
            }: Next Ratio = ${ratioNextYear}`,
          );
          if (ratioThisYear > 1 && ratioNextYear < 1) {
            // Linear interpolation between years i and i+1
            const dy = ratioThisYear - ratioNextYear;
            const dt = (ratioThisYear - 1) / dy;
            // "yearByYearProjections[i].year" is the start of this interval
            // Add the fraction dt to get the fractional year where ratio hits 1
            const fractionalYear = yearByYearProjections[i].year + dt;
            console.log(`Interpolated Year: ${fractionalYear}`);
            return parseFloat(fractionalYear.toFixed(1));
          }
        }
      }
    }

    // 3) If still not reached, extend with terminal growth for up to 50 years
    let lastYear =
      yearByYearProjections[yearByYearProjections.length - 1]?.year || 0;
    let lastVal =
      accessor(yearByYearProjections[yearByYearProjections.length - 1]) || 0;
    const terminalRate = parseFloat(data.growthAnalysis.endingGrowthRate) / 100;

    for (let i = 1; i <= 50; i++) {
      const prevRatio = sharePrice / lastVal;
      lastVal *= 1 + terminalRate;
      const nextRatio = sharePrice / lastVal;
      lastYear++;
      console.log(`Extended Year ${lastYear}: Ratio = ${nextRatio}`);

      // If it crosses between lastVal(old) and lastVal(new), do another interpolation
      if (prevRatio > 1 && nextRatio <= 1) {
        const dy = prevRatio - nextRatio;
        const dt = (prevRatio - 1) / dy;
        const fractionalYear = lastYear - 1 + dt;
        console.log(`Interpolated Extended Year: ${fractionalYear}`);
        return parseFloat(fractionalYear.toFixed(1));
      }

      if (nextRatio <= 1) {
        return lastYear;
      }
    }

    // Not reached within 50 extended years
    return -1;
  }

  /**
   * Calculates how many years it takes for P/E >= 1 to drop to or below 1.
   * @param data ProjectionData with EPS
   * @returns Year or -1 if not reached
   */
  static calculateTimeToPEOne(data: ProjectionData): number {
    return this.calculateTimeToOne(data, (p) => p.eps);
  }

  /**
   * Calculates how many years it takes for P/FCF >= 1 to drop to or below 1.
   * @param data ProjectionData with FCF
   * @returns Year or -1 if not reached
   */
  static calculateTimeToPFCFOne(data: ProjectionData): number {
    return this.calculateTimeToOne(data, (p) => p.fcf);
  }
}
