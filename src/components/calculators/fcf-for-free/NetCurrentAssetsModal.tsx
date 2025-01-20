import React, { useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import GPT from '../../ui/GPT';

interface NetCurrentAssetsModalProps {
  prefilledMarketCap: number;
  show: boolean;
  onClose: () => void;
  onCalculate: (
    mcap: number,
    currentAssets: number,
    currentLiabilities: number,
  ) => void;
}

const NetCurrentAssetsModal: React.FC<NetCurrentAssetsModalProps> = ({
  prefilledMarketCap,
  show,
  onClose,
  onCalculate,
}) => {
  const [marketCap, setMarketCap] = useState(prefilledMarketCap);
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const marketCapValue = parseFloat(marketCap.toString());
    const currentAssetsValue = parseFloat(currentAssets);
    const currentLiabilitiesValue = parseFloat(currentLiabilities);

    if (
      isNaN(marketCapValue) ||
      isNaN(currentAssetsValue) ||
      isNaN(currentLiabilitiesValue)
    ) {
      setError('Please enter valid numbers for all fields.');
      return;
    }

    setError('');
    onCalculate(marketCapValue, currentAssetsValue, currentLiabilitiesValue);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Enter Current Assets to Calculate</Modal.Header>
      <Modal.Body>
        <GPT>Need help with any calculations? Use this custom GPT.</GPT>
        <div className="space-y-4">
          <article>
            <Label
              htmlFor="marketCap"
              value="Market Cap (or Enterprise Value)"
            />
            <TextInput
              id="marketCap"
              name="marketCap"
              value={marketCap}
              onChange={(e) => setMarketCap(parseFloat(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </article>
          <article>
            <Label htmlFor="currentAssets" value="Current Assets" />
            <TextInput
              id="currentAssets"
              name="currentAssets"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </article>
          <article>
            <Label htmlFor="currentLiabilities" value="Current Liabilities" />
            <TextInput
              id="currentLiabilities"
              name="currentLiabilities"
              value={currentLiabilities}
              onChange={(e) => setCurrentLiabilities(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </article>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCalculate}>Calculate</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NetCurrentAssetsModal;
