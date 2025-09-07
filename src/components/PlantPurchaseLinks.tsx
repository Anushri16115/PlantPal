import type { Plant } from '../types/plant';

interface PlantPurchaseLinksProps {
  plant: Plant;
}

interface PlantStore {
  name: string;
  url: string;
  icon: string;
  searchQuery: (species: string) => string;
}

const plantStores: PlantStore[] = [
  {
    name: 'Amazon',
    url: 'https://www.amazon.in/s?k=',
    icon: '🛒',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species} plant live indoor outdoor`)
  },
  {
    name: 'Flipkart',
    url: 'https://www.flipkart.com/search?q=',
    icon: '🛍️',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species} plant live`)
  },
  {
    name: 'Ugaoo',
    url: 'https://www.ugaoo.com/search?q=',
    icon: '🌱',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species}`)
  },
  {
    name: 'Nurserylive',
    url: 'https://www.nurserylive.com/search?q=',
    icon: '🪴',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species} plant`)
  },
  {
    name: 'BigBasket',
    url: 'https://www.bigbasket.com/ps/?q=',
    icon: '🥬',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species} plant`)
  },
  {
    name: 'Urban Plants',
    url: 'https://www.urbanplants.co.in/search?q=',
    icon: '🏙️',
    searchQuery: (species: string) => 
      encodeURIComponent(`${species}`)
  }
];

export function PlantPurchaseLinks({ plant }: PlantPurchaseLinksProps) {
  const handlePurchaseClick = (store: PlantStore) => {
    const searchQuery = store.searchQuery(plant.species);
    const fullUrl = store.url + searchQuery;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="plant-purchase-section">
      <h3>🛒 Buy Similar Plants</h3>
      <p className="purchase-description">
        Find and purchase <strong>{plant.species}</strong> from these trusted plant retailers:
      </p>
      
      <div className="purchase-links-grid">
        {plantStores.map((store) => (
          <button
            key={store.name}
            onClick={() => handlePurchaseClick(store)}
            className="purchase-link-btn"
            title={`Search for ${plant.species} on ${store.name}`}
          >
            <span className="store-icon">{store.icon}</span>
            <span className="store-name">{store.name}</span>
            <span className="external-link-icon">↗</span>
          </button>
        ))}
      </div>
      
      <div className="purchase-disclaimer">
        <p>
          <small>
            💡 <strong>Tip:</strong> Search results will show plants similar to your <em>{plant.species}</em>. 
            Compare prices and read reviews before purchasing.
          </small>
        </p>
      </div>
    </div>
  );
}
