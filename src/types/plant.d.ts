export interface Plant {
  id: string;
  name: string;
  species: string;
  dateAdded: string;
  lastWatered: string;
  wateringFrequency: number; // days between watering
  location: string;
  notes: string;
  imageUrl?: string; // Primary image for backward compatibility
  images?: PlantImage[]; // Multiple images from API
  growthLogs: GrowthLog[];
}

export interface PlantImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  source: 'unsplash' | 'pexels' | 'user' | 'default';
  photographer?: string;
  photographerUrl?: string;
  isPrimary?: boolean;
}

export interface GrowthLog {
  id: string;
  plantId: string;
  date: string;
  notes: string;
  imageUrl?: string;
  height?: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CareNote {
  id: string;
  plantId: string;
  date: string;
  content: string;
  type: 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'general';
}

export interface WaterReminder {
  plantId: string;
  plantName: string;
  daysOverdue: number;
  isOverdue: boolean;
}
