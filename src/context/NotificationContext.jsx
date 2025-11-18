import React, { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGreenhouse } from './GreenhouseContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { alerts, irrigationEvents } = useGreenhouse();

  // Notificar nuevas alertas
  useEffect(() => {
    if (alerts.length > 0) {
      const latestAlert = alerts[0];
      showNotification(latestAlert);
    }
  }, [alerts.length]);

  // Notificar eventos de riego
  useEffect(() => {
    const activeIrrigation = irrigationEvents.find(e => e.status === 'in_progress');
    if (activeIrrigation) {
      toast('💧 Riego en progreso', { icon: '🚿' });
    }
  }, [irrigationEvents]);

  const showNotification = (alert) => {
    const options = {
      duration: 4000,
      style: {
        background: getAlertColor(alert.severity),
        color: '#fff',
      },
    };

    switch (alert.severity) {
      case 'critical':
        toast.error(`⚠️ ${alert.message}`, options);
        break;
      case 'high':
        toast.error(`${alert.icon} ${alert.message}`, options);
        break;
      case 'medium':
        toast(`${alert.icon} ${alert.message}`, options);
        break;
      default:
        toast.success(`${alert.icon} ${alert.message}`, options);
    }
  };

  const getAlertColor = (severity) => {
    const colors = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[severity] || '#6c757d';
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
