import { useState, useEffect } from 'react';
import { PlantImageViewer } from '../../components/PlantImageViewer';
import './PlantEncyclopedia.css';

interface PlantInfo {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  origin: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lightRequirement: 'low' | 'medium' | 'bright' | 'direct';
  wateringFrequency: number;
  humidity: 'low' | 'medium' | 'high';
  temperature: string;
  toxicity: 'safe' | 'toxic-pets' | 'toxic-humans' | 'toxic-all';
  description: string;
  careInstructions: {
    watering: string;
    light: string;
    soil: string;
    fertilizing: string;
    pruning: string;
  };
  commonProblems: {
    problem: string;
    cause: string;
    solution: string;
  }[];
  benefits: string[];
  imageUrl?: string;
}

const PLANT_DATABASE: PlantInfo[] = [
  {
    id: 'pothos',
    name: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    family: 'Araceae',
    origin: 'Southeast Asia',
    difficulty: 'easy',
    lightRequirement: 'medium',
    wateringFrequency: 7,
    humidity: 'medium',
    temperature: '65-85°F (18-29°C)',
    toxicity: 'toxic-pets',
    description: 'A popular trailing houseplant with heart-shaped leaves that can be variegated with yellow or white. Perfect for beginners and great for hanging baskets or climbing poles.',
    careInstructions: {
      watering: 'Water when top inch of soil is dry. Avoid overwatering.',
      light: 'Bright, indirect light. Can tolerate low light conditions.',
      soil: 'Well-draining potting mix. Regular houseplant soil works well.',
      fertilizing: 'Feed monthly during growing season with balanced liquid fertilizer.',
      pruning: 'Trim regularly to maintain shape and encourage bushier growth.'
    },
    commonProblems: [
      {
        problem: 'Yellow leaves',
        cause: 'Overwatering or poor drainage',
        solution: 'Reduce watering frequency and ensure proper drainage'
      },
      {
        problem: 'Brown leaf tips',
        cause: 'Low humidity or fluoride in water',
        solution: 'Increase humidity and use filtered water'
      }
    ],
    benefits: ['Air purifying', 'Easy propagation', 'Fast growing', 'Low maintenance']
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    family: 'Asparagaceae',
    origin: 'West Africa',
    difficulty: 'easy',
    lightRequirement: 'low',
    wateringFrequency: 14,
    humidity: 'low',
    temperature: '60-80°F (15-27°C)',
    toxicity: 'toxic-pets',
    description: 'A hardy succulent with tall, upright leaves featuring green and yellow patterns. Known for its air-purifying qualities and extreme low-maintenance requirements.',
    careInstructions: {
      watering: 'Water sparingly, every 2-3 weeks. Allow soil to dry completely between waterings.',
      light: 'Tolerates low light but prefers bright, indirect light.',
      soil: 'Well-draining cactus or succulent mix.',
      fertilizing: 'Feed 2-3 times per year with diluted fertilizer.',
      pruning: 'Remove damaged leaves at soil level. Divide when overcrowded.'
    },
    commonProblems: [
      {
        problem: 'Root rot',
        cause: 'Overwatering',
        solution: 'Reduce watering and improve drainage'
      },
      {
        problem: 'Wrinkled leaves',
        cause: 'Underwatering',
        solution: 'Water thoroughly and establish regular schedule'
      }
    ],
    benefits: ['Air purifying', 'Low water needs', 'Tolerates neglect', 'Produces oxygen at night']
  },
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    family: 'Araceae',
    origin: 'Central America',
    difficulty: 'medium',
    lightRequirement: 'bright',
    wateringFrequency: 7,
    humidity: 'high',
    temperature: '65-80°F (18-27°C)',
    toxicity: 'toxic-all',
    description: 'A stunning tropical plant known for its large, split leaves with natural holes. A popular choice for modern interiors and Instagram-worthy plant collections.',
    careInstructions: {
      watering: 'Water when top 1-2 inches of soil are dry.',
      light: 'Bright, indirect light. Avoid direct sunlight.',
      soil: 'Well-draining, chunky potting mix with perlite.',
      fertilizing: 'Feed monthly during growing season with balanced fertilizer.',
      pruning: 'Prune to control size and remove damaged leaves.'
    },
    commonProblems: [
      {
        problem: 'No fenestrations (holes)',
        cause: 'Insufficient light or young plant',
        solution: 'Provide brighter light and be patient with young plants'
      },
      {
        problem: 'Brown leaf edges',
        cause: 'Low humidity or inconsistent watering',
        solution: 'Increase humidity and maintain consistent watering schedule'
      }
    ],
    benefits: ['Statement plant', 'Air purifying', 'Fast growing', 'Easy propagation']
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    family: 'Moraceae',
    origin: 'Western Africa',
    difficulty: 'hard',
    lightRequirement: 'bright',
    wateringFrequency: 7,
    humidity: 'medium',
    temperature: '65-75°F (18-24°C)',
    toxicity: 'toxic-pets',
    description: 'A dramatic tree-like plant with large, violin-shaped leaves. Popular in modern decor but requires consistent care and stable conditions.',
    careInstructions: {
      watering: 'Water when top inch of soil is dry. Water thoroughly until it drains.',
      light: 'Bright, indirect light. Rotate weekly for even growth.',
      soil: 'Well-draining potting mix with good aeration.',
      fertilizing: 'Feed monthly during growing season with diluted fertilizer.',
      pruning: 'Prune to shape and remove damaged leaves. Wear gloves due to sap.'
    },
    commonProblems: [
      {
        problem: 'Dropping leaves',
        cause: 'Stress from changes in light, water, or location',
        solution: 'Maintain consistent care routine and avoid moving the plant'
      },
      {
        problem: 'Brown spots on leaves',
        cause: 'Overwatering or bacterial infection',
        solution: 'Reduce watering and improve air circulation'
      }
    ],
    benefits: ['Architectural statement', 'Air purifying', 'Can grow very tall', 'Beautiful foliage']
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    family: 'Araceae',
    origin: 'Tropical Americas',
    difficulty: 'easy',
    lightRequirement: 'medium',
    wateringFrequency: 5,
    humidity: 'high',
    temperature: '65-80°F (18-27°C)',
    toxicity: 'toxic-pets',
    description: 'An elegant plant with dark green leaves and white flower-like spathes. Known for its air-purifying abilities and ability to indicate when it needs water.',
    careInstructions: {
      watering: 'Keep soil consistently moist but not soggy. Plant will droop when thirsty.',
      light: 'Medium to low indirect light. Avoid direct sunlight.',
      soil: 'Well-draining potting mix that retains some moisture.',
      fertilizing: 'Feed monthly during growing season with balanced fertilizer.',
      pruning: 'Remove spent flowers and yellow leaves regularly.'
    },
    commonProblems: [
      {
        problem: 'No flowers',
        cause: 'Insufficient light or plant too young',
        solution: 'Provide brighter indirect light and be patient'
      },
      {
        problem: 'Brown leaf tips',
        cause: 'Low humidity or fluoride in water',
        solution: 'Increase humidity and use filtered water'
      }
    ],
    benefits: ['Air purifying', 'Beautiful flowers', 'Indicates water needs', 'Tolerates low light']
  }
];

export function PlantEncyclopedia() {
  const [plants] = useState<PlantInfo[]>(PLANT_DATABASE);
  const [filteredPlants, setFilteredPlants] = useState<PlantInfo[]>(PLANT_DATABASE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLight, setSelectedLight] = useState<string>('all');
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  useEffect(() => {
    filterPlants();
  }, [searchTerm, selectedDifficulty, selectedLight]);

  const filterPlants = () => {
    let filtered = plants;

    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.family.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(plant => plant.difficulty === selectedDifficulty);
    }

    if (selectedLight !== 'all') {
      filtered = filtered.filter(plant => plant.lightRequirement === selectedLight);
    }

    setFilteredPlants(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getToxicityIcon = (toxicity: string) => {
    switch (toxicity) {
      case 'safe': return '✅';
      case 'toxic-pets': return '🐕❌';
      case 'toxic-humans': return '👶❌';
      case 'toxic-all': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="plant-encyclopedia">
      <div className="encyclopedia-header">
        <h1>🌿 Plant Encyclopedia</h1>
        <p>Discover and learn about different houseplants</p>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search plants by name, scientific name, or family..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={selectedLight}
            onChange={(e) => setSelectedLight(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Light Requirements</option>
            <option value="low">Low Light</option>
            <option value="medium">Medium Light</option>
            <option value="bright">Bright Light</option>
            <option value="direct">Direct Light</option>
          </select>
        </div>
      </div>

      <div className="plants-grid">
        {filteredPlants.map(plant => (
          <div key={plant.id} className="plant-card" onClick={() => setSelectedPlant(plant)}>
            <div className="plant-card-header">
              <h3>{plant.name}</h3>
              <div className="plant-badges">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(plant.difficulty) }}
                >
                  {plant.difficulty}
                </span>
                <span className="toxicity-badge" title={`Toxicity: ${plant.toxicity}`}>
                  {getToxicityIcon(plant.toxicity)}
                </span>
              </div>
            </div>
            
            <p className="scientific-name">{plant.scientificName}</p>
            <p className="plant-description">{plant.description.substring(0, 120)}...</p>
            
            <div className="plant-quick-info">
              <div className="info-item">
                <span className="info-label">Light:</span>
                <span className="info-value">{plant.lightRequirement}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Water:</span>
                <span className="info-value">Every {plant.wateringFrequency} days</span>
              </div>
              <div className="info-item">
                <span className="info-label">Humidity:</span>
                <span className="info-value">{plant.humidity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="no-results">
          <p>No plants found matching your criteria. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="plant-modal">
          <div className="modal-overlay" onClick={() => setSelectedPlant(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedPlant(null)}
                className="close-btn"
              >
                ×
              </button>
              
              <div className="plant-detail">
                <div className="plant-detail-header">
                  <h2>{selectedPlant.name}</h2>
                  <p className="scientific-name">{selectedPlant.scientificName}</p>
                  <div className="plant-badges">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(selectedPlant.difficulty) }}
                    >
                      {selectedPlant.difficulty}
                    </span>
                    <span className="toxicity-badge">
                      {getToxicityIcon(selectedPlant.toxicity)} {selectedPlant.toxicity.replace('-', ' ')}
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowImageViewer(true)}
                    className="btn btn-secondary"
                  >
                    📸 View Images
                  </button>
                </div>

                <div className="plant-info-grid">
                  <div className="info-section">
                    <h3>Basic Information</h3>
                    <div className="info-list">
                      <div className="info-item">
                        <strong>Family:</strong> {selectedPlant.family}
                      </div>
                      <div className="info-item">
                        <strong>Origin:</strong> {selectedPlant.origin}
                      </div>
                      <div className="info-item">
                        <strong>Temperature:</strong> {selectedPlant.temperature}
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Care Requirements</h3>
                    <div className="care-instructions">
                      <div className="care-item">
                        <strong>💧 Watering:</strong> {selectedPlant.careInstructions.watering}
                      </div>
                      <div className="care-item">
                        <strong>☀️ Light:</strong> {selectedPlant.careInstructions.light}
                      </div>
                      <div className="care-item">
                        <strong>🌱 Soil:</strong> {selectedPlant.careInstructions.soil}
                      </div>
                      <div className="care-item">
                        <strong>🌿 Fertilizing:</strong> {selectedPlant.careInstructions.fertilizing}
                      </div>
                      <div className="care-item">
                        <strong>✂️ Pruning:</strong> {selectedPlant.careInstructions.pruning}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Common Problems & Solutions</h3>
                  <div className="problems-list">
                    {selectedPlant.commonProblems.map((problem, index) => (
                      <div key={index} className="problem-item">
                        <h4>🚨 {problem.problem}</h4>
                        <p><strong>Cause:</strong> {problem.cause}</p>
                        <p><strong>Solution:</strong> {problem.solution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Benefits</h3>
                  <div className="benefits-list">
                    {selectedPlant.benefits.map((benefit, index) => (
                      <span key={index} className="benefit-tag">✨ {benefit}</span>
                    ))}
                  </div>
                </div>

                <p className="plant-description-full">{selectedPlant.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {showImageViewer && selectedPlant && (
        <div className="image-viewer-modal">
          <PlantImageViewer
            plantName={selectedPlant.name}
            species={selectedPlant.scientificName}
            onClose={() => setShowImageViewer(false)}
          />
        </div>
      )}
    </div>
  );
}
