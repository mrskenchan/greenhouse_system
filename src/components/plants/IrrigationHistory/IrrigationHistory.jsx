import React, { useEffect, useState } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { database } from '../../../services/firebase';
import { format } from 'date-fns'; // <--- Importamos formateador
import { es } from 'date-fns/locale'; // <--- Importamos idioma español
import './IrrigationHistory.css';

const IrrigationHistory = ({ plantId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = ref(database, 'IRRIGATION_EVENTS');
    const q = query(eventsRef, orderByChild('timestamp'), limitToLast(10)); // Solo los últimos 10 para no saturar

    const unsubscribe = onValue(q, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedEvents = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(event => !plantId || event.plantId === plantId)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setEvents(loadedEvents);
      }
    });

    return () => unsubscribe();
  }, [plantId]);

  // Función auxiliar para formatear fecha segura
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    try {
        // Formato: "03 dic, 14:30"
        return format(new Date(timestamp), "d MMM, HH:mm", { locale: es });
    } catch {
        return 'Fecha inválida';
    }
  };

  return (
    <div className="irrigation-history-card">
      <div className="history-header">
        <h3>💧 Últimos Riegos</h3>
        <span className="badge-count">{events.length}</span>
      </div>
      
      <div className="history-list">
        {events.length === 0 ? (
            <div className="empty-state-history">
                <span style={{fontSize: '2rem'}}>🍃</span>
                <p>Sin actividad reciente.</p>
            </div>
        ) : (
            events.map(event => (
            <div key={event.id} className={`history-item ${event.type || 'manual'}`}>
                {/* Icono según tipo */}
                <div className="history-icon">
                    {event.type === 'manual' ? '👤' : '🤖'}
                </div>

                {/* Detalles */}
                <div className="history-details">
                    <span className="history-title">
                        {event.type === 'manual' ? 'Riego Manual' : 'Automático'}
                    </span>
                    <span className="history-time">
                        {formatDate(event.timestamp)}
                    </span>
                </div>

                {/* Estado */}
                <div className="history-status">
                    <span className="status-dot"></span> Completado
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default IrrigationHistory;