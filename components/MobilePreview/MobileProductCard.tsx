import React, { useState, useRef, useEffect } from 'react';
import { Product, AppearanceSettings } from '../../types';
import { StarIcon, InfoIcon, ShoppingCartIcon } from '../../constants'; 
import { tailwindConfig } from '../../utils'; 
import { isColorDark } from '../MobilePreview';

interface MobileProductCardProps {
  product: Product;
  appearance: AppearanceSettings;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null; 
  onAddToCart: (product: Product) => boolean; 
  onProductCardClick: (product: Product) => void;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ 
  product, 
  appearance,
  isElementSelectionActive,
  onElementSelected,
  activelySelectedPreviewElementId,
  onAddToCart,
  onProductCardClick
}) => {
  const [feedbackState, setFeedbackState] = useState<'default' | 'success' | 'info'>('default');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [canShowMoreButton, setCanShowMoreButton] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      // Show "more" button if the scrollHeight (full content height) is greater than clientHeight (visible height when clamped)
      // or if the description is simply long enough to warrant it as a fallback.
      const isClamped = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setCanShowMoreButton(isClamped || (product.description && product.description.length > 80)); // 80 chars is an arbitrary threshold
    }
  }, [product.description, isDescriptionExpanded]);

  const elementName = `Product: ${product.name}`; // Name for selection context

  const handleCardClick = () => {
    if (isElementSelectionActive && onElementSelected) {
      onElementSelected({ id: product.id, name: elementName });
    } else if (!isElementSelectionActive && onProductCardClick) {
      onProductCardClick(product);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!isElementSelectionActive) {
      const success = onAddToCart(product);
      if (success) {
        setFeedbackState('success');
      } else {
        setFeedbackState('info'); 
      }
      setTimeout(() => setFeedbackState('default'), 1500); 
    }
  };
  
  const toggleDescriptionExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when toggling description
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const selectableClasses = isElementSelectionActive 
    ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-replit-primary-blue transition-all duration-100' 
    : 'cursor-pointer group';
  
  const activeSelectionClasses = activelySelectedPreviewElementId === product.id ? 'preview-element-actively-selected' : '';

  let addToCartButtonBgColor = appearance.primaryColor;
  let AddToCartIconComponent: React.ReactNode = <ShoppingCartIcon className="text-xl" />;
  let addToCartTitle = "Add to cart";
  
  const isEditorDark = document.documentElement.classList.contains('dark');

  // 按钮文字色动态切换
  const isPrimaryDark = isColorDark(appearance.primaryColor);
  const addToCartButtonTextColor = isPrimaryDark ? 'text-white' : 'text-gray-900';

  if (feedbackState === 'success') {
    addToCartButtonBgColor = isEditorDark ? tailwindConfig.theme.extend.colors['replit-dark-green'] : tailwindConfig.theme.extend.colors['replit-light-green'];
    AddToCartIconComponent = <i className="ph-check-circle text-xl"></i>;
    addToCartTitle = "Added!";
  } else if (feedbackState === 'info') {
    addToCartButtonBgColor = isEditorDark ? tailwindConfig.theme.extend.colors['replit-dark-text-disabled'] : tailwindConfig.theme.extend.colors['replit-light-text-disabled'];
    AddToCartIconComponent = <InfoIcon className="text-xl" />; 
    addToCartTitle = "Already in cart / Info";
  }

  return (
    <div 
      className={`bg-BACKGROUND_CONTENT rounded-xl overflow-hidden m-2 border border-BORDER_DEFAULT relative shadow-light-subtle dark:shadow-subtle ${selectableClasses} ${activeSelectionClasses} transition-all duration-150 hover:shadow-md dark:hover:border-BORDER_MUTED`}
      onClick={handleCardClick}
      data-selectable-id={product.id}
      data-selectable-name={elementName} // Added for hover tooltip
      role={isElementSelectionActive ? undefined : "button"}
      tabIndex={isElementSelectionActive ? undefined : 0}
      aria-label={isElementSelectionActive ? undefined : `View details for ${product.name}`}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-40 object-cover pointer-events-none" 
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/placeholder/400/300')}
        />
        {product.isFeatured && (
          <div 
            className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full text-white font-semibold z-10 flex items-center pointer-events-none"
            style={{ backgroundColor: appearance.primaryColor, filter: 'brightness(1.1)' }}
            title="Featured Product"
          >
            <StarIcon className="w-3 h-3 mr-1" /> Featured
          </div>
        )}
        <button 
            className="absolute top-2 right-2 p-1.5 bg-BACKGROUND_CONTENT/80 dark:bg-replit-dark-bg/80 rounded-full text-TEXT_SECONDARY hover:text-ERROR_RED transition-colors pointer-events-auto z-10 backdrop-blur-sm border border-BORDER_DEFAULT dark:border-replit-dark-border"
            title="Add to Wishlist"
            aria-label="Add to Wishlist"
            tabIndex={isElementSelectionActive ? -1 : 0}
            onClick={(e) => e.stopPropagation()}
        >
            <i className="ph-heart text-lg"></i>
        </button>
      </div>
      
      <div className="p-3 pointer-events-none min-w-0">
        <h3 className="text-base font-semibold text-TEXT_PRIMARY truncate pr-2">{product.name}</h3>
        
        <div className="relative">
          <p 
            ref={descriptionRef}
            className={`text-xs text-TEXT_SECONDARY break-words my-1 h-auto ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}
          >
            {product.description}
          </p>
          {canShowMoreButton && product.description && product.description.length > 0 && ( // Only show if description exists
            <button
              onClick={toggleDescriptionExpand}
              className="text-xs font-medium pointer-events-auto mt-0.5"
              style={{ color: appearance.primaryColor }}
              aria-expanded={isDescriptionExpanded}
            >
              {isDescriptionExpanded ? 'less' : 'more'}
            </button>
          )}
        </div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 mb-1 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => ( 
              <span 
                key={tag} 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${appearance.primaryColor}20`, color: appearance.primaryColor }} 
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-bold" style={{color: appearance.primaryColor}}>
            {typeof product.price === 'number' && !isNaN(product.price) ? `$${product.price.toFixed(2)}` : 'N/A'}
          </p>
          <button 
            className="p-2 rounded-full text-white transition-all duration-150 hover:scale-110 active:scale-95 pointer-events-auto"
            style={{ backgroundColor: addToCartButtonBgColor }} 
            tabIndex={isElementSelectionActive ? -1 : 0}
            aria-label={addToCartTitle} 
            title={addToCartTitle} 
            onClick={handleAddToCartClick}
          >
            {AddToCartIconComponent} 
          </button>
        </div>
         {product.category && (
          <p className="text-xs text-TEXT_MUTED mt-1.5 truncate">Category: {product.category}</p>
        )}
      </div>
    </div>
  );
};

export default MobileProductCard;
