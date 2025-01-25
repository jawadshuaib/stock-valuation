# Monte Carlo Intrinsic Value Calculator Explanation

This document explains the rationale, methodology, and statistical models used in the `MonteCarloIntrinsicValueCalculator` class for calculating the intrinsic value of a stock using Monte Carlo simulations.

---

## 1. Introduction

The `MonteCarloIntrinsicValueCalculator` class performs a series of Monte Carlo simulations to estimate the intrinsic value of a stock. This approach allows for the incorporation of uncertainty and variability in key financial parameters, providing a more robust valuation.

---

## 2. Monte Carlo Simulation

Monte Carlo simulation is a statistical technique that uses random sampling to approximate complex mathematical models. In the context of stock valuation, it helps to account for the uncertainty in growth rates, discount rates, and other financial metrics.

### 2.1 Key Parameters

- **Growth Rate**: The initial growth rate of the company.
- **Terminal Growth Rate**: The long-term sustainable growth rate.
- **Discount Rate**: The required rate of return, reflecting the time value of money and risk.
- **Projection Years**: The number of years to project future cash flows.

---

## 3. Statistical Models

### 3.1 Log-Normal Distribution for Growth Rate

The growth rate is modeled using a log-normal distribution to account for positive skewness. This reflects the reality that while most companies will have moderate growth rates, a few might experience exceptionally high growth rates.

$$ \text{Growth Rate} \sim \text{LogNormal}(\mu, \sigma) $$

Where:

$$ \mu = \log(\text{initial growth rate}) $$
$$ \sigma = 0.2 $$

### 3.2 Normal Distribution for Terminal Growth Rate and Discount Rate

Both the terminal growth rate and discount rate are modeled using normal distributions to reflect symmetric variability around their means.

$$ \text{Terminal Growth Rate} \sim \text{Normal}(\mu, \sigma) $$
$$ \text{Discount Rate} \sim \text{Normal}(\mu, \sigma) $$

Where:

$$ \mu = \text{initial terminal growth rate or discount rate} $$
$$ \sigma = 0.01 $$

---

## 4. Simulation Process

### 4.1 Generating Random Inputs

For each simulation, random values for the growth rate, terminal growth rate, and discount rate are generated based on their respective distributions.

### 4.2 Running Simulations

The class runs a specified number of simulations (default: 10,000). For each simulation, it calculates the intrinsic value using either the Free Cash Flow (FCF) or Earnings Per Share (EPS) method.

### 4.3 Handling Validation Errors

If a generated input is out of range, a validation error is logged, and the simulation continues with the next set of inputs.

---

## 5. Analyzing Results

After running all simulations, the results are analyzed to provide key statistical metrics:

### 5.1 Mean and Median

The mean and median intrinsic values are calculated to provide central tendency measures.

$$ \text{Mean} = \frac{1}{n} \sum\_{i=1}^{n} \text{intrinsic value}\_i $$
$$ \text{Median} = \text{sorted intrinsic values}[\frac{n}{2}] $$

### 5.2 Percentiles

The 10th and 90th percentiles are calculated to provide a range of likely intrinsic values.

$$ \text{Percentile}(p) = \text{sorted intrinsic values}[\frac{p}{100} \times n] $$

---

## 6. Conclusion

The `MonteCarloIntrinsicValueCalculator` class provides a robust method for estimating the intrinsic value of a stock by incorporating uncertainty and variability in key financial parameters. By using Monte Carlo simulations, it offers a comprehensive view of potential valuation outcomes, helping investors make more informed decisions.

For a full reference, see [`MonteCarloIntrinsicValueCalculator.ts`](../src/utils/valuations/monte-carlo/MonteCarloIntrinsicValueCalculator.ts).
