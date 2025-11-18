import { useMemo } from 'react';
import { useGreenhouse } from './useGreenhouse';
import { Plant } from '../models/Plant';

export const usePlants = (filter = null) => {
  const { plants } = useGreenhouse();
  
  const filteredPlants = useMemo(() => {
    let result = plants.map(p => new Plant(p));

      if (filter) {
        if (filter.status) {
          result = result.filter(p => p.status === filter.status);
        }
        if (filter.location) {
          result = result.filter(p => p.location === filter.location);
        }
    }
    return result;
  }, [plants, filter]); // Dependencias: Solo recalcular si plants o filter cambian

  return filteredPlants;
};
