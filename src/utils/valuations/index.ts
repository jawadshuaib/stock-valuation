/**
 * Stock Valuation System
 * ---------------------
 * This system implements Discounted Cash Flow (DCF) valuation with growth decay.
 *
 * Key Valuation Concepts:
 * 1. Present Value: Future cash flows discounted to today's value
 * 2. Growth Decay: Recognition that high growth rates naturally decline over time
 * 3. Terminal Value: Company's value beyond the projection period
 * 4. Margin of Safety: Buffer against estimation errors
 *
 * Mathematical Foundation:
 * - Present Value = FutureValue / (1 + r)^n
 * - Growth Decay = TerminalGrowth + (InitialGrowth - TerminalGrowth) * e^(-kt)
 * - Terminal Value = FinalEPS * (1 + g) / (r - g)
 *
 * where:
 * r = discount rate
 * n = number of years
 * g = growth rate
 * k = decay factor
 * t = time in years
 *
 * @author jawadshuaib
 */
export { default as GrowthCalculator } from './GrowthCalculator';
export { default as PresentValueCalculator } from './PresentValueCalculator';
export { default as StockInputValidator } from './StockInputValidator';
export { default as ValuationConfig } from './ValuationConfig';
