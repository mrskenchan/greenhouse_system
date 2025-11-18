import React, { useState } from 'react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { useSensors } from '../../hooks/useSensors';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import SensorCard from '../../components/sensors/SensorCard/SensorCard';
import toast from 'react-hot-toast';
import './Sensors.css';

const Sensors = () => {
  const { plants, startIrrigation, refresh } = useGreenhouse();
  const [selectedPlant, setSelectedPlant] = useState('all');
  const { readings } = useSensors(selectedPlant !== 'all' ? selectedPlant : null);
  
  useRealTimeData(selectedPlant !== 'all' ? selectedPlant : null);

  const handleRefresh = async () => {
    toast.promise(
      refresh(),
      {
        loading: 'Actualizando datos...',
        success: '✓ Datos actualizados',
        error: 'Error al actualizar'
      }
    );
  };

  const handleManualIrrigation = async (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const confirmed = window.confirm(
      `¿Iniciar riego manual para ${plant.commonName}?`
    );

    if (confirmed) {
      toast.promise(
        startIrrigation(plantId, 'manual'),
        {
          loading: 'Iniciando riego...',
          success: '💧 Riego iniciado',
          error: 'Error al iniciar riego'
        }
      );
    }
  };

  return (
    <div className="sensors-page">
      <header className="sensors-header">
        <h1>📊 Monitoreo de Sensores en Tiempo Real</h1>
        <div className="header-actions">
          <span className="last-update">
            Última actualización: {new Date().toLocaleTimeString('es-CL')}
          </span>
          <button onClick={handleRefresh} className="btn-refresh">
            🔄 Actualizar
          </button>
        </div>
      </header>

      <div className="plant-selector">
        <label>Seleccionar Planta:</label>
        <select 
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
          className="form-control"
        >
          <option value="all">Vista General</option>
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>
              {plant.commonName}
            </option>
          ))}
        </select>
      </div>

      <div className="sensors-grid">
        {plants
          .filter(p => selectedPlant === 'all' || p.id === selectedPlant)
          .map(plant => {
            const reading = readings.find(r => r.plantId === plant.id);
            return (
              <SensorCard
                key={plant.id}
                plant={plant}
                reading={reading}
                onManualIrrigation={handleManualIrrigation}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Sensors;
