import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem, AppearanceSettings } from '../types';
import ModernProductList from '../components/modern/product/ModernProductList';
import ModernProductDetail from '../components/modern/product/ModernProductDetail';
import ModernCartSummary from '../components/modern/cart/ModernCartSummary';
import ModernFooter from '../components/modern/layout/ModernFooter';
import ModernBanner from '../components/modern/layout/ModernBanner';
import ModernSearchBar from '../components/modern/layout/ModernSearchBar';
import ModernSocialIcons from '../components/modern/layout/ModernSocialIcons';
import ModernBottomNav from '../components/modern/layout/ModernBottomNav';
import ModernStoreHeader from '../components/modern/layout/ModernStoreHeader';
import ModernCheckout from '../components/modern/checkout/ModernCheckout';
import { motion, AnimatePresence } from 'framer-motion';

// 模拟数据
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Modern Designer Chair",
    description: "Minimalist and elegant, fits any space perfectly.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1",
    category: "Furniture",
    sku: "CHAIR-001",
    stockQuantity: 12,
    tags: ["Home", "Design", "Comfort"],
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Track your health data and stay active.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
    category: "Electronics",
    sku: "WATCH-002",
    stockQuantity: 30,
    tags: ["Tech", "Health"],
    isPublished: true,
  },
  {
    id: "3",
    name: "Organic Skincare Set",
    description: "Natural ingredients to care for your skin.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
    category: "Beauty",
    sku: "SKIN-003",
    stockQuantity: 50,
    tags: ["Skincare", "Organic"],
    isPublished: true,
  },
];

const mockAppearance: AppearanceSettings = {
  primaryColor: "#FFD600",
  fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
  darkMode: true,
};

const StorePreview: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  // 新增：分类、排序、搜索等状态
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState('home');

  const mainRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [isSocialCollapsed, setIsSocialCollapsed] = useState(false);

  // 自动提取所有类别
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockProducts.map(p => p.category)));
    return ['All', ...cats];
  }, []);

  // Toast 状态
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 新增：结账状态
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 支持详情页加购后自动关闭弹窗并弹 Toast
  const handleAddToCart = (product: Product, fromDetail = false) => {
    const prodWithQty = product as Product & { quantity?: number };
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (prodWithQty.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: prodWithQty.quantity || 1 }];
    });
    if (fromDetail) {
      setToastMsg('已加入购物车！');
      setShowToast(true);
      setIsProductDetailOpen(false);
    } else {
      setIsCartOpen(true);
    }
    return true;
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleTab = (key: string) => {
    setActiveTab(key);
    if (key === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (key === 'category') {
      setTimeout(() => {
        if (categoryRef.current) {
          categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (key === 'cart') {
      setIsCartOpen(true);
    } else if (key === 'support') {
      alert('Support chat page coming soon!');
    } else if (key === 'ai') {
      alert('AI Assistant coming soon!');
    }
  };

  // Toast 自动消失
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handlePlaceOrder = () => {
    // 这里可以添加订单处理逻辑
    alert('Order placed successfully!');
    setIsCheckoutOpen(false);
    setCart([]); // 清空购物车
  };

  return (
    <div className="h-screen bg-black w-full flex flex-col justify-between" style={{ color: '#D4FF00', fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>
      {/* 顶部区域：商店标题栏、横幅、搜索框、社交图标区 */}
      <header className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto px-4 pt-6 pb-2">
        {/* 商店标题栏 */}
        <ModernStoreHeader 
          storeName="GENZ Store" 
          cartCount={cart.length} 
          onCartClick={() => setIsCartOpen(true)}
          onStoreNameClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        {/* 动态横幅插槽 */}
        <div className="mb-7">
          <ModernBanner showUserMessage={!isSocialCollapsed}>
            <AnimatePresence initial={false}>
              {isSocialCollapsed && (
                <motion.div
                  key="collapsed-social"
                  className="flex justify-center mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                  layout
                >
                  <ModernSocialIcons isCollapsed={isSocialCollapsed} setIsCollapsed={setIsSocialCollapsed} />
                </motion.div>
              )}
            </AnimatePresence>
          </ModernBanner>
        </div>
        {/* 搜索框插槽 */}
        <AnimatePresence initial={false}>
          {!isSocialCollapsed && (
            <motion.div
              key="search-bar"
              className="mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
              layout
            >
              <ModernSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search product or category..." />
            </motion.div>
          )}
        </AnimatePresence>
        {/* 社交图标区插槽 */}
        <AnimatePresence initial={false}>
          {!isSocialCollapsed && (
            <motion.div
              key="social-icons"
              className="mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
              layout
            >
              <ModernSocialIcons isCollapsed={isSocialCollapsed} setIsCollapsed={setIsSocialCollapsed} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* 主要内容区域 */}
      <main ref={mainRef} className="flex-1 w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto px-4 py-2 sm:py-4 pb-32 overflow-y-auto">
        <div ref={categoryRef} />
        <ModernProductList
          products={mockProducts}
          categories={categories as string[]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchTerm={searchTerm}
          isSearchActive={isSearchActive}
          onProductClick={(product) => {
            setSelectedProduct(product);
            setIsProductDetailOpen(true);
          }}
          onAddToCart={handleAddToCart}
          appearance={mockAppearance}
        />
      </main>
      {/* Modern Footer（可选） */}
      {/* <ModernFooter storeName="GENZ 商店" appearance={mockAppearance} /> */}
      {/* 底部导航插槽 */}
      <ModernBottomNav active={activeTab} onChange={handleTab} cartCount={cart.length} />
      {/* 极简版权区，Tab下方一行显示 */}
      <div className="w-full flex justify-center items-center fixed left-0 z-50" style={{ bottom: 2, pointerEvents: 'none' }}>
        <span className="bg-black/80 rounded-full px-2 py-0.5 text-[10px] text-[#D4FF00] font-bold tracking-wide flex items-center gap-2 shadow-sm" style={{ pointerEvents: 'auto' }}>
          © {new Date().getFullYear()} GENZ Store · Powered by Miniy
        </span>
      </div>
      {/* 客服/AI助手浮动按钮、购物车弹窗、产品详情弹窗等保留 */}
      {/* 已移除右下角客服和AI助手浮动按钮 */}
      <ModernCartSummary
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onIncrementItem={(productId) => setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))}
        onDecrementItem={(productId) => setCart(prev => prev.map(item => item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))}
        appearance={mockAppearance}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      {selectedProduct && (
        <ModernProductDetail
          isOpen={isProductDetailOpen}
          onClose={() => {
            setIsProductDetailOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={p => handleAddToCart(p, true)}
          appearance={mockAppearance}
        />
      )}
      {/* Toast 提示 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#222] text-[#FFD600] px-6 py-3 rounded-2xl shadow-lg z-[9999] font-bold text-lg"
          >
            🛒 {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
      {/* 结账弹窗 */}
      {isCheckoutOpen && (
        <ModernCheckout
          cartItems={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
};

export default StorePreview; 