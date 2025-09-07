import { useNavigate } from 'react-router-dom';
import { usePlants } from '../../context/PlantContext.js';
import { PlantForm } from '../../components/PlantForm.js';

export function AddPlant() {
  const navigate = useNavigate();
  const { addPlant } = usePlants();

  const handleAddPlant = async (plantData: any) => {
    await addPlant(plantData);
    navigate('/plants');
  };

  return (
    <div className="add-plant-page">
      <div className="page-header">
        <h1>Add New Plant 🌱</h1>
        <p>Add a new plant to your collection and start tracking its care</p>
      </div>

      <div className="plant-form-container">
        <div className="form-wrapper">
          <PlantForm
            onSubmit={handleAddPlant}
            onCancel={() => navigate('/plants')}
          />
        </div>
      </div>
    </div>
  );
}
