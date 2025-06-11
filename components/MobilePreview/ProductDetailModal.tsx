import React, { useEffect, useCallback } from 'react';
import { Product, AppearanceSettings } from '../../types';
import Button from '../common/Button';
// Removed Modal import: import Modal from '../common/Modal'; 
import { XMarkIcon, StarIcon } from '../../constants';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => boolean;
  appearance: AppearanceSettings;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  appearance,
}) => {
  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleEscKey]);

  if (!isOpen || !product) return null;

  const handleAddToCartClick = () => {
    const success = onAddToCart(product);
    if (success) {
      onClose(); // Close modal after successfully adding to cart
    }
  };

  let stockStatusText = "In Stock";
  let stockStatusColor = "text-SUCCESS_GREEN dark:text-replit-dark-green";
  if (product.stockQuantity === undefined) {
    stockStatusText = "Availability Unknown";
    stockStatusColor = "text-TEXT_MUTED dark:text-DARK_TEXT_MUTED";
  } else if (product.stockQuantity === 0) {
    stockStatusText = "Out of Stock";
    stockStatusColor = "text-ERROR_RED dark:text-replit-dark-red";
  } else if (product.stockQuantity < 10) {
    stockStatusText = `Low Stock (${product.stockQuantity} left)`;
    stockStatusColor = "text-yellow-500 dark:text-replit-dark-yellow";
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 dark:bg-DARK_BACKGROUND_CONTENT/70 backdrop-blur-sm p-2 sm:p-3"
      onClick={onClose} // Backdrop click closes modal
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div 
        className="bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-lg border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT w-full max-w-[calc(100%-1rem)] sm:max-w-xs shadow-xl flex flex-col max-h-[90%] transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Prevent modal content click from closing
      >
        {/* Header with Product Name and Close Button */}
        <div className="flex justify-between items-center p-3 border-b border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex-shrink-0">
          <h2 id="product-detail-title" className="text-base font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY truncate pr-2">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY hover:text-TEXT_PRIMARY dark:hover:text-DARK_TEXT_PRIMARY transition-colors p-1 rounded-full -mr-1 -mt-1"
            aria-label="Close product details"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto p-3 space-y-3 styled-scrollbar">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-contain rounded-md border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/placeholder_detail/600/400')}
            />
            {product.isFeatured && (
              <div 
                className="absolute top-1.5 left-1.5 text-xs px-1.5 py-0.5 rounded-full text-white font-semibold z-10 flex items-center"
                style={{ backgroundColor: appearance.primaryColor, filter: 'brightness(1.1)' }}
              >
                <StarIcon className="w-3 h-3 mr-1" /> Featured
              </div>
            )}
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-bold" style={{ color: appearance.primaryColor }}>
              {typeof product.price === 'number' && !isNaN(product.price) ? `$${product.price.toFixed(2)}` : 'N/A'}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${stockStatusColor}`}>
              {stockStatusText}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-0.5">Description</h4>
            <p className="text-xs text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.category && (
            <div>
              <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-0.5">Category</h4>
              <p className="text-xs text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">{product.category}</p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${appearance.primaryColor}20`, color: appearance.primaryColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
           {product.sku && (
            <div>
              <h4 className="text-xs font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-0.5">SKU</h4>
              <p className="text-xs text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">{product.sku}</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-3 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex-shrink-0">
          <Button
            variant="primary"
            className="w-full text-sm"
            style={{ backgroundColor: product.stockQuantity === 0 ? appearance.primaryColor + '80' : appearance.primaryColor }}
            onClick={handleAddToCartClick}
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
