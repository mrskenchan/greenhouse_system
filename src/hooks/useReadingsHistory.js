import { useState, useEffect, startTransition } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../services/firebase';

export const useReadingsHistory = (plantId, limit = 20) => {
  const [history, setHistory] = useState([]);
  // Inicializamos en 'true' solo si hay un ID, para que la UI muestre carga
  const [loading, setLoading] = useState(!!plantId);

  useEffect(() => {
    // 1. Si no hay ID, simplemente salimos.
    if (!plantId) {
        return;
    }

    // 2. Si hay ID, activamos la carga y suscripción
    startTransition(() => {
      setLoading(true);
    });

    const readingsRef = ref(database, `READINGS/${plantId}`);
    const historyQuery = query(readingsRef, orderByChild('timestamp'), limitToLast(limit));

    const unsubscribe = onValue(historyQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        .filter(item => item.timestamp && item.temperature !== undefined)
        .sort((a, b) => a.timestamp - b.timestamp); // Ordenar por tiempo
        
        setHistory(formattedData);
      } else {
        setHistory([]);
      }
      // Aquí está bien llamar a setLoading porque es asíncrono (dentro del callback)
      setLoading(false);
    });

    return () => unsubscribe();
  }, [plantId, limit]);

  return { history, loading };
};