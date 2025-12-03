import React from 'react';
import { Link } from 'react-router-dom';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { useSensors } from '../../hooks/useSensors';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import PlantCard from '../../components/plants/PlantCard/PlantCard';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import IrrigationHistory from '../../components/plants/IrrigationHistory/IrrigationHistory';
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

        <Card className={`metric-card ${totalAlerts > 0 ? 'alert-active' : ''}`}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-value">{totalAlerts}</div>
          <div className="metric-label">Alertas Activas</div>
        </Card>
      </div>

      {/* --- 2. NUEVA SECCIÓN: HISTORIAL DE RIEGOS RECIENTES --- */}
      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Columna Izquierda: Plantas */}
        <section className="plants-section">
        <div className="section-header">
            <h2>🌿 Estado de las Plantas</h2>
            <span className="badge-count">{plants.length}</span>
        </div>
        
        {/* ENVOLTORIO NUEVO PARA EL SCROLL */}
        <div className="plants-scroll-container"> 
            <div className="plants-grid">
                {plants.map(plant => (
                    <PlantCard key={plant.id} plant={plant} />
                ))}
            </div>
        </div>
      </section>

        {/* Columna Derecha: Historial de Riego */}
        <section className="history-section">
           {/* Al no pasarle 'plantId', muestra el historial GLOBAL */}
           <IrrigationHistory /> 
        </section>
        
      </div>
    </div>
  );
};

export default Dashboard;