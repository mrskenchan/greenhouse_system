import React, { useState, useEffect } from 'react'; // <--- 1. Agregado useEffect
import { useSearchParams } from 'react-router-dom'; 
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { useReadingsHistory } from '../../hooks/useReadingsHistory';
import TemperatureChart from '../../components/sensors/TemperatureChart/TemperatureChart';
import SensorReading from '../../components/sensors/SensorReading/SensorReading';
import Loader from '../../components/common/Loader/Loader';
import './Sensors.css';

const Sensors = () => {
    const { plants, loading: plantsLoading } = useGreenhouse();
    
    // Obtener parámetros de URL
    const [searchParams] = useSearchParams();
    const urlPlantId = searchParams.get('id');

    // Estado inicial
    const [selectedPlantId, setSelectedPlantId] = useState(urlPlantId || null);
    
    const { history, loading: historyLoading } = useReadingsHistory(selectedPlantId);

    // 2. EFECTO CORREGIDO (Sin bucles infinitos)
    useEffect(() => {
        // Solo ejecutamos si ya cargaron las plantas
        if (plants.length > 0) {
            
            // Caso A: La URL manda (Navegación desde "Ver Detalles")
            if (urlPlantId) {
                // Verificamos si la planta existe y si NO está seleccionada ya
                const plantExists = plants.find(p => p.id === urlPlantId);
                if (plantExists && selectedPlantId !== urlPlantId) {
                    setTimeout(() => {
                        setSelectedPlantId(urlPlantId);
                    }, 0);
                }
            } 
            // Caso B: Carga inicial sin URL (Dashboard general)
            else if (!selectedPlantId) {
                // Seleccionamos la primera planta disponible
                setTimeout(() => {
                        setSelectedPlantId(plants[0].id);
                    }, 0);
            }
        }
        // Quitamos 'selectedPlantId' de las dependencias para evitar el bucle
    }, [plants, urlPlantId]); 

    if (plantsLoading) return <Loader />;

    // Buscar datos de la planta seleccionada
    const selectedPlant = plants.find(p => p.id === selectedPlantId);
    
    // Obtener última lectura del historial para las tarjetas
    const latestReading = history.length > 0 ? history[history.length - 1] : null;

    return (
        <div className="sensors-page">
            <div className="sensors-header">
                <h1>📊 Monitoreo Detallado</h1>
                
                <div className="plant-selector">
                    <label>Seleccionar Planta:</label>
                    <select 
                        value={selectedPlantId || ''} 
                        onChange={(e) => setSelectedPlantId(e.target.value)}
                    >
                        {plants.map(p => (
                            <option key={p.id} value={p.id}>{p.commonName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedPlantId && selectedPlant ? (
                <div className="sensors-grid">
                    {/* Gráficos */}
                    <div className="chart-section">
                        <div className="chart-card">
                            <h3>🌡️ Histórico de Temperatura</h3>
                            {historyLoading ? (
                                <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
                                    Cargando historial...
                                </div>
                            ) : (
                                <TemperatureChart data={history} />
                            )}
                        </div>
                    </div>

                    {/* Panel Lateral: Lectura Actual */}
                    <div className="readings-panel">
                        <h3>Lectura Actual</h3>
                        {latestReading ? (
                            <>
                                <SensorReading 
                                    label="Temperatura" 
                                    value={latestReading.temperature} unit="°C" icon="🌡️" 
                                    status={latestReading.temperature > selectedPlant.tempMax ? 'high' : 'normal'}
                                />
                                <SensorReading 
                                    label="Humedad" 
                                    value={latestReading.humidity} unit="%" icon="💧" 
                                />
                                <SensorReading 
                                    label="Suelo" 
                                    value={latestReading.soilMoisture} unit="%" icon="🌱" 
                                    status={latestReading.soilMoisture < selectedPlant.soilMoistureMin ? 'critical' : 'normal'}
                                />
                                <div className="timestamp">
                                    Actualizado: {latestReading.timeLabel}
                                </div>
                            </>
                        ) : (
                            <div style={{padding: '1rem', textAlign: 'center', color: '#999'}}>
                                <p>Esperando datos...</p>
                                <small style={{display:'block', marginTop:'5px'}}>Verifica tu Arduino</small>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>No hay plantas registradas o seleccionadas.</p>
            )}
        </div>
    );
};

export default Sensors;