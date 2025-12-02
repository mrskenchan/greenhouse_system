import React from 'react';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import AlertItem from '../../components/alerts/AlertItem/AlertItem';
import IrrigationStatus from '../../components/alerts/IrrigationStatus/IrrigationStatus';
import Loader from '../../components/common/Loader/Loader';
import './Alerts.css';

const Alerts = () => {
    // Necesitamos 'plants' para generar los controles de riego
    // Y 'alerts' para mostrar el historial
    const { plants, alerts, loading, resolveAlert } = useGreenhouse();

    if (loading) return <Loader />;

    return (
        <div className="alerts-page">
            <h1 className="page-title">🔔 Centro de Control y Alertas</h1>
            
            <div className="alerts-layout">
                
                {/* COLUMNA IZQUIERDA: CONTROL DE RIEGO (Por Planta) */}
                <section className="control-panel">
                    <h2>🚰 Control de Riego</h2>
                    <p className="section-desc">Activa las válvulas manualmente por planta.</p>
                    
                    {plants.length > 0 ? (
                        <div className="irrigation-grid">
                            {plants.map(plant => (
                                // AQUÍ PASAMOS LA PLANTA AL COMPONENTE
                                // Esto elimina el error 'undefined'
                                <IrrigationStatus key={plant.id} plant={plant} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No hay plantas registradas para controlar.</p>
                    )}
                </section>

                {/* COLUMNA DERECHA: HISTORIAL DE ALERTAS */}
                <section className="alerts-list-panel">
                    <h2>⚠️ Historial de Alertas ({alerts.length})</h2>
                    
                    {alerts.length === 0 ? (
                        <div className="empty-alerts">
                            <span className="check-icon">✅</span>
                            <p>Todo en orden. No hay alertas pendientes.</p>
                        </div>
                    ) : (
                        <div className="alert-list">
                            {alerts.map(alert => (
                                <AlertItem key={alert.id} alert={alert} onResolve={resolveAlert} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Alerts;