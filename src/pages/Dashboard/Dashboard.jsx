import React, { useEffect } from 'react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { useSensors } from '../../hooks/useSensors';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import PlantCard from '../../components/plants/PlantCard/PlantCard';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { plants, alerts, loading } = useGreenhouse();
  const { avgTemp, avgHumidity, warnings } = useSensors();
  
  // Activar actualizaciones en tiempo real
  useRealTimeData();

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <h1>🌱 Dashboard del Invernadero</h1>

      {/* Métricas clave */}
      <div className="metrics-grid">
        <Card className="metric-card">
          <div className="metric-icon">🌱</div>
          <div className="metric-value">{plants.length}</div>
          <div className="metric-label">Plantas Activas</div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon">🌡️</div>
          <div className="metric-value">{avgTemp}°C</div>
          <div className="metric-label">Temperatura Promedio</div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon">💧</div>
          <div className="metric-value">{avgHumidity}%</div>
          <div className="metric-label">Humedad Promedio</div>
        </Card>

        <Card className={`metric-card ${alerts.length > 0 ? 'alert-active' : ''}`}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-value">{alerts.length}</div>
          <div className="metric-label">Alertas Activas</div>
        </Card>
      </div>

      {/* Advertencias */}
      {warnings.length > 0 && (
        <div className="warnings-section">
          <h3>⚠️ Atención Requerida</h3>
          {warnings.map((warning, idx) => (
            <div key={idx} className="warning-banner">
              Planta {warning.plantId}: {warning.issues.join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Grid de plantas */}
      <section className="plants-section">
        <h2>Estado de las Plantas</h2>
        <div className="plants-grid">
          {plants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
