import React from 'react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import AlertItem from '../../components/alerts/AlertItem/AlertItem';
import IrrigationStatus from '../../components/alerts/IrrigationStatus/IrrigationStatus';
import toast from 'react-hot-toast';
import './Alerts.css';

const Alerts = () => {
  const { alerts, irrigationEvents, resolveAlert } = useGreenhouse();

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  const handleResolve = async (alertId) => {
    toast.promise(
      resolveAlert(alertId),
      {
        loading: 'Resolviendo alerta...',
        success: '✓ Alerta resuelta',
        error: 'Error al resolver'
      }
    );
  };

  return (
    <div className="alerts-page">
      <h1>🔔 Centro de Notificaciones y Alertas</h1>

      {/* Alertas Activas */}
      <section className="alerts-section">
        <h2>Alertas Activas ({pendingAlerts.length})</h2>
        {pendingAlerts.length === 0 ? (
          <p className="no-alerts">✅ No hay alertas activas</p>
        ) : (
          <div className="alerts-list">
            {pendingAlerts.map(alert => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </section>

      {/* Estado del Riego */}
      <section className="irrigation-section">
        <h2>💧 Estado del Sistema de Riego</h2>
        <IrrigationStatus events={irrigationEvents} />
      </section>

      {/* Historial */}
      <section className="history-section">
        <h2>Historial Reciente ({resolvedAlerts.length})</h2>
        <div className="alerts-list history">
          {resolvedAlerts.slice(0, 10).map(alert => (
            <AlertItem key={alert.id} alert={alert} resolved />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Alerts;
