import React from 'react';
import { useIrrigation } from '../../../hooks/useIrrigation';
import './IrrigationStatus.css';
    const IrrigationStatus = ({ plantId }) => {
        const { isRiegoRunning, startIrrigation } = useIrrigation();
    const handleIrrigation = () => {
        if (window.confirm('¿Confirmar riego manual?')) {
        startIrrigation(plantId);
        }
    };

    return (
        <div className="irrigation-status">
                <p className="status-label">Estado del Riego:</p>
            <div className={`status-indicator ${isRiegoRunning ? 'running' : 'idle'}`}>
                {isRiegoRunning ? '💧 Riego en Curso...' : '✅ Sistema Listo'}
            </div>
            <button 
                className="btn-primary btn-manual-irrigation"
                onClick={handleIrrigation}
                disabled={isRiegoRunning}
            >
                {isRiegoRunning ? 'Esperando...' : 'Iniciar Riego Manual'}
            </button>
        </div>
    );
};

export default IrrigationStatus;