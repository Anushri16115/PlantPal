import type { Plant, GrowthLog, CareNote } from '../types/plant';
import { API_CONFIG, type ApiResponse } from '../config/api';

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  // Plant operations
  async getPlants(): Promise<Plant[]> {
    try {
      const response = await this.request<ApiResponse<Plant[]>>(API_CONFIG.ENDPOINTS.PLANTS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch plants:', error);
      // Fallback to localStorage for offline support
      return this.getLocalPlants();
    }
  }

  async addPlant(plant: Omit<Plant, 'id' | 'growthLogs'>): Promise<Plant> {
    try {
      const response = await this.request<ApiResponse<Plant>>(API_CONFIG.ENDPOINTS.PLANTS, {
        method: 'POST',
        body: JSON.stringify(plant),
      });
      
      // Also save to localStorage as backup
      this.saveLocalPlant(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add plant via API, saving locally:', error);
      return this.addLocalPlant(plant);
    }
  }

  async updatePlant(id: string, updates: Partial<Plant>): Promise<Plant> {
    try {
      const response = await this.request<ApiResponse<Plant>>(`${API_CONFIG.ENDPOINTS.PLANTS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      // Update localStorage backup
      this.updateLocalPlant(id, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update plant via API, updating locally:', error);
      return this.updateLocalPlant(id, updates);
    }
  }

  async deletePlant(id: string): Promise<boolean> {
    try {
      await this.request<ApiResponse<void>>(`${API_CONFIG.ENDPOINTS.PLANTS}/${id}`, {
        method: 'DELETE',
      });
      
      // Remove from localStorage backup
      this.deleteLocalPlant(id);
      return true;
    } catch (error) {
      console.error('Failed to delete plant via API, deleting locally:', error);
      return this.deleteLocalPlant(id);
    }
  }

  // Growth log operations
  async getGrowthLogs(): Promise<GrowthLog[]> {
    try {
      const response = await this.request<ApiResponse<GrowthLog[]>>(API_CONFIG.ENDPOINTS.GROWTH_LOGS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch growth logs:', error);
      return this.getLocalGrowthLogs();
    }
  }

  async addGrowthLog(log: Omit<GrowthLog, 'id'>): Promise<GrowthLog> {
    try {
      const response = await this.request<ApiResponse<GrowthLog>>(API_CONFIG.ENDPOINTS.GROWTH_LOGS, {
        method: 'POST',
        body: JSON.stringify(log),
      });
      
      this.saveLocalGrowthLog(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add growth log via API, saving locally:', error);
      return this.addLocalGrowthLog(log);
    }
  }

  // Care note operations
  async getCareNotes(): Promise<CareNote[]> {
    try {
      const response = await this.request<ApiResponse<CareNote[]>>(API_CONFIG.ENDPOINTS.CARE_NOTES);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch care notes:', error);
      return this.getLocalCareNotes();
    }
  }

  async addCareNote(note: Omit<CareNote, 'id'>): Promise<CareNote> {
    try {
      const response = await this.request<ApiResponse<CareNote>>(API_CONFIG.ENDPOINTS.CARE_NOTES, {
        method: 'POST',
        body: JSON.stringify(note),
      });
      
      this.saveLocalCareNote(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add care note via API, saving locally:', error);
      return this.addLocalCareNote(note);
    }
  }

  // Fallback localStorage methods
  private getLocalPlants(): Plant[] {
    try {
      const plants = localStorage.getItem('plantpal_plants');
      return plants ? JSON.parse(plants) : [];
    } catch {
      return [];
    }
  }

  private saveLocalPlant(plant: Plant): void {
    const plants = this.getLocalPlants();
    const existingIndex = plants.findIndex(p => p.id === plant.id);
    if (existingIndex >= 0) {
      plants[existingIndex] = plant;
    } else {
      plants.push(plant);
    }
    localStorage.setItem('plantpal_plants', JSON.stringify(plants));
  }

  private addLocalPlant(plant: Omit<Plant, 'id' | 'growthLogs'>): Plant {
    const newPlant: Plant = {
      ...plant,
      id: crypto.randomUUID(),
      growthLogs: []
    };
    this.saveLocalPlant(newPlant);
    return newPlant;
  }

  private updateLocalPlant(id: string, updates: Partial<Plant>): Plant {
    const plants = this.getLocalPlants();
    const index = plants.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plant not found');
    
    plants[index] = { ...plants[index], ...updates };
    localStorage.setItem('plantpal_plants', JSON.stringify(plants));
    return plants[index];
  }

  private deleteLocalPlant(id: string): boolean {
    const plants = this.getLocalPlants();
    const filteredPlants = plants.filter(p => p.id !== id);
    if (filteredPlants.length === plants.length) return false;
    
    localStorage.setItem('plantpal_plants', JSON.stringify(filteredPlants));
    return true;
  }

  private getLocalGrowthLogs(): GrowthLog[] {
    try {
      const logs = localStorage.getItem('plantpal_growth_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  private saveLocalGrowthLog(log: GrowthLog): void {
    const logs = this.getLocalGrowthLogs();
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    localStorage.setItem('plantpal_growth_logs', JSON.stringify(logs));
  }

  private addLocalGrowthLog(log: Omit<GrowthLog, 'id'>): GrowthLog {
    const newLog: GrowthLog = {
      ...log,
      id: crypto.randomUUID()
    };
    this.saveLocalGrowthLog(newLog);
    return newLog;
  }

  private getLocalCareNotes(): CareNote[] {
    try {
      const notes = localStorage.getItem('plantpal_care_notes');
      return notes ? JSON.parse(notes) : [];
    } catch {
      return [];
    }
  }

  private saveLocalCareNote(note: CareNote): void {
    const notes = this.getLocalCareNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem('plantpal_care_notes', JSON.stringify(notes));
  }

  private addLocalCareNote(note: Omit<CareNote, 'id'>): CareNote {
    const newNote: CareNote = {
      ...note,
      id: crypto.randomUUID()
    };
    this.saveLocalCareNote(newNote);
    return newNote;
  }
}

export const apiService = new ApiService();
