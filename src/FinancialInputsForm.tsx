import React, { useState, ChangeEvent } from 'react';
import InputField from './InputField';
import { IntrinsicValueCalculator, ValidationError } from './utils/valuations';

// Define types for the form data state
interface FormData {
  eps: number;
  growthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  marginOfSafety: number;
}

const FinancialInputsForm: React.FC = () => {
  // Initialize state for the form inputs
  const [formData, setFormData] = useState<FormData>({
    eps: 0,
    growthRate: 0,
    terminalGrowthRate: 4,
    discountRate: 15,
    marginOfSafety: 50,
  });

  // Handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update state with new value
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: parseFloat(value),
      };
      console.log(updatedData); // Output updated state to console

      try {
        const calculator = new IntrinsicValueCalculator({
          eps: 14.65,
          growthRate: 0.18,
          terminalGrowthRate: 0.04,
          discountRate: 0.15,
          marginOfSafety: 0.5,
        });

        const result = calculator.calculate();

        console.log('Intrinsic Value', result.valuation.intrinsicValue);
        console.log('Margin of Safety', result.valuation.marginOfSafetyPrice);
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
};

export default FinancialInputsForm;
