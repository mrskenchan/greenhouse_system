import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TemperatureChart.css';

const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="chart-container">No hay datos históricos.</div>;

  // Formatear datos de tiempo (ej: si dataKey es 'time')
  const formattedData = data.map(item => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="chart-container">
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-text-light)" />
            <YAxis unit="°C" domain={['auto', 'auto']} stroke="var(--color-text-light)" />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="var(--color-danger)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureChart;