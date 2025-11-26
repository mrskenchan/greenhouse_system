import { ref, push, set, get, child, update, remove } from 'firebase/database';
import { database } from './firebase';

const PLANTS_NODE = 'PLANTS';

/**
 * Obtiene todas las plantas de Firebase y las convierte en un array.
 */
export const getAll = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, PLANTS_NODE));

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convertir el objeto de objetos de Firebase en un array para React
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo plantas:", error);
    return [];
  }
};

/**
 * Crea una nueva planta en Firebase (Genera UID automáticamente)
 */
export const create = async (plantData) => {
  try {
    const plantsRef = ref(database, PLANTS_NODE);
    const newPlantRef = push(plantsRef); // Genera el UID
    const plantId = newPlantRef.key;

    const newPlant = {
      ...plantData,
      id: plantId,
      plantingDate: plantData.plantingDate || new Date().toISOString()
    };

    await set(newPlantRef, newPlant);
    return newPlant;
  } catch (error) {
    console.error("Error creando planta:", error);
    throw error;
  }
};

/**
 * Actualizar una planta existente
 */
export const updatePlantData = async (plantId, plantData) => {
  try {
    const plantRef = ref(database, `${PLANTS_NODE}/${plantId}`);
    await update(plantRef, plantData);
    return { id: plantId, ...plantData };
  } catch (error) {
    console.error("Error actualizando planta:", error);
    throw error;
  }
};

/**
 * Eliminar una planta
 */
export const removePlant = async (plantId) => {
  try {
    const plantRef = ref(database, `${PLANTS_NODE}/${plantId}`);
    await remove(plantRef);
    // Opcional: También podrías borrar sus lecturas aquí si quisieras limpiar la BD
    return true;
  } catch (error) {
    console.error("Error eliminando planta:", error);
    throw error;
  }
};

