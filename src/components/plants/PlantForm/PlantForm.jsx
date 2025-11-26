import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGreenhouse } from '../../../hooks/useGreenhouse';
import toast from 'react-hot-toast';
import './PlantForm.css';

const PlantForm = ({ initialData = null  }) => {
  const { addPlant, modifyPlant } = useGreenhouse();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    commonName: initialData?.commonName || '',
    plantingDate: initialData?.plantingDate || new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    // Ciclos (Días)
    germinationDays: 7,
    growthDays: 30,
    floweringDays: 0,
    fruitingDays: 0,
    harvestDays: 5,
    // Umbrales
    tempMin: 15,
    tempMax: 30,
    humidityMin: 40,
    humidityMax: 80,
    soilMoistureMin: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Days') || name.includes('Min') || name.includes('Max') 
              ? Number(value) 
              : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convertir fecha a ISO string completo para compatibilidad
      const submissionData = {
        ...formData,
        plantingDate: new Date(formData.plantingDate).toISOString()
      };
      
      if (initialData) {
        // Editando planta existente
        await modifyPlant(initialData.id, submissionData);
        toast.success('¡Planta actualizada correctamente!');
      } else {
        // Creando nueva planta
        await addPlant(submissionData);
        toast.success('¡Planta registrada correctamente!');
      }
      
      navigate('/'); // Volver al dashboard
    } catch (error) {
      toast.error('Error al guardar la planta');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      
      {/* SECCIÓN 1: DATOS GENERALES */}
      <section className="form-section">
        <h3>🌱 Información General</h3>
        <div className="form-group">
          <label>Nombre de la Planta</label>
          <input 
            type="text" name="commonName" required placeholder="Ej: Pimiento Rojo"
            value={formData.commonName} onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Fecha de Siembra</label>
          <input 
            type="date" name="plantingDate" required
            value={formData.plantingDate} onChange={handleChange} 
          />
        </div>
      </section>

      {/* SECCIÓN 2: CICLOS DE VIDA (Lógica de fases) */}
      <section className="form-section">
        <h3>⏳ Configuración de Ciclos (Días)</h3>
        <p className="form-hint">Define cuánto dura cada etapa para calcular el progreso.</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Germinación</label>
            <input type="number" name="germinationDays" min="1" value={formData.germinationDays} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Crecimiento Veg.</label>
            <input type="number" name="growthDays" min="1" value={formData.growthDays} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Floración</label>
            <input type="number" name="floweringDays" min="0" value={formData.floweringDays} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Fructificación</label>
            <input type="number" name="fruitingDays" min="0" value={formData.fruitingDays} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Cosecha</label>
            <input type="number" name="harvestDays" min="1" value={formData.harvestDays} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: UMBRALES DE SENSORES */}
      <section className="form-section">
        <h3>🌡️ Umbrales de Alerta</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Temp. Mín (°C)</label>
            <input type="number" name="tempMin" value={formData.tempMin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Temp. Máx (°C)</label>
            <input type="number" name="tempMax" value={formData.tempMax} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Humedad Mín (%)</label>
            <input type="number" name="humidityMin" value={formData.humidityMin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Humedad Máx (%)</label>
            <input type="number" name="humidityMax" value={formData.humidityMax} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Humedad Suelo Mín (%)</label>
            <input type="number" name="soilMoistureMin" value={formData.soilMoistureMin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Suelo Máx (%) 🚫</label>
            <input type="number" name="soilMoistureMax" value={formData.soilMoistureMax} onChange={handleChange} />
          </div>
        </div>
      </section>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Planta'}
      </button>
    </form>
  );
};

export default PlantForm;