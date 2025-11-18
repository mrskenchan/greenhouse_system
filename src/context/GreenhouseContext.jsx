import React, { createContext, useState, useEffect } from 'react';
import { plantService, sensorService, alertService, irrigationService } from '../services';

// 1. Exportamos solo el Context
export const GreenhouseContext = createContext();

export const GreenhouseProvider = ({ children }) => {
    const [plants, setPlants] = useState([]);
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [irrigationEvents, setIrrigationEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const addPlant = async (plantData) => { /* ... lógica de agregar planta ... */ };
    const updateReading = (newReading) => { /* ... lógica de actualización ... */ };
    const resolveAlert = async (alertId) => { /* ... lógica de resolver alerta ... */ };
    const startIrrigation = async (plantId, type = 'manual') => { /* ... lógica de riego ... */ };

    const value = {
        plants, readings, alerts, irrigationEvents, loading, error, 
        addPlant, updateReading, resolveAlert, startIrrigation, refresh: loadInitialData
    };

    return (
        <GreenhouseContext.Provider value={value}>
            {children}
        </GreenhouseContext.Provider>
    );
};