# Half Life Explanation

This document explains the rationale behind the **Half Life** calculation used in our valuation model. It provides insight into **why** this metric is important, **how** we calculate it, and **what** makes the chosen methodology reasonable in a financial modeling context.

---

## 1. Why Calculate Half Life?

The **Half Life** metric measures the time it takes for an investment to become twice as cheap based on its growth trajectory. This metric is useful for several reasons:

1. **Valuation Insight**: It provides a clear indication of how quickly an investment's valuation will improve relative to its growth.
2. **Investment Potential**: A shorter half life suggests a higher growth potential relative to the current price, making the investment more attractive.
3. **Comparative Analysis**: It allows investors to compare different companies and investments based on their growth potential and current valuation.

---

## 2. Financial Context

### 2.1 Price to Earnings (P/E) and Price to Free Cash Flow (P/FCF) Ratios

- **P/E Ratio**: The ratio of a company's share price to its earnings per share (EPS). It indicates how much investors are willing to pay for each dollar of earnings.
- **P/FCF Ratio**: The ratio of a company's share price to its free cash flow (FCF). It indicates how much investors are willing to pay for each dollar of free cash flow.

### 2.2 Half Life Calculation

The **half life** is calculated as the time it takes for the P/E or P/FCF ratio to reach half its initial value.

---

## 3. Mathematical Calculation

### 3.1 Initial Ratio Calculation

The initial ratio is calculated based on the share price and the initial EPS or FCF:

    Initial Ratio = Share Price / Initial EPS (or Initial FCF)

### 3.2 Projected Value Calculation

For each year, we project the EPS or FCF and calculate the ratio:

    Projected Ratio = Share Price / Projected EPS (or Projected FCF)

### 3.3 Half Life Calculation

We iterate over the projected values and determine the year in which the ratio reaches half or below its initial value:

    Half Life = Year in which Projected Ratio <= Initial Ratio / 2

### 3.4 Example Calculation

Assume the following data:

- Share Price: $207
- Initial EPS: $10
- Initial Ratio (P/E): 207 / 10 = 20.7
- Projected EPS for the next 10 years

We calculate the projected ratio for each year and determine the half life:

    Year 1: Projected EPS = $12, Projected Ratio = 207 / 12 = 17.25
    Year 2: Projected EPS = $14, Projected Ratio = 207 / 14 = 14.79
    ...

We continue this process until the projected ratio meets or falls below half the initial ratio:

    Half of Initial Ratio: 20.7 / 2 = 10.35
    Year 3: Projected EPS = $21, Projected Ratio = 207 / 21 = 9.86

In this example, the projected ratio falls below half the initial ratio in the third year, resulting in a **half life** of 3 years.

---

## 4. Conclusion: Importance of Half Life

1. **Realistic Valuation**: By considering the time it takes for the ratio to reach half its initial value, investors can make more informed decisions.
2. **Growth Potential**: A shorter half life indicates higher growth potential relative to the current price, making the investment more attractive.
3. **Comparative Analysis**: This metric allows for effective comparison between different companies and investments based on their growth potential and current valuation.

Overall, the **Half Life** calculation provides a valuable metric for assessing the financial health and investment potential of a company. It aligns with conservative financial valuation practices and offers a reasonable approach to evaluating a company's growth trajectory.

---

## Related Code Snippets

Below is a snippet illustrating the calculation of Half Life. For a full reference, see [`half-life.ts`](../src/utils/valuations/half-life/half-life.ts).

```typescript
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
```
