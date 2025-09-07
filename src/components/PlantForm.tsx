import { useState } from 'react';
import type { Plant } from '../types/plant';

interface PlantFormProps {
  onSubmit: (plant: Omit<Plant, 'id' | 'growthLogs'>) => void;
  onCancel: () => void;
  initialData?: Partial<Plant>;
}

export function PlantForm({ onSubmit, onCancel, initialData }: PlantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    species: initialData?.species || '',
    location: initialData?.location || '',
    wateringFrequency: initialData?.wateringFrequency || 7,
    notes: initialData?.notes || '',
    imageUrl: initialData?.imageUrl || '',
    lastWatered: initialData?.lastWatered || new Date().toISOString().split('T')[0],
    dateAdded: initialData?.dateAdded || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'wateringFrequency' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="plant-form">
      <div className="form-group">
        <label htmlFor="name">Plant Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="species">Species *</label>
        <input
          type="text"
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Living room window, Kitchen counter"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="wateringFrequency">Watering Frequency (days) *</label>
        <select
          id="wateringFrequency"
          name="wateringFrequency"
          value={formData.wateringFrequency}
          onChange={handleChange}
          required
        >
          <option value={1}>Daily</option>
          <option value={2}>Every 2 days</option>
          <option value={3}>Every 3 days</option>
          <option value={7}>Weekly</option>
          <option value={10}>Every 10 days</option>
          <option value={14}>Bi-weekly</option>
          <option value={21}>Every 3 weeks</option>
          <option value={30}>Monthly</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="lastWatered">Last Watered *</label>
        <input
          type="date"
          id="lastWatered"
          name="lastWatered"
          value={formData.lastWatered}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateAdded">Date Added</label>
        <input
          type="date"
          id="dateAdded"
          name="dateAdded"
          value={formData.dateAdded}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/plant-image.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Care instructions, observations, etc."
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Plant' : 'Add Plant'}
        </button>
      </div>
    </form>
  );
}
