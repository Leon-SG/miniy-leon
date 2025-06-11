import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { StoreConfiguration, Product, CartItem, SupportConversation } from '../../../types';
import { useToast } from '../../../contexts/ToastContext';
import ModernHeader from '../../../components/modern/layout/ModernHeader';
import ModernFooter from '../../../components/modern/layout/ModernFooter';
import ModernProductList from '../../../components/modern/product/ModernProductList';
import ModernCartSummary from '../../../components/modern/cart/ModernCartSummary';
import ModernCheckout from '../../../components/modern/checkout/ModernCheckout';
import ModernProductDetail from '../../../components/modern/product/ModernProductDetail';
import ModernSupportChat from '../../../components/modern/chat/ModernSupportChat';
import ModernBanner from '../../../components/modern/layout/ModernBanner';
import ModernSocialIcons from '../../../components/modern/layout/ModernSocialIcons';

interface ModernLayoutProps {
  config: StoreConfiguration;
  displayMode?: 'mobile' | 'desktop';
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null;
  elementToHighlight?: string | null;
  setHoveredElementName: (name: string | null) => void;
  setTooltipPosition: (pos: { x: number; y: number }) => void;
  supportConversations: SupportConversation[];
  onSendMessageToSupport: (conversationId: string | null, messageText: string, customerName: string) => string;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({
  config,
  displayMode = 'mobile',
  isElementSelectionActive = false,
  onElementSelected = () => {},
  activelySelectedPreviewElementId,
  elementToHighlight,
  setHoveredElementName,
  setTooltipPosition,
  supportConversations,
  onSendMessageToSupport,
}) => {
  const { showToast } = useToast();
  const isTabletMode = displayMode === 'desktop';
  const layoutRef = useRef<HTMLDivElement>(null);

  // Cart and Modal States
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Search, Filter, Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Support Chat States
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [activeSupportConversationId, setActiveSupportConversationId] = useState<string | null>(null);
  const MOCK_CUSTOMER_ID = "modern_preview_user_001";
  const MOCK_CUSTOMER_NAME = "Valued Customer";

  // 商品列表处理
  const publishedProducts = useMemo(() => 
    config.products.filter(p => p.isPublished), 
    [config.products]
  );

  const productCategories = useMemo(() => {
    const categories = new Set(publishedProducts.map(p => p.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(categories)];
  }, [publishedProducts]);

  // 购物车操作
  const toggleCartModal = useCallback(() => {
    if (isElementSelectionActive) return;
    setIsCartModalOpen(prev => !prev);
  }, [isElementSelectionActive]);

  const addToCart = useCallback((product: Product): boolean => {
    if (isElementSelectionActive) return false;
    let itemAddedOrQuantityIncreased = false;
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        itemAddedOrQuantityIncreased = true;
        return updatedCart;
      } else {
        itemAddedOrQuantityIncreased = true;
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    if (itemAddedOrQuantityIncreased) {
      showToast(`"${product.name}" added to cart.`, 'success');
    }
    return itemAddedOrQuantityIncreased;
  }, [isElementSelectionActive, showToast]);

  // 结账流程
  const handleProceedToCheckout = useCallback(() => {
    if (isElementSelectionActive) return;
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
  }, [isElementSelectionActive]);

  const handlePlaceOrder = useCallback(() => {
    if (isElementSelectionActive) return false;
    setCart([]);
    setIsCheckoutModalOpen(false);
    showToast('Order placed successfully! Thank you for your purchase.', 'success');
    return true;
  }, [isElementSelectionActive, showToast]);

  // 商品详情
  const handleProductCardClick = useCallback((product: Product) => {
    if (isElementSelectionActive) return;
    setSelectedProductForDetail(product);
    setIsProductDetailModalOpen(true);
  }, [isElementSelectionActive]);

  // 客服聊天
  const handleOpenSupportChat = useCallback(() => {
    if (isElementSelectionActive) return;
    setIsSupportChatModalOpen(true);
  }, [isElementSelectionActive]);

  const handleSendCustomerSupportMessage = useCallback((messageText: string) => {
    const convId = onSendMessageToSupport(activeSupportConversationId, messageText, MOCK_CUSTOMER_NAME);
    if (!activeSupportConversationId) {
      setActiveSupportConversationId(convId);
    }
  }, [activeSupportConversationId, onSendMessageToSupport]);

  // 开发者模式相关
  useEffect(() => {
    if (isElementSelectionActive) {
      setIsCartModalOpen(false);
      setIsCheckoutModalOpen(false);
      setIsProductDetailModalOpen(false);
      setIsSearchActive(false);
      setIsSupportChatModalOpen(false);
    }
  }, [isElementSelectionActive]);

  const [isSocialCollapsed, setIsSocialCollapsed] = useState(false);

  return (
    <div 
      ref={layoutRef}
      className="bg-background text-foreground"
      style={{ 
        fontFamily: 'Nunito, system-ui, sans-serif',
        '--primary-color': config.appearance.primaryColor,
      } as React.CSSProperties}
    >
      <ModernHeader
        basicInfo={config.basicInfo}
        appearance={config.appearance}
        isElementSelectionActive={isElementSelectionActive}
        onElementSelected={onElementSelected}
        activelySelectedPreviewElementId={activelySelectedPreviewElementId}
        cartItemCount={cart.length}
        onToggleCartModal={toggleCartModal}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        isSearchActive={isSearchActive}
        onToggleSearchActive={setIsSearchActive}
      />

      <main className="container mx-auto px-4 py-8">
        <ModernProductList
          products={publishedProducts}
          categories={productCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          searchTerm={searchTerm}
          isSearchActive={isSearchActive}
          appearance={config.appearance}
          onProductClick={handleProductCardClick}
          onAddToCart={addToCart}
          isElementSelectionActive={isElementSelectionActive}
          onElementSelected={onElementSelected}
          activelySelectedPreviewElementId={activelySelectedPreviewElementId}
        />
      </main>

      <ModernFooter
        storeName={config.basicInfo.storeName}
        appearance={config.appearance}
        isElementSelectionActive={isElementSelectionActive}
        onElementSelected={onElementSelected}
        activelySelectedPreviewElementId={activelySelectedPreviewElementId}
      />

      {/* Modals */}
      {isCartModalOpen && (
        <ModernCartSummary
          isOpen={isCartModalOpen}
          onClose={toggleCartModal}
          cartItems={cart}
          onRemoveItem={(productId: string) => setCart(prev => prev.filter(item => item.id !== productId))}
          onIncrementItem={(productId: string) => setCart(prev => 
            prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)
          )}
          onDecrementItem={(productId: string) => setCart(prev => 
            prev.map(item => item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
          )}
          appearance={config.appearance}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {isCheckoutModalOpen && (
        <ModernCheckout
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cartItems={cart}
          appearance={config.appearance}
          onPlaceOrder={handlePlaceOrder}
          storeConfig={config}
        />
      )}

      {isProductDetailModalOpen && selectedProductForDetail && (
        <ModernProductDetail
          isOpen={isProductDetailModalOpen}
          onClose={() => {
            setIsProductDetailModalOpen(false);
            setTimeout(() => setSelectedProductForDetail(null), 300);
          }}
          product={selectedProductForDetail}
          onAddToCart={addToCart}
          appearance={config.appearance}
        />
      )}

      {isSupportChatModalOpen && (
        <ModernSupportChat
          isOpen={isSupportChatModalOpen}
          onClose={() => setIsSupportChatModalOpen(false)}
          storeName={config.basicInfo.storeName}
          conversationMessages={supportConversations.find(c => c.id === activeSupportConversationId)?.messages || []}
          onSendMessage={handleSendCustomerSupportMessage}
          appearance={config.appearance}
        />
      )}

      {/* Support Chat FAB */}
      <button
        className="fixed bottom-5 right-5 p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 z-50"
        style={{ backgroundColor: config.appearance.primaryColor }}
        onClick={handleOpenSupportChat}
        aria-label="Chat with store support"
        title="Chat with Store Support"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <ModernBanner>
        {isSocialCollapsed && (
          <div className="flex justify-center mt-2">
            <ModernSocialIcons isCollapsed={isSocialCollapsed} setIsCollapsed={setIsSocialCollapsed} />
          </div>
        )}
      </ModernBanner>
      {!isSocialCollapsed && (
        <>
          <div className="flex justify-center mt-2">
            <ModernSocialIcons isCollapsed={isSocialCollapsed} setIsCollapsed={setIsSocialCollapsed} />
          </div>
          {/* 搜索框、用户自定义消息板等原有内容 */}
          {/* 搜索框 */}
          <div className="container mx-auto px-4 mt-4">
            {/* 这里插入 ModernSearchBar 组件或相关内容 */}
          </div>
          {/* 用户自定义消息板已在 ModernBanner 内部 */}
        </>
      )}
    </div>
  );
};

export default ModernLayout; 