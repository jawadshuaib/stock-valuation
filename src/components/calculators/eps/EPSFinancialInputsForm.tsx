import React, { useState, ChangeEvent, useCallback } from 'react';
import InputField from '../../InputField';
import {
  IntrinsicValueCalculator,
  ValidationError,
} from '../../../utils/valuations/eps';
import { debounce } from 'lodash';
import { ValuationData } from '../types';

/**
 * Represents the structure of the financial calculation form data.
 * All values are stored as numbers, with percentage values stored in their natural form
 * (e.g., 18 for 18% rather than 0.18)
 */
interface FormData {
  eps: number; // Earnings Per Share
  growthRate: number; // Annual growth rate as a percentage
  terminalGrowthRate: number; // Long-term growth rate as a percentage
  discountRate: number; // Required rate of return as a percentage
  marginOfSafety: number; // Margin of safety as a percentage
}

/**
 * Default values for the financial calculation form.
 * These values are used to initialize the form and provide a starting point
 * for users to adjust according to their needs.
 */
const DEFAULT_VALUES: FormData = {
  eps: 0, // Starting EPS value
  growthRate: 8, // 18% annual growth
  terminalGrowthRate: 4, // 4% terminal growth
  discountRate: 15, // 15% discount rate
  marginOfSafety: 50, // 50% margin of safety
};

/**
 * Props interface for the FinancialInputsForm component.
 * @property valuateFn - Callback function to handle successful valuation calculations
 * @property valuationErrorFn - Callback function to handle calculation or validation errors
 */
interface FinancialInputsFormProps {
  valuateFn: (valuationData: ValuationData) => void;
  valuationErrorFn: (err: string) => void;
}

/**
 * Configuration for form field rendering.
 * Using 'as const' assertion to ensure type safety when accessing field IDs
 * that correspond to FormData keys.
 */
const FORM_FIELDS = [
  { label: 'Earnings Per Share (EPS)', id: 'eps' },
  { label: 'Growth Rate (%)', id: 'growthRate' },
  { label: 'Terminal Growth Rate (%)', id: 'terminalGrowthRate' },
  { label: 'Discount Rate (%)', id: 'discountRate' },
  { label: 'Margin of Safety (%)', id: 'marginOfSafety' },
] as const;

/**
 * EPSFinancialInputsForm Component
 *
 * A form component that collects financial metrics and calculates intrinsic value.
 * Uses debounced calculations to prevent excessive recalculations during user input.
 *
 * @param props FinancialInputsFormProps
 */
function EPSFinancialInputsForm({
  valuateFn,
  valuationErrorFn,
}: FinancialInputsFormProps) {
  // State to track form input values
  const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES);

  /**
   * Calculates the intrinsic value based on current form data.
   * Converts percentage values to decimals before calculation.
   * Handles both validation and calculation errors.
   *
   * @param data Current form data to use for calculation
   */
  const calculateValuation = useCallback(
    (data: FormData) => {
      try {
        if (data.eps <= 0) {
          throw new ValidationError([
            { code: 'eps', message: 'EPS must be greater than zero' },
          ]);
        }

        // Convert percentage values to decimals for calculation
        const calculator = new IntrinsicValueCalculator({
          eps: data.eps,
          growthRate: data.growthRate / 100,
          terminalGrowthRate: data.terminalGrowthRate / 100,
          discountRate: data.discountRate / 100,
          marginOfSafety: data.marginOfSafety / 100,
        });

        const result = calculator.calculate();
        valuateFn(result.valuation);
      } catch (error) {
        // Handle both validation errors and general calculation errors
        const errorMessage =
          error instanceof ValidationError
            ? `Validation failed: ${error.errors[0].message}`
            : `Calculation error: ${error}`;

        valuationErrorFn(errorMessage);
      }
    },
    [valuateFn, valuationErrorFn],
  );

  /**
   * Debounced version of calculateValuation to prevent excessive calculations
   * during rapid user input. Waits 300ms after the last input before calculating.
   */
  const debouncedValuation = useCallback(debounce(calculateValuation, 300), [
    calculateValuation,
  ]);

  /**
   * Handles changes to form inputs.
   * Updates form state and triggers a debounced calculation.
   *
   * @param event Change event from form input
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: parseFloat(value) };
      debouncedValuation(updatedData);
      return updatedData;
    });
  };

  return (
    <form className="space-y-4">
      <div className="grid gap-6">
        {/* Dynamically render form fields based on FORM_FIELDS configuration */}
        {FORM_FIELDS.map(({ label, id }) => (
          <InputField
            key={id}
            label={label}
            id={id}
            name={id}
            value={formData[id as keyof FormData]}
            onChange={handleChange}
          />
        ))}
      </div>
    </form>
  );
}

export default EPSFinancialInputsForm;
