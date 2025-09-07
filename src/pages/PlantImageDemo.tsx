import { useState } from 'react';
import { PlantImageViewer } from '../components/PlantImageViewer';

export function PlantImageDemo() {
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const plants = [
    { name: 'Aloe Vera', species: 'Aloe barbadensis' },
    { name: 'Fiddle Leaf Fig', species: 'Ficus lyrata' }
  ];

  return (
    <div className="plant-image-demo">
      <div className="demo-header">
        <h1>Plant Image Gallery Demo</h1>
        <p>Click on a plant to view its images fetched from APIs</p>
      </div>

      <div className="plant-selector">
        {plants.map((plant) => (
          <button
            key={plant.name}
            onClick={() => setSelectedPlant(plant.name)}
            className="btn btn-primary plant-btn"
          >
            📸 View {plant.name} Images
          </button>
        ))}
      </div>

      {selectedPlant && (
        <div className="image-viewer-container">
          <PlantImageViewer
            plantName={selectedPlant}
            species={plants.find(p => p.name === selectedPlant)?.species}
            onClose={() => setSelectedPlant(null)}
          />
        </div>
      )}

      <style>{`
        .plant-image-demo {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .demo-header h1 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .plant-selector {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .plant-btn {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          border-radius: 8px;
          transition: transform 0.2s ease;
        }

        .plant-btn:hover {
          transform: translateY(-2px);
        }

        .image-viewer-container {
          margin-top: 2rem;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 1rem;
          background: white;
        }

        .plant-image-viewer .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .plant-image-viewer .species-name {
          font-style: italic;
          color: #666;
          margin: 0;
        }

        .no-images {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .loading-spinner {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
}
