import React from 'react';
import { useGreenhouse } from '../../../hooks/useGreenhouse';
import { useNavigate } from 'react-router-dom';
import { Plant } from '../../../models/Plant';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
  const { readings } = useGreenhouse();
  const { deletePlant } = useGreenhouse();
  const navigate = useNavigate();
  const plantModel = new Plant(plant);
  const reading = readings.find(r => r.plantId === plant.id);
  const currentPhase = plantModel.getCurrentPhase();

  return (
    <div className="plant-card">
      <div className="plant-card-header">
        <h3>{plant.commonName}</h3>
        <span className={`status-badge ${plant.status}`}>
          {plant.status}
        </span>
      </div>

      <div className="card-actions" style={{marginTop: '1rem', display: 'flex', gap: '10px'}}>
        <button 
            className="btn-edit"
            onClick={() => navigate(`/editar-planta/${plant.id}`)}
            style={{flex: 1, background: '#3498db', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer'}}
        >
            ✏️ Editar
        </button>
        <button 
            className="btn-delete"
            onClick={() => deletePlant(plant.id)}
            style={{flex: 1, background: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer'}}
        >
            🗑️ Borrar
        </button>
      </div>

      <div className="plant-phase">
        <strong>Fase:</strong> {currentPhase.name}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${currentPhase.progress}%` }}
          />
        </div>
        <span className="progress-text">{currentPhase.progress.toFixed(0)}%</span>
      </div>

      {reading && (
        <div className="plant-readings">
          <div className="reading">
            <span className="icon">🌡️</span>
            <span>{reading.temperature}°C</span>
          </div>
          <div className="reading">
            <span className="icon">💧</span>
            <span>{reading.humidity}%</span>
          </div>
          <div className="reading">
            <span className="icon">🌱</span>
            <span>Suelo: {reading.soilMoisture}%</span>
          </div>
        </div>
      )}

      <button className="btn-detail">Ver Detalles</button>
    </div>
  );
};

export default PlantCard;
