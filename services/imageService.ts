import axios from 'axios';

// TODO: 需要替换为实际的 Unsplash API key
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// 临时的默认图片
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60';

export const getProductImage = async (productName: string): Promise<string> => {
  // TODO: 实现 Unsplash API 图片搜索功能
  // 目前返回默认图片
  console.log(`[TODO] 获取商品 "${productName}" 的图片 - 等待 Unsplash API key`);
  return DEFAULT_PRODUCT_IMAGE;
};

// 图片缓存，避免重复请求
const imageCache: Record<string, string> = {};

export const getCachedProductImage = async (productName: string): Promise<string> => {
  if (imageCache[productName]) {
    return imageCache[productName];
  }

  const imageUrl = await getProductImage(productName);
  imageCache[productName] = imageUrl;
  return imageUrl;
}; 