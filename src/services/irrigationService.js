// src/services/irrigationService.js
import { ref, set, push } from 'firebase/database';
import { database } from './firebase';

const EVENTS_NODE = 'IRRIGATION_EVENTS';
const COMMANDS_NODE = 'COMMANDS';

/**
 * Obtiene historial reciente (Simulado para dashboard)
 */
export const getRecent = async () => {
    // Retornamos vacío por ahora para no complicar, 
    // lo importante es el comando de riego.
    return [];
};

/**
 * ENVÍA COMANDO DE RIEGO AL ARDUINO
 * Escribe en /COMMANDS/{plantId}/manualTrigger = true
 */
export const start = async (plantId, type = 'manual') => {
    try {
        console.log(`📡 Enviando orden de riego a: ${plantId}`);

        // 1. Escribir el comando que el Arduino está escuchando
        const commandRef = ref(database, `${COMMANDS_NODE}/${plantId}/manualTrigger`);
        await set(commandRef, true); // <--- ESTO ES LO QUE LEE EL ARDUINO

        // 2. Registrar el evento en el historial (para tu registro)
        const newEventRef = push(ref(database, EVENTS_NODE));
        await set(newEventRef, {
            plantId,
            type,
            startTime: Date.now(),
            status: 'initiated'
        });

        return { id: newEventRef.key, status: 'initiated' };
    } catch (error) {
        console.error("Error iniciando riego:", error);
        throw error;
    }
};