import { useState } from 'react';
import { usePlants } from '../../context/PlantContext.js';

interface GrowthLogProps {
  plantId: string;
}

export function GrowthLog({ plantId }: GrowthLogProps) {
  const { getGrowthLogsByPlantId, addGrowthLog } = usePlants();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    imageUrl: '',
    height: '',
    healthStatus: 'good' as const
  });

  const growthLogs = getGrowthLogsByPlantId(plantId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGrowthLog({
      plantId,
      date: formData.date,
      notes: formData.notes,
      imageUrl: formData.imageUrl || undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      healthStatus: formData.healthStatus
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      notes: '',
      imageUrl: '',
      height: '',
      healthStatus: 'good'
    });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="growth-log">
      <div className="section-header">
        <h3>Growth Log</h3>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          Add Entry
        </button>
      </div>

      {showAddForm && (
        <div className="add-log-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="healthStatus">Health Status</label>
                <select
                  id="healthStatus"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Observations about growth, changes, etc."
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Entry
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="growth-entries">
        {growthLogs.length === 0 ? (
          <div className="empty-state">
            <p>No growth entries yet. Start tracking your plant's progress!</p>
          </div>
        ) : (
          growthLogs.map(log => (
            <div key={log.id} className="growth-entry">
              <div className="entry-header">
                <div className="entry-date">{formatDate(log.date)}</div>
                <div 
                  className="health-badge"
                  style={{ backgroundColor: getHealthStatusColor(log.healthStatus) }}
                >
                  {log.healthStatus}
                </div>
              </div>
              
              {log.imageUrl && (
                <div className="entry-image">
                  <img src={log.imageUrl} alt={`Growth on ${log.date}`} />
                </div>
              )}
              
              <div className="entry-content">
                <p>{log.notes}</p>
                {log.height && (
                  <div className="height-info">
                    📏 Height: {log.height} cm
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
