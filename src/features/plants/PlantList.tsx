import { useState } from 'react';
import { usePlants } from '../../context/PlantContext.js';
import { PlantCard } from '../../components/PlantCard.js';
import { PlantForm } from '../../components/PlantForm.js';

export function PlantList() {
  const { plants, addPlant, loading } = usePlants();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'dateAdded' | 'lastWatered'>('name');

  const handleAddPlant = (plantData: any) => {
    addPlant(plantData);
    setShowAddForm(false);
  };

  const filteredPlants = plants
    .filter(plant => 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dateAdded':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'lastWatered':
          return new Date(b.lastWatered).getTime() - new Date(a.lastWatered).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return <div className="loading">Loading your plants...</div>;
  }

  return (
    <div className="plant-list">
      <div className="page-header">
        <h1>My Plants ({plants.length})</h1>
        <button 
          onClick={() => setShowAddForm(true)} 
          className="btn btn-primary"
        >
          Add New Plant
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Plant</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <PlantForm
                onSubmit={handleAddPlant}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search plants by name, species, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="dateAdded">Date Added</option>
            <option value="lastWatered">Last Watered</option>
          </select>
        </div>
      </div>

      {filteredPlants.length === 0 ? (
        <div className="empty-state">
          {plants.length === 0 ? (
            <>
              <div className="empty-icon">🌱</div>
              <h2>No plants yet!</h2>
              <p>Start building your plant collection by adding your first plant.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                Add Your First Plant
              </button>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <h2>No plants found</h2>
              <p>Try adjusting your search terms or filters.</p>
            </>
          )}
        </div>
      ) : (
        <div className="plants-grid">
          {filteredPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}
