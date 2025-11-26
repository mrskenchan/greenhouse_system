import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGreenhouse } from '../../hooks/useGreenhouse';
import PlantForm from '../../components/plants/PlantForm/PlantForm';
import Loader from '../../components/common/Loader/Loader';

const EditPlant = () => {
  const { id } = useParams();
  const { plants, loading } = useGreenhouse();
  const navigate = useNavigate();

  // derivar los datos de la planta de forma sincrónica (sin setState en efecto)
  const plantToEdit = useMemo(() => {
    if (loading) return null;
    const found = plants.find(p => p.id === id);
    if (!found) return null;
    return {
      ...found,
      plantingDate: found.plantingDate?.split('T')[0] ?? found.plantingDate
    };
  }, [id, plants, loading]);

  // Redirigir si no se encuentra la planta
  useEffect(() => {
    if (!loading && !plantToEdit) {
      navigate('/');
    }
  }, [plantToEdit, loading, navigate]);

  if (loading || !plantToEdit) return <Loader />;

  return (
    <div className="edit-page">
      <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>✏️ Editar Planta</h1>
      <PlantForm initialData={plantToEdit} />
    </div>
  );
};

export default EditPlant;