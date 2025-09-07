import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePlants } from '../../context/PlantContext.js';
import { PlantForm } from '../../components/PlantForm.js';
import { PlantPurchaseLinks } from '../../components/PlantPurchaseLinks.js';

export function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPlantById, 
    getGrowthLogsByPlantId, 
    getCareNotesByPlantId, 
    updatePlant, 
    deletePlant,
    addGrowthLog,
    addCareNote 
  } = usePlants();
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'care'>('overview');
  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [showCareForm, setShowCareForm] = useState(false);

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

  if (!id) {
    return <div className="error">Plant not found</div>;
  }

  const plant = getPlantById(id);
  const growthLogs = getGrowthLogsByPlantId(id);
  const careNotes = getCareNotesByPlantId(id);

  if (!plant) {
    return (
      <div className="error">
        <h2>Plant not found</h2>
        <p>The plant you're looking for doesn't exist.</p>
        <Link to="/plants" className="btn btn-primary">Back to Plants</Link>
      </div>
    );
  }

  const handleUpdatePlant = (plantData: any) => {
    updatePlant(id, plantData);
    setShowEditForm(false);
  };

  const handleDeletePlant = () => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deletePlant(id);
      navigate('/plants');
    }
  };

  const handleAddGrowthLog = (data: any) => {
    addGrowthLog({ ...data, plantId: id });
    setShowGrowthForm(false);
  };

  const handleAddCareNote = (data: any) => {
    addCareNote({ ...data, plantId: id });
    setShowCareForm(false);
  };

  const daysSinceWatered = Math.floor(
    (new Date().getTime() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysSinceWatered > plant.wateringFrequency;

  return (
    <div className="plant-detail">
      <div className="plant-header">
        <div className="plant-image-large">
          <div className="plant-placeholder-large">{getDummyPlantImage(plant.species)}</div>
        </div>
        
        <div className="plant-info-large">
          <h1>{plant.name}</h1>
          <p className="plant-species">{plant.species}</p>
          <p className="plant-location">📍 {plant.location}</p>
          <p className="plant-added">Added on {new Date(plant.dateAdded).toLocaleDateString()}</p>
          
          <div className={`water-status ${isOverdue ? 'overdue' : 'good'}`}>
            {isOverdue ? '🚨' : '💧'} 
            {isOverdue 
              ? `Overdue by ${daysSinceWatered - plant.wateringFrequency} days`
              : `Next watering in ${plant.wateringFrequency - daysSinceWatered} days`
            }
          </div>

          <div className="plant-actions">
            <button 
              onClick={() => updatePlant(id, { lastWatered: new Date().toISOString().split('T')[0] })}
              className="btn btn-primary"
            >
              💧 Water Plant
            </button>
            <button 
              onClick={() => setShowEditForm(true)}
              className="btn btn-secondary"
            >
              ✏️ Edit
            </button>
            <button 
              onClick={handleDeletePlant}
              className="btn btn-danger"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {plant.notes && (
        <div className="plant-notes">
          <h3>Notes</h3>
          <p>{plant.notes}</p>
        </div>
      )}

      <div className="plant-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'growth' ? 'active' : ''}`}
          onClick={() => setActiveTab('growth')}
        >
          Growth Logs ({growthLogs.length})
        </button>
        <button 
          className={`tab ${activeTab === 'care' ? 'active' : ''}`}
          onClick={() => setActiveTab('care')}
        >
          Care Notes ({careNotes.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div>
            <div className="plant-details-grid">
              <div className="detail-card">
                <h3>Care Schedule</h3>
                <p><strong>Watering:</strong> Every {plant.wateringFrequency} days</p>
                <p><strong>Last watered:</strong> {new Date(plant.lastWatered).toLocaleDateString()}</p>
                <p><strong>Next watering:</strong> {new Date(new Date(plant.lastWatered).getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              
              <div className="detail-card">
                <h3>Plant Info</h3>
                <p><strong>Species:</strong> {plant.species}</p>
                <p><strong>Location:</strong> {plant.location}</p>
                <p><strong>Date Added:</strong> {new Date(plant.dateAdded).toLocaleDateString()}</p>
              </div>
            </div>
            
            <PlantPurchaseLinks plant={plant} />
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="growth-section">
            <div className="section-header">
              <h3>Growth History</h3>
              <button 
                onClick={() => setShowGrowthForm(true)}
                className="btn btn-primary"
              >
                Add Growth Log
              </button>
            </div>
            
            {growthLogs.length === 0 ? (
              <div className="empty-state">
                <p>No growth logs yet. Start tracking your plant's progress!</p>
              </div>
            ) : (
              <div className="growth-logs">
                {growthLogs
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(log => (
                    <div key={log.id} className="growth-log">
                      <div className="log-header">
                        <span className="log-date">{new Date(log.date).toLocaleDateString()}</span>
                        <span className={`health-badge ${log.healthStatus}`}>
                          {log.healthStatus}
                        </span>
                      </div>
                      <p className="log-notes">{log.notes}</p>
                      {log.height && <p className="log-height">Height: {log.height}cm</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'care' && (
          <div className="care-section">
            <div className="section-header">
              <h3>Care History</h3>
              <button 
                onClick={() => setShowCareForm(true)}
                className="btn btn-primary"
              >
                Add Care Note
              </button>
            </div>
            
            {careNotes.length === 0 ? (
              <div className="empty-state">
                <p>No care notes yet. Record your plant care activities!</p>
              </div>
            ) : (
              <div className="care-notes">
                {careNotes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(note => (
                    <div key={note.id} className="care-note">
                      <div className="note-header">
                        <span className="note-date">{new Date(note.date).toLocaleDateString()}</span>
                        <span className={`note-type ${note.type}`}>
                          {note.type}
                        </span>
                      </div>
                      <p className="note-content">{note.content}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Plant</h2>
              <button onClick={() => setShowEditForm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <PlantForm
                initialData={plant}
                onSubmit={handleUpdatePlant}
                onCancel={() => setShowEditForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Growth Log Form Modal */}
      {showGrowthForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Growth Log</h2>
              <button onClick={() => setShowGrowthForm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddGrowthLog({
                  date: formData.get('date'),
                  notes: formData.get('notes'),
                  healthStatus: formData.get('healthStatus'),
                  height: formData.get('height') ? Number(formData.get('height')) : undefined
                });
              }}>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label htmlFor="healthStatus">Health Status</label>
                  <select id="healthStatus" name="healthStatus" required>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input type="number" id="height" name="height" />
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea id="notes" name="notes" required rows={3}></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add Log</button>
                  <button type="button" onClick={() => setShowGrowthForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Care Note Form Modal */}
      {showCareForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Care Note</h2>
              <button onClick={() => setShowCareForm(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddCareNote({
                  date: formData.get('date'),
                  type: formData.get('type'),
                  content: formData.get('content')
                });
              }}>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select id="type" name="type" required>
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="repotting">Repotting</option>
                    <option value="pruning">Pruning</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="content">Notes</label>
                  <textarea id="content" name="content" required rows={3}></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add Note</button>
                  <button type="button" onClick={() => setShowCareForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
