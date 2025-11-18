// src/models/Reading.js
export class Reading {
    constructor(data) {
        // Asignar todas las propiedades recibidas
        Object.assign(this, data);
        this.timestamp = new Date(data.timestamp); // Asegurar que sea objeto Date
    }

    isCritical() {
        // Ejemplo de lógica crítica: temperatura muy alta
        return this.temperature > 35; 
    }

    getFormattedTime() {
        return this.timestamp.toLocaleTimeString();
    }
}