import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
// IMPORTACIONES ADICIONALES NECESARIAS para Realtime Listener
import { ref, onValue } from 'firebase/database';
import { database } from '../services/firebase'; 

import { plantService, alertService, irrigationService } from '../services';
import { GreenhouseContext } from './GHContext';

// Valores por defecto copiados de plantService.js (Necesarios para el listener)
const DEFAULT_PLANT_VALUES = {
  soilMoistureMax: 80, 
  soilMoistureMin: 30,
  humidityMax: 80,
  humidityMin: 40,
  tempMax: 30,
  tempMin: 15,
};

export const GreenhouseProvider = ({ children }) => {
    const [plants, setPlants] = useState([]);
    const [readings, setReadings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [irrigationEvents, setIrrigationEvents] = useState([]);
    // Inicializar como true. Se pondrá en false después de la primera carga exitosa de todos los datos.
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    // Función para cargar alerts e irrigationEvents (que usan fetch única)
    const loadSecondaryData = async () => { 
        try {
            // Se asume que alertService.getAll() e irrigationService.getAll() se refieren
            // a los datos pendientes o recientes, como se ve en otros hooks/servicios.
            const [alertsData, irrigationData] = await Promise.all([
                alertService.getPending(), // Asumo que se pretendía usar getPending o una versión de getAll
                irrigationService.getRecent(), // Asumo getRecent
            ]);
            setAlerts(alertsData);
            setIrrigationEvents(irrigationData);
        } catch (err) {
            setError(err.message);
            console.error("Error cargando datos secundarios:", err);
            // Si falla, no rompemos el flujo.
        }
    };

    // Lógica principal: Suscripción a Plantas y Carga de Datos Secundarios
    useEffect(() => {
        // En cada montaje (incluso después del refresco del token), volvemos a cargar
        setLoading(true);

        // --- A. Suscripción permanente a la lista de plantas (SOLUCIÓN ROBUSTA) ---
        const plantsRef = ref(database, 'PLANTS');
        let initialLoadCompleted = false;
        
        const unsubscribePlants = onValue(plantsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const plantsData = Object.keys(data).map(key => ({
                    id: key,
                    ...DEFAULT_PLANT_VALUES, // Aplicar valores por defecto para evitar errores
                    ...data[key]             // Sobreescribir con valores de Firebase
                }));
                
                setPlants(plantsData);
            } else {
                setPlants([]); 
            }

            // Marcamos la carga inicial de plantas como hecha.
            if (!initialLoadCompleted) {
                 initialLoadCompleted = true;
                 
                 // Una vez que las plantas cargan por primera vez, cargamos los otros datos.
                 // Y solo al finalizar, ponemos loading en false.
                 loadSecondaryData().finally(() => {
                    setLoading(false); 
                 });
            }
        }, (error) => {
            console.error("Error en el listener de plantas:", error);
            toast.error("Error al sincronizar la lista de plantas.");
            setLoading(false); // Desbloquear si el listener falla
        });


        // Cleanup: Desuscribir el listener de plantas al desmontar el Provider
        return () => {
             unsubscribePlants();
        };

    }, []); // Se mantiene sin dependencias para que solo se ejecute al montar

    
    // --- MÉTODOS DE MANIPULACIÓN (Se mantienen sin setPlants locales) ---
    const addPlant = async (plantData) => {
        try {
            const newPlant = await plantService.create(plantData);
            return newPlant;
        } catch (err) {
            throw new Error(`Error agregando planta: ${err.message}`);
        }
    };

    const deletePlant = async (plantId) => {
    if(!window.confirm("¿Estás seguro de eliminar esta planta? Se perderá su configuración.")) return;
        try {
            await plantService.removePlant(plantId);
            toast.success("Planta eliminada");
        } catch (err) {
            toast.error("Error al eliminar", err.message);
        }
    };

    const modifyPlant = async (plantId, data) => {
        try {
            await plantService.updatePlantData(plantId, data);
            return true;
        } catch (err) {
            throw new Error(err.message);
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
        plants, readings, alerts, irrigationEvents, loading, error, deletePlant, modifyPlant,
        addPlant, updateReading, resolveAlert, startIrrigation, refresh: loadSecondaryData
    };

    return (
        <GreenhouseContext.Provider value={value}>
            {children}
        </GreenhouseContext.Provider>
    );
};