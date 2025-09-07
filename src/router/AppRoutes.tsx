import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../features/dashboard/Dashboard.js';
import { PlantList } from '../features/plants/PlantList.js';
import { PlantDetail } from '../features/plants/PlantDetail.js';
import { AddPlant } from '../features/plants/AddPlant.js';
import { PlantImageDemo } from '../pages/PlantImageDemo.js';
import { PlantEncyclopedia } from '../features/encyclopedia/PlantEncyclopedia.js';
import { PlantHealthTracker } from '../features/health/PlantHealthTracker.js';
import { PlantAnalytics } from '../features/analytics/PlantAnalytics.js';
import { PlantCommunity } from '../features/community/PlantCommunity.js';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/plants" element={<PlantList />} />
      <Route path="/plants/new" element={<AddPlant />} />
      <Route path="/plants/:id" element={<PlantDetail />} />
      <Route path="/encyclopedia" element={<PlantEncyclopedia />} />
      <Route path="/health" element={<PlantHealthTracker />} />
      <Route path="/analytics" element={<PlantAnalytics />} />
      <Route path="/community" element={<PlantCommunity />} />
      <Route path="/demo/images" element={<PlantImageDemo />} />
    </Routes>
  );
}
