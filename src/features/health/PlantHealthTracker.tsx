import { useState, useEffect } from 'react';
import { usePlants } from '../../context/PlantContext.js';
import type { Plant } from '../../types/plant.d.ts';
import './PlantHealthTracker.css';

interface HealthIssue {
  id: string;
  name: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  severity: 'low' | 'medium' | 'high';
  category: 'pest' | 'disease' | 'environmental' | 'nutritional';
  imageUrl?: string;
}

interface PlantDiagnosis {
  plantId: string;
  plantName: string;
  symptoms: string[];
  possibleIssues: HealthIssue[];
  confidence: number;
  recommendations: string[];
}

const HEALTH_ISSUES: HealthIssue[] = [
  {
    id: 'spider-mites',
    name: 'Spider Mites',
    symptoms: ['Fine webbing on leaves', 'Yellow stippling on leaves', 'Leaves appear dusty', 'Tiny moving dots on undersides'],
    causes: ['Low humidity', 'Dry conditions', 'Poor air circulation', 'Stressed plants'],
    treatments: ['Increase humidity', 'Spray with water regularly', 'Use insecticidal soap', 'Improve air circulation'],
    severity: 'high',
    category: 'pest'
  },
  {
    id: 'aphids',
    name: 'Aphids',
    symptoms: ['Small green/black insects on stems', 'Sticky honeydew on leaves', 'Curled or distorted leaves', 'Yellowing leaves'],
    causes: ['New growth attracts aphids', 'Over-fertilization', 'Weak plants', 'Ants farming aphids'],
    treatments: ['Spray off with water', 'Use insecticidal soap', 'Introduce ladybugs', 'Remove heavily infested parts'],
    severity: 'medium',
    category: 'pest'
  },
  {
    id: 'root-rot',
    name: 'Root Rot',
    symptoms: ['Yellowing leaves', 'Musty smell from soil', 'Black/brown mushy roots', 'Plant wilting despite wet soil'],
    causes: ['Overwatering', 'Poor drainage', 'Contaminated soil', 'Fungal infection'],
    treatments: ['Stop watering immediately', 'Remove from pot and trim black roots', 'Repot in fresh, well-draining soil', 'Reduce watering frequency'],
    severity: 'high',
    category: 'disease'
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    symptoms: ['White powdery coating on leaves', 'Leaves may yellow and drop', 'Stunted growth', 'Distorted leaves'],
    causes: ['High humidity with poor air circulation', 'Overcrowding', 'Low light conditions', 'Temperature fluctuations'],
    treatments: ['Improve air circulation', 'Reduce humidity around plant', 'Remove affected leaves', 'Apply fungicidal spray'],
    severity: 'medium',
    category: 'disease'
  },
  {
    id: 'nutrient-deficiency',
    name: 'Nutrient Deficiency',
    symptoms: ['Yellowing leaves (nitrogen)', 'Purple/red leaves (phosphorus)', 'Brown leaf edges (potassium)', 'Pale new growth'],
    causes: ['Poor soil quality', 'Infrequent fertilizing', 'pH imbalance', 'Root problems preventing uptake'],
    treatments: ['Apply balanced fertilizer', 'Check soil pH', 'Repot in fresh soil', 'Ensure proper watering'],
    severity: 'medium',
    category: 'nutritional'
  },
  {
    id: 'sunburn',
    name: 'Sunburn/Light Burn',
    symptoms: ['Brown or white patches on leaves', 'Crispy leaf edges', 'Faded or bleached appearance', 'Leaves dropping'],
    causes: ['Too much direct sunlight', 'Sudden change in light conditions', 'Magnification through glass', 'Heat stress'],
    treatments: ['Move to indirect light', 'Gradually acclimate to brighter light', 'Remove damaged leaves', 'Provide shade during peak hours'],
    severity: 'low',
    category: 'environmental'
  },
  {
    id: 'overwatering',
    name: 'Overwatering',
    symptoms: ['Yellowing leaves', 'Soft, mushy stems', 'Fungal growth on soil', 'Leaves dropping', 'Stunted growth'],
    causes: ['Watering too frequently', 'Poor drainage', 'Wrong pot size', 'Heavy, water-retaining soil'],
    treatments: ['Reduce watering frequency', 'Improve drainage', 'Repot if necessary', 'Allow soil to dry between waterings'],
    severity: 'high',
    category: 'environmental'
  },
  {
    id: 'underwatering',
    name: 'Underwatering',
    symptoms: ['Wilting leaves', 'Dry, crispy leaf edges', 'Leaves dropping', 'Soil pulling away from pot edges', 'Stunted growth'],
    causes: ['Infrequent watering', 'Fast-draining soil', 'High temperatures', 'Low humidity'],
    treatments: ['Increase watering frequency', 'Water thoroughly until drainage', 'Check soil moisture regularly', 'Consider humidity tray'],
    severity: 'medium',
    category: 'environmental'
  }
];

export function PlantHealthTracker() {
  const { plants } = usePlants();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);

  const allSymptoms = Array.from(new Set(HEALTH_ISSUES.flatMap(issue => issue.symptoms)));

  const diagnosePlant = () => {
    if (!selectedPlant || selectedSymptoms.length === 0) return;

    const matchingIssues = HEALTH_ISSUES.map(issue => {
      const matchingSymptoms = issue.symptoms.filter(symptom => 
        selectedSymptoms.includes(symptom)
      );
      const confidence = matchingSymptoms.length / issue.symptoms.length;
      
      return { issue, confidence, matchingSymptoms };
    })
    .filter(result => result.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

    const topIssues = matchingIssues.slice(0, 3).map(result => result.issue);
    const overallConfidence = matchingIssues.length > 0 ? matchingIssues[0].confidence : 0;

    const recommendations = generateRecommendations(topIssues, selectedSymptoms);

    setDiagnosis({
      plantId: selectedPlant.id,
      plantName: selectedPlant.name,
      symptoms: selectedSymptoms,
      possibleIssues: topIssues,
      confidence: overallConfidence,
      recommendations
    });
  };

  const generateRecommendations = (issues: HealthIssue[], symptoms: string[]): string[] => {
    const recommendations = new Set<string>();
    
    // Add general recommendations based on symptoms
    if (symptoms.some(s => s.includes('yellow'))) {
      recommendations.add('Check watering schedule - yellowing often indicates water issues');
    }
    if (symptoms.some(s => s.includes('brown') || s.includes('crispy'))) {
      recommendations.add('Examine light conditions and humidity levels');
    }
    if (symptoms.some(s => s.includes('insects') || s.includes('webbing'))) {
      recommendations.add('Isolate plant to prevent pest spread to other plants');
    }

    // Add specific treatments from top issues
    issues.slice(0, 2).forEach(issue => {
      issue.treatments.slice(0, 2).forEach(treatment => {
        recommendations.add(treatment);
      });
    });

    return Array.from(recommendations);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pest': return '🐛';
      case 'disease': return '🦠';
      case 'environmental': return '🌡️';
      case 'nutritional': return '🌿';
      default: return '❓';
    }
  };

  const resetDiagnosis = () => {
    setSelectedPlant(null);
    setSelectedSymptoms([]);
    setDiagnosis(null);
    setShowDiagnosisForm(false);
  };

  return (
    <div className="plant-health-tracker">
      <div className="health-header">
        <h1>🏥 Plant Health Tracker</h1>
        <p>Diagnose and treat your plant health issues</p>
      </div>

      {!showDiagnosisForm && !diagnosis && (
        <div className="health-overview">
          <div className="quick-actions">
            <button 
              onClick={() => setShowDiagnosisForm(true)}
              className="btn btn-primary action-btn"
            >
              🔍 Diagnose Plant Issue
            </button>
          </div>

          <div className="health-tips">
            <h2>🌱 General Health Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <h3>💧 Watering</h3>
                <p>Check soil moisture before watering. Most plants prefer to dry out slightly between waterings.</p>
              </div>
              <div className="tip-card">
                <h3>☀️ Light</h3>
                <p>Ensure plants get appropriate light levels. Rotate regularly for even growth.</p>
              </div>
              <div className="tip-card">
                <h3>🌬️ Air Circulation</h3>
                <p>Good airflow prevents many fungal issues and pest problems.</p>
              </div>
              <div className="tip-card">
                <h3>🔍 Regular Inspection</h3>
                <p>Check plants weekly for early signs of pests or diseases.</p>
              </div>
            </div>
          </div>

          <div className="common-issues">
            <h2>🚨 Common Plant Issues</h2>
            <div className="issues-grid">
              {HEALTH_ISSUES.map(issue => (
                <div key={issue.id} className="issue-card">
                  <div className="issue-header">
                    <span className="category-icon">{getCategoryIcon(issue.category)}</span>
                    <h3>{issue.name}</h3>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(issue.severity) }}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <div className="issue-symptoms">
                    <h4>Symptoms:</h4>
                    <ul>
                      {issue.symptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="issue-treatments">
                    <h4>Quick Treatment:</h4>
                    <p>{issue.treatments[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDiagnosisForm && !diagnosis && (
        <div className="diagnosis-form">
          <div className="form-header">
            <h2>🔍 Plant Diagnosis</h2>
            <button onClick={resetDiagnosis} className="btn btn-secondary">
              ← Back
            </button>
          </div>

          <div className="form-step">
            <h3>Step 1: Select Your Plant</h3>
            <div className="plant-selector">
              {plants.map(plant => (
                <div 
                  key={plant.id}
                  className={`plant-option ${selectedPlant?.id === plant.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <span className="plant-name">{plant.name}</span>
                  <span className="plant-species">{plant.species}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedPlant && (
            <div className="form-step">
              <h3>Step 2: Select Symptoms</h3>
              <div className="symptoms-grid">
                {allSymptoms.map(symptom => (
                  <label key={symptom} className="symptom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSymptoms([...selectedSymptoms, symptom]);
                        } else {
                          setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                    {symptom}
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedPlant && selectedSymptoms.length > 0 && (
            <div className="form-actions">
              <button onClick={diagnosePlant} className="btn btn-primary">
                Get Diagnosis
              </button>
            </div>
          )}
        </div>
      )}

      {diagnosis && (
        <div className="diagnosis-results">
          <div className="results-header">
            <h2>🩺 Diagnosis Results for {diagnosis.plantName}</h2>
            <button onClick={resetDiagnosis} className="btn btn-secondary">
              New Diagnosis
            </button>
          </div>

          <div className="confidence-meter">
            <h3>Confidence Level</h3>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ 
                  width: `${diagnosis.confidence * 100}%`,
                  backgroundColor: diagnosis.confidence > 0.7 ? '#10b981' : diagnosis.confidence > 0.4 ? '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
            <span className="confidence-text">{Math.round(diagnosis.confidence * 100)}% match</span>
          </div>

          <div className="selected-symptoms">
            <h3>Reported Symptoms</h3>
            <div className="symptoms-list">
              {diagnosis.symptoms.map((symptom, index) => (
                <span key={index} className="symptom-tag">{symptom}</span>
              ))}
            </div>
          </div>

          <div className="possible-issues">
            <h3>Possible Issues</h3>
            {diagnosis.possibleIssues.map((issue, index) => (
              <div key={issue.id} className="diagnosis-issue">
                <div className="issue-header">
                  <span className="category-icon">{getCategoryIcon(issue.category)}</span>
                  <h4>{issue.name}</h4>
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(issue.severity) }}
                  >
                    {issue.severity} severity
                  </span>
                  {index === 0 && <span className="most-likely">Most Likely</span>}
                </div>
                
                <div className="issue-details">
                  <div className="detail-section">
                    <h5>Causes:</h5>
                    <ul>
                      {issue.causes.map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="detail-section">
                    <h5>Treatments:</h5>
                    <ul>
                      {issue.treatments.map((treatment, idx) => (
                        <li key={idx}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="recommendations">
            <h3>💡 Immediate Recommendations</h3>
            <div className="recommendations-list">
              {diagnosis.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <span className="rec-number">{index + 1}</span>
                  <span className="rec-text">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="follow-up">
            <h3>📅 Follow-up Care</h3>
            <div className="follow-up-tips">
              <p>• Monitor your plant daily for the next week</p>
              <p>• Take photos to track progress</p>
              <p>• If symptoms worsen, consider more aggressive treatment</p>
              <p>• Isolate plant if pest-related to protect other plants</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
