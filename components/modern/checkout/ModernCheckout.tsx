import React, { useState } from 'react';
import { CartItem } from '../../../types';

interface ModernCheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onPlaceOrder: () => void;
}

const ModernCheckout: React.FC<ModernCheckoutProps> = ({
  cartItems,
  onClose,
  onPlaceOrder,
}) => {
  // 计算订单总金额
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00; // 模拟运费
  const tax = subtotal * 0.08; // 模拟税率 8%
  const total = subtotal + shipping + tax;

  // 配送地址表单状态
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70">
      <div className="min-h-screen px-3 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        {/* 结账内容 */}
        <div className="inline-block w-full max-w-2xl p-4 my-4 text-left align-middle bg-[#181818] rounded-3xl border-2 border-[#D4FF00]">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#D4FF00]">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#222] transition-colors"
            >
              <svg className="w-6 h-6 text-[#D4FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 左侧：订单摘要 */}
            <div className="space-y-6">
              <div className="bg-[#222] rounded-2xl p-3">
                <h3 className="text-base font-bold text-[#D4FF00] mb-2">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[#D4FF00]">
                    <span>{cartItems.length} item(s)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#D4FF00]">
                    <span>Shipping (Simulated)</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#D4FF00]">
                    <span>Taxes (Simulated)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#D4FF00] pt-3 mt-3">
                    <div className="flex justify-between text-[#D4FF00] font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 社交分享 */}
              <div className="bg-[#222] rounded-2xl p-3">
                <h3 className="text-base font-bold text-[#D4FF00] mb-2">Social Bill & Save Together!</h3>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-[#333] text-[#666] font-bold cursor-not-allowed"
                >
                  Disabled
                </button>
              </div>
            </div>

            {/* 右侧：配送地址和支付选项 */}
            <div className="space-y-6">
              {/* 配送地址表单 */}
              <div className="bg-[#222] rounded-2xl p-3">
                <h3 className="text-base font-bold text-[#D4FF00] mb-2">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#D4FF00] mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-3 py-1.5 rounded-xl bg-black border-2 border-[#D4FF00] text-[#D4FF00] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#D4FF00] mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full px-3 py-1.5 rounded-xl bg-black border-2 border-[#D4FF00] text-[#D4FF00] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#D4FF00] mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="City Name"
                        className="w-full px-3 py-1.5 rounded-xl bg-black border-2 border-[#D4FF00] text-[#D4FF00] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#D4FF00] mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        placeholder="Zip Code"
                        className="w-full px-3 py-1.5 rounded-xl bg-black border-2 border-[#D4FF00] text-[#D4FF00] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#D4FF00] mb-1">Country/Region</label>
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 rounded-xl bg-black border-2 border-[#D4FF00] text-[#D4FF00] focus:outline-none focus:ring-2 focus:ring-[#D4FF00] text-sm"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 支付选项 */}
              <div className="bg-[#222] rounded-2xl p-3">
                <h3 className="text-base font-bold text-[#D4FF00] mb-2">Payment Options</h3>
                <p className="text-[#D4FF00] opacity-70">No payment methods available currently.</p>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onPlaceOrder}
              className="px-6 py-2 rounded-xl bg-[#D4FF00] text-black font-bold hover:bg-black hover:text-[#D4FF00] border-2 border-[#D4FF00] transition-colors text-sm"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCheckout; 