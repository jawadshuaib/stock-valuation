import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useState, useEffect, ChangeEvent, FocusEvent } from 'react';
import { EPSFormData, FCFFormData } from '../calculators/types';

interface SaveModalProps {
  show: boolean;
  formData: EPSFormData | FCFFormData;
  onSave: (name: string) => void;
  onClose: () => void;
}

function SaveModal({ show, formData, onSave, onClose }: SaveModalProps) {
  // State to store the name input value
  const [name, setName] = useState('');
  // State to store any error messages
  const [error, setError] = useState('');

  // Effect to set the default name to an incremented value when the modal opens
  useEffect(() => {
    if (show) {
      // Retrieve saved items from localStorage
      const savedItems = JSON.parse(
        localStorage.getItem('savedValuations') || '[]',
      );
      // Determine the base name based on the formData type
      const baseName = 'eps' in formData ? 'EPS Valuation' : 'FCF Valuation';
      let newName = `${baseName} 1`;
      let counter = 1;

      // Function to check if the name already exists
      const nameExists = (nm: string) => {
        return savedItems.some((item: { name: string }) => item.name === nm);
      };

      // Increment the name until a unique one is found
      while (nameExists(newName)) {
        counter += 1;
        newName = `${baseName} ${counter}`;
      }

      // Set the unique name
      setName(newName);
    }
  }, [show, formData]);

  // Handle changes to the name input field
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // Handle focus event to select the entire text in the input field
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  // Handle save button click
  const handleSave = () => {
    // Retrieve saved items from localStorage
    const savedItems = JSON.parse(
      localStorage.getItem('savedValuations') || '[]',
    );

    // Check if an item with the same name already exists
    if (savedItems.some((item: { name: string }) => item.name === name)) {
      setError('An item with this name already exists.');
      return;
    }

    // Add the new item to the array
    const newItem = { name, data: formData };
    savedItems.push(newItem);

    // Save the updated array back to localStorage
    localStorage.setItem('savedValuations', JSON.stringify(savedItems));

    // Clear the error message and close the modal
    setError('');
    onSave(name);
  };

  return (
    <div>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Save Valuation</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Label htmlFor="name" value="Provide a Name" />
            <TextInput
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              onFocus={handleFocus}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>Save</Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SaveModal;
