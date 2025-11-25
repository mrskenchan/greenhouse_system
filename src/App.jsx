import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 1. IMPORTACIONES CORREGIDAS
import { AuthProvider } from './context/AuthContext'; 
import { useAuth } from './hooks/useAuth';            

import Navbar from './components/common/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import NewPlant from './pages/NewPlant/NewPlant';
import Calendar from './pages/Calendar/Calendar';
import Sensors from './pages/Sensors/Sensors';
import Alerts from './pages/Alerts/Alerts';
import Login from './pages/Login/Login'; 

import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth(); // <--- AQUÍ SE USA LA VARIABLE
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider> {/* <--- Envolver TODO */}
      <BrowserRouter>
        {/* Solo mostrar Navbar si está logueado (opcional, pero recomendado) */}
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Protegidas */}
          <Route path="/*" element={
            <PrivateRoute>
              <Navbar />
              <main className="app-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/nueva-planta" element={<NewPlant />} />
                  <Route path="/calendario" element={<Calendar />} />
                  <Route path="/sensores" element={<Sensors />} />
                  <Route path="/alertas" element={<Alerts />} />
                </Routes>
              </main>
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;