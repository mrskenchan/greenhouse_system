import { useState, useEffect } from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { Plant } from '../models/Plant';

export const usePlants = (filter = null) => {
  const { plants } = useGreenhouse();
  const [filteredPlants, setFilteredPlants] = useState([]);

  useEffect(() => {
    let result = plants.map(p => new Plant(p));

    if (filter) {
      if (filter.status) {
        result = result.filter(p => p.status === filter.status);
      }
      if (filter.location) {
        result = result.filter(p => p.location === filter.location);
      }
    }

    setFilteredPlants(result);
  }, [plants, filter]);

  return filteredPlants;
};
