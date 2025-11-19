import React from 'react';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { usePlants } from '../../hooks/usePlants';
import PlantTimeline from '../../components/plants/PlantTimeline/PlantTimeline'; 
import './Calendar.css';

const Calendar = () => {
    const { loading } = useGreenhouse();
    const filteredPlants = usePlants(); // Asume que usePlants trae todas las plantas por defecto

    if (loading) return <div>Cargando calendario...</div>;

    const phases = ['Germinación', 'Crecimiento', 'Floración', 'Fructificación', 'Cosecha'];

    return (
        <div className="calendar-page">
            <h1>🗓️ Calendario del Ciclo de Plantas</h1>
            
            <div className="calendar-options">
                 {/* Aquí iría el selector de plantas */}
                 <select>
                    <option>Todas las plantas</option>
                 </select>
            </div>
            
            <div className="legend-container">
                <p className="legend-title">Leyenda de Fases:</p>
                <div className="phases-list">
                    {phases.map(p => <span key={p} className="phase-legend-item">{p}</span>)}
                </div>
            </div>

            <section className="timeline-section">
                {filteredPlants.map(plant => (
                    <PlantTimeline key={plant.id} plant={plant} />
                ))}
            </section>
        </div>
    );
};

export default Calendar;