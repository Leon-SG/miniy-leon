
import React, { useEffect } from 'react';
import { CartItem, AppearanceSettings } from '../../types';
import Button from '../common/Button';
import { XMarkIcon } from '../../constants';

interface CartSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onIncrementItem: (productId: string) => void;
  onDecrementItem: (productId: string) => void;
  appearance: AppearanceSettings;
  onProceedToCheckout: () => void;
}

const CartSummaryModal: React.FC<CartSummaryModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onIncrementItem,
  onDecrementItem,
  appearance,
  onProceedToCheckout,
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <div
        className="relative z-40 bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-xl border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT w-full max-w-xs sm:max-w-sm shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="cart-modal-title"
          className="flex items-center justify-between p-3 rounded-t-xl flex-shrink-0"
          style={{ backgroundColor: appearance.primaryColor }}
        >
          <h2 className="text-base font-semibold text-white">Your Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
            aria-label="Close cart"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT">
            <div className="p-3 sm:p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <i className="ph-shopping-cart text-4xl sm:text-5xl text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mb-3"></i>
                <p className="text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY font-medium text-sm sm:text-base">Your cart is empty.</p>
                <p className="text-xs sm:text-sm text-TEXT_MUTED dark:text-DARK_TEXT_MUTED">Add some products to get started!</p>
                <Button variant="primary" onClick={onClose} className="mt-4 sm:mt-6 text-sm">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-48 sm:max-h-60 overflow-y-auto pr-1 sm:pr-2 space-y-2.5 styled-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 p-2 border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT rounded-lg bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT hover:bg-gray-50/50 dark:hover:bg-DARK_BORDER_MUTED/30">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT"
                        onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/placeholder_cart/100/100')}
                      />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY truncate">{item.name}</p>
                        <p className="text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mb-1">
                           Price: <span style={{ color: appearance.primaryColor }}>${item.price.toFixed(2)}</span>
                        </p>
                        <div className="flex items-center space-x-1.5">
                           <button 
                            onClick={() => onDecrementItem(item.id)}
                            className="p-0.5 rounded-full text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY hover:bg-gray-200 dark:hover:bg-DARK_BORDER_MUTED transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`}
                           >
                             <i className="ph-minus-circle text-base sm:text-lg"></i>
                           </button>
                           <span className="text-xs sm:text-sm font-medium text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY w-5 text-center">{item.quantity}</span>
                           <button 
                            onClick={() => onIncrementItem(item.id)}
                            className="p-0.5 rounded-full text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY hover:bg-gray-200 dark:hover:bg-DARK_BORDER_MUTED transition-colors"
                            aria-label={`Increase quantity of ${item.name}`}
                           >
                             <i className="ph-plus-circle text-base sm:text-lg"></i>
                           </button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-ERROR_RED hover:bg-ERROR_RED/10 dark:hover:bg-ERROR_RED/20 p-1 flex-shrink-0 self-start"
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove item"
                      >
                        <i className="ph-trash w-4 h-4 sm:w-5 sm:h-5"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
        </div>

        {cartItems.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex-shrink-0 bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-b-xl">
                <div className="flex justify-between items-center text-sm sm:text-md font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY">
                <span>Subtotal:</span>
                <span style={{ color: appearance.primaryColor }}>${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mt-1">Shipping & taxes calculated at checkout (simulated).</p>

                <div className="mt-4 space-y-2">
                <Button
                    variant="primary"
                    className="w-full text-sm"
                    style={{ backgroundColor: appearance.primaryColor }}
                    onClick={onProceedToCheckout}
                >
                    Proceed to Checkout
                </Button>
                <Button variant="ghost" className="w-full text-sm" onClick={onClose}>
                    Continue Shopping
                </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartSummaryModal;
