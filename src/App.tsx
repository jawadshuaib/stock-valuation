import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import AppRoutes from './AppRoutes'; // Import the Routes component
import Footer from './components/footer/Footer';
import Header from './components/ui/Header';
import BackButton from './components/ui/BackButton';

const APP_NAME = 'Stock Valuation Calculator';

function App() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    if (name) {
      document.title = `${name} | ${APP_NAME}`;
    } else {
      document.title = APP_NAME;
    }
  }, [location]);

  return (
    <div className="App mt-6 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <BackButton />
      <Header />
      {/* Render the Routes component */}
      <AppRoutes />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
      {/* Render the Footer component */}
      <Footer />
    </Router>
  );
}

export default AppWrapper;
