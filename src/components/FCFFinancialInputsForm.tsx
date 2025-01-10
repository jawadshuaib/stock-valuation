import React, { useState, ChangeEvent, useCallback } from 'react';
import InputField from './InputField';
import { debounce } from 'lodash';
import { ValuationData } from './EPSCalculator'; // Import the corresponding ValuationData
import { ValidationError } from '../utils/valuations/eps';
import { FCFIntrinsicValueCalculator } from '../utils/valuations/fcf';

interface FormData {
  fcf: number; // Initial Free Cash Flow in dollars
  growthRate: number; // Initial growth rate as a percentage
  terminalGrowthRate: number; // Terminal growth rate as a percentage
  discountRate: number; // Discount rate as a percentage
  projectionYears: number; // Projection period in years
  marginOfSafety: number; // Margin of safety as a percentage
  outstandingShares: number; // Number of shares outstanding
}

const DEFAULT_VALUES: FormData = {
  fcf: 0, // Initial Free Cash Flow
  growthRate: 15, // 15% annual growth
  terminalGrowthRate: 4, // 4% terminal growth
  discountRate: 15, // 10% discount rate
  projectionYears: 10, // 10 years projection
  marginOfSafety: 50, // 20% margin of safety
  outstandingShares: 1, // 100,000 shares outstanding
};

interface FinancialInputsFormProps {
  valuateFn: (valuationData: ValuationData) => void;
  valuationErrorFn: (err: string) => void;
}

const FORM_FIELDS = [
  { label: 'Free Cash Flow (FCF)', id: 'fcf' },
  { label: 'Growth Rate (%)', id: 'growthRate' },
  { label: 'Terminal Growth Rate (%)', id: 'terminalGrowthRate' },
  { label: 'Discount Rate (%)', id: 'discountRate' },
  { label: 'Projection Years', id: 'projectionYears' },
  { label: 'Margin of Safety (%)', id: 'marginOfSafety' },
  { label: 'Outstanding Shares', id: 'outstandingShares' },
] as const;

function FCFFinancialInputsForm({
  valuateFn,
  valuationErrorFn,
}: FinancialInputsFormProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES);

  const calculateValuation = useCallback(
    (data: FormData) => {
      try {
        if (data.fcf <= 0) {
          throw new ValidationError([
            { code: 'fcf', message: 'FCF must be greater than zero' },
          ]);
        }

        const calculator = new FCFIntrinsicValueCalculator({
          fcf: data.fcf,
          growthRate: data.growthRate / 100,
          terminalGrowthRate: data.terminalGrowthRate / 100,
          discountRate: data.discountRate / 100,
          projectionYears: data.projectionYears,
          marginOfSafety: data.marginOfSafety / 100,
          outstandingShares: data.outstandingShares,
        });

        const result = calculator.calculate();
        valuateFn(result.valuation);
      } catch (error) {
        const errorMessage =
          error instanceof ValidationError
            ? `Validation failed: ${error.errors[0].message}`
            : `Calculation error: ${error}`;

        valuationErrorFn(errorMessage);
      }
    },
    [valuateFn, valuationErrorFn],
  );

  const debouncedValuation = useCallback(debounce(calculateValuation, 300), [
    calculateValuation,
  ]);

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
