import { useMemo } from 'react';
import { useGreenhouse } from './useGreenhouse';

export const useSensors = (plantId = null) => {
  const { readings, plants } = useGreenhouse();

  const sensorData = useMemo(() => {
    // 1. Filtrar lecturas (si se especifica una planta, o todas)
    let targetReadings = [];
    
    if (plantId) {
      // Si pedimos de una planta específica
      targetReadings = readings.filter(r => r.plantId === plantId);
    } else {
      // Si es para el Dashboard general (usamos la última de cada planta)
      targetReadings = readings;
    }

    // Si no hay datos reales, devolvemos ceros (no valores falsos como 22.3)
    if (targetReadings.length === 0) {
      return { avgTemp: 0, avgHumidity: 0, warnings: [] };
    }

    // 2. Calcular Promedios Reales
    const totalTemp = targetReadings.reduce((acc, r) => acc + Number(r.temperature || 0), 0);
    const totalHum = targetReadings.reduce((acc, r) => acc + Number(r.humidity || 0), 0);
    
    const avgTemp = (totalTemp / targetReadings.length).toFixed(1);
    const avgHumidity = (totalHum / targetReadings.length).toFixed(1);

    // 3. Generar Advertencias Reales (Comparando con los umbrales de la planta)
    const warnings = targetReadings.map(reading => {
      const plant = plants.find(p => p.id === reading.plantId);
      if (!plant) return null;

      const issues = [];
      // Verificar temperatura
      if (reading.temperature < plant.tempMin) issues.push('Temp. Baja ❄️');
      if (reading.temperature > plant.tempMax) issues.push('Temp. Alta 🔥');
      
      // Verificar humedad suelo
      if (reading.soilMoisture < (plant.soilMoistureMin || 30)) issues.push('Suelo Seco 🌵');

      return issues.length > 0 ? { plantId: reading.plantId, plantName: plant.commonName, issues } : null;
    }).filter(Boolean); // Eliminar nulos

    return {
      avgTemp,
      avgHumidity,
      warnings
    };
  }, [readings, plants, plantId]);

  return sensorData;
};