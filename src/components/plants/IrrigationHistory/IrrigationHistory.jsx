import React, { useEffect, useState } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../../../services/firebase';
import './IrrigationHistory.css';

const IrrigationHistory = ({ plantId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Escuchamos el nodo IRRIGATION_EVENTS
    const eventsRef = ref(database, 'IRRIGATION_EVENTS');
    const q = query(eventsRef, orderByChild('timestamp'), limitToLast(20));

    const unsubscribe = onValue(q, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedEvents = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          // Filtramos solo los de esta planta (o todos si no se pasa plantId)
          .filter(event => !plantId || event.plantId === plantId)
          .sort((a, b) => b.timestamp - a.timestamp); // Más recientes primero
        
        setEvents(loadedEvents);
      }
    });

    return () => unsubscribe();
  }, [plantId]);

  return (
    <div className="irrigation-history">
      <h3>💧 Historial de Riegos</h3>
      <div className="history-list">
        {events.length === 0 ? (
            <p className="no-data">No hay riegos registrados.</p>
        ) : (
            events.map(event => (
            <div key={event.id} className={`history-item ${event.type}`}>
                <div className="history-info">
                    <span className="history-type">
                        {event.type === 'manual' ? '👤 Manual' : '🤖 Automático'}
                    </span>
                    <span className="history-date">
                        {new Date(event.timestamp).toLocaleString()}
                    </span>
                </div>
                <span className="history-status">Completado</span>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default IrrigationHistory;