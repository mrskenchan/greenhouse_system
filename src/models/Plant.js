export class Plant {
  constructor(data) {
    Object.assign(this, data);
  }

  getCurrentPhase() {
    const daysElapsed = this.getDaysElapsed();
    const totalDays = this.germinationDays + this.growthDays + 
                      this.floweringDays + this.fruitingDays + this.harvestDays;

    let currentDay = 0;
    const phases = [
      { name: 'Germinación', days: this.germinationDays },
      { name: 'Crecimiento Vegetativo', days: this.growthDays },
      { name: 'Floración', days: this.floweringDays },
      { name: 'Fructificación', days: this.fruitingDays },
      { name: 'Cosecha', days: this.harvestDays }
    ];

    for (const phase of phases) {
      if (daysElapsed <= currentDay + phase.days) {
        const phaseProgress = ((daysElapsed - currentDay) / phase.days) * 100;
        return {
          name: phase.name,
          progress: Math.min(phaseProgress, 100),
          daysRemaining: currentDay + phase.days - daysElapsed
        };
      }
      currentDay += phase.days;
    }

    return { name: 'Completado', progress: 100, daysRemaining: 0 };
  }

  getDaysElapsed() {
    const today = new Date();
    const planted = new Date(this.plantingDate);
    const diff = today - planted;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getHarvestDate() {
    const totalDays = this.germinationDays + this.growthDays + 
                      this.floweringDays + this.fruitingDays + this.harvestDays;
    const harvestDate = new Date(this.plantingDate);
    harvestDate.setDate(harvestDate.getDate() + totalDays);
    return harvestDate;
  }
}
