import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes'; // Import the Routes component
import Footer from './components/footer/Footer';

function App() {
  return (
    <Router>
      <div className="App mt-6 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        {/* Render the Routes component */}
        <AppRoutes />
      </div>
      {/* Render the Footer component */}
      <Footer />
    </Router>
  );
}

export default App;
