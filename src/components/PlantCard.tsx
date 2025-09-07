import { Link } from 'react-router-dom';
import type { Plant } from '../types/plant';

export function PlantCard({ plant }: { plant: Plant }) {
  // Function to get dummy plant image based on plant species
  const getDummyPlantImage = (species: string) => {
    const plantImages = {
      'Monstera deliciosa': '🌿',
      'Sansevieria trifasciata': '🪴',
      'Ficus lyrata': '🌳',
      'Epipremnum aureum': '🌿',
      'Spathiphyllum wallisii': '🌸',
      'Ficus elastica': '🌳',
      'Zamioculcas zamiifolia': '🪴',
      'Chlorophytum comosum': '🌿',
      'Aloe barbadensis': '🌵',
      'Nephrolepis exaltata': '🌿',
      'Philodendron hederaceum': '🌿',
      'Crassula ovata': '🌵',
      'Strelitzia reginae': '🌺',
      'Calathea orbifolia': '🌿',
      'Senecio rowleyanus': '🌵'
    };
    
    return plantImages[species as keyof typeof plantImages] || '🌱';
  };
  
  return (
    <Link to={`/plants/${plant.id}`} className="plant-card">
      <div className="plant-image">
        <div className="plant-placeholder">{getDummyPlantImage(plant.species)}</div>
      </div>
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        <p className="plant-species">{plant.species}</p>
        <p className="plant-location">📍 {plant.location}</p>
      </div>
    </Link>
  );
}
