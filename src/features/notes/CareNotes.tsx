import { useState } from 'react';
import { usePlants } from '../../context/PlantContext.js';

interface CareNotesProps {
  plantId: string;
}

export function CareNotes({ plantId }: CareNotesProps) {
  const { getCareNotesByPlantId, addCareNote } = usePlants();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    content: '',
    type: 'general' as const
  });

  const careNotes = getCareNotesByPlantId(plantId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCareNote({
      plantId,
      date: formData.date,
      content: formData.content,
      type: formData.type
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      content: '',
      type: 'general'
    });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌱';
      case 'repotting': return '🪴';
      case 'pruning': return '✂️';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'watering': return '#2196F3';
      case 'fertilizing': return '#4CAF50';
      case 'repotting': return '#FF9800';
      case 'pruning': return '#9C27B0';
      default: return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="care-notes">
      <div className="section-header">
        <h3>Care Notes</h3>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          Add Note
        </button>
      </div>

      {showAddForm && (
        <div className="add-note-form">
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
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General</option>
                  <option value="watering">Watering</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="repotting">Repotting</option>
                  <option value="pruning">Pruning</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content">Note</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Write your care note here..."
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Note
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-list">
        {careNotes.length === 0 ? (
          <div className="empty-state">
            <p>No care notes yet. Start documenting your plant care activities!</p>
          </div>
        ) : (
          careNotes.map(note => (
            <div key={note.id} className="care-note">
              <div className="note-header">
                <div className="note-date">{formatDate(note.date)}</div>
                <div 
                  className="note-type"
                  style={{ backgroundColor: getTypeColor(note.type) }}
                >
                  {getTypeIcon(note.type)} {note.type}
                </div>
              </div>
              <div className="note-content">
                <p>{note.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
