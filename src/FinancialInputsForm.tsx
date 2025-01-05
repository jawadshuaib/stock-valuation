import React, { useState, ChangeEvent } from 'react';
import InputField from './InputField';
import { IntrinsicValueCalculator, ValidationError } from './utils/valuations';
import { ValuationData } from './App';

// Define types for the form data state
interface FormData {
  eps: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  marginOfSafety: number;
}

const DEFAULT_VALUES: FormData = {
  eps: 0,
  growthRate: 18,
  terminalGrowthRate: 4,
  discountRate: 15,
  marginOfSafety: 50,
};

interface FinancialInputsFormProps {
  setValuation: (valuation: ValuationData) => void;
}

function FinancialInputsForm({ setValuation }: FinancialInputsFormProps) {
  // Initialize state for the form inputs
  const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES);

  // Handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update state with new value
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: parseFloat(value),
      };

      try {
        const calculator = new IntrinsicValueCalculator({
          eps: updatedData.eps,
          growthRate: updatedData.growthRate / 100,
          terminalGrowthRate: updatedData.terminalGrowthRate / 100,
          discountRate: updatedData.discountRate / 100,
          marginOfSafety: updatedData.marginOfSafety / 100,
        });

        const result = calculator.calculate();

        // console.log('Intrinsic Value', result.valuation.intrinsicValue);
        // console.log('Margin of Safety', result.valuation.marginOfSafetyPrice);

        setValuation(result.valuation);
      } catch (error) {
        if (error instanceof ValidationError) {
          console.error('Validation failed:', error.errors);
        } else {
          console.error('Calculation error:', error);
        }
      }
      return updatedData;
    });
  };

  return (
    <form>
      <InputField
        label="EPS"
        id="eps"
        name="eps"
        value={formData.eps}
        onChange={handleChange}
      />

      <InputField
        label="Growth Rate"
        id="growthRate"
        name="growthRate"
        value={formData.growthRate}
        onChange={handleChange}
      />

      <InputField
        label="Terminal Growth Rate"
        id="terminalGrowthRate"
        name="terminalGrowthRate"
        value={formData.terminalGrowthRate}
        onChange={handleChange}
      />

      <InputField
        label="Discount Rate"
        id="discountRate"
        name="discountRate"
        value={formData.discountRate}
        onChange={handleChange}
      />

      <InputField
        label="Margin of Safety"
        id="marginOfSafety"
        name="marginOfSafety"
        value={formData.marginOfSafety}
        onChange={handleChange}
      />
    </form>
  );
}

export default FinancialInputsForm;
