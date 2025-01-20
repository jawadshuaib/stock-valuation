# Free Cash Flow for Free Explanation

This document explains the rationale behind the **Free Cash Flow for Free (FCF for Free)** calculation used in our valuation model. It provides insight into **why** this metric is important, **how** we calculate it, and **what** makes the chosen methodology reasonable in a financial modeling context.

---

## 1. Why Calculate Free Cash Flow for Free?

The **Free Cash Flow for Free** metric measures how quickly the net present value of a company's projected free cash flows can potentially cover the difference between its market cap and net current assets. This metric is crucial for several reasons:

1. **Valuation Insight**: It provides a clear indication of how long it will take for an investment to generate enough free cash flow to cover the premium paid over the company's net current assets.
2. **Investment Safety**: A shorter FCF for Free time suggests a safer investment, as the company can quickly generate enough cash flow to cover the premium.
3. **Comparative Analysis**: It allows investors to compare different companies and investments based on their ability to generate free cash flow relative to their market cap and net current assets.

---

## 2. Financial Context

### 2.1 Market Cap and Net Current Assets

- **Market Cap**: The total market value of a company's outstanding shares.
- **Net Current Assets (NCAV)**: The difference between a company's current assets and current liabilities. It represents the company's near-liquid assets.

### 2.2 Premium Calculation

The **premium** is calculated as:

    Premium = Market Cap - NCAV

This premium represents the amount investors are paying over the company's net current assets.

---

## 3. Mathematical Calculation

### 3.1 Discounted Cash Flow (DCF)

To calculate the FCF for Free time, we use the **Discounted Cash Flow (DCF)** method to project future free cash flows and discount them to their present value.

### 3.2 Present Value Calculation

The present value of a future cash flow is calculated using the formula:

    PV = FV / (1 + r)^n

Where:

- **PV**: Present Value
- **FV**: Future Value (projected free cash flow)
- **r**: Discount Rate
- **n**: Number of years

### 3.3 Accumulated Cash Flow

We accumulate the discounted cash flows year by year until the total accumulated cash flow meets or exceeds the premium. The year in which this occurs is the **FCF for Free time**.

### 3.4 Example Calculation

Assume the following data:

- Market Cap: $3,904,631,591
- NCAV: $3,324,322,944
- Premium: $580,308,647
- Discount Rate: 15%
- Projected Free Cash Flows (FCF) for the next 10 years

We calculate the present value of each year's FCF and accumulate them:

    Year 1: PV = 603,503,101.69 / (1 + 0.15)^1 = 524,785,305.81
    Year 2: PV = 643,482,675.38 / (1 + 0.15)^2 = 486,565,350.01
    Year 3: PV = 681,913,460.68 / (1 + 0.15)^3 = 448,369,169.51
    ...

We continue this process until the accumulated cash flow meets or exceeds the premium:

    Accumulated Cash Flow by Year 1: 524,785,305.81
    Accumulated Cash Flow by Year 2: 1,011,350,655.82
    ...

In this example, the accumulated cash flow exceeds the premium in the first year, resulting in an **FCF for Free time** of 1 year.

---

## 4. Conclusion: Importance of FCF for Free

1. **Realistic Valuation**: By considering the time it takes for free cash flows to cover the premium, investors can make more informed decisions.
2. **Risk Assessment**: A shorter FCF for Free time indicates a lower risk investment, as the company can quickly generate enough cash flow to cover the premium.
3. **Comparative Analysis**: This metric allows for effective comparison between different companies and investments based on their ability to generate free cash flow relative to their market cap and net current assets.

Overall, the **Free Cash Flow for Free** calculation provides a valuable metric for assessing the financial health and investment potential of a company. It aligns with conservative financial valuation practices and offers a reasonable approach to evaluating a company's ability to generate future cash flow.

---

## Related Code Snippets

Below is a snippet illustrating the calculation of FCF for Free. For a full reference, see [`fcf-for-free.ts`](../src/utils/valuations/fcf-for-free/fcf-for-free.ts).

```typescript
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
```
