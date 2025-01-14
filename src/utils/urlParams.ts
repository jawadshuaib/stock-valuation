// FILE: urlParams.ts

import { EPSFormData, FCFFormData } from '../components/calculators/types';

// Define a type that can be either EPSFormData or FCFFormData
type FormData = EPSFormData | FCFFormData;

/**
 * Function to get prefilled values from URL parameters.
 *
 * This function takes default form values and checks if there are corresponding
 * URL parameters. If URL parameters are found, it updates the default values
 * with the values from the URL parameters.
 *
 * @param defaultValues - The default values for the form fields.
 * @returns The updated form values with any prefilled values from the URL parameters.
 */
export const getPrefilledValues = <T extends FormData>(defaultValues: T): T => {
  // Parse the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  // Create a copy of the default values to update
  const prefilledValues = { ...defaultValues };

  // Iterate over each key in the default values
  Object.keys(defaultValues).forEach((key) => {
    // Get the corresponding URL parameter value
    const paramValue = urlParams.get(key);
    // If a URL parameter is found, update the prefilled values
    if (paramValue !== null) {
      prefilledValues[key as keyof T] = parseFloat(paramValue) as T[keyof T];
    }
  });

  // Return the updated form values
  return prefilledValues;
};
