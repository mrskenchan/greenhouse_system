import { ref, set, push, remove } from 'firebase/database';
import { database } from './firebase';

const EVENTS_NODE = 'IRRIGATION_EVENTS';
const COMMANDS_NODE = 'COMMANDS';
const SCHEDULES_NODE = 'SCHEDULES';

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

export const scheduleIrrigation = async (plantId, dateObj) => {
    try {
        // Convertimos la fecha Javascript (milisegundos) a Unix Timestamp (segundos)
        // Esto es vital porque el Arduino trabaja en segundos.
        const timestampSeconds = Math.floor(dateObj.getTime() / 1000);

        console.log(`📅 Programando riego para ${plantId} a las ${timestampSeconds}`);

        // Guardamos en el nodo específico de la planta
        // Usamos 'nextTask' para sobrescribir la anterior (así solo hay 1 pendiente a la vez)
        const scheduleRef = ref(database, `${SCHEDULES_NODE}/${plantId}`);
        
        await set(scheduleRef, {
            triggerAt: timestampSeconds, // El número mágico para el Arduino
            status: 'pending',           // Estado inicial
            createdAt: Date.now(),
            readableDate: dateObj.toLocaleString() // Solo para que tú lo leas fácil en Firebase
        });

        return true;
    } catch (error) {
        console.error("Error agendando riego:", error);
        throw error;
    }
};

/**
 * CANCELAR RIEGO PROGRAMADO
 */
export const cancelSchedule = async (plantId) => {
    const scheduleRef = ref(database, `${SCHEDULES_NODE}/${plantId}`);
    await remove(scheduleRef);
    return true;
};
   