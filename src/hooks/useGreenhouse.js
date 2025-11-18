import { useContext } from 'react';
import { GreenhouseContext } from '../context/GHContext.jsx';

export const useGreenhouse = () => {
    const context = useContext(GreenhouseContext);
    if (!context) {
        // Asegurar que siempre se use dentro del Provider
        throw new Error('useGreenhouse debe usarse dentro de GreenhouseProvider');
    }
    return context;
};