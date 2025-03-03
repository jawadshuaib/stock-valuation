# Reverse DCF Calculator

## Overview

The Reverse DCF (Discounted Cash Flow) Calculator is a financial tool used to determine the implied initial growth rate of a stock given its current market price, free cash flow (FCF) or earnings per share (EPS), discount rate, terminal growth rate, and other parameters. This method helps investors understand the growth expectations embedded in the current stock price.

## Usefulness

The Reverse DCF Calculator is particularly useful for investors who want to:

- **Understand Market Expectations**: By calculating the implied growth rate, investors can see what growth rate the market is pricing into the stock. This helps in assessing whether the stock is overvalued or undervalued based on the investor's own growth expectations.
- **Compare with Own Projections**: Investors can compare the implied growth rate with their own projections to make more informed investment decisions.
- **Assess Risk**: Understanding the growth expectations can help in assessing the risk associated with the investment. If the implied growth rate is very high, it may indicate higher risk.

## Calculation Methodology

The `ReverseDCFCalculator` uses an exponential decay model for the growth rate. This model provides a more realistic projection of growth rates over time compared to a constant growth rate assumption. The dynamic growth rate for year `n` is calculated as:

\[ \text{dynamicGrowthRate}(n) = \text{terminalGrowthRate} + (\text{initialGrowthRate} - \text{terminalGrowthRate}) \times \exp(-\text{decayFactor} \times (n - 1)) \]

### Steps

1. **Determine the Base Value**:

   - For the FCF method, the base value is the initial free cash flow (`initialFCF`).
   - For the EPS method, the base value is the initial earnings per share (`initialEPS`).

2. **Calculate the Market's Intrinsic Value**:

   - For the FCF method, the intrinsic value is calculated as: `sharePrice * outstandingShares`.
   - For the EPS method, the intrinsic value is simply the `sharePrice` (per-share valuation).

3. **DCF Calculation**:

   - For each year in the projection period, calculate the dynamic growth rate using the exponential decay model.
   - Update the value for each year based on the dynamic growth rate.
   - Discount the value to the present value using the discount rate.
   - Calculate the terminal value using the terminal growth rate and discount it to the present value.

4. **Binary Search for Implied Growth Rate**:
   - Use a binary search to find the implied initial growth rate that makes the present value of the projected values equal to the market's intrinsic value.

## Advantages Over Regular Reverse DCF

The exponential decay model used in this Reverse DCF Calculator offers several advantages over the regular reverse DCF method:

- **Realistic Growth Projections**: The exponential decay model provides a more realistic projection of growth rates over time, reflecting the natural decline in growth rates as companies mature.
- **Flexibility**: The model allows for different initial and terminal growth rates, providing more flexibility in modeling various growth scenarios.
- **Accuracy**: By using a dynamic growth rate, the model can more accurately reflect the expected cash flows or earnings, leading to a more precise calculation of the implied growth rate.
- **Risk Assessment**: The model helps in better assessing the risk associated with the investment by providing a clearer picture of the growth expectations embedded in the stock price.

## Conclusion

The Reverse DCF Calculator is a powerful tool for investors to understand the growth expectations embedded in a stock's current price. By calculating the implied growth rate using an exponential decay model, investors can make more informed decisions about whether a stock is fairly valued, overvalued, or undervalued based on their own growth expectations. This method offers a more realistic and flexible approach compared to regular reverse DCF, making it a valuable addition to any investor's toolkit.
