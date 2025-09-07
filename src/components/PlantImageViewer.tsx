import { useState, useEffect } from 'react';

interface PlantImageViewerProps {
  plantName: string;
  species?: string;
  onClose: () => void;
}

interface PlantImage {
  id: string;
  url: string;
  source: string;
  description?: string;
}

export function PlantImageViewer({ plantName, species, onClose }: PlantImageViewerProps) {
  const [images, setImages] = useState<PlantImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlantImages();
  }, [plantName, species]);

  const fetchPlantImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data for now
      // In a real app, you would call actual plant image APIs like:
      // - Unsplash API
      // - Pixabay API  
      // - Plant.id API
      // - iNaturalist API
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      const mockImages: PlantImage[] = [
        {
          id: '1',
          url: `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center`,
          source: 'Unsplash',
          description: `${plantName} in natural habitat`
        },
        {
          id: '2', 
          url: `https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop&crop=center`,
          source: 'Unsplash',
          description: `Close-up of ${plantName} leaves`
        },
        {
          id: '3',
          url: `https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop&crop=center`,
          source: 'Unsplash', 
          description: `${plantName} as houseplant`
        },
        {
          id: '4',
          url: `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop&crop=center`,
          source: 'Unsplash',
          description: `${plantName} care example`
        }
      ];
      
      setImages(mockImages);
    } catch (err) {
      setError('Failed to load plant images. Please try again later.');
      console.error('Error fetching plant images:', err);
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="plant-image-viewer">
      <div className="viewer-header">
        <div>
          <h2>📸 {plantName} Images</h2>
          {species && <p className="species-name">{species}</p>}
        </div>
        <button onClick={onClose} className="btn btn-secondary close-btn">
          ✕ Close
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading plant images...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchPlantImages} className="btn btn-primary retry-btn">
            🔄 Retry
          </button>
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="no-images">
          <p>📷 No images found for {plantName}</p>
          <p>Try searching for a different plant or check back later.</p>
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="images-grid">
          {images.map((image) => (
            <div key={image.id} className="image-card" onClick={() => openImageModal(image.url)}>
              <img 
                src={image.url} 
                alt={image.description || plantName}
                loading="lazy"
              />
              <div className="image-overlay">
                <p className="image-description">{image.description}</p>
                <p className="image-source">Source: {image.source}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-size image modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeImageModal} className="modal-close-btn">✕</button>
            <img src={selectedImage} alt={plantName} className="modal-image" />
          </div>
        </div>
      )}

      <style>{`
        .plant-image-viewer {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eee;
        }

        .viewer-header h2 {
          margin: 0 0 0.5rem 0;
          color: var(--primary-color, #2d5a27);
        }

        .species-name {
          font-style: italic;
          color: #666;
          margin: 0;
          font-size: 0.9rem;
        }

        .close-btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .loading-spinner {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary-color, #2d5a27);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          text-align: center;
          padding: 2rem;
          color: #e74c3c;
        }

        .retry-btn {
          margin-top: 1rem;
        }

        .no-images {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .image-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: #f8f9fa;
        }

        .image-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .image-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 1rem;
          transform: translateY(100%);
          transition: transform 0.2s ease;
        }

        .image-card:hover .image-overlay {
          transform: translateY(0);
        }

        .image-description {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .image-source {
          margin: 0;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .modal-close-btn {
          position: absolute;
          top: -40px;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .plant-image-viewer {
            padding: 1rem;
          }

          .viewer-header {
            flex-direction: column;
            gap: 1rem;
          }

          .images-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .image-card img {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}
