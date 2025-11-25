import { ref, push, set, get, child } from 'firebase/database';
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
 * 🛠️ FUNCIÓN DE CONFIGURACIÓN INICIAL (SEED)
 * Ejecuta esto una vez para crear la estructura base y obtener el ID para Arduino.
 */
export const seedDatabase = async () => {
  console.log("Iniciando creación de estructura base...");
  const plantsRef = ref(database, PLANTS_NODE);
  
  // 1. Generar referencia y UID
  const newPlantRef = push(plantsRef);
  const plantId = newPlantRef.key;

  // 2. Datos de la Planta Inicial (Tomate Cherry)
  const initialPlant = {
    id: plantId,
    commonName: "Tomate Cherry",
    description: "Planta de prueba inicial",
    plantingDate: new Date().toISOString(),
    
    // Ciclos (Días)
    germinationDays: 7,
    growthDays: 45,
    floweringDays: 20,
    fruitingDays: 30,
    harvestDays: 10,
    
    // Umbrales de Sensores (Para alertas)
    tempMin: 18,
    tempMax: 28,
    humidityMin: 40,
    humidityMax: 70,
    soilMoistureMin: 30 // % Mínimo antes de alerta de riego
  };

  try {
    // 3. Guardar en Firebase
    await set(newPlantRef, initialPlant);
    
    const mensaje = `✅ ESTRUCTURA CREADA CON ÉXITO.\n\n⚠️ COPIA ESTE ID PARA TU ARDUINO:\n${plantId}`;
    console.log(mensaje);
    alert(mensaje);
    
    return plantId;
  } catch (error) {
    console.error("Error fatal al inicializar:", error);
    alert("Error al conectar con Firebase. Revisa la consola.");
  }
};