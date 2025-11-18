// src/models/Alert.js
export class Alert {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date(data.createdAt || Date.now());
    }

    getSeverity() {
        if (this.type === 'temp_critico' || this.type === 'water_fail') {
            return 'danger';
        }
        return 'warning';
    }

    getRelativeTime() {
        // Lógica simple de hace cuánto tiempo (ej: 'hace 5 minutos')
        const diffInMinutes = Math.floor((Date.now() - this.createdAt) / 60000);
        if (diffInMinutes < 60) return `hace ${diffInMinutes} minutos`;
        return this.createdAt.toLocaleDateString();
    }
}