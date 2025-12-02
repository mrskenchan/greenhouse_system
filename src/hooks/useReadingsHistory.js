import { useState, useEffect, startTransition } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../services/firebase';

export const useReadingsHistory = (plantId, limit = 20) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(!!plantId);

  useEffect(() => {
    if (!plantId) return;
    // --- DEBUG: ESTO NOS DIRÁ LA VERDAD ---
    console.log("🔍 ID PLANTA SELECCIONADA:", plantId);
    console.log(`📡 CONECTANDO A RUTA: READINGS/${plantId}`);
    // --------------------------------------

    startTransition(() => setLoading(true));

    const readingsRef = ref(database, `READINGS/${plantId}`);
    // Pedimos los últimos 20 registros ordenados por tiempo
    const historyQuery = query(readingsRef, orderByChild('timestamp'), limitToLast(limit));

    const unsubscribe = onValue(historyQuery, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        
        // --- AQUÍ ESTÁ LA MAGIA DE LA EXTRACCIÓN ---
        const formattedData = Object.keys(rawData).map(key => {
          const item = rawData[key];
          
          // 1. NORMALIZACIÓN: Buscamos cualquier nombre posible
          // El Arduino manda 'tempAire', la web espera 'temperature'
          const tempVal = item.tempAire ?? item.temperature ?? item.tAire ?? 0;
          const humVal = item.humAire ?? item.humidity ?? item.hAire ?? 0;
          const soilVal = item.humSuelo ?? item.soilMoisture ?? 0;

          return {
            id: key,
            timestamp: item.timestamp,
            // 2. CREAMOS EL ESTÁNDAR LIMPIO
            temperature: Number(tempVal), 
            humidity: Number(humVal),
            soilMoisture: Number(soilVal),
            // Formateamos la hora aquí mismo para facilitar el gráfico
            timeLabel: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp); // Aseguramos orden cronológico
        
        // DEBUG: ¡Mira esto en la consola (F12) para ver qué llega!
        console.log("📊 DATOS PROCESADOS:", formattedData);

        setHistory(formattedData);
      } else {
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [plantId, limit]);

  return { history, loading };
};