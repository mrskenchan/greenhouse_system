import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Cargando Sistema de Invernadero...</p>
    </div>
  );
};

export default Loader;