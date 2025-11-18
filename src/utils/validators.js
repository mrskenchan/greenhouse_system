export const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

export const isThresholdMet = (current, min, max) => {
  // Verifica si el valor actual está fuera del rango óptimo
  return current < min || current > max;
};