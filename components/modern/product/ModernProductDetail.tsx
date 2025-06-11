import React, { useState } from 'react';
import { Product, AppearanceSettings } from '../../../types';

interface ModernProductDetailProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (product: Product) => boolean;
  appearance: AppearanceSettings;
}

const ModernProductDetail: React.FC<ModernProductDetailProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  appearance,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const productToAdd = { ...product, quantity };
    const success = onAddToCart(productToAdd);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (success) setQuantity(1);
    setIsAddingToCart(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" onClick={onClose} />
        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-3xl bg-[#181818] text-left align-bottom shadow-2xl transition-all sm:my-8 sm:align-middle border-2 border-[#D4FF00]">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-[#D4FF00] hover:text-black text-[#D4FF00] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Image Display Area */}
          <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden flex items-center justify-center bg-black mt-6 relative">
            {product.imageUrl ? (
              <>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={`object-contain w-full h-full transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  style={{ position: 'absolute', inset: 0 }}
                />
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-[#23242a] shimmer rounded-2xl" />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-[#D4FF00]">🛒</div>
            )}
          </div>
          {/* Content Area */}
          <div className="px-6 pt-6 pb-8">
            {/* Product Name + Tags */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-[#D4FF00] flex items-center gap-1">{product.name} <span className="text-lg">✨</span></h3>
              {product.isFeatured && <span className="bg-[#D4FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full shadow">Featured</span>}
              {product.tags?.includes('discount') && <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">-50%</span>}
            </div>
            {/* Price + Stock */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-extrabold text-[#D4FF00] drop-shadow">${product.price}</span>
              <span className="text-xs text-[#D4FF00] opacity-70">Stock: {product.stockQuantity ?? '--'}</span>
            </div>
            {/* Description */}
            <div className="mb-4">
              <h4 className="text-base font-bold text-[#D4FF00] mb-1">Description</h4>
              <p className="text-sm text-[#D4FF00] opacity-80 whitespace-pre-wrap leading-relaxed">{product.description}</p>
            </div>
            {/* Category */}
            {product.category && (
              <div className="mb-4">
                <h4 className="text-base font-bold text-[#D4FF00] mb-1">Category</h4>
                <p className="text-sm text-[#D4FF00] opacity-80">{product.category}</p>
              </div>
            )}
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#D4FF00] font-bold">Quantity</span>
              <button className="w-8 h-8 rounded-full bg-black border-2 border-[#D4FF00] text-[#D4FF00] text-xl flex items-center justify-center hover:bg-[#D4FF00] hover:text-black transition-colors" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span className="text-lg font-bold text-[#D4FF00] w-8 text-center">{quantity}</span>
              <button className="w-8 h-8 rounded-full bg-black border-2 border-[#D4FF00] text-[#D4FF00] text-xl flex items-center justify-center hover:bg-[#D4FF00] hover:text-black transition-colors" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full py-4 rounded-2xl text-black font-extrabold text-xl shadow-lg hover:bg-black hover:text-[#D4FF00] border-2 border-[#D4FF00] bg-[#D4FF00] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="text-2xl">＋</span>
              )}
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProductDetail; 