import { format, differenceInDays } from 'date-fns';
export const getDaysElapsed = (dateString) => {
     const planted = new Date(dateString)
 return differenceInDays(new Date(), planted);
};

export const formatTimestamp = (timestamp) => {
 return format(new Date(timestamp), 'MMM dd, HH:mm');
};

export const calculateProgress = (start, end) => {
 // Lógica de progreso entre dos fechas
 if (start >= end) return 100;
 return Math.min(100, Math.floor((start / end) * 100));
};