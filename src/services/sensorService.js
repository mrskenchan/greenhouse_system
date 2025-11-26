import { ref, get, onValue, query, limitToLast } from 'firebase/database';
import { database } from './firebase';
import { Reading } from '../models/Reading'; 

const READINGS_NODE = 'READINGS';

/**
 * Obtiene las últimas lecturas REALES.
 * Si no hay datos en Firebase, devuelve [] (Array vacío), NO datos falsos.
 */
export const getLatestReadings = async (plantId = null) => {
    try {
        const path = plantId ? `${READINGS_NODE}/${plantId}` : READINGS_NODE;
        const readingsRef = ref(database, path);
        // Traemos solo las últimas para no cargar todo el historial de golpe
        const snapshot = await get(query(readingsRef, limitToLast(5))); 

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Si pedimos de TODAS las plantas (Dashboard general)
            if (!plantId) {
                // La estructura es { plantId: { timestamp: reading } }
                // Aplanamos esto para obtener un array de todas las lecturas recientes
                let allReadings = [];
                Object.keys(data).forEach(pId => {
                    const plantReadings = data[pId];
                    Object.keys(plantReadings).forEach(rId => {
                        allReadings.push(new Reading({ id: rId, plantId: pId, ...plantReadings[rId] }));
                    });
                });
                return allReadings;
            } 
            
            // Si es de UNA planta específica
            return Object.keys(data).map(key => new Reading({ id: key, ...data[key] }));
        } else {
            // Devolver array vacío, no mocks
            return []; 
        }
    } catch (error) {
        console.error("Error al obtener lecturas:", error);
        return [];
    }
};

/**
 * Suscripción en tiempo real
 */
export const subscribe = (plantId = null, callback) => {
    const readingsRef = ref(database, READINGS_NODE);

    const unsubscribe = onValue(readingsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Recorremos las plantas para encontrar la última lectura de cada una
            Object.keys(data).forEach(plantIdKey => {
                 // Si filtramos por ID y no coincide, saltamos
                 if (plantId && plantId !== plantIdKey) return;

                 const plantReadings = data[plantIdKey];
                 // Obtenemos la última llave (la más reciente por timestamp)
                 const keys = Object.keys(plantReadings).sort(); 
                 const latestKey = keys[keys.length - 1];
                 const latestReading = plantReadings[latestKey];

                 if (latestReading) {
                     callback(new Reading({ 
                        plantId: plantIdKey, 
                        ...latestReading
                     }));
                 }
            });
        }
    });

    return { unsubscribe };
};