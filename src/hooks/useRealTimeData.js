import { useEffect } from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { sensorService } from '../services';

/**
 * Hook para recibir datos de sensores en tiempo real
 * Simula Tinkercad o se conecta a Firebase Realtime
 */
export const useRealTimeData = (plantId = null, interval = 5000) => {
  const { updateReading } = useGreenhouse();

  useEffect(() => {
    // Configurar listener para datos en tiempo real
    const subscription = sensorService.subscribe(plantId, (newReading) => {
      updateReading(newReading);
    });

    // Polling alternativo si no hay WebSocket/Firebase
    const pollingInterval = setInterval(async () => {
      try {
        const readings = await sensorService.getLatestReadings(plantId);
        readings.forEach(reading => updateReading(reading));
      } catch (err) {
        console.error('Error polling datos:', err);
      }
    }, interval);

    // Cleanup
    return () => {
      if (subscription) subscription.unsubscribe();
      clearInterval(pollingInterval);
    };
  }, [plantId, interval, updateReading]);
};
