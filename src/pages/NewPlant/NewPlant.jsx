import React from 'react';
import PlantForm from '../../components/plants/PlantForm/PlantForm';
import './NewPlant.css';

const NewPlant = () => {
  return (
    <div className="new-plant-page">
      <div className="page-header">
        <h1>🌱 Registrar Nueva Planta</h1>
        <p>Configura los parámetros vitales y ciclos de vida para iniciar el monitoreo.</p>
      </div>
      <PlantForm />
    </div>
  );
};

export default NewPlant;