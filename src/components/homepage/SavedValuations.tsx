import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'flowbite-react';
import { EPSFormData } from '../calculators/eps/EPSFinancialInputsForm';

interface SavedValuation {
  name: string;
  data: EPSFormData;
}

const SavedValuations: React.FC = () => {
  const [savedValuations, setSavedValuations] = useState<SavedValuation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [valuationToRemove, setValuationToRemove] = useState<string | null>(
    null,
  );

  // Load saved valuations from localStorage when the component mounts
  useEffect(() => {
    const savedItems = JSON.parse(
      localStorage.getItem('savedValuations') || '[]',
    );
    setSavedValuations(savedItems);
  }, []);

  // Construct URL with parameters from EPSFormData
  const constructUrlWithParams = (data: EPSFormData) => {
    const params = new URLSearchParams({
      sharePrice: data.sharePrice.toString(),
      eps: data.eps.toString(),
      growthRate: data.growthRate.toString(),
      terminalGrowthRate: data.terminalGrowthRate.toString(),
      discountRate: data.discountRate.toString(),
      marginOfSafety: data.marginOfSafety.toString(),
    }).toString();
    return `/eps?${params}`;
  };

  // Show confirmation modal before removing a saved valuation
  const handleRemoveClick = (name: string) => {
    setValuationToRemove(name);
    setShowModal(true);
  };

  // Remove a saved valuation by name
  const handleRemoveConfirm = () => {
    if (valuationToRemove) {
      const updatedValuations = savedValuations.filter(
        (valuation) => valuation.name !== valuationToRemove,
      );
      setSavedValuations(updatedValuations);
      localStorage.setItem(
        'savedValuations',
        JSON.stringify(updatedValuations),
      );
      setValuationToRemove(null);
      setShowModal(false);
    }
  };

  if (savedValuations.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Saved Valuations
      </h3>
      <div className="space-y-4">
        {savedValuations.length > 0 &&
          savedValuations.map((valuation, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-slate-600 mb-2">
                  {valuation.name}
                </h4>
                <button
                  onClick={() => handleRemoveClick(valuation.name)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              {valuation.data.eps && (
                <Link
                  to={constructUrlWithParams(valuation.data)}
                  className="text-blue-500 hover:underline"
                >
                  Go to EPS Calculator
                </Link>
              )}
            </div>
          ))}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Confirm Removal</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove this valuation?</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleRemoveConfirm}>
              Yes, Remove
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default SavedValuations;
