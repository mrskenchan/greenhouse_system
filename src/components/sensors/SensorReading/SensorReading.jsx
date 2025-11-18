import React from 'react';
import './SensorReading.css'; 

const SensorReading = ({ label, value, unit, icon, range, status, message }) => {
    // La tarjeta de sensor pasa muchas propiedades; las usamos para el estilo
    const statusClass = status ? `status-${status}` : '';

    return (
        <div className={`reading-item ${statusClass}`}>
            <span className="reading-icon">{icon}</span>
            <div className="reading-content">
                <div className="reading-label">{label}</div>
                <div className="reading-value">{value}{unit}</div>
                {message && <p className="reading-message">{message}</p>}
                {range && <span className="reading-range">Rango: {range}</span>}
            </div>
        </div>
    );
};

export default SensorReading;