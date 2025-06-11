import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'; // Added useRef
import { StoreConfiguration, Product, CartItem, AppearanceSettings, BasicInfo, SupportConversation, SupportChatMessage } from '../types'; // Added SupportConversation, SupportChatMessage
import MobileHeader from './MobilePreview/MobileHeader';
import MobileProductCard from './MobilePreview/MobileProductCard';
import MobileFooter from './MobilePreview/MobileFooter';
import CartSummaryModal from './MobilePreview/CartSummaryModal';
import CheckoutModal from './MobilePreview/CheckoutModal'; 
import ProductDetailModal from './MobilePreview/ProductDetailModal';
import ProductListToolbar from './MobilePreview/ProductListToolbar'; 
import SupportChatModal from './MobilePreview/SupportChatModal'; // Added SupportChatModal
import { ChatBubbleOvalLeftEllipsisIcon, SORT_OPTIONS, InfoIcon, FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon, PinterestIcon, SnapchatIcon, WhatsAppIcon, TelegramIcon, RedditIcon, DiscordIcon, TwitchIcon, BehanceIcon, DribbbleIcon, StoreSupportChatIcon } from '../constants'; // Added StoreSupportChatIcon
import { useToast } from '../contexts/ToastContext'; 
import FishboneSkeleton from './FishboneSkeleton';
import './FishboneSkeleton.css';

interface MobilePreviewProps {
  config: StoreConfiguration;
  displayMode?: 'mobile' | 'desktop';
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null;
  elementToHighlight?: string | null; 
  setHoveredElementName: (name: string | null) => void; 
  setTooltipPosition: (pos: { x: number; y: number }) => void; 
  // Props for store support chat
  supportConversations: SupportConversation[]; 
  onSendMessageToSupport: (conversationId: string | null, messageText: string, customerName: string) => string; // Returns new/existing convId
}

// Copied from MobileHeader.tsx for headerHeight calculation
interface SocialLinkDefinition {
  key: keyof BasicInfo;
  platformName: string;
  baseUrl?: string; 
  isHandle?: boolean; 
  IconComponent: React.FC<{className?: string}>;
}

const socialLinkDefinitions: SocialLinkDefinition[] = [
  { key: 'facebookPageUrl', platformName: 'Facebook', IconComponent: FacebookIcon },
  { key: 'instagramHandle', platformName: 'Instagram', baseUrl: 'https://instagram.com/', isHandle: true, IconComponent: InstagramIcon },
  { key: 'tiktokHandle', platformName: 'TikTok', baseUrl: 'https://tiktok.com/@', isHandle: true, IconComponent: TiktokIcon },
  { key: 'xHandle', platformName: 'X', baseUrl: 'https://x.com/', isHandle: true, IconComponent: XIcon },
  { key: 'linkedinPageUrl', platformName: 'LinkedIn', IconComponent: LinkedInIcon },
  { key: 'youtubeChannelUrl', platformName: 'YouTube', IconComponent: YoutubeIcon },
  { key: 'pinterestProfileUrl', platformName: 'Pinterest', IconComponent: PinterestIcon },
  { key: 'snapchatUsername', platformName: 'Snapchat', baseUrl: 'https://snapchat.com/add/', isHandle: true, IconComponent: SnapchatIcon },
  { key: 'whatsappNumber', platformName: 'WhatsApp', baseUrl: 'https://wa.me/', isHandle: true, IconComponent: WhatsAppIcon }, 
  { key: 'telegramUsername', platformName: 'Telegram', baseUrl: 'https://t.me/', isHandle: true, IconComponent: TelegramIcon },
  { key: 'redditProfileUrl', platformName: 'Reddit', IconComponent: RedditIcon },
  { key: 'discordServerInviteUrl', platformName: 'Discord', IconComponent: DiscordIcon },
  { key: 'twitchChannelUrl', platformName: 'Twitch', IconComponent: TwitchIcon },
  { key: 'behanceProfileUrl', platformName: 'Behance', IconComponent: BehanceIcon },
  { key: 'dribbbleProfileUrl', platformName: 'Dribbble', IconComponent: DribbbleIcon },
];

// 工具函数：判断颜色明暗
export function isColorDark(hex: string): boolean {
  if (!hex) return false;
  const color = hex.replace('#', '');
  if (color.length !== 6) return false;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({
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
}): JSX.Element => {
  const { showToast } = useToast();     
  const isTabletMode = displayMode === 'desktop';
  const mobilePreviewRef = useRef<HTMLDivElement>(null); 

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
  const MOCK_CUSTOMER_ID = "mobile_preview_user_001"; // For identifying the "customer" in this preview
  const MOCK_CUSTOMER_NAME = "Valued Customer";


  const publishedProducts = useMemo(() => config.products.filter(p => p.isPublished), [config.products]);

  const productCategories = useMemo(() => {
    const categories = new Set(publishedProducts.map(p => p.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(categories)];
  }, [publishedProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let productsToDisplay = [...publishedProducts];

    // Filter by search term
    if (searchTerm && isSearchActive) { // Only filter if search is active
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      productsToDisplay = productsToDisplay.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price_asc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        productsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: 
        break;
    }
    return productsToDisplay;
  }, [publishedProducts, searchTerm, selectedCategory, sortBy, isSearchActive]);


  const toggleCartModal = useCallback(() => {
    if (isElementSelectionActive) return;
    setIsCartModalOpen(prev => !prev);
  }, [isElementSelectionActive]);

  const internalAddToCart = useCallback((product: Product): boolean => {
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

  const internalRemoveFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    const removedItem = cart.find(item => item.id === productId);
    if (removedItem) {
        showToast(`"${removedItem.name}" removed from cart.`, 'info');
    }
  }, [cart, showToast]);

  const incrementQuantity = useCallback((productId: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((productId: string) => {
    setCart(prevCart => {
      const itemToDecrement = prevCart.find(item => item.id === productId);
      if (itemToDecrement && itemToDecrement.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        const removedItem = cart.find(item => item.id === productId);
        if (removedItem) {
             showToast(`"${removedItem.name}" removed from cart.`, 'info');
        }
        return prevCart.filter(item => item.id !== productId);
      }
    });
  }, [cart, showToast]);


  const handleProceedToCheckout = useCallback(() => {
    if (isElementSelectionActive) return;
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
  }, [isElementSelectionActive]);

  const handleCloseCheckoutModal = useCallback(() => {
    setIsCheckoutModalOpen(false);
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (isElementSelectionActive) return false;
    setCart([]); 
    setIsCheckoutModalOpen(false);
    showToast('Order placed successfully! Thank you for your purchase.', 'success');
    return true;
  }, [isElementSelectionActive, showToast]);

  const handleProductCardClick = useCallback((product: Product) => {
    if (isElementSelectionActive) return;
    setSelectedProductForDetail(product);
    setIsProductDetailModalOpen(true);
  }, [isElementSelectionActive]);

  const handleCloseProductDetailModal = useCallback(() => {
    setIsProductDetailModalOpen(false);
    setTimeout(() => setSelectedProductForDetail(null), 300); 
  }, []);

  const handleSearchTermChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);
  
  const handleToggleSearchActive = useCallback((active: boolean) => {
    setIsSearchActive(active);
    if (!active) {
      setSearchTerm(''); 
    }
  }, []);

  // Tooltip Event Handlers
  const handleMouseOverPreview = useCallback((event: React.MouseEvent) => {
      if (!isElementSelectionActive) return;
      let target = event.target as HTMLElement;
      while (target && target !== mobilePreviewRef.current) {
          if (target.dataset.selectableId && target.dataset.selectableName) {
              setHoveredElementName(target.dataset.selectableName);
              return;
          }
          target = target.parentElement as HTMLElement;
      }
      setHoveredElementName(null);
  }, [isElementSelectionActive, setHoveredElementName, mobilePreviewRef]);

  const handleMouseOutPreview = useCallback(() => {
      if (!isElementSelectionActive) return;
      setHoveredElementName(null);
  }, [isElementSelectionActive, setHoveredElementName]);

  const handleMouseMovePreview = useCallback((event: React.MouseEvent) => {
      if (!isElementSelectionActive) return;
      setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, [isElementSelectionActive, setTooltipPosition]);


  const containerClasses = `bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT overflow-hidden border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT relative shadow-light-subtle dark:shadow-subtle ${
    isTabletMode
      ? "w-[600px] aspect-[3/4] max-w-full max-h-full rounded-xl"
      : "w-[360px] aspect-[10/16] max-w-full max-h-full rounded-3xl"
  } ${isElementSelectionActive ? 'cursor-crosshair' : ''}`;

  const scrollAreaClasses = `overflow-y-auto h-full ${
    isTabletMode
      ? "desktop-preview-scrollbar"
      : ""
  }`;

  const productListClasses = isTabletMode
    ? "grid grid-cols-2 gap-0" 
    : "flex flex-col";
    
  useEffect(() => {
    if (isElementSelectionActive) {
      setIsCartModalOpen(false);
      setIsCheckoutModalOpen(false);
      setIsProductDetailModalOpen(false);
      setIsSearchActive(false); 
      setIsSupportChatModalOpen(false);
    }
  }, [isElementSelectionActive]);

  const headerHeight = useMemo(() => {
    let height = 3.5 * 16; 
    if (!isSearchActive && config.basicInfo.tagline) {
      height += 0.75 * 16 + 0.25 * 16; 
    }
    const activeSocialLinks = socialLinkDefinitions.filter(
      (linkDef) => config.basicInfo[linkDef.key] && (config.basicInfo[linkDef.key] as string).trim() !== ''
    );
    if (!isSearchActive && activeSocialLinks.length > 0) {
        height += 1 * 16 + 0.5 * 16 + 0.25*16; 
    }
    return height;
  }, [config.basicInfo, isSearchActive]);

  const welcomeMessageTextColor = isColorDark(config.appearance.primaryColor) ? 'text-white' : 'text-gray-800';
  
  const welcomeMessageElementId = 'store-welcome-message-display';
  const [isWelcomeMessageHighlighted, setIsWelcomeMessageHighlighted] = useState(false);

  useEffect(() => {
    if (elementToHighlight === welcomeMessageElementId) {
      setIsWelcomeMessageHighlighted(true);
      const timer = setTimeout(() => setIsWelcomeMessageHighlighted(false), 1500); // Duration of highlight
      return () => clearTimeout(timer);
    }
  }, [elementToHighlight]);

  // Support Chat Logic
  const handleOpenSupportChat = () => {
    if (isElementSelectionActive) return;
    // If no active conversation, one will be implicitly created by App.tsx on first message.
    // Or, we can pre-fetch/create one if needed, but for now, let App.tsx handle it.
    setIsSupportChatModalOpen(true);
  };

  const handleCloseSupportChatModal = () => {
    setIsSupportChatModalOpen(false);
  };

  const handleSendCustomerSupportMessage = (messageText: string) => {
    // The `onSendMessageToSupport` function from App.tsx will handle creating/finding the conversation.
    // It returns the conversation ID, which we store.
    const convId = onSendMessageToSupport(activeSupportConversationId, messageText, MOCK_CUSTOMER_NAME);
    if (!activeSupportConversationId) {
      setActiveSupportConversationId(convId);
    }
  };
  
  const currentCustomerConversation = useMemo(() => {
    if (!activeSupportConversationId) return null;
    return supportConversations.find(c => c.id === activeSupportConversationId) || null;
  }, [supportConversations, activeSupportConversationId]);

  if (
    (!config.products || config.products.length === 0) &&
    !config.basicInfo?.storeName &&
    !config.basicInfo?.storeWelcomeMessage
  ) {
    return (
      <div className={containerClasses}>
        <FishboneSkeleton />
      </div>
    );
  }

  return (
    <div 
      ref={mobilePreviewRef}
      className={containerClasses}
      style={{ background: '#111', color: '#fff', borderRadius: '32px', height: '80%', fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}
      onMouseOver={handleMouseOverPreview}
      onMouseOut={handleMouseOutPreview}
      onMouseMove={handleMouseMovePreview}
    >
      <MobileHeader
        basicInfo={config.basicInfo}
        appearance={config.appearance}
        isElementSelectionActive={isElementSelectionActive}
        onElementSelected={onElementSelected}
        activelySelectedPreviewElementId={activelySelectedPreviewElementId}
        cartItemCount={cart.length}
        onToggleCartModal={toggleCartModal}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        isSearchActive={isSearchActive}
        onToggleSearchActive={handleToggleSearchActive}
      />
      <div 
        className={scrollAreaClasses} 
        style={{ 
          height: isTabletMode ? 'calc(100% - 56px - 48px)' : 'calc(100% - 56px - 48px)', 
        }}
      >
        {config.basicInfo.storeWelcomeMessage && (
          <div 
            data-selectable-id={welcomeMessageElementId}
            data-selectable-name="Store Welcome Message" // Added for hover tooltip
            onClick={() => isElementSelectionActive && onElementSelected && onElementSelected({id: welcomeMessageElementId, name: "Store Welcome Message"})}
            className={`p-3 m-2 rounded-md border flex items-start space-x-2 shadow-sm transition-all duration-150 
                        ${isElementSelectionActive ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-replit-primary-blue' : ''}
                        ${activelySelectedPreviewElementId === welcomeMessageElementId ? 'preview-element-actively-selected' : ''}
                        ${isWelcomeMessageHighlighted ? 'element-highlighted-briefly' : ''}`}
            style={{ 
              backgroundColor: `${config.appearance.primaryColor}20`, 
              borderColor: `${config.appearance.primaryColor}60`,
              // @ts-ignore
              '--highlight-color': config.appearance.primaryColor,
              '--highlight-color-shadow': `${config.appearance.primaryColor}80`,
            }}
          >
            <span 
              className="mt-0.5 flex-shrink-0" 
              style={{ color: config.appearance.primaryColor, filter: 'brightness(0.8)' }}
            >
              <InfoIcon className="w-4 h-4" />
            </span>
            <p className={`text-xs ${welcomeMessageTextColor}`} style={{ color: config.appearance.primaryColor, filter: 'brightness(0.7)' }}>
              {config.basicInfo.storeWelcomeMessage}
            </p>
          </div>
        )}
        <ProductListToolbar
          categories={productCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortByOptions={SORT_OPTIONS}
          currentSortBy={sortBy}
          onSortByChange={setSortBy}
          appearance={config.appearance}
        />
        <div className={productListClasses}>
          {filteredAndSortedProducts.map((product) => (
            <MobileProductCard
              key={product.id}
              product={product}
              appearance={config.appearance}
              isElementSelectionActive={isElementSelectionActive}
              onElementSelected={onElementSelected}
              activelySelectedPreviewElementId={activelySelectedPreviewElementId}
              onAddToCart={internalAddToCart}
              onProductCardClick={handleProductCardClick}
            />
          ))}
        </div>
        <div className="h-4"></div> 
      </div>
      <MobileFooter storeName={config.basicInfo.storeName} appearance={config.appearance} isElementSelectionActive={isElementSelectionActive} onElementSelected={onElementSelected} activelySelectedPreviewElementId={activelySelectedPreviewElementId} />

      {isCartModalOpen && (
        <CartSummaryModal
          isOpen={isCartModalOpen}
          onClose={toggleCartModal}
          cartItems={cart}
          onRemoveItem={internalRemoveFromCart}
          onIncrementItem={incrementQuantity}
          onDecrementItem={decrementQuantity}
          appearance={config.appearance}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
      {isCheckoutModalOpen && (
         <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={handleCloseCheckoutModal}
            cartItems={cart}
            appearance={config.appearance}
            onPlaceOrder={() => handlePlaceOrder()} 
            storeConfig={config} 
          />
      )}
      {isProductDetailModalOpen && selectedProductForDetail && (
        <ProductDetailModal
          isOpen={isProductDetailModalOpen}
          onClose={handleCloseProductDetailModal}
          product={selectedProductForDetail}
          onAddToCart={internalAddToCart}
          appearance={config.appearance}
        />
      )}
      
      {/* AI Customer Service FAB */}
      {config.aiCustomerService.isEnabled && (
        <button
          className="absolute bottom-20 right-4 p-3 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 z-20"
          style={{ backgroundColor: config.appearance.primaryColor }}
          onClick={() => showToast("AI Chat (Store Preview): " + config.aiCustomerService.welcomeMessage, 'info', 5000)}
          aria-label="Open AI Chat Assistant"
          title="AI Chat Assistant"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Store Support Chat FAB */}
      <button
          className="absolute bottom-5 right-4 p-3 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 z-20"
          style={{ backgroundColor: config.appearance.primaryColor, filter: 'brightness(0.85)' }} // Slightly different color/brightness
          onClick={handleOpenSupportChat}
          aria-label="Chat with store support"
          title="Chat with Store Support"
        >
          <StoreSupportChatIcon className="w-6 h-6 text-white" />
      </button>

      {isSupportChatModalOpen && (
        <SupportChatModal
          isOpen={isSupportChatModalOpen}
          onClose={handleCloseSupportChatModal}
          storeName={config.basicInfo.storeName}
          conversationMessages={currentCustomerConversation?.messages || []}
          onSendMessage={handleSendCustomerSupportMessage}
          appearance={config.appearance}
        />
      )}
    </div>
  );
};

export default MobilePreview;
