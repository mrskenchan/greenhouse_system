import React from 'react';
import { useGreenhouse } from '../../../hooks/useGreenhouse';
import { Plant } from '../../../models/Plant';
import './PlantCard.css';

const PlantCard = ({ plant }) => {
  const { readings } = useGreenhouse();
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
