export const getLatestReadings = async () => {
  // Devuelve array de lecturas simuladas
  return [
    { plantId: 1, temperature: 24.5, humidity: 60, soilMoisture: 45, timestamp: new Date() },
    { plantId: 2, temperature: 20.0, humidity: 65, soilMoisture: 70, timestamp: new Date() }
  ];
};

export const subscribe = (plantId, callback) => {
  // Simula WebSocket llegando cada 5 segundos
  const interval = setInterval(() => {
    const fakeReading = {
      plantId: plantId || 1, // Si no hay ID, manda del 1
      temperature: +(20 + Math.random() * 5).toFixed(1),
      humidity: +(50 + Math.random() * 20).toFixed(0),
      soilMoisture: +(30 + Math.random() * 40).toFixed(0),
      timestamp: new Date()
    };
    callback(fakeReading);
  }, 5000);

  return { unsubscribe: () => clearInterval(interval) };
};