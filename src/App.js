import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import Sensors from './pages/Sensors/Sensors';
import Alerts from './pages/Alerts/Alerts';
import { GreenhouseProvider } from './context/GreenhouseContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <Router>
      <GreenhouseProvider>
        <NotificationProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendario" element={<Calendar />} />
                <Route path="/sensores" element={<Sensors />} />
                <Route path="/alertas" element={<Alerts />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </NotificationProvider>
      </GreenhouseProvider>
    </Router>
  );
}

export default App;
