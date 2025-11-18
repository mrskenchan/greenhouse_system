import React, { useState } from 'react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { usePlants } from '../../hooks/usePlants';
import PlantTimeline from '../../components/plants/PlantTimeline/PlantTimeline';
import './Calendar.css';

const Calendar = () => {
  const { plants } = useGreenhouse();
  const [selectedPlant, setSelectedPlant] = useState('all');
  
  const filteredPlants = usePlants(
    selectedPlant !== 'all' ? { id: selectedPlant } : null
  );

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h1>📅 Calendario del Ciclo de Plantas</h1>
        
        <select 
          className="plant-filter"
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
        >
          <option value="all">Todas las plantas</option>
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>
              {plant.commonName}
            </option>
          ))}
        </select>
      </header>

      <div className="timeline-container">
        {(selectedPlant === 'all' ? plants : filteredPlants).map(plant => (
          <PlantTimeline key={plant.id} plant={plant} />
        ))}
      </div>

      <div className="legend">
        <h4>Leyenda de Fases</h4>
        <div className="legend-items">
          <span className="legend-item">
            <span className="color-box germination"></span> Germinación
          </span>
          <span className="legend-item">
            <span className="color-box growth"></span> Crecimiento
          </span>
          <span className="legend-item">
            <span className="color-box flowering"></span> Floración
          </span>
          <span className="legend-item">
            <span className="color-box fruiting"></span> Fructificación
          </span>
          <span className="legend-item">
            <span className="color-box harvest"></span> Cosecha
          </span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
