import React, { useState } from 'react';
import { useIrrigation } from '../../../hooks/useIrrigation';
import './IrrigationStatus.css';

// RECIBIMOS LA PLANTA COMPLETA COMO PROP
const IrrigationStatus = ({ plant }) => {
  const { startIrrigation } = useIrrigation();
  const [loading, setLoading] = useState(false);

  // Verificamos que la planta exista para evitar errores
  if (!plant) return null;

  const handleManualWatering = async () => {
    if (!plant.id) {
        alert("Error: Planta sin ID válido");
        return;
    }

    if (window.confirm(`¿Activar riego manual para: ${plant.commonName}?`)) {
      setLoading(true);
      try {
        // AQUÍ ESTÁ LA SOLUCIÓN: Pasamos el ID específico
        await startIrrigation(plant.id); 
        // El Arduino recibirá: /COMMANDS/-Nd67.../manualTrigger: true
      } catch (error) {
        console.error(error);
        alert("Error al enviar comando");
      } finally {
        // Simulamos un tiempo de espera para evitar spam de clicks
        setTimeout(() => setLoading(false), 3000);
      }
    }
  };

  return (
    <div className="irrigation-card">
      <div className="irrigation-header">
        <h4>💧 {plant.commonName}</h4>
        <span className="plant-id-tag">ID: {plant.id.slice(-4)}</span>
      </div>
      
      <div className="irrigation-body">
        <p className="status-text">Estado: <strong>Sistema Listo</strong></p>
        
        <button 
          className={`btn-irrigate ${loading ? 'active' : ''}`}
          onClick={handleManualWatering}
          disabled={loading}
        >
          {loading ? 'Enviando Orden...' : 'Iniciar Riego Manual'}
        </button>
      </div>
    </div>
  );
};

export default IrrigationStatus;