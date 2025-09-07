import { Link } from 'react-router-dom';
import { usePlants } from '../../context/PlantContext.js';
import { useWaterReminder } from '../../hooks/useWaterReminder.js';
import { PlantCard } from '../../components/PlantCard.js';

export function Dashboard() {
  const { plants, loading } = usePlants();
  const waterReminders = useWaterReminder(plants);

  if (loading) {
    return <div className="loading">Loading your plants...</div>;
  }

  const recentPlants = plants
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 3);

  return (
    <div className="dashboard">
      <div className="watering-scene">
        <div className="watering-message">
          <h1>Welcome to PlantPal! <span className="animated-plant-icon">🌱</span></h1>
          <p>Keep track of your green friends and their care needs</p>
        </div>
        <div className="watering-can">🚿</div>
        <div className="water-drops">
          <span className="water-drop">💧</span>
          <span className="water-drop">💧</span>
          <span className="water-drop">💧</span>
        </div>
        <div className="plants-being-watered">
          <span className="plant-being-watered">🌱</span>
          <span className="plant-being-watered">🌿</span>
          <span className="plant-being-watered">🪴</span>
        </div>
      </div>

      {waterReminders.length > 0 && (
        <div className="water-reminders">
          <h2>🚨 Plants Need Water</h2>
          <div className="reminder-list">
            {waterReminders.map(reminder => (
              <div key={reminder.plantId} className="reminder-item">
                <span className="plant-name">{reminder.plantName}</span>
                <span className="overdue-days">
                  {reminder.daysOverdue === 0 ? 'Due today' : `${reminder.daysOverdue} days overdue`}
                </span>
                <Link to={`/plants/${reminder.plantId}`} className="btn btn-sm">
                  View Plant
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-plants">
        <div className="section-header">
          <h2>Recent Plants</h2>
          <Link to="/plants" className="btn btn-secondary">View All</Link>
        </div>
        
        {recentPlants.length === 0 ? (
          <div className="empty-state">
            <p>No plants yet! Add your first plant to get started.</p>
            <Link to="/plants/new" className="btn btn-primary">Add Your First Plant</Link>
          </div>
        ) : (
          <div className="plants-grid">
            {recentPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/plants/new" className="action-card">
            <div className="action-icon animated-plant-icon sway">🌱</div>
            <div className="action-title">Add New Plant</div>
            <div className="action-description">Register a new plant in your collection</div>
          </Link>
          <Link to="/plants" className="action-card">
            <div className="action-icon animated-plant-icon float">🌿</div>
            <div className="action-title">View All Plants</div>
            <div className="action-description">Browse your entire plant collection</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
