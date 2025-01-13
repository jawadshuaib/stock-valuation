# Growth Rate Decay Explanation

This document explains the rationale behind the **growth rate decay** logic used in our valuation model. It provides insight into **why** growth decay is important, **how** we calculate it, and **what** makes the chosen decay factors reasonable in a financial modeling context.

---

## 1. Why Do We Decay Growth Rates?

In most Discounted Cash Flow (DCF) valuations, **initial growth** rates (e.g., 20–30% for high-growth companies) cannot be sustained indefinitely. Competition, market saturation, and macroeconomic factors usually pull growth closer to GDP or inflation rates (commonly 2–4%) over time.

By applying a decaying growth rate:

1. We avoid **over-optimistic projections** that inflate the valuation.
2. We align with **real-world observations** that rapid early growth typically tapers off.

---

## 2. Checking the Decay Factors

### 2.1 Declared Decay Factors

We define three baseline **decay factors** for different growth categories:

- **High Growth**: 0.35
- **Moderate Growth**: 0.25
- **Low Growth**: 0.15

Additionally, for **very high** growth rates (above 20%), we add an **extra decay** up to `+0.10`. This helps ensure that extremely high-growth scenarios (e.g., 40%+) come back to a realistic long-term rate by the end of the projection period.

### 2.2 Exponential Decay Intuition

We use an **exponential decay** formula:

    growthRate(t)
    = terminalGrowth
      + (initialGrowth - terminalGrowth) * e^(-decayFactor * t)

- A **larger** `decayFactor` drives the growth rate down **faster** toward the terminal growth rate.
- A **smaller** `decayFactor` slows convergence, keeping growth elevated longer.

A simple “rule of thumb” is to look at the **half-life** of the spread `(initialGrowth - terminalGrowth)`. For instance, with `decayFactor = 0.35`, the gap halves approximately every 2 years. This ensures that high-growth companies quickly approach more stable levels.

---

## 3. Interpolation Logic

Rather than abrupt **cutoffs** at growth thresholds (e.g., 10% or 20%), we **interpolate** the decay factor when the initial growth rate falls between the defined categories. This prevents discontinuities—ensuring, for example, that a growth rate of 19.9% doesn’t jump to a drastically different decay factor at 20.0%. Instead, it **smoothly scales** between the moderate and high growth categories.

---

## 4. Examples

To illustrate, assume a **terminalGrowth** of 3% and a 10-year horizon.

1. **High Growth Example**

   - Initial Growth: 25%
   - Decay Factor: 0.35 (plus potential extra if above 20%)
   - By Year 10, the growth rate will converge close to the 3% terminal rate because of the faster decay.

2. **Moderate Growth Example**

   - Initial Growth: 12%
   - Decay Factor: 0.25 (based on the “moderate” category)
   - Growth still declines each year, reaching near 3% by the end of Year 10.

3. **Low Growth Example**
   - Initial Growth: 6%
   - Decay Factor: 0.15 (the slowest decay)
   - Takes longer to converge, but still moves from 6% down toward 3% over the course of the projection.

---

## 5. Conclusion: Are These Decays Reasonable?

1. **Realistic Over 10 Years**  
   By the end of a typical 10-year DCF projection, it is prudent for most companies to be near or at a stable, long-term growth rate.

2. **Avoiding Over-Optimism**  
   Extra decay for very high growth (> 20%) prevents unrealistic valuations.

3. **Smooth Transitions**  
   Interpolation between growth categories stops sharp jumps in decay factors at threshold boundaries.

Overall, these decay factors and the exponential model align well with **conservative financial valuation practices**. They provide a **reasonable glide path** from high (or moderate) initial growth down to a **terminal**, often GDP- or inflation-linked growth rate.

---

## Related Code Snippets

Below is a snippet illustrating where these decay factors are defined and calculated. For a full reference, see [`ValuationConfig.ts`](./ValuationConfig.ts) and [`GrowthCalculator.ts`](./GrowthCalculator.ts).

    // In ValuationConfig.ts
    static DECAY_FACTORS = {
      HIGH_GROWTH: 0.35,
      MODERATE_GROWTH: 0.25,
      LOW_GROWTH: 0.15,
    };

    // ...

    static calculateDecayFactor(initialGrowthRate: number): number {
      // ...
    }

    // In GrowthCalculator.ts
    calculateGrowthRate(year: number): number {
      const growthSpread = this.initialGrowth - this.terminalGrowth;
      return (
        this.terminalGrowth + growthSpread * Math.exp(-this.decayFactor * year)
      );
    }

---

> **Disclaimer**: These assumptions and constants are illustrative and may not suit every market condition or individual company. Always review and adjust growth decay assumptions based on your **actual market research** and **company-specific insights**.
