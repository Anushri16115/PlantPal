const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let plants = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    dateAdded: '2024-01-15',
    lastWatered: '2025-08-22',
    wateringFrequency: 7,
    location: 'Living room corner',
    notes: 'Beautiful split leaves, loves bright indirect light. Growing very well!',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
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
];

let growthLogs = [
  {
    id: 'gl1',
    plantId: '1',
    date: '2024-03-01',
    notes: 'New leaf unfurling! The fenestrations are getting bigger.',
    healthStatus: 'excellent',
    height: 45
  }
];

let careNotes = [
  {
    id: 'cn1',
    plantId: '1',
    date: '2024-04-01',
    content: 'Applied diluted liquid fertilizer. Plant responded well with new growth.',
    type: 'fertilizing'
  }
];

// Plants endpoints
app.get('/api/plants', (req, res) => {
  res.json({ success: true, data: plants });
});

app.post('/api/plants', (req, res) => {
  const newPlant = {
    ...req.body,
    id: uuidv4(),
    growthLogs: []
  };
  plants.push(newPlant);
  res.status(201).json({ success: true, data: newPlant });
});

app.put('/api/plants/:id', (req, res) => {
  const { id } = req.params;
  const index = plants.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Plant not found' });
  }
  
  plants[index] = { ...plants[index], ...req.body };
  res.json({ success: true, data: plants[index] });
});

app.delete('/api/plants/:id', (req, res) => {
  const { id } = req.params;
  const index = plants.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Plant not found' });
  }
  
  plants.splice(index, 1);
  // Clean up related data
  growthLogs = growthLogs.filter(log => log.plantId !== id);
  careNotes = careNotes.filter(note => note.plantId !== id);
  
  res.json({ success: true, message: 'Plant deleted successfully' });
});

// Growth logs endpoints
app.get('/api/growth-logs', (req, res) => {
  res.json({ success: true, data: growthLogs });
});

app.post('/api/growth-logs', (req, res) => {
  const newLog = {
    ...req.body,
    id: uuidv4()
  };
  growthLogs.push(newLog);
  res.status(201).json({ success: true, data: newLog });
});

// Care notes endpoints
app.get('/api/care-notes', (req, res) => {
  res.json({ success: true, data: careNotes });
});

app.post('/api/care-notes', (req, res) => {
  const newNote = {
    ...req.body,
    id: uuidv4()
  };
  careNotes.push(newNote);
  res.status(201).json({ success: true, data: newNote });
});

// Plant images endpoints
app.get('/api/plants/:id/images', (req, res) => {
  const { id } = req.params;
  const plant = plants.find(p => p.id === id);
  
  if (!plant) {
    return res.status(404).json({ success: false, message: 'Plant not found' });
  }
  
  res.json({ success: true, data: plant.images || [] });
});

app.post('/api/plants/:id/images', (req, res) => {
  const { id } = req.params;
  const plantIndex = plants.findIndex(p => p.id === id);
  
  if (plantIndex === -1) {
    return res.status(404).json({ success: false, message: 'Plant not found' });
  }
  
  const newImage = {
    ...req.body,
    id: uuidv4()
  };
  
  if (!plants[plantIndex].images) {
    plants[plantIndex].images = [];
  }
  
  plants[plantIndex].images.push(newImage);
  res.status(201).json({ success: true, data: newImage });
});

app.delete('/api/plants/:plantId/images/:imageId', (req, res) => {
  const { plantId, imageId } = req.params;
  const plantIndex = plants.findIndex(p => p.id === plantId);
  
  if (plantIndex === -1) {
    return res.status(404).json({ success: false, message: 'Plant not found' });
  }
  
  if (!plants[plantIndex].images) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }
  
  const imageIndex = plants[plantIndex].images.findIndex(img => img.id === imageId);
  if (imageIndex === -1) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }
  
  plants[plantIndex].images.splice(imageIndex, 1);
  res.json({ success: true, message: 'Image deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PlantPal API is running!' });
});

app.listen(PORT, () => {
  console.log(`PlantPal Mock API Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
