import { useEffect, useRef } from 'react';
import { useSensors } from './useSensors';
import { createAlert } from '../services/alertService';
import toast from 'react-hot-toast';

export const useAlertLogger = () => {
  const { warnings } = useSensors();
  
  // Usamos 'refs' para recordar qué alertas ya guardamos y no repetirlas
  const hasLoggedWater = useRef(false);

  useEffect(() => {
    // 1. Buscar si hay alerta de agua activa en los sensores
    const waterWarning = warnings.find(w => 
      w.issues.some(issue => issue.includes('TANQUE') || issue.includes('AGUA'))
    );

    // CASO A: Hay problema de agua Y no lo hemos registrado todavía
    if (waterWarning && !hasLoggedWater.current) {
      console.log("💾 Registrando alerta en Historial: Tanque Vacío");
      
      // 1. Guardar en Firebase
      createAlert({
        plantId: waterWarning.plantId,
        type: 'water_critical',
        message: `Nivel de agua crítico en ${waterWarning.plantName}`,
        severity: 'danger'
      });

      // 2. Avisar visualmente
      toast.error(`¡Alerta registrada: ${waterWarning.plantName}!`, { duration: 5000 });

      // 3. Bloquear para no repetir (Candado puesto)
      hasLoggedWater.current = true;
    }

    // CASO B: Ya no hay problema (llenaron el tanque)
    if (!waterWarning && hasLoggedWater.current) {
      console.log("✅ Tanque rellenado. Reseteando vigilante.");
      // Quitamos el candado para poder avisar la próxima vez que se vacíe
      hasLoggedWater.current = false;
    }

  }, [warnings]); // Se ejecuta cada vez que cambian los sensores
};