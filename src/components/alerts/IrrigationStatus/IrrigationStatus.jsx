import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useIrrigation } from '../../../hooks/useIrrigation';
import { scheduleIrrigation } from '../../../services/irrigationService';
import './IrrigationStatus.css';

// RECIBIMOS LA PLANTA COMPLETA COMO PROP
const IrrigationStatus = ({ plant }) => {
  const { startIrrigation } = useIrrigation();
  const [loading, setLoading] = useState(false);

  const [scheduleDate, setScheduleDate] = useState('');

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

  // --- Lógica Riego Programado (NUEVA) ---
  const handleSchedule = async () => {
    if (!scheduleDate) {
        toast.error("Selecciona una fecha y hora");
        return;
    }

    const selectedTime = new Date(scheduleDate);
    const now = new Date();

    if (selectedTime <= now) {
        toast.error("¡La fecha debe ser en el futuro!");
        return;
    }

    setLoading(true);
    try {
        await scheduleIrrigation(plant.id, selectedTime);
        toast.success(`📅 Riego programado para: ${selectedTime.toLocaleString()}`);
        setScheduleDate(''); // Limpiar input
    } catch (error) {
        toast.error("Error al programar", error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="irrigation-card">
      <div className="irrigation-header">
        <h4>🌿 {plant.commonName}</h4>
        <span className="plant-id-tag">ID: {plant.id.slice(-4)}</span>
      </div>
      
      <div className="irrigation-body">
        
        {/* SECCIÓN 1: MANUAL */}
        <div className="control-section">
            <p className="status-label">Acción Inmediata:</p>
            <button 
            className={`btn-irrigate ${loading ? 'active' : ''}`}
            onClick={handleManualWatering}
            disabled={loading}
            >
            {loading ? 'Procesando...' : '💧 Iniciar Riego Ahora'}
            </button>
        </div>

        <hr className="divider" />

        {/* SECCIÓN 2: PROGRAMADOR (NUEVO) */}
        <div className="schedule-section">
            <p className="status-label">Programar a futuro:</p>
            <div className="schedule-inputs">
                <input 
                    type="datetime-local" 
                    className="date-input"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                />
                <button 
                    className="btn-schedule"
                    onClick={handleSchedule}
                    disabled={loading}
                >
                    🕒 Agendar
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default IrrigationStatus;