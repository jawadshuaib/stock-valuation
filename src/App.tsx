import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store/store';
import './App.css';
import AppRoutes from './AppRoutes'; // Import the Routes component
import Footer from './components/footer/Footer';
import Header from './components/ui/Header';
import BackButton from './components/ui/BackButton';

const APP_NAME = 'Stock Valuation using Discounted Cash Flows';

function App() {
  const location = useLocation();
  const [header, setHeader] = useState<string | null>(null);

  useEffect(() => {
    // Extract the 'name' parameter from the URL
    const params = new URLSearchParams(location.search);
    const name = params.get('name');

    // Update the document title based on the 'name' parameter
    if (name) {
      document.title = `${name} | ${APP_NAME}`;
      setHeader(name);
    } else {
      document.title = APP_NAME;
    }
  }, [location]);

  return (
    <div className="App mt-6 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <BackButton />
      {location && location.pathname === '/' && (
        // Render the Header component
        <Header title={header} />
      )}

      {/* Render the Routes component */}
      <AppRoutes />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ReduxProvider store={store}>
        <App />
        {/* Render the Footer component */}
        <Footer />
      </ReduxProvider>
    </Router>
  );
}

export default AppWrapper;
