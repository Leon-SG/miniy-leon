import React from 'react';

const ModernStoreHeader: React.FC<{
  storeName: string;
  cartCount: number;
  onCartClick: () => void;
  onStoreNameClick?: () => void;
}> = ({ storeName, cartCount, onCartClick, onStoreNameClick }) => {
  return (
    <div className="w-full flex items-center justify-between rounded-2xl bg-black px-4 py-3 mb-4 shadow-lg" style={{ minHeight: 56 }}>
      {/* 左侧送货地址 */}
      <div className="flex flex-col justify-center">
        <span className="text-xs text-[#D4FF00] font-bold flex items-center gap-1">
          Delivery Address
          <svg className="w-4 h-4 text-[#D4FF00]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </span>
        <span className="text-xs text-[#D4FF00] opacity-80">San Francisco, california</span>
      </div>
      {/* 中间商店名 */}
      <div className="flex-1 flex justify-center">
        <button 
          onClick={onStoreNameClick}
          className="text-xl font-extrabold text-[#D4FF00] tracking-wider drop-shadow hover:opacity-80 transition-opacity" 
          style={{ letterSpacing: 2 }}
        >
          {storeName}
        </button>
      </div>
      {/* 右侧购物车icon */}
      <button className="relative p-2 rounded-full hover:bg-[#222] transition-all border-2 border-[#D4FF00] bg-black" onClick={onCartClick}>
        <svg className="w-6 h-6 text-[#D4FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ModernStoreHeader; 