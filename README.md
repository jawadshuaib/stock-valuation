# Stock Valuation Calculator

This repository provides a comprehensive stock valuation tool built using React, TypeScript, and Tailwind CSS, with ESLint and Prettier for code quality and formatting. The tool implements core financial concepts to calculate the intrinsic value of a stock using both Earnings Per Share (EPS) and Free Cash Flow (FCF) methodologies.

Live example: https://stock-valuation.netlify.app/

## Key Features

- **Growth Rate Modeling**: Simulates growth rate decay over time, transitioning from high initial growth to a sustainable terminal growth rate. This is quite sophisticated so I have provided more explanation in the [Growth Rate Decay Explanation](./documentation/GrowthRateDecayExplanation.md) section.
- **Discounted Cash Flow Analysis**: Computes the intrinsic value of a stock by discounting projected earnings or free cash flows to their present value.
- **Validation Layer**: Ensures input parameters are realistic and consistent with economic principles.
- **Configurable Parameters**: Allows users to adjust settings like projection years, margin of safety, and growth thresholds.
- **Detailed Growth Analysis**: Provides year-by-year projections of EPS, FCF, growth rates, and present values.
- **Payback Time Calculator**: Computes the payback time to generate an amount of cash flow sufficient to recover the initial investment.

## Financial Concepts Behind the Tool

### 1. **Earnings Per Share (EPS)**

EPS is a key metric in valuing a company's profitability. It represents the portion of a company's profit allocated to each outstanding share of common stock. This tool uses EPS as the baseline for projecting future earnings.

### 2. **Free Cash Flow (FCF)**

FCF is a measure of a company's financial performance, calculated as operating cash flow minus capital expenditures. It represents the cash a company generates after accounting for cash outflows to support operations and maintain its capital assets. This tool uses FCF as an alternative baseline for intrinsic value calculation.

### 3. **Free Cash Flow for Free (FCF for Free)**

The Free Cash Flow for Free metric measures how quickly the net present value of a company's projected free cash flows can potentially cover the difference between its market cap and net current assets. This metric provides insight into the time it takes for an investment to generate enough free cash flow to cover the premium paid over the company's net current assets, indicating the safety and comparative value of the investment. See detailed documentation [`FreeCashFlowForFreeExplanation.md`](documentation/FreeCashFlowForFreeExplanation.md)

### 4. **Growth Rate Decay**

High-growth companies typically experience a decline in growth over time due to market saturation, competitive pressures, and scalability limits. This tool models this decay using exponential functions to transition from an initial growth rate to a terminal growth rate. See detailed documentation [`GrowthRateDecayExplanation.md`](documentation/GrowthRateDecayExplanation.md)

### 5. **Discount Rate**

The discount rate reflects the required rate of return for an investor, accounting for risk and the time value of money. It is used to calculate the present value of future cash flows.

### 6. **Terminal Growth Rate**

This rate represents the sustainable long-term growth a company can achieve. It is usually aligned with GDP growth or inflation, ensuring the valuation remains grounded in economic reality.

### 7. **Margin of Safety**

A margin of safety reduces the intrinsic value estimate to account for uncertainties in assumptions, ensuring a conservative investment decision.

### 8. **Payback Time**

Payback time is the period it takes for an investment to generate an amount of cash flow or profits equivalent to the initial investment amount.

### 9. **Half Life**

The Half Life metric measures the time it takes for an investment to become twice as cheap based on its growth trajectory. This metric provides insight into the growth potential of an investment relative to its current price. Companies with a shorter half life are considered to have higher growth potential. See detailed documentation [`HalfLifeExplanation.md`](documentation/HalfLifeExplanation.md)

---

## API Endpoints

This project provides two API endpoints for calculating the intrinsic value of a stock using either Earnings Per Share (EPS) or Free Cash Flow (FCF).

These API's can be integrated into 3rd party app, or used in Google Sheets to directly calculate the intrinsic value through available data.

Example: https://stock-valuation.netlify.app/.netlify/functions/calculateEPS?sharePrice=468&eps=10&growthRate=9&terminalGrowthRate=3&discountRate=15&marginOfSafety=50

### Calculate Intrinsic Value using EPS

- **Endpoint**: `/calculateUsingEPS`
- **Method**: `GET`
- **Description**: Returns the intrinsic value and margin of safety price based on Earnings Per Share (EPS).
- **Query Parameters**:
  - `sharePrice` (required): The current share price of the stock.
  - `eps` (required): The earnings per share of the stock.
  - `growthRate` (required): The expected growth rate of the stock.
  - `terminalGrowthRate` (required): The terminal growth rate of the stock.
  - `discountRate` (required): The discount rate to be used in the calculation.
  - `marginOfSafety` (required): The margin of safety to be used in the calculation.

### Calculate Intrinsic Value using FCF

- **Endpoint**: `/calculateUsingFCF`
- **Method**: `GET`
- **Description**: Returns the intrinsic value and margin of safety price based on Free Cash Flow (FCF).
- **Query Parameters**:

  - `sharePrice` (required): The current share price of the stock.
  - `fcf` (required): The free cash flow of the stock.
  - `growthRate` (required): The expected growth rate of the stock.
  - `terminalGrowthRate` (required): The terminal growth rate of the stock.
  - `discountRate` (required): The discount rate to be used in the calculation.
  - `marginOfSafety` (required): The margin of safety to be used in the calculation.
  - `outstandingShares` (required): The number of outstanding shares of the stock.

  ***

## Technical Stack

- **React**: Frontend framework for building user interfaces.
- **TypeScript**: Strongly typed language to enhance code reliability.
- **Vite**: Lightning-fast build tool for modern web development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ESLint & Prettier**: For code quality and consistent formatting.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:jawadshuaib/stock-valuation.git YOUR_PROJECT_NAME
cd YOUR_PROJECT_NAME
```

### 2. Remove the Existing GitHub Repo

```bash
git remote remove origin
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

---

## How the Code Works

### 1. **Input Validation**

The `StockInputValidator` class ensures all input parameters are consistent with economic and financial principles. For example:

- Terminal growth rates must be lower than the discount rate.
- EPS must be positive to ensure meaningful valuation.

### 2. **Growth Calculation**

The `GrowthCalculator` class models how a company's growth transitions from an initial rate to a terminal rate over time. It accounts for faster decay in high-growth companies compared to stable ones.

### 3. **Present Value Calculation**

The `PresentValueCalculator` class computes the present value of future earnings or free cash flows using the discount rate, enabling precise valuation.

### 4. **Intrinsic Value Calculation**

The `IntrinsicValueCalculator` class combines:

- Year-by-year projections of EPS, FCF, and growth.
- The terminal value of the company after the projection period.
- A margin of safety to account for uncertainties.

### 5. **Configuration**

The `ValuationConfig` class defines:

- Default settings such as the projection period and margin of safety.
- Limits on growth rates and discount rates to ensure realistic projections.
- Growth categories (e.g., High Growth, Moderate Growth) to classify companies.

---

## Example Workflow

1. Input your stock's EPS, FCF, growth rate, terminal growth rate, and discount rate.
2. The tool:
   - Validates the inputs.
   - Projects EPS or FCF growth for the next 10 years.
   - Calculates the terminal value and discounts all cash flows to their present value.
   - Provides an intrinsic value and a margin of safety price.
3. Analyze the results, including detailed growth profiles and year-by-year projections.

---

## Contributions

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

## License

This project is licensed under the MIT License.

---
