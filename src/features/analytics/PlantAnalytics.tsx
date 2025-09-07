import { useState, useEffect } from 'react';
import { usePlants } from '../../context/PlantContext.js';
import './PlantAnalytics.css';

interface PlantStats {
  totalPlants: number;
  healthyPlants: number;
  plantsNeedingWater: number;
  averageAge: number;
  mostCommonSpecies: string;
  totalGrowthLogs: number;
  wateringStreak: number;
}

interface GrowthData {
  date: string;
  height: number;
  plantName: string;
}

interface WateringData {
  date: string;
  count: number;
}

export function PlantAnalytics() {
  const { plants } = usePlants();
  const [stats, setStats] = useState<PlantStats | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [selectedPlant, setSelectedPlant] = useState<string>('all');

  useEffect(() => {
    calculateStats();
  }, [plants]);

  const calculateStats = () => {
    if (plants.length === 0) {
      setStats(null);
      return;
    }

    const today = new Date();
    
    // Calculate plants needing water
    const plantsNeedingWater = plants.filter(plant => {
      const lastWatered = new Date(plant.lastWatered);
      const daysSince = Math.floor((today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= plant.wateringFrequency;
    }).length;

    // Calculate healthy plants (watered within schedule)
    const healthyPlants = plants.length - plantsNeedingWater;

    // Calculate average age
    const totalAge = plants.reduce((sum, plant) => {
      const dateAdded = new Date(plant.dateAdded);
      const ageInDays = Math.floor((today.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24));
      return sum + ageInDays;
    }, 0);
    const averageAge = Math.floor(totalAge / plants.length);

    // Find most common species
    const speciesCount = plants.reduce((acc, plant) => {
      acc[plant.species] = (acc[plant.species] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonSpecies = Object.entries(speciesCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Calculate total growth logs
    const totalGrowthLogs = plants.reduce((sum, plant) => sum + plant.growthLogs.length, 0);

    // Calculate watering streak (consecutive days with at least one watering)
    const wateringStreak = calculateWateringStreak();

    setStats({
      totalPlants: plants.length,
      healthyPlants,
      plantsNeedingWater,
      averageAge,
      mostCommonSpecies,
      totalGrowthLogs,
      wateringStreak
    });
  };

  const calculateWateringStreak = (): number => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Get all watering dates from plants
    const wateringDates = plants.map(plant => new Date(plant.lastWatered).toDateString());
    const uniqueWateringDates = new Set(wateringDates);

    // Check consecutive days backwards from today
    while (true) {
      const dateString = currentDate.toDateString();
      if (uniqueWateringDates.has(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getGrowthData = (): GrowthData[] => {
    const growthData: GrowthData[] = [];
    
    plants.forEach(plant => {
      plant.growthLogs.forEach(log => {
        if (log.height) {
          growthData.push({
            date: log.date,
            height: log.height,
            plantName: plant.name
          });
        }
      });
    });

    return growthData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getWateringData = (): WateringData[] => {
    const wateringCounts: Record<string, number> = {};
    
    plants.forEach(plant => {
      const wateringDate = new Date(plant.lastWatered).toDateString();
      wateringCounts[wateringDate] = (wateringCounts[wateringDate] || 0) + 1;
    });

    return Object.entries(wateringCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getHealthDistribution = () => {
    const distribution = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0
    };

    plants.forEach(plant => {
      const latestLog = plant.growthLogs[plant.growthLogs.length - 1];
      if (latestLog) {
        distribution[latestLog.healthStatus]++;
      } else {
        // Default to good if no logs
        distribution.good++;
      }
    });

    return distribution;
  };

  const getSpeciesDistribution = () => {
    const distribution: Record<string, number> = {};
    
    plants.forEach(plant => {
      distribution[plant.species] = (distribution[plant.species] || 0) + 1;
    });

    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5 species
  };

  const growthData = getGrowthData();
  const wateringData = getWateringData();
  const healthDistribution = getHealthDistribution();
  const speciesDistribution = getSpeciesDistribution();

  if (!stats) {
    return (
      <div className="plant-analytics">
        <div className="analytics-header">
          <h1>📊 Plant Analytics</h1>
          <p>No plants to analyze yet. Add some plants to see your statistics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-analytics">
      <div className="analytics-header">
        <h1>📊 Plant Analytics</h1>
        <p>Insights and statistics about your plant collection</p>
      </div>

      <div className="analytics-controls">
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'year')}
          className="timeframe-select"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>

        <select
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
          className="plant-select"
        >
          <option value="all">All Plants</option>
          {plants.map(plant => (
            <option key={plant.id} value={plant.id}>{plant.name}</option>
          ))}
        </select>
      </div>

      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalPlants}</div>
            <div className="stat-label">Total Plants</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.healthyPlants}</div>
            <div className="stat-label">Healthy Plants</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">💧</div>
          <div className="stat-content">
            <div className="stat-number">{stats.plantsNeedingWater}</div>
            <div className="stat-label">Need Water</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageAge}</div>
            <div className="stat-label">Avg Age (days)</div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalGrowthLogs}</div>
            <div className="stat-label">Growth Logs</div>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.wateringStreak}</div>
            <div className="stat-label">Watering Streak</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>🌿 Species Distribution</h3>
          <div className="species-chart">
            {speciesDistribution.map(([species, count]) => (
              <div key={species} className="species-bar">
                <div className="species-label">{species}</div>
                <div className="species-bar-container">
                  <div 
                    className="species-bar-fill"
                    style={{ width: `${(count / stats.totalPlants) * 100}%` }}
                  ></div>
                  <span className="species-count">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>💚 Health Status Distribution</h3>
          <div className="health-chart">
            {Object.entries(healthDistribution).map(([status, count]) => (
              <div key={status} className={`health-item ${status}`}>
                <div className="health-label">
                  <span className="health-icon">
                    {status === 'excellent' && '🌟'}
                    {status === 'good' && '😊'}
                    {status === 'fair' && '😐'}
                    {status === 'poor' && '😟'}
                  </span>
                  {status}
                </div>
                <div className="health-count">{count}</div>
                <div className="health-percentage">
                  {Math.round((count / stats.totalPlants) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>📈 Growth Tracking</h3>
          {growthData.length > 0 ? (
            <div className="growth-chart">
              <div className="chart-container">
                {growthData.map((data, index) => (
                  <div key={index} className="growth-point">
                    <div 
                      className="growth-bar"
                      style={{ height: `${Math.min(data.height * 2, 100)}px` }}
                      title={`${data.plantName}: ${data.height}cm on ${new Date(data.date).toLocaleDateString()}`}
                    ></div>
                    <div className="growth-date">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>No growth data available. Start logging plant heights to see growth trends!</p>
            </div>
          )}
        </div>

        <div className="chart-card full-width">
          <h3>💧 Watering Activity</h3>
          {wateringData.length > 0 ? (
            <div className="watering-chart">
              <div className="chart-container">
                {wateringData.slice(-14).map((data, index) => (
                  <div key={index} className="watering-day">
                    <div 
                      className="watering-bar"
                      style={{ height: `${Math.min(data.count * 20, 100)}px` }}
                      title={`${data.count} plants watered on ${new Date(data.date).toLocaleDateString()}`}
                    ></div>
                    <div className="watering-date">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>No watering data available yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="insights-section">
        <h2>💡 Insights & Recommendations</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🏆 Most Popular Species</h4>
            <p>Your most common plant is <strong>{stats.mostCommonSpecies}</strong>. Consider diversifying your collection with different species for a more varied garden.</p>
          </div>
          
          <div className="insight-card">
            <h4>💧 Watering Performance</h4>
            <p>
              {stats.wateringStreak > 7 
                ? `Great job! You've maintained a ${stats.wateringStreak}-day watering streak. Keep it up!`
                : stats.plantsNeedingWater > stats.totalPlants / 2
                ? `${stats.plantsNeedingWater} plants need water. Consider setting up reminders to stay on track.`
                : 'Your watering schedule looks good! Most plants are well-hydrated.'
              }
            </p>
          </div>

          <div className="insight-card">
            <h4>📊 Collection Growth</h4>
            <p>
              {stats.totalGrowthLogs > 0 
                ? `You've logged ${stats.totalGrowthLogs} growth entries. Regular logging helps track plant health over time.`
                : 'Start logging plant growth measurements to track their development and health trends.'
              }
            </p>
          </div>

          <div className="insight-card">
            <h4>🌱 Plant Health</h4>
            <p>
              {stats.healthyPlants === stats.totalPlants
                ? 'Excellent! All your plants are healthy and well-cared for.'
                : `${stats.healthyPlants} out of ${stats.totalPlants} plants are healthy. Focus on the ones needing attention.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
