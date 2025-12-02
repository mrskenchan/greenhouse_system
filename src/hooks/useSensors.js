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
      
      // 1. Verificar Temperatura (Ya lo tenías)
      if (reading.temperature < plant.tempMin) issues.push('Temp. Baja ❄️');
      if (reading.temperature > plant.tempMax) issues.push('Temp. Alta 🔥');
      
      // 2. Verificar Humedad Suelo (Ya lo tenías)
      if (reading.soilMoisture < (plant.soilMoistureMin || 30)) issues.push('Suelo Seco 🌵');

      // --- 3. NUEVO: VERIFICAR ESTADO DEL TANQUE ---
      // Verificamos si el Arduino mandó la señal de ALERTA o si el nivel es muy bajo
      // Nota: A veces Arduino manda "estadoTanque", a veces "waterLevel", cubrimos ambos casos
      const tanqueEstado = reading.estadoTanque || reading.waterLevel;
      const nivelAgua = Number(reading.nivelAgua || 0);

      if (tanqueEstado === 'ALERTA' || tanqueEstado === 'LOW' || nivelAgua < 10) {
          issues.push('¡TANQUE DE AGUA VACÍO! 🚰');
      }
    
      return issues.length > 0 ? { plantId: reading.plantId, plantName: plant.commonName, issues } : null;
    }).filter(Boolean);

    return {
      avgTemp,
      avgHumidity,
      warnings
    };
  }, [readings, plants, plantId]);

  return sensorData;
};