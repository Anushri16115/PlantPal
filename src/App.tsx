import { BrowserRouter } from 'react-router-dom';
import { PlantProvider } from './context/PlantContext.js';
import { Navbar } from './components/Navbar.js';
import { AppRoutes } from './router/AppRoutes.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <PlantProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </PlantProvider>
    </BrowserRouter>
  );
}

export default App;
