import React from 'react';
import { Plant } from '../../../models/Plant';
import './PlantTimeline.css';
    const PlantTimeline = ({ plant }) => {
        const plantModel = new Plant(plant);
        const currentPhase = plantModel.getCurrentPhase();
        const phases = [
            'Germinación', 
            'Crecimiento Vegetativo', 
            'Floración', 
            'Fructificación', 
            'Cosecha'
        ];

        return (
            <div className="plant-timeline-container">
                <h3>{plant.commonName}</h3>
                <div className="timeline-bar">
                    {phases.map((phase, index) => (
                        <div 
                            key={phase}
                            className={`timeline-step ${phase === currentPhase.name ? 'current' : ''} ${index < phases.indexOf(currentPhase.name) ? 'completed' : ''}`}
                        >
                            <span className="step-dot"></span>
                            <span className="step-name">{phase}</span>
                        </div>
                    ))}
                </div>
                <p className="timeline-info">Fase actual: <strong>{currentPhase.name}</strong> ({currentPhase.progress.toFixed(0)}%)</p>
            </div>
        );
    };

export default PlantTimeline;