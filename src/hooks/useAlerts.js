import { useMemo } from 'react';
import { useGreenhouse } from './useGreenhouse';

export const useAlerts = () => {
 const { alerts, resolveAlert } = useGreenhouse();

 const activeAlerts = useMemo(() => {
 // Aquí puedes añadir lógica para ordenar o filtrar
 return alerts.filter(a => a.status !== 'resolved');
 }, [alerts]);

 return { activeAlerts, resolveAlert, alertCount: activeAlerts.length };
};