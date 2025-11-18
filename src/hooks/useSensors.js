import { useMemo } from 'react';
import { useGreenhouse } from './useGreenhouse';

export const useSensors = (plantId = null) => {
  const { readings, plants } = useGreenhouse();

  const sensorData = useMemo(() => {
    let filteredReadings = readings;

    if (plantId) {
      filteredReadings = readings.filter(r => r.plantId === plantId);
    }

    // Calcular estadísticas
    const avgTemp = filteredReadings.reduce((acc, r) => acc + r.temperature, 0) / 
                    (filteredReadings.length || 1);
    const avgHumidity = filteredReadings.reduce((acc, r) => acc + r.humidity, 0) / 
                        (filteredReadings.length || 1);

    // Verificar si hay lecturas fuera de rango
    const warnings = filteredReadings.map(reading => {
      const plant = plants.find(p => p.id === reading.plantId);
      if (!plant) return null;

      const issues = [];
      if (reading.temperature < plant.tempMin || reading.temperature > plant.tempMax) {
        issues.push('temperature');
      }
      if (reading.humidity < plant.humidityMin || reading.humidity > plant.humidityMax) {
        issues.push('humidity');
      }
      if (reading.soilMoisture < 30) {
        issues.push('irrigation');
      }

      return issues.length > 0 ? { plantId: reading.plantId, issues } : null;
    }).filter(Boolean);

    return {
      readings: filteredReadings,
      avgTemp: avgTemp.toFixed(1),
      avgHumidity: avgHumidity.toFixed(1),
      warnings
    };
  }, [readings, plantId, plants]);

  return sensorData;
};
