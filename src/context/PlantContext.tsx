import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Plant, GrowthLog, CareNote } from '../types/plant';
import { apiService } from '../services/apiService.js';
import { initializeDummyData } from '../data/dummyData.js';

interface PlantState {
  plants: Plant[];
  growthLogs: GrowthLog[];
  careNotes: CareNote[];
  loading: boolean;
  error: string | null;
}

type PlantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PLANTS'; payload: Plant[] }
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: Plant }
  | { type: 'DELETE_PLANT'; payload: string }
  | { type: 'LOAD_GROWTH_LOGS'; payload: GrowthLog[] }
  | { type: 'ADD_GROWTH_LOG'; payload: GrowthLog }
  | { type: 'LOAD_CARE_NOTES'; payload: CareNote[] }
  | { type: 'ADD_CARE_NOTE'; payload: CareNote };

const initialState: PlantState = {
  plants: [],
  growthLogs: [],
  careNotes: [],
  loading: false,
  error: null,
};

function plantReducer(state: PlantState, action: PlantAction): PlantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_PLANTS':
      return { ...state, plants: action.payload };
    case 'ADD_PLANT':
      return { ...state, plants: [...state.plants, action.payload] };
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(plant =>
          plant.id === action.payload.id ? action.payload : plant
        ),
      };
    case 'DELETE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(plant => plant.id !== action.payload),
      };
    case 'LOAD_GROWTH_LOGS':
      return { ...state, growthLogs: action.payload };
    case 'ADD_GROWTH_LOG':
      return { ...state, growthLogs: [...state.growthLogs, action.payload] };
    case 'LOAD_CARE_NOTES':
      return { ...state, careNotes: action.payload };
    case 'ADD_CARE_NOTE':
      return { ...state, careNotes: [...state.careNotes, action.payload] };
    default:
      return state;
  }
}

interface PlantContextType extends PlantState {
  addPlant: (plant: Omit<Plant, 'id' | 'growthLogs'>) => Promise<void>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  addGrowthLog: (log: Omit<GrowthLog, 'id'>) => Promise<void>;
  addCareNote: (note: Omit<CareNote, 'id'>) => Promise<void>;
  getPlantById: (id: string) => Plant | undefined;
  getGrowthLogsByPlantId: (plantId: string) => GrowthLog[];
  getCareNotesByPlantId: (plantId: string) => CareNote[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Always clear existing data and force fresh dummy data reload
        localStorage.clear();
        
        // Initialize dummy data
        initializeDummyData();
        
        // Small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const plants = await apiService.getPlants();
        const growthLogs = await apiService.getGrowthLogs();
        const careNotes = await apiService.getCareNotes();
        
        console.log('Loaded plants:', plants.length);
        console.log('First plant:', plants[0]);
        console.log('Aloe Vera plant:', plants.find((p: Plant) => p.name === 'Aloe Vera'));
        console.log('Fiddle Leaf Fig plant:', plants.find((p: Plant) => p.name === 'Fiddle Leaf Fig'));
        
        dispatch({ type: 'LOAD_PLANTS', payload: plants });
        dispatch({ type: 'LOAD_GROWTH_LOGS', payload: growthLogs });
        dispatch({ type: 'LOAD_CARE_NOTES', payload: careNotes });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, []);

  const addPlant = async (plantData: Omit<Plant, 'id' | 'growthLogs'>) => {
    try {
      const newPlant = await apiService.addPlant(plantData);
      dispatch({ type: 'ADD_PLANT', payload: newPlant });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add plant' });
    }
  };

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    try {
      const updatedPlant = await apiService.updatePlant(id, updates);
      if (updatedPlant) {
        dispatch({ type: 'UPDATE_PLANT', payload: updatedPlant });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update plant' });
    }
  };

  const deletePlant = async (id: string) => {
    try {
      const success = await apiService.deletePlant(id);
      if (success) {
        dispatch({ type: 'DELETE_PLANT', payload: id });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete plant' });
    }
  };

  const addGrowthLog = async (logData: Omit<GrowthLog, 'id'>) => {
    try {
      const newLog = await apiService.addGrowthLog(logData);
      dispatch({ type: 'ADD_GROWTH_LOG', payload: newLog });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add growth log' });
    }
  };

  const addCareNote = async (noteData: Omit<CareNote, 'id'>) => {
    try {
      const newNote = await apiService.addCareNote(noteData);
      dispatch({ type: 'ADD_CARE_NOTE', payload: newNote });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add care note' });
    }
  };

  const getPlantById = (id: string) => {
    return state.plants.find(plant => plant.id === id);
  };

  const getGrowthLogsByPlantId = (plantId: string) => {
    return state.growthLogs.filter(log => log.plantId === plantId);
  };

  const getCareNotesByPlantId = (plantId: string) => {
    return state.careNotes.filter(note => note.plantId === plantId);
  };

  const value: PlantContextType = {
    ...state,
    addPlant,
    updatePlant,
    deletePlant,
    addGrowthLog,
    addCareNote,
    getPlantById,
    getGrowthLogsByPlantId,
    getCareNotesByPlantId,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
}

export function usePlants() {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}
