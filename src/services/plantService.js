import { ref, push, set, get, child, update, remove } from 'firebase/database';
import { database } from './firebase';

const PLANTS_NODE = 'PLANTS';

// VALORES POR DEFECTO (Para revivir plantas viejas)
const DEFAULT_PLANT_VALUES = {
  soilMoistureMax: 80, 
  soilMoistureMin: 30,
  humidityMax: 80,
  humidityMin: 40,
  tempMax: 30,
  tempMin: 15,
  // Agregar aquí cualquier otro campo nuevo futuro
};

export const getAll = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, PLANTS_NODE));

    if (snapshot.exists()) {
      const data = snapshot.val();
      
      
      return Object.keys(data).map(key => ({
        id: key,
        ...DEFAULT_PLANT_VALUES, // 1. Ponemos los valores por defecto primero
        ...data[key]             // 2. Sobreescribimos con los datos reales de Firebase
                                 // (Si data[key] tiene el valor, gana. Si no, queda el default)
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
    const newPlantRef = push(plantsRef);
    const plantId = newPlantRef.key;

    // Aseguramos que al crear también lleve todos los campos
    const newPlant = {
      ...DEFAULT_PLANT_VALUES,
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

// Modificar datos de una planta existente
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

// Eliminar una planta por su ID
export const removePlant = async (plantId) => {
  try {
    const plantRef = ref(database, `${PLANTS_NODE}/${plantId}`);
    await remove(plantRef);
    return true;
  } catch (error) {
    console.error("Error eliminando planta:", error);
    throw error;
  }
};