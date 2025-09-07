import { useMemo } from 'react';
import type { Plant, WaterReminder } from '../types/plant';

export function useWaterReminder(plants: Plant[]): WaterReminder[] {
  return useMemo(() => {
    const today = new Date();
    
    return plants.map(plant => {
      const lastWateredDate = new Date(plant.lastWatered);
      const daysSinceWatered = Math.floor((today.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysOverdue = daysSinceWatered - plant.wateringFrequency;
      
      return {
        plantId: plant.id,
        plantName: plant.name,
        daysOverdue: Math.max(0, daysOverdue),
        isOverdue: daysOverdue > 0
      };
    }).filter(reminder => reminder.isOverdue);
  }, [plants]);
}
