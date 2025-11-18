import React, { useState, useEffect } from 'react';
import { plantService, alertService, irrigationService } from '../services';
import { GreenhouseContext } from './GHContext';

export const GreenhouseProvider = ({ children }) => {
    const [plants, setPlants] = useState([]);
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [irrigationEvents, setIrrigationEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadInitialData = async () => { 
        try {
            setLoading(true);
            const [plantsData, alertsData, irrigationData] = await Promise.all([
                plantService.getAll(),
                alertService.getAll(),
                irrigationService.getAll(),
            ]);
            setPlants(plantsData);
            setAlerts(alertsData);
            setIrrigationEvents(irrigationData);
            setError(null);
            setLoading(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Lógica de carga inicial (ya existente)
    useEffect(() => {
        loadInitialData();
    }, []);
    
    
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
        plants, readings, alerts, irrigationEvents, loading, error, 
        addPlant, updateReading, resolveAlert, startIrrigation, refresh: loadInitialData
    };

    return (
        <GreenhouseContext.Provider value={value}>
            {children}
        </GreenhouseContext.Provider>
    );
};