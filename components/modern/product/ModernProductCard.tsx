import React, { useState } from 'react';
import { Product, AppearanceSettings } from '../../../types';

interface ModernProductCardProps {
  product: Product;
  appearance: AppearanceSettings;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => boolean;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({
  product,
  appearance,
  onProductClick,
  onAddToCart,
  isElementSelectionActive = false,
  onElementSelected = () => {},
  activelySelectedPreviewElementId,
}) => {
  const productCardElementId = `product-card-${product.id}`;
  const isProductCardHighlighted = activelySelectedPreviewElementId === productCardElementId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isElementSelectionActive) return;
    onAddToCart(product);
  };

  return (
    <div
      className="rounded-3xl bg-[#181818] p-4 sm:p-6 shadow-xl flex flex-col items-center transition-transform hover:scale-105 border-2 border-[#D4FF00] relative group"
      style={{ minHeight: 260, fontFamily: 'Nunito, Helvetica Neue, Arial, sans-serif' }}
      onClick={() => onProductClick(product)}
      data-selectable-id={productCardElementId}
      data-selectable-name={product.name}
    >
      {/* 收藏icon/折扣标签 */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
        <button className="rounded-full bg-black/60 hover:bg-[#D4FF00] hover:text-black text-[#D4FF00] p-2 shadow transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0l1.318 1.318 1.318-1.318a4.5 4.5 0 116.364 6.364l-7.682 7.682a2 2 0 01-2.828 0l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
        {product.isFeatured && (
          <span className="bg-[#D4FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full shadow">Featured</span>
        )}
        {product.tags?.includes('折扣') && (
          <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">-50%</span>
        )}
      </div>
      {/* 商品图片 */}
      <div className="w-full h-32 sm:h-40 rounded-2xl overflow-hidden mb-3 sm:mb-4 flex items-center justify-center bg-black relative">
        {product.imageUrl ? (
          (() => {
            const [imgLoaded, setImgLoaded] = useState(false);
            return (
              <>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={`object-cover w-full h-full rounded-2xl transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  style={{ position: 'absolute', inset: 0 }}
                />
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-[#23242a] shimmer rounded-2xl" />
                )}
              </>
            );
          })()
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl text-[#D4FF00]">🛒</div>
        )}
      </div>
      {/* 商品名 */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#D4FF00] mb-1 sm:mb-2 text-center tracking-wide flex items-center gap-1">
        {product.name} <span className="text-lg">✨</span>
      </h2>
      {/* 商品描述 */}
      <p className="text-sm sm:text-base text-[#D4FF00] opacity-80 mb-2 sm:mb-4 text-center" style={{ minHeight: 32 }}>{product.description}</p>
      {/* 价格+加购按钮 */}
      <div className="flex items-center justify-between w-full mt-auto gap-2">
        <span className="text-2xl font-extrabold text-[#D4FF00] drop-shadow-sm">${product.price}</span>
        <button
          className="rounded-full bg-[#D4FF00] text-black font-bold px-5 py-2 shadow-lg hover:bg-black hover:text-[#D4FF00] border-2 border-[#D4FF00] transition-colors text-base"
          onClick={handleAddToCart}
        >
          <span className="text-lg">+</span> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ModernProductCard; 