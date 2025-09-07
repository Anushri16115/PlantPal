import type { Plant } from '../types/plant';

interface WaterStatusProps {
  plant: Plant;
}

export function WaterStatus({ plant }: WaterStatusProps) {
  const getDaysUntilWatering = () => {
    const lastWatered = new Date(plant.lastWatered);
    const today = new Date();
    const daysSinceWatered = Math.floor((today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
    return plant.wateringFrequency - daysSinceWatered;
  };

  const daysUntilWatering = getDaysUntilWatering();
  
  const getStatusInfo = () => {
    if (daysUntilWatering < 0) {
      return {
        status: 'overdue',
        icon: '🚨',
        text: `${Math.abs(daysUntilWatering)} days overdue`,
        className: 'water-status overdue'
      };
    } else if (daysUntilWatering === 0) {
      return {
        status: 'today',
        icon: '💧',
        text: 'Water today',
        className: 'water-status today'
      };
    } else if (daysUntilWatering <= 2) {
      return {
        status: 'soon',
        icon: '⏰',
        text: `Water in ${daysUntilWatering} days`,
        className: 'water-status soon'
      };
    } else {
      return {
        status: 'good',
        icon: '✅',
        text: `Water in ${daysUntilWatering} days`,
        className: 'water-status good'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={statusInfo.className}>
      <span className="water-icon">{statusInfo.icon}</span>
      <span className="water-text">{statusInfo.text}</span>
    </div>
  );
}
