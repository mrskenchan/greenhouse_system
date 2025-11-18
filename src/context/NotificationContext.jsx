import React, { useEffect } from 'react';
import toast from 'react-hot-toast'; 
import { useGreenhouse } from '../hooks/useGreenhouse'; 
import { NotificationContext } from './NContext';

export const NotificationProvider = ({ children }) => {
    const { alerts, irrigationEvents } = useGreenhouse();

    // 1. Declaración de la función: Mover showNotification al inicio.
    const showNotification = (data, type = 'alert') => {
        const isAlert = type === 'alert';
        let message, icon, color;

        if (isAlert) {
            message = data.message || `Nueva Alerta (${data.type})`;
            icon = data.getSeverity() === 'danger' ? '🚨' : '⚠️';
            color = data.getSeverity() === 'danger' ? '#e74c3c' : '#f1c40f';
        } else { // Riego
            message = `Riego iniciado para planta ${data.plantId}`;
            icon = '💧';
            color = '#3498db';
        }

        toast(message, {
            duration: 4000,
            icon: icon,
            style: {
                background: isAlert ? '#fff3f3' : '#f0f8ff',
                color: color,
                fontWeight: 'bold',
            },
        });
    };

    // 2. Notificar nuevas alertas (Ahora showNotification está disponible)
    useEffect(() => {
        if (alerts.length > 0) {
            const latestAlert = alerts[0]; 
            showNotification(latestAlert, 'alert');
        }
    }, [alerts.length]);

    // 3. Notificar inicio de riego
    useEffect(() => {
        if (irrigationEvents.length > 0) {
            const latestEvent = irrigationEvents[0];
            showNotification(latestEvent, 'irrigation');
        }
    }, [irrigationEvents.length]); // Dependencia corregida: observa el cambio en la longitud

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};