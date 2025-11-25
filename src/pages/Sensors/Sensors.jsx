import React, { useState } from 'react';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import { useReadingsHistory } from '../../hooks/useReadingsHistory';
import TemperatureChart from '../../components/sensors/TemperatureChart/TemperatureChart';
import SensorReading from '../../components/sensors/SensorReading/SensorReading';
import Loader from '../../components/common/Loader/Loader';
import './Sensors.css';

const Sensors = () => {
    const { plants, loading: plantsLoading } = useGreenhouse();
    // Estado para seleccionar qué planta ver (por defecto la primera si existe)
    const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || null);
    
    // Hook de historial conectado a la planta seleccionada
    const { history, loading: historyLoading } = useReadingsHistory(selectedPlantId);

    // Efecto para seleccionar la primera planta automáticamente al cargar
    React.useEffect(() => {
        if (plants.length > 0 && !selectedPlantId) {
            setSelectedPlantId(plants[0].id);
        }
    }, [plants, selectedPlantId]);

    if (plantsLoading) return <Loader />;

    // Buscar datos de la planta seleccionada para mostrar nombre, etc.
    const selectedPlant = plants.find(p => p.id === selectedPlantId);
    const latestReading = history.length > 0 ? history[history.length - 1] : null;

    return (
        <div className="sensors-page">
            <div className="sensors-header">
                <h1>📊 Monitoreo Detallado</h1>
                
                {/* Selector de Planta */}
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
                    {/* COLUMNA IZQUIERDA: GRÁFICOS */}
                    
                    <div className="chart-section">
                      <div className="chart-card">
                        <h3>🌡️ Histórico de Temperatura</h3>
                        {/* SOLUCIÓN: Usamos historyLoading para dar feedback visual */}
                        {historyLoading ? (
                            <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
                                Cargando historial...
                            </div>
                        ) : (
                            <TemperatureChart data={history} />
                        )}
                      </div>
                    </div>

                    {/* COLUMNA DERECHA: ÚLTIMA LECTURA */}
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
                                    Actualizado: {new Date(latestReading.timestamp).toLocaleTimeString()}
                                </div>
                            </>
                        ) : (
                            <p>Esperando datos del Arduino...</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>No hay plantas registradas. Ve al Dashboard para agregar una.</p>
            )}
        </div>
    );
};

export default Sensors;