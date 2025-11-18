import React from 'react';
import SensorReading from '../SensorReading/SensorReading';
import './SensorCard.css';

const getStatus = (value, min, max) => {
  if (value < min) return 'low';
  if (value > max) return 'high';
  return 'normal';
};

const getSoilStatus = (value) => {
  if (value < 30) return { status: 'critical', message: '⚠️ Necesita riego urgente' };
  if (value < 50) return { status: 'warning', message: 'Considerar riego pronto' };
  return { status: 'normal', message: 'Nivel óptimo' };
};

const SensorCard = ({ plant, reading, onManualIrrigation }) => {
  if (!reading) {
    return (
      <div className="sensor-card no-data">
        <h3>{plant.commonName}</h3>
        <p>Sin datos de sensores</p>
      </div>
    );
  }

  const tempStatus = getStatus(reading.temperature, plant.tempMin, plant.tempMax);
  const humidityStatus = getStatus(reading.humidity, plant.humidityMin, plant.humidityMax);
  const soilStatus = getSoilStatus(reading.soilMoisture);

  return (
    <div className="sensor-card">
      <div className="sensor-header">
        <h3>{plant.commonName}</h3>
        <span className="location">📍 {plant.location}</span>
      </div>

      <div className="sensor-readings">
        <SensorReading
          icon="🌡️"
          label="Temperatura"
          value={`${reading.temperature}°C`}
          range={`${plant.tempMin}°C - ${plant.tempMax}°C`}
          status={tempStatus}
        />

        <SensorReading
          icon="💧"
          label="Humedad Ambiental"
          value={`${reading.humidity}%`}
          range={`${plant.humidityMin}% - ${plant.humidityMax}%`}
          status={humidityStatus}
        />

        <SensorReading
          icon="🌱"
          label="Humedad del Suelo"
          value={`${reading.soilMoisture}%`}
          message={soilStatus.message}
          status={soilStatus.status}
        />

        <SensorReading
          icon="☀️"
          label="Nivel de Luz"
          value={`${reading.lightLevel}%`}
          status="normal"
        />
      </div>

      <div className="sensor-actions">
        <button 
          className="btn-irrigation"
          onClick={() => onManualIrrigation(plant.id)}
        >
          💧 Riego Manual
        </button>
      </div>
    </div>
  );
};


export default SensorCard;
