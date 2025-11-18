import { useContext } from 'react';
import { NotificationContext } from '../context/NContext';

export const useNotifications = () => useContext(NotificationContext);