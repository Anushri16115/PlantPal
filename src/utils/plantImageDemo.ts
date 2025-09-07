import { imageService } from '../services/imageService';

// Demo function to fetch images for specific plants
export async function fetchPlantImages() {
  console.log('🌿 Fetching plant images...');
  
  try {
    // Fetch Aloe Vera images
    console.log('📸 Searching for Aloe Vera images...');
    const aloeVeraImages = await imageService.searchPlantImages('Aloe Vera', 'Aloe barbadensis', 1, 6);
    
    console.log('🌵 Aloe Vera Images Found:');
    aloeVeraImages.images.forEach((image, index) => {
      console.log(`${index + 1}. ${image.url}`);
      console.log(`   Alt: ${image.alt}`);
      console.log(`   Source: ${image.source}`);
      if (image.photographer) {
        console.log(`   Photographer: ${image.photographer}`);
      }
      console.log('---');
    });

    // Fetch Fiddle Leaf Fig images
    console.log('📸 Searching for Fiddle Leaf Fig images...');
    const fiddleLeafImages = await imageService.searchPlantImages('Fiddle Leaf Fig', 'Ficus lyrata', 1, 6);
    
    console.log('🌿 Fiddle Leaf Fig Images Found:');
    fiddleLeafImages.images.forEach((image, index) => {
      console.log(`${index + 1}. ${image.url}`);
      console.log(`   Alt: ${image.alt}`);
      console.log(`   Source: ${image.source}`);
      if (image.photographer) {
        console.log(`   Photographer: ${image.photographer}`);
      }
      console.log('---');
    });

    return {
      aloeVera: aloeVeraImages,
      fiddleLeaf: fiddleLeafImages
    };
    
  } catch (error) {
    console.error('❌ Error fetching plant images:', error);
    return null;
  }
}

// Function to get images for existing plants in the database
export async function getExistingPlantImages() {
  try {
    // Find Aloe Vera plant (ID from dummy data)
    const aloeVeraPlantId = '9'; // From the dummy data
    const fiddleLeafPlantId = '3'; // From the dummy data
    
    console.log('🔍 Fetching images for existing plants...');
    
    const [aloeVeraPlantImages, fiddleLeafPlantImages] = await Promise.all([
      imageService.getPlantImages(aloeVeraPlantId),
      imageService.getPlantImages(fiddleLeafPlantId)
    ]);
    
    console.log('🌵 Aloe Vera Plant Images:', aloeVeraPlantImages);
    console.log('🌿 Fiddle Leaf Fig Plant Images:', fiddleLeafPlantImages);
    
    return {
      aloeVera: aloeVeraPlantImages,
      fiddleLeaf: fiddleLeafPlantImages
    };
    
  } catch (error) {
    console.error('❌ Error fetching existing plant images:', error);
    return null;
  }
}
