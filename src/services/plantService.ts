import type { Plant, GrowthLog, CareNote } from '../types/plant';

const PLANTS_KEY = 'plantpal_plants';
const GROWTH_LOGS_KEY = 'plantpal_growth_logs';
const CARE_NOTES_KEY = 'plantpal_care_notes';

export const plantService = {
  // Plant operations
  getPlants(): Plant[] {
    try {
      const plants = localStorage.getItem(PLANTS_KEY);
      return plants ? JSON.parse(plants) : [];
    } catch (error) {
      console.error('Error loading plants:', error);
      return [];
    }
  },

  savePlants(plants: Plant[]): void {
    try {
      localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
    } catch (error) {
      console.error('Error saving plants:', error);
    }
  },

  addPlant(plant: Omit<Plant, 'id' | 'growthLogs'>): Plant {
    const newPlant: Plant = {
      ...plant,
      id: crypto.randomUUID(),
      growthLogs: []
    };
    
    const plants = this.getPlants();
    plants.push(newPlant);
    this.savePlants(plants);
    
    return newPlant;
  },

  updatePlant(id: string, updates: Partial<Plant>): Plant | null {
    const plants = this.getPlants();
    const index = plants.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    plants[index] = { ...plants[index], ...updates };
    this.savePlants(plants);
    
    return plants[index];
  },

  deletePlant(id: string): boolean {
    const plants = this.getPlants();
    const filteredPlants = plants.filter(p => p.id !== id);
    
    if (filteredPlants.length === plants.length) return false;
    
    this.savePlants(filteredPlants);
    
    // Clean up related data
    this.deleteGrowthLogsByPlantId(id);
    this.deleteCareNotesByPlantId(id);
    
    return true;
  },

  // Growth log operations
  getGrowthLogs(): GrowthLog[] {
    try {
      const logs = localStorage.getItem(GROWTH_LOGS_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error loading growth logs:', error);
      return [];
    }
  },

  saveGrowthLogs(logs: GrowthLog[]): void {
    try {
      localStorage.setItem(GROWTH_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving growth logs:', error);
    }
  },

  addGrowthLog(log: Omit<GrowthLog, 'id'>): GrowthLog {
    const newLog: GrowthLog = {
      ...log,
      id: crypto.randomUUID()
    };
    
    const logs = this.getGrowthLogs();
    logs.push(newLog);
    this.saveGrowthLogs(logs);
    
    return newLog;
  },

  getGrowthLogsByPlantId(plantId: string): GrowthLog[] {
    return this.getGrowthLogs().filter(log => log.plantId === plantId);
  },

  deleteGrowthLogsByPlantId(plantId: string): void {
    const logs = this.getGrowthLogs();
    const filteredLogs = logs.filter(log => log.plantId !== plantId);
    this.saveGrowthLogs(filteredLogs);
  },

  // Care notes operations
  getCareNotes(): CareNote[] {
    try {
      const notes = localStorage.getItem(CARE_NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error loading care notes:', error);
      return [];
    }
  },

  saveCareNotes(notes: CareNote[]): void {
    try {
      localStorage.setItem(CARE_NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving care notes:', error);
    }
  },

  addCareNote(note: Omit<CareNote, 'id'>): CareNote {
    const newNote: CareNote = {
      ...note,
      id: crypto.randomUUID()
    };
    
    const notes = this.getCareNotes();
    notes.push(newNote);
    this.saveCareNotes(notes);
    
    return newNote;
  },

  getCareNotesByPlantId(plantId: string): CareNote[] {
    return this.getCareNotes().filter(note => note.plantId === plantId);
  },

  deleteCareNotesByPlantId(plantId: string): void {
    const notes = this.getCareNotes();
    const filteredNotes = notes.filter(note => note.plantId !== plantId);
    this.saveCareNotes(filteredNotes);
  }
};
