import React from 'react';
import { Home, Grid, ShoppingCart, MessagesSquare, Bot } from 'lucide-react';

const NAVS = [
  { key: 'home', label: 'Home', icon: <Home size={16} strokeWidth={2.2} /> },
  { key: 'category', label: 'Category', icon: <Grid size={16} strokeWidth={2.2} /> },
  { key: 'cart', label: 'Cart', icon: <ShoppingCart size={16} strokeWidth={2.2} /> },
  { key: 'support', label: 'Support', icon: <MessagesSquare size={16} strokeWidth={2.2} /> },
  { key: 'ai', label: 'AI Assistant', icon: <Bot size={16} strokeWidth={2.2} /> },
];

const BOTTOM_COLOR = '#D4FF00';

const ModernBottomNav: React.FC<{
  active: string;
  onChange: (key: string) => void;
  cartCount?: number;
  onSupport?: () => void;
  onAI?: () => void;
}> = ({ active, onChange, cartCount, onSupport, onAI }) => {
  return (
    <nav
      className="fixed left-0 bottom-0 w-full flex justify-center items-end z-50 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 18px)' }}
    >
      <div
        className="pointer-events-auto flex justify-between items-center bg-[#D4FF00] rounded-xl shadow-2xl"
        style={{
          minWidth: 240,
          maxWidth: 420,
          width: '90vw',
          margin: '0 auto',
          padding: '2px 2px',
          position: 'relative',
          bottom: 12,
        }}
      >
        {NAVS.map(nav => (
          <button
            key={nav.key}
            onClick={() => {
              if (nav.key === 'support' && onSupport) return onSupport();
              if (nav.key === 'ai' && onAI) return onAI();
              onChange(nav.key);
            }}
            className={`flex flex-col items-center flex-1 py-0.5 px-0.5 rounded-lg transition-all ${active === nav.key ? 'bg-black/10 text-black font-extrabold' : 'text-black/60 font-extrabold'}`}
            style={{ minWidth: 0, minHeight: 44 }}
          >
            <span className="relative">
              {nav.icon}
            </span>
            <span className="text-[9px] mt-0.5 whitespace-nowrap font-extrabold">{nav.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ModernBottomNav; 