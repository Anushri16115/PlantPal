import type { Plant, GrowthLog, CareNote } from '../types/plant';

export const dummyPlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    dateAdded: '2024-01-15',
    lastWatered: '2025-08-22',
    wateringFrequency: 7,
    location: 'Living room corner',
    notes: 'Beautiful split leaves, loves bright indirect light. Growing very well!',
    imageUrl: '',
    growthLogs: []
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    dateAdded: '2024-02-10',
    lastWatered: '2025-08-20',
    wateringFrequency: 14,
    location: 'Bedroom windowsill',
    notes: 'Very low maintenance, perfect for beginners. Tolerates low light.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    dateAdded: '2024-03-05',
    lastWatered: '2025-08-18',
    wateringFrequency: 10,
    location: 'Near south window',
    notes: 'Dramatic large leaves, needs consistent watering schedule. Sensitive to changes.',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '4',
    name: 'Pothos',
    species: 'Epipremnum aureum',
    dateAdded: '2024-04-12',
    lastWatered: '2025-08-24',
    wateringFrequency: 5,
    location: 'Kitchen shelf',
    notes: 'Fast-growing trailing vine, very easy to propagate. Great air purifier.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '5',
    name: 'Peace Lily',
    species: 'Spathiphyllum wallisii',
    dateAdded: '2024-05-20',
    lastWatered: '2025-08-23',
    wateringFrequency: 6,
    location: 'Bathroom counter',
    notes: 'Beautiful white flowers, tells you when it needs water by drooping.',
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '6',
    name: 'Rubber Plant',
    species: 'Ficus elastica',
    dateAdded: '2024-06-08',
    lastWatered: '2025-08-21',
    wateringFrequency: 8,
    location: 'Office desk',
    notes: 'Glossy dark green leaves, grows quite tall. Wipe leaves regularly for shine.',
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '7',
    name: 'ZZ Plant',
    species: 'Zamioculcas zamiifolia',
    dateAdded: '2024-07-15',
    lastWatered: '2025-08-10',
    wateringFrequency: 21,
    location: 'Hallway corner',
    notes: 'Extremely drought tolerant, perfect for low light areas. Very resilient.',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '8',
    name: 'Spider Plant',
    species: 'Chlorophytum comosum',
    dateAdded: '2024-08-01',
    lastWatered: '2025-08-23',
    wateringFrequency: 7,
    location: 'Hanging by window',
    notes: 'Produces baby plants (spiderettes) that can be propagated easily.',
    imageUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '9',
    name: 'Aloe Vera',
    species: 'Aloe barbadensis',
    dateAdded: '2024-03-20',
    lastWatered: '2025-08-15',
    wateringFrequency: 14,
    location: 'Kitchen windowsill',
    notes: 'Medicinal succulent, great for burns and cuts. Very drought tolerant.',
    imageUrl: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '10',
    name: 'Boston Fern',
    species: 'Nephrolepis exaltata',
    dateAdded: '2024-04-05',
    lastWatered: '2025-08-24',
    wateringFrequency: 4,
    location: 'Bathroom shelf',
    notes: 'Loves humidity and indirect light. Fronds are delicate but beautiful.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '11',
    name: 'Philodendron',
    species: 'Philodendron hederaceum',
    dateAdded: '2024-05-12',
    lastWatered: '2025-08-22',
    wateringFrequency: 6,
    location: 'Living room bookshelf',
    notes: 'Heart-shaped leaves, trails beautifully. Very easy to care for.',
    imageUrl: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '12',
    name: 'Jade Plant',
    species: 'Crassula ovata',
    dateAdded: '2024-06-18',
    lastWatered: '2025-08-12',
    wateringFrequency: 10,
    location: 'Desk by window',
    notes: 'Thick succulent leaves, symbol of good luck. Easy to propagate.',
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '13',
    name: 'Bird of Paradise',
    species: 'Strelitzia reginae',
    dateAdded: '2024-07-02',
    lastWatered: '2025-08-21',
    wateringFrequency: 7,
    location: 'Corner by patio door',
    notes: 'Dramatic tropical plant with large paddle-shaped leaves. Needs bright light.',
    imageUrl: '',
    growthLogs: []
  },
  {
    id: '14',
    name: 'Calathea',
    species: 'Calathea orbifolia',
    dateAdded: '2024-08-10',
    lastWatered: '2025-08-23',
    wateringFrequency: 5,
    location: 'Bedroom dresser',
    notes: 'Beautiful patterned leaves that fold up at night. Loves humidity.',
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop',
    growthLogs: []
  },
  {
    id: '15',
    name: 'String of Pearls',
    species: 'Senecio rowleyanus',
    dateAdded: '2024-08-15',
    lastWatered: '2025-08-10',
    wateringFrequency: 12,
    location: 'Hanging in study',
    notes: 'Unique trailing succulent with bead-like leaves. Very drought tolerant.',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop',
    growthLogs: []
  }
];

export const dummyGrowthLogs: GrowthLog[] = [
  {
    id: 'gl1',
    plantId: '1',
    date: '2024-03-01',
    notes: 'New leaf unfurling! The fenestrations are getting bigger.',
    healthStatus: 'excellent',
    height: 45
  },
  {
    id: 'gl2',
    plantId: '1',
    date: '2024-06-15',
    notes: 'Significant growth spurt this spring. Added moss pole for support.',
    healthStatus: 'excellent',
    height: 62
  },
  {
    id: 'gl3',
    plantId: '2',
    date: '2024-04-20',
    notes: 'New shoots emerging from the soil. Very healthy growth.',
    healthStatus: 'good',
    height: 28
  },
  {
    id: 'gl4',
    plantId: '3',
    date: '2024-05-10',
    notes: 'Some brown spots on lower leaves, adjusted watering schedule.',
    healthStatus: 'fair',
    height: 85
  },
  {
    id: 'gl5',
    plantId: '4',
    date: '2024-07-01',
    notes: 'Trailing beautifully, propagated several cuttings for friends.',
    healthStatus: 'excellent'
  },
  {
    id: 'gl6',
    plantId: '5',
    date: '2024-06-01',
    notes: 'Beautiful white blooms appeared! First time flowering.',
    healthStatus: 'excellent',
    height: 35
  },
  {
    id: 'gl7',
    plantId: '6',
    date: '2024-07-15',
    notes: 'New leaves are glossier than ever. Wiping routine is working well.',
    healthStatus: 'excellent',
    height: 78
  },
  {
    id: 'gl8',
    plantId: '9',
    date: '2024-05-20',
    notes: 'Several new pups growing around the base. Very healthy growth.',
    healthStatus: 'excellent',
    height: 25
  },
  {
    id: 'gl9',
    plantId: '11',
    date: '2024-07-30',
    notes: 'Vines have grown 2 feet this month! Heart-shaped leaves getting larger.',
    healthStatus: 'excellent'
  },
  {
    id: 'gl10',
    plantId: '13',
    date: '2024-08-15',
    notes: 'New leaf unfurling, paddle shape is perfect. Growing towards the light.',
    healthStatus: 'good',
    height: 95
  }
];

export const dummyCareNotes: CareNote[] = [
  {
    id: 'cn1',
    plantId: '1',
    date: '2024-04-01',
    content: 'Applied diluted liquid fertilizer. Plant responded well with new growth.',
    type: 'fertilizing'
  },
  {
    id: 'cn2',
    plantId: '1',
    date: '2024-06-15',
    content: 'Repotted into larger container with fresh potting mix. Added moss pole.',
    type: 'repotting'
  },
  {
    id: 'cn3',
    plantId: '2',
    date: '2024-03-20',
    content: 'Wiped leaves clean and checked for pests. All looking healthy.',
    type: 'general'
  },
  {
    id: 'cn4',
    plantId: '3',
    date: '2024-05-15',
    content: 'Removed some brown leaves from bottom. Improved air circulation.',
    type: 'pruning'
  },
  {
    id: 'cn5',
    plantId: '4',
    date: '2024-06-30',
    content: 'Trimmed long vines and propagated cuttings in water.',
    type: 'pruning'
  },
  {
    id: 'cn6',
    plantId: '5',
    date: '2024-07-10',
    content: 'Watered thoroughly after soil felt dry. Leaves perked up nicely.',
    type: 'watering'
  },
  {
    id: 'cn7',
    plantId: '6',
    date: '2024-08-05',
    content: 'Applied balanced fertilizer for indoor plants. Growing season boost.',
    type: 'fertilizing'
  },
  {
    id: 'cn8',
    plantId: '7',
    date: '2024-08-20',
    content: 'First watering in 3 weeks! ZZ plants are incredibly drought tolerant.',
    type: 'watering'
  },
  {
    id: 'cn9',
    plantId: '8',
    date: '2024-08-10',
    content: 'Harvested 5 baby spider plants and potted them up. Great success rate!',
    type: 'general'
  },
  {
    id: 'cn10',
    plantId: '9',
    date: '2024-07-25',
    content: 'Used aloe gel on a minor burn - worked perfectly! Plant is so useful.',
    type: 'general'
  },
  {
    id: 'cn11',
    plantId: '10',
    date: '2024-08-05',
    content: 'Increased humidity with pebble tray. Fronds look much healthier now.',
    type: 'general'
  },
  {
    id: 'cn12',
    plantId: '11',
    date: '2024-08-01',
    content: 'Propagated stem cuttings in water. Roots appeared within a week!',
    type: 'general'
  },
  {
    id: 'cn13',
    plantId: '12',
    date: '2024-07-20',
    content: 'Repotted into terracotta pot for better drainage. Jade plants love it.',
    type: 'repotting'
  },
  {
    id: 'cn14',
    plantId: '13',
    date: '2024-08-12',
    content: 'Applied balanced fertilizer. Bird of paradise is a heavy feeder.',
    type: 'fertilizing'
  },
  {
    id: 'cn15',
    plantId: '14',
    date: '2024-08-18',
    content: 'Misted leaves and increased humidity. Calathea responded beautifully.',
    type: 'general'
  },
  {
    id: 'cn16',
    plantId: '15',
    date: '2024-08-20',
    content: 'Careful watering - these succulents hate wet feet. Soil dried completely first.',
    type: 'watering'
  }
];

// Function to initialize dummy data in localStorage
export function initializeDummyData() {
  const existingPlants = localStorage.getItem('plantpal_plants');
  const existingGrowthLogs = localStorage.getItem('plantpal_growth_logs');
  const existingCareNotes = localStorage.getItem('plantpal_care_notes');

  // Only add dummy data if no existing data
  if (!existingPlants) {
    localStorage.setItem('plantpal_plants', JSON.stringify(dummyPlants));
  }
  
  if (!existingGrowthLogs) {
    localStorage.setItem('plantpal_growth_logs', JSON.stringify(dummyGrowthLogs));
  }
  
  if (!existingCareNotes) {
    localStorage.setItem('plantpal_care_notes', JSON.stringify(dummyCareNotes));
  }
}