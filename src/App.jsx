import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar/Navbar.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Sensors from './pages/Sensors/Sensors.jsx';
import Alerts from './pages/Alerts/Alerts.jsx';
import Calendar from './pages/Calendar/Calendar.jsx';

import './index.css';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter> {/* Envolver la app en el Router */}
      <Navbar /> 
      
      <main className="app-content">
        <Routes> {/* Definición de rutas */}
          {/* Ruta Raíz */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Rutas con tus NavLinks */}
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/sensores" element={
            <Sensors />} 
          />
          <Route path="/alertas" element={<Alerts />} />
          
          {/* Manejo de ruta no encontrada (opcional) */}
          <Route path="*" element={<h2>404 | Página no encontrada</h2>} />
        </Routes>
      </main>

      <Toaster position="bottom-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;