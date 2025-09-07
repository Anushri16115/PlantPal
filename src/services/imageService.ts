import { API_CONFIG } from '../config/api';

export interface PlantImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  source: 'unsplash' | 'pexels' | 'user' | 'default';
  photographer?: string;
  photographerUrl?: string;
}

export interface ImageSearchResult {
  images: PlantImage[];
  total: number;
  page: number;
  hasMore: boolean;
}

class ImageService {
  private unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  private pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

  // Search for plant images using multiple APIs
  async searchPlantImages(
    plantName: string, 
    species?: string, 
    page: number = 1, 
    perPage: number = 12
  ): Promise<ImageSearchResult> {
    const searchTerms = [plantName, species].filter(Boolean).join(' ');
    const results: PlantImage[] = [];

    try {
      // Try Unsplash first
      if (this.unsplashAccessKey) {
        const unsplashImages = await this.searchUnsplash(searchTerms, page, Math.ceil(perPage / 2));
        results.push(...unsplashImages);
      }

      // Then try Pexels
      if (this.pexelsApiKey && results.length < perPage) {
        const pexelsImages = await this.searchPexels(searchTerms, page, perPage - results.length);
        results.push(...pexelsImages);
      }

      // If no API keys or results, use fallback images
      if (results.length === 0) {
        results.push(...this.getFallbackImages(plantName, species));
      }

      return {
        images: results.slice(0, perPage),
        total: results.length,
        page,
        hasMore: results.length === perPage
      };
    } catch (error) {
      console.error('Error searching plant images:', error);
      return {
        images: this.getFallbackImages(plantName, species),
        total: 1,
        page: 1,
        hasMore: false
      };
    }
  }

  // Search Unsplash for plant images
  private async searchUnsplash(query: string, page: number, perPage: number): Promise<PlantImage[]> {
    if (!this.unsplashAccessKey) return [];

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' plant')}&page=${page}&per_page=${perPage}&orientation=portrait`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      );

      if (!response.ok) throw new Error('Unsplash API error');

      const data = await response.json();
      return data.results.map((photo: any): PlantImage => ({
        id: `unsplash-${photo.id}`,
        url: photo.urls.regular,
        thumbnailUrl: photo.urls.small,
        alt: photo.alt_description || `${query} plant`,
        source: 'unsplash',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      }));
    } catch (error) {
      console.error('Unsplash search error:', error);
      return [];
    }
  }

  // Search Pexels for plant images
  private async searchPexels(query: string, page: number, perPage: number): Promise<PlantImage[]> {
    if (!this.pexelsApiKey) return [];

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' plant')}&page=${page}&per_page=${perPage}&orientation=portrait`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      );

      if (!response.ok) throw new Error('Pexels API error');

      const data = await response.json();
      return data.photos.map((photo: any): PlantImage => ({
        id: `pexels-${photo.id}`,
        url: photo.src.large,
        thumbnailUrl: photo.src.medium,
        alt: `${query} plant`,
        source: 'pexels',
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url
      }));
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }

  // Get fallback images when APIs are not available
  private getFallbackImages(plantName?: string, species?: string): PlantImage[] {
    const searchTerm = species || plantName || 'plant';
    const fallbackImages = [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=600&fit=crop'
    ];

    return fallbackImages.map((url, index) => ({
      id: `fallback-${index}`,
      url,
      thumbnailUrl: url.replace('w=400&h=600', 'w=200&h=300'),
      alt: `${searchTerm} plant`,
      source: 'default' as const
    }));
  }

  // Get plant images from our API
  async getPlantImages(plantId: string): Promise<PlantImage[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/plants/${plantId}/images`);
      if (!response.ok) throw new Error('Failed to fetch plant images');
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching plant images:', error);
      return [];
    }
  }

  // Save plant image to our API
  async savePlantImage(plantId: string, image: Omit<PlantImage, 'id'>): Promise<PlantImage> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/plants/${plantId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(image)
      });

      if (!response.ok) throw new Error('Failed to save plant image');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error saving plant image:', error);
      throw error;
    }
  }

  // Delete plant image from our API
  async deletePlantImage(plantId: string, imageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/plants/${plantId}/images/${imageId}`, {
        method: 'DELETE'
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting plant image:', error);
      return false;
    }
  }

  // Upload user image (if implementing file upload)
  async uploadPlantImage(plantId: string, file: File): Promise<PlantImage> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('plantId', plantId);

      const response = await fetch(`${API_CONFIG.BASE_URL}/plants/${plantId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error uploading plant image:', error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
