import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import './TemperatureChart.css';

const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container empty">
        <p>Esperando datos del sensor...</p>
        <small>Verifica que el Arduino esté enviando datos...</small>
      </div>
    );
  }

  // 1. TRADUCTOR DE DATOS (El paso clave)
  // Convertimos los nombres del Arduino a los nombres del Gráfico
  const formattedData = data.map(item => {
    // Detectamos qué nombre está usando el Arduino
    const tempValue = item.temperature ?? item.tempAire ?? item.tAire ?? 0;
    const humValue = item.humidity ?? item.humAire ?? item.hAire ?? 0;
    
    return {
      ...item,
      // Formatear hora (HH:MM:SS)
      displayTime: new Date(item.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }),
      // Asegurar que sean números
      temperature: Number(tempValue),
      humidity: Number(humValue)
    };
  });

  return (
    <div className="chart-container">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="displayTime" 
              stroke="#9ca3af" 
              fontSize={11} 
              tickMargin={10}
              minTickGap={30}
            />
            
            <YAxis 
              unit="°C" 
              stroke="#9ca3af" 
              fontSize={11} 
              domain={['auto', 'auto']} // Auto-escala para que la curva se note
            />
            
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="#e74c3c" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;