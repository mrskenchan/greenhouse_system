import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TemperatureChart.css';

const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-container empty"><p>Esperando datos...</p></div>;
  }

  return (
    <div className="chart-container">
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            {/* Usamos 'timeLabel' que creamos en el Hook */}
            <XAxis dataKey="timeLabel" stroke="#9ca3af" fontSize={11} tickMargin={10} />
            
            {/* Usamos 'temperature' ya normalizado */}
            <YAxis unit="°C" stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
            
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="#e74c3c" 
              fill="url(#colorTemp)" 
              strokeWidth={3} 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;