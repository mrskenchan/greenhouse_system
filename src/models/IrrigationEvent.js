export class IrrigationEvent {
  constructor(data) {
    Object.assign(this, data);
    // Aseguramos que la fecha sea un objeto Date
    this.timestamp = new Date(data.timestamp || Date.now()); 
  }

  getDurationMinutes() {
    // Calcula la duración si el evento ya terminó
    if (this.endTime && this.startTime) {
      return ((new Date(this.endTime) - new Date(this.startTime)) / 60000).toFixed(1);
    }
    // Si aún está corriendo, devuelve 0 o usa un placeholder
    return 0;
  }
}