import React, { useState, ChangeEvent, useCallback } from 'react';
import InputField from '../../ui/InputField';
import { debounce } from 'lodash';
import { FCFIntrinsicValueCalculator } from '../../../utils/valuations/fcf';
import { ProjectionData } from '../types';
import { ValidationError } from '../../../utils/valuations';

// Define the form data structure
interface FormData {
  fcf: number; // Initial Free Cash Flow in dollars
  growthRate: number; // Initial growth rate as a percentage
  terminalGrowthRate: number; // Terminal growth rate as a percentage
  discountRate: number; // Discount rate as a percentage
  projectionYears: number; // Projection period in years
  marginOfSafety: number; // Margin of safety as a percentage
  outstandingShares: number; // Number of shares outstanding
}

// Default values for the form fields
const DEFAULT_VALUES: FormData = {
  fcf: 0, // Initial Free Cash Flow
  growthRate: 0, // Initial growth rate
  terminalGrowthRate: 4, // Terminal growth rate
  discountRate: 15, // Discount rate
  projectionYears: 10, // Projection period
  marginOfSafety: 50, // Margin of safety
  outstandingShares: 0, // Number of shares outstanding
};

// Form field configuration
const FORM_FIELDS = [
  { label: 'Free Cash Flow (FCF)', id: 'fcf' },
  { label: 'Issued Shares', id: 'outstandingShares' },
  { label: 'Growth Rate (%)', id: 'growthRate' },
  { label: 'Terminal Growth Rate (%)', id: 'terminalGrowthRate' },
  { label: 'Discount Rate (%)', id: 'discountRate' },
  { label: 'Projection Years', id: 'projectionYears' },
  { label: 'Margin of Safety (%)', id: 'marginOfSafety' },
] as const;

// Component props
interface FinancialInputsFormProps {
  valuateFn: (resultData: ProjectionData) => void;
  valuationErrorFn: (err: string) => void;
}

/**
 * FCFFinancialInputsForm Component
 * A form component that collects financial metrics and calculates intrinsic value.
 * Uses debounced calculations to prevent excessive recalculations during user input.
 *
 * @param props FinancialInputsFormProps
 */
function FCFFinancialInputsForm({
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
      // Check if any form value is zero or less
      const keys = Object.keys(data) as Array<keyof FormData>;
      for (const key of keys) {
        if (data[key] <= 0) {
          return; // Early return if any field is zero or less
        }
      }

      try {
        // Convert percentage values to decimals for calculation
        const calculator = new FCFIntrinsicValueCalculator({
          method: 'fcf',
          fcf: data.fcf,
          growthRate: data.growthRate / 100,
          terminalGrowthRate: data.terminalGrowthRate / 100,
          discountRate: data.discountRate / 100,
          projectionYears: data.projectionYears,
          marginOfSafety: data.marginOfSafety / 100,
          outstandingShares: data.outstandingShares,
        });

        const result = calculator.calculate();
        valuateFn(result);
      } catch (error) {
        // Handle both validation errors and general calculation errors
        let errorMessage = 'Calculation error';
        if (error instanceof ValidationError) {
          errorMessage = `Validation failed: ${error.errors
            .map((e) => e.message)
            .join(', ')}`;
        } else if (error instanceof Error) {
          errorMessage = `Calculation error: ${error.message}`;
        }
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

export default FCFFinancialInputsForm;
