import React from 'react';
import { CartItem, AppearanceSettings } from '../../types';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface ModernCartSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onIncrementItem: (productId: string) => void;
  onDecrementItem: (productId: string) => void;
  appearance: AppearanceSettings;
  onProceedToCheckout: () => void;
}

const ModernCartSummary: React.FC<ModernCartSummaryProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onIncrementItem,
  onDecrementItem,
  appearance,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99; // Example shipping fee
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" onClick={onClose} />
        {/* Modal content */}
        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-3xl bg-[#181818] text-left align-bottom shadow-2xl transition-all sm:my-8 sm:align-middle border-2 border-[#D4FF00]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b-2 border-[#D4FF00] bg-[#181818] rounded-t-3xl sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="w-6 h-6 text-[#D4FF00]" />
              <h3 className="text-xl font-extrabold text-[#D4FF00] tracking-wide">Shopping Cart</h3>
            </div>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-[#D4FF00] hover:text-black text-[#D4FF00] transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Cart items list */}
          <div className="mt-2 max-h-[60vh] overflow-y-auto px-6 pb-2">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-black border-2 border-[#D4FF00] p-3 shadow-md">
                    {/* Product image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#222] flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <ShoppingCartIcon className="w-8 h-8 text-[#D4FF00]" />
                      )}
                    </div>
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-[#D4FF00] truncate">{item.name}</h4>
                      <p className="text-xs text-[#D4FF00] opacity-70 mt-1">${item.price}</p>
                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => onDecrementItem(item.id)} className="rounded-full p-1 bg-black border-2 border-[#D4FF00] text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-colors">
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="text-base font-bold text-[#D4FF00] w-6 text-center">{item.quantity}</span>
                        <button onClick={() => onIncrementItem(item.id)} className="rounded-full p-1 bg-black border-2 border-[#D4FF00] text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-colors">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Delete button */}
                    <button onClick={() => onRemoveItem(item.id)} className="rounded-full p-2 hover:bg-red-500 hover:text-white text-red-400 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCartIcon className="mx-auto h-12 w-12 text-[#D4FF00]" />
                <h3 className="mt-4 text-lg font-extrabold text-[#D4FF00]">Your cart is empty</h3>
                <p className="mt-2 text-base text-[#D4FF00] opacity-80">Start adding some items to your cart.</p>
              </div>
            )}
          </div>
          {/* Price summary */}
          {cartItems.length > 0 && (
            <div className="mt-4 space-y-2 border-t-2 border-[#D4FF00] pt-4 px-6">
              <div className="flex justify-between text-base font-bold text-[#D4FF00]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#D4FF00] opacity-80">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#D4FF00]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
          {/* Bottom buttons */}
          <div className="bg-[#181818] px-6 py-5 rounded-b-3xl flex flex-col gap-3">
            {cartItems.length > 0 ? (
              <button
                onClick={onProceedToCheckout}
                className="w-full rounded-2xl py-3 text-xl font-extrabold text-black bg-[#D4FF00] shadow-lg hover:bg-black hover:text-[#D4FF00] border-2 border-[#D4FF00] transition-all"
              >
                Proceed to Checkout
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="w-full rounded-2xl py-3 text-xl font-extrabold text-[#D4FF00] bg-black border-2 border-[#D4FF00] shadow hover:bg-[#D4FF00] hover:text-black transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCartSummary; 