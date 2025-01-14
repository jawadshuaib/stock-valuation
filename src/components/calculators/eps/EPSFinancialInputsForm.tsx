import React, { useState, ChangeEvent, useCallback } from 'react';
import { Button } from 'flowbite-react';
import InputField from '../../ui/InputField';
import { debounce } from 'lodash';
import { EPSIntrinsicValueCalculator } from '../../../utils/valuations/eps';
import { EPSFormData, ProjectionData } from '../types';
import { ValidationError } from '../../../utils/valuations';
import { Link } from 'react-router-dom';
import SaveModal from '../../ui/SaveModal';
import { getPrefilledValues } from '../../../utils/urlParams';

// Default values for the form fields
const DEFAULT_VALUES: EPSFormData = {
  sharePrice: 0,
  eps: 0,
  growthRate: 0,
  terminalGrowthRate: 0,
  discountRate: 0,
  marginOfSafety: 50,
};

// Get prefilled values from URL parameters if available
const prefilledValues = getPrefilledValues(DEFAULT_VALUES);

// Form field configuration
const FORM_FIELDS = [
  { label: 'Share Price', id: 'sharePrice' },
  { label: 'Earnings Per Share (EPS)', id: 'eps' },
  { label: 'Growth Rate (%)', id: 'growthRate' },
  { label: 'Terminal Growth Rate (%)', id: 'terminalGrowthRate' },
  { label: 'Discount Rate (%)', id: 'discountRate' },
  { label: 'Margin of Safety (%)', id: 'marginOfSafety' },
] as const;

// Component props
interface FinancialInputsFormProps {
  valuateFn: (resultData: ProjectionData) => void;
  valuationErrorFn: (err: string) => void;
}

/**
 * EPSFinancialInputsForm Component
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
  const [formData, setFormData] = useState<EPSFormData>(prefilledValues);
  // Show save button
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  // Modal state
  const [openModal, setOpenModal] = useState(false);
  // State to track if the valuation has been saved
  const [isSaved, setIsSaved] = useState(false);

  /**
   * Calculates the intrinsic value based on current form data.
   * Converts percentage values to decimals before calculation.
   * Handles both validation and calculation errors.
   *
   * @param data Current form data to use for calculation
   */
  const calculateValuation = useCallback(
    (data: EPSFormData) => {
      // Check if any form value is zero or less
      const keys = Object.keys(data) as Array<keyof EPSFormData>;
      for (const key of keys) {
        if (data[key] <= 0) {
          return; // Early return if any field is zero or less
        }
      }

      try {
        // Convert percentage values to decimals for calculation
        const calculator = new EPSIntrinsicValueCalculator({
          method: 'eps',
          sharePrice: data.sharePrice,
          eps: data.eps,
          growthRate: data.growthRate / 100,
          terminalGrowthRate: data.terminalGrowthRate / 100,
          discountRate: data.discountRate / 100,
          marginOfSafety: data.marginOfSafety / 100,
        });

        const result = calculator.calculate();
        valuateFn(result);

        // Show save button
        setShowSaveBtn(true);
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

        // Hide save button
        setShowSaveBtn(false);
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

  /**
   * Handles the save action from the SaveModal.
   */
  const handleSave = (name: string) => {
    const savedValuations = JSON.parse(
      localStorage.getItem('savedValuations') || '[]',
    );

    // Check if an item with the same name already exists
    if (savedValuations.some((item: { name: string }) => item.name === name)) {
      setIsSaved(true);
      setShowSaveBtn(false);
      setOpenModal(false);
      return;
    }

    // Add the new item to the array
    savedValuations.push({ name, data: formData });

    // Save the updated array back to localStorage
    localStorage.setItem('savedValuations', JSON.stringify(savedValuations));

    setIsSaved(true);
    setShowSaveBtn(false);
    setOpenModal(false);
  };

  /**
   * Handles the close action from the SaveModal.
   */
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <section>
      <form className="space-y-4">
        <div className="grid gap-6">
          {/* Dynamically render form fields based on FORM_FIELDS configuration */}
          {FORM_FIELDS.map(({ label, id }) => (
            <InputField
              key={id}
              label={label}
              id={id}
              name={id}
              value={formData[id as keyof EPSFormData]}
              onChange={handleChange}
            />
          ))}
          {/* Show save button or saved message */}
          {showSaveBtn && !isSaved && (
            <>
              <Button onClick={() => setOpenModal(true)} className="text-white">
                Save Valuation
              </Button>
            </>
          )}
          {isSaved && (
            <p className="text-green-500">
              Valuation has been{' '}
              <Link to="/" className="underline hover:text-green-800">
                saved
              </Link>
              .
            </p>
          )}
        </div>
      </form>
      {/* Modal for saving valuation */}
      {openModal && (
        <SaveModal
          show={openModal}
          formData={formData}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </section>
  );
}

export default EPSFinancialInputsForm;
