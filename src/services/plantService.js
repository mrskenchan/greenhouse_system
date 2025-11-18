/* src/services/plantService.js */

// Helper para crear fechas pasadas (para simular que ya plantaste hace tiempo)
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const getAll = async () => {
  return [
    { 
      id: 1, 
      commonName: 'Tomate Cherry', 
      status: 'active',
      // IMPORTANTE: Tu modelo usa 'plantingDate', no 'sowingDate'
      plantingDate: daysAgo(35), // Plantado hace 35 días
      
      // Ciclos definidos (días) para que tu lógica funcione
      germinationDays: 7,
      growthDays: 45,
      floweringDays: 20,
      fruitingDays: 30,
      harvestDays: 10,

      // Umbrales para alertas
      tempMin: 18, tempMax: 28, 
      humidityMin: 40, humidityMax: 70
    },
    { 
      id: 2, 
      commonName: 'Lechuga Hidropónica', 
      status: 'active',
      plantingDate: daysAgo(12), // Plantado hace 12 días
      
      germinationDays: 5,
      growthDays: 35,
      floweringDays: 0, // La lechuga se cosecha antes de florecer
      fruitingDays: 0,
      harvestDays: 5,

      tempMin: 15, tempMax: 22, 
      humidityMin: 60, humidityMax: 80
    }
  ];
};

export const create = async (data) => {
  // Simulación de creación
  return { 
    ...data, 
    id: Date.now(),
    plantingDate: new Date().toISOString() 
  };
};