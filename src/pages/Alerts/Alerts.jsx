import React from 'react';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { useSensors } from '../../hooks/useSensors'; 
import AlertItem from '../../components/alerts/AlertItem/AlertItem';
import IrrigationStatus from '../../components/alerts/IrrigationStatus/IrrigationStatus';
import Loader from '../../components/common/Loader/Loader';
import './Alerts.css';

const Alerts = () => {
    const { plants, alerts: historyAlerts, loading, resolveAlert } = useGreenhouse();
    
    // TRAEMOS LAS ADVERTENCIAS EN TIEMPO REAL (Aquí viene "Tanque Vacío")
    const { warnings } = useSensors(); 

    if (loading) return <Loader />;

    return (
        <div className="alerts-page">
            <h1 className="page-title">🔔 Centro de Control y Alertas</h1>
            
            {/* SECCIÓN NUEVA: ALERTAS CRÍTICAS DE HARDWARE */}
            {warnings.length > 0 && (
                <section className="critical-alerts-section">
                    {warnings.map((warn, idx) => (
                        <div key={idx} className="critical-banner">
                            <span className="icon">🚨</span>
                            <div className="content">
                                <strong>¡ATENCIÓN EN {warn.plantName.toUpperCase()}!</strong>
                                <p>{warn.issues.join(' • ')}</p>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            <div className="alerts-layout">
                
                {/* Control de Riego */}
                <section className="control-panel">
                    <h2>🚰 Control de Riego</h2>
                    <p className="section-desc">Activa las válvulas manualmente.</p>
                    {plants.length > 0 ? (
                        <div className="irrigation-grid">
                            {plants.map(plant => (
                                <IrrigationStatus key={plant.id} plant={plant} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No hay plantas.</p>
                    )}
                </section>

                {/* Historial de Alertas (Base de Datos) */}
                <section className="alerts-list-panel">
                    <h2>📋 Historial de Notificaciones</h2>
                    {historyAlerts.length === 0 ? (
                        <div className="empty-alerts">
                            <span className="check-icon">✅</span>
                            <p>Sin notificaciones antiguas.</p>
                        </div>
                    ) : (
                        <div className="alert-list">
                            {historyAlerts.map(alert => (
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