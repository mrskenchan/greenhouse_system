import { ref, push, set, get, update } from 'firebase/database';
import { database } from './firebase';
import { Alert } from '../models/Alert';

const ALERTS_NODE = 'ALERTS';

export const getPending = async () => {
  const dbRef = ref(database, ALERTS_NODE);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .map(key => new Alert({ id: key, ...data[key] }))
      .filter(a => !a.resolved)
      .reverse(); // Las más nuevas primero
  }
  return [];
};

export const resolve = async (alertId) => {
  const alertRef = ref(database, `${ALERTS_NODE}/${alertId}`);
  // Opción A: Borrarla (Desaparece del historial)
  // await remove(alertRef); 
  
  // Opción B: Marcarla como resuelta (Se queda en el historial pero gris) -> RECOMENDADO
  await update(alertRef, { resolved: true, resolvedAt: Date.now() });
};

// --- FUNCIÓN NUEVA PARA EL LOGGER ---
export const createAlert = async (alertData) => {
  const alertsRef = ref(database, ALERTS_NODE);
  const newAlertRef = push(alertsRef);
  await set(newAlertRef, {
    ...alertData,
    createdAt: Date.now(),
    resolved: false
  });
};