import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { EPSFormData, FCFFormData } from '../calculators/types';

interface SavedValuation {
  name: string;
  data: EPSFormData | FCFFormData;
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

  // Construct URL with parameters from EPSFormData or FCFFormData
  const constructUrlWithParams = (
    name: string,
    data: EPSFormData | FCFFormData,
  ) => {
    if ('eps' in data) {
      const params = new URLSearchParams({
        name,
        sharePrice: data.sharePrice.toString(),
        eps: data.eps.toString(),
        growthRate: data.growthRate.toString(),
        terminalGrowthRate: data.terminalGrowthRate.toString(),
        discountRate: data.discountRate.toString(),
        marginOfSafety: data.marginOfSafety.toString(),
      }).toString();
      return `/eps?${params}`;
    } else {
      const params = new URLSearchParams({
        name,
        sharePrice: data.sharePrice.toString(),
        fcf: data.fcf.toString(),
        growthRate: data.growthRate.toString(),
        terminalGrowthRate: data.terminalGrowthRate.toString(),
        discountRate: data.discountRate.toString(),
        projectionYears: data.projectionYears.toString(),
        marginOfSafety: data.marginOfSafety.toString(),
        outstandingShares: data.outstandingShares.toString(),
      }).toString();
      return `/fcf?${params}`;
    }
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
                <h4 className="font-medium text-slate-600">
                  <a
                    href={constructUrlWithParams(
                      valuation.name,
                      valuation.data,
                    )}
                    className="text-blue-500 hover:underline"
                  >
                    {valuation.name}
                  </a>
                </h4>
                <button
                  onClick={() => handleRemoveClick(valuation.name)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
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
