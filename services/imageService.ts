import axios from 'axios';

// TODO: Need to replace with actual Unsplash API key
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// Temporary default image
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60';

export const getProductImage = async (productName: string): Promise<string> => {
  // TODO: Implement Unsplash API image search functionality
  // Currently returning default image
  console.log(`[TODO] Getting image for product "${productName}" - waiting for Unsplash API key`);
  return DEFAULT_PRODUCT_IMAGE;
};

// Image cache to avoid duplicate requests
const imageCache: Record<string, string> = {};

export const getCachedProductImage = async (productName: string): Promise<string> => {
  if (imageCache[productName]) {
    return imageCache[productName];
  }

  const imageUrl = await getProductImage(productName);
  imageCache[productName] = imageUrl;
  return imageUrl;
}; 