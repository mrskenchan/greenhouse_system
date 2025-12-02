import React from 'react';
import { Link } from 'react-router-dom';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { useSensors } from '../../hooks/useSensors';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import PlantCard from '../../components/plants/PlantCard/PlantCard';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { plants, alerts: historyAlerts, loading } = useGreenhouse();
  const { avgTemp, avgHumidity, warnings: realtimeWarnings } = useSensors();
  
  // Activar actualizaciones
  useRealTimeData();

  if (loading) return <Loader />;

  // CÁLCULO TOTAL DE ALERTAS (Historial + Tiempo Real)
  const totalAlerts = historyAlerts.length + realtimeWarnings.length;

  return (
    <div className="dashboard">
      
      {/* Header */}
      <header className="dashboard-header-actions" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1>🌱 Dashboard del Invernadero</h1>
        <Link to="/nueva-planta" className="btn-primary" style={{textDecoration: 'none'}}>
          + Agregar Planta
        </Link>
      </header>

      {/* Métricas */}
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

        {/* AQUÍ ESTÁ EL ARREGLO DEL CONTADOR */}
        <Card className={`metric-card ${totalAlerts > 0 ? 'alert-active' : ''}`}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-value">{totalAlerts}</div>
          <div className="metric-label">Alertas Activas</div>
        </Card>
      </div>

      {/* --- SECCIÓN DE ADVERTENCIAS ELIMINADA (Ya está en la página Alertas) --- */}

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