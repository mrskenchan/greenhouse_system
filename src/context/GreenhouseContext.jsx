import React, { createContext, useContext, useState, useEffect } from 'react';
import { plantService, sensorService, alertService, irrigationService } from '../services';

const GreenhouseContext = createContext();

export const useGreenhouse = () => {
  const context = useContext(GreenhouseContext);
  if (!context) {
    throw new Error('useGreenhouse debe usarse dentro de GreenhouseProvider');
  }
  return context;
};

export const GreenhouseProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [plantsData, readingsData, alertsData, eventsData] = await Promise.all([
        plantService.getAll(),
        sensorService.getLatestReadings(),
        alertService.getPending(),
        irrigationService.getRecent()
      ]);

      setPlants(plantsData);
      setReadings(readingsData);
      setAlerts(alertsData);
      setIrrigationEvents(eventsData);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva planta
  const addPlant = async (plantData) => {
    try {
      const newPlant = await plantService.create(plantData);
      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (err) {
      throw new Error(`Error agregando planta: ${err.message}`);
    }
  };

  // Actualizar lectura de sensor
  const updateReading = (newReading) => {
    setReadings(prev => {
      const index = prev.findIndex(r => r.plantId === newReading.plantId);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newReading;
        return updated;
      }
      return [...prev, newReading];
    });
  };

  // Resolver alerta
  const resolveAlert = async (alertId) => {
    try {
      await alertService.resolve(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      throw new Error(`Error resolviendo alerta: ${err.message}`);
    }
  };

  // Iniciar riego
  const startIrrigation = async (plantId, type = 'manual') => {
    try {
      const event = await irrigationService.start(plantId, type);
      setIrrigationEvents(prev => [...prev, event]);
      return event;
    } catch (err) {
      throw new Error(`Error iniciando riego: ${err.message}`);
    }
  };

  const value = {
    // Estado
    plants,
    readings,
    alerts,
    irrigationEvents,
    loading,
    error,
    
    // Acciones
    addPlant,
    updateReading,
    resolveAlert,
    startIrrigation,
    refresh: loadInitialData
  };

  return (
    <GreenhouseContext.Provider value={value}>
      {children}
    </GreenhouseContext.Provider>
  );
};
