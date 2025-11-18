import React from 'react';
import './PlantPhaseBar.css';

const PlantPhaseBar = ({ progress, phaseName }) => {
  const phase = phaseName || 'Cargando...';
  
  return (
    <div className="phase-bar-container">
      <div className="phase-label">{phase}</div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="progress-text">{progress.toFixed(0)}%</div>
    </div>
  );
};

export default PlantPhaseBar;