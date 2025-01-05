import './App.css';
import FinancialInputsForm from './FinancialInputsForm';

export interface ValuationData {
  intrinsicValue: number;
  marginOfSafetyPrice: number;
}

function App() {
  // const [valuation, setValuation] = useState<ValuationData | null>(null);
  const setValuation = (valuation: ValuationData | null) => {
    console.log(valuation?.intrinsicValue);
    console.log(valuation?.marginOfSafetyPrice);
  };
  return (
    <div className="App">
      <FinancialInputsForm setValuation={setValuation} />
    </div>
  );
}

export default App;
