import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mode, StoreConfiguration, ChatMessage, Product, BasicInfo, PaymentMethods, AppearanceSettings, CardContent, AICustomerServiceSettings, CartItem, AIModelInfo, ProductDisplayInfo, DeveloperSection, CardOption, SupportConversation, SupportChatMessage } from './types'; 
import Header from './components/Header';
import NormalModeView from './components/NormalModeView';
import DeveloperModeView from './components/DeveloperModeView';
import MobilePreview from './components/MobilePreview';
import PreviewControls from './components/common/PreviewControls';
import { INITIAL_STORE_CONFIG, INITIAL_CHAT_MESSAGES, GEMINI_MODEL_NAME, INITIAL_SUPPORT_CONVERSATIONS, STORE_TEMPLATES } from './constants'; 
import { generateStoreUpdateFromText, optimizeTextWithAI, generateAiSupportResponse, callClaudeApi } from './services/anthropicService';
import LoadingSpinner from './components/common/LoadingSpinner';
import Button from './components/common/Button';
import { DeploymentSettings } from './components/DeveloperMode/DeploymentSettingsModal';
import { useToast } from './contexts/ToastContext'; 
import ElementHoverTooltip from './components/common/ElementHoverTooltip';
import { Routes, Route } from 'react-router-dom';
import StorePreview from './pages/store-preview';

// App component root
const APP_PREFIX = "miniy_";
const STORE_CONFIG_KEY = `${APP_PREFIX}storeConfig_v1`;
const CHAT_MESSAGES_KEY = `${APP_PREFIX}chatMessages_v1`;
const SUPPORT_CONVERSATIONS_KEY = `${APP_PREFIX}supportConversations_v1`;
const EDITOR_THEME_KEY = `${APP_PREFIX}editorTheme_v2`;
const LEFT_PANEL_WIDTH_KEY = `${APP_PREFIX}leftPanelWidth_v2`;
const CONTEXTUAL_HELP_ENABLED_KEY = `${APP_PREFIX}contextualHelpEnabled_v1`;
const DISMISSED_CONTEXTUAL_HELP_IDS_KEY = `${APP_PREFIX}dismissedContextualHelpIds_v1`;


const MIN_LEFT_PANEL_WIDTH_PX = 300; 
const RESIZER_WIDTH_PX = 6; 
const GAP_WIDTH_PX = 0; 


const mergeStoreConfig = (current: StoreConfiguration, update: Partial<StoreConfiguration>): StoreConfiguration => {
  console.log('[调试] 开始合并配置');
  console.log('[调试] 当前配置:', current);
  console.log('[调试] 更新配置:', update);

  // 创建新的配置对象
  let newConfig = { ...current };

  // 合并基础信息
  if (update.basicInfo) {
    console.log('[调试] 合并基础信息');
    newConfig.basicInfo = {
      ...current.basicInfo,
      ...update.basicInfo,
      // 确保必填字段有默认值
      storeName: update.basicInfo.storeName || current.basicInfo.storeName,
      tagline: update.basicInfo.tagline || current.basicInfo.tagline,
      logoUrl: update.basicInfo.logoUrl || current.basicInfo.logoUrl,
      storeEmail: update.basicInfo.storeEmail || current.basicInfo.storeEmail,
      storeAddress: update.basicInfo.storeAddress || current.basicInfo.storeAddress,
      country: update.basicInfo.country || current.basicInfo.country,
      currency: update.basicInfo.currency || current.basicInfo.currency,
      timezone: update.basicInfo.timezone || current.basicInfo.timezone
    };
  }

  // 合并产品信息
  if (update.products) {
    console.log('[调试] 合并产品信息');
    newConfig.products = update.products.map(product => ({
      ...product,
      // 确保必填字段有默认值
      id: product.id || `prod_${Date.now()}`,
      name: product.name || '',
      description: product.description || '',
      price: typeof product.price === 'number' ? product.price : 0,
      imageUrl: product.imageUrl || '',
      // 可选字段
      category: product.category || '',
      sku: product.sku || '',
      stockQuantity: typeof product.stockQuantity === 'number' ? product.stockQuantity : 0,
      tags: Array.isArray(product.tags) ? product.tags : [],
      isFeatured: !!product.isFeatured,
      isPublished: !!product.isPublished
    }));
  }

  // 合并促销信息
  if (update.promotions) {
    console.log('[调试] 合并促销信息');
    newConfig.promotions = update.promotions.map(promotion => ({
      ...promotion,
      // 确保必填字段有默认值
      id: promotion.id || `promo_${Date.now()}`,
      code: promotion.code || '',
      description: promotion.description || '',
      discountPercentage: typeof promotion.discountPercentage === 'number' ? promotion.discountPercentage : 0,
      isActive: !!promotion.isActive
    }));
  }

  // 合并支付方式
  if (update.paymentMethods) {
    console.log('[调试] 合并支付方式');
    const updatedPaymentMethods: PaymentMethods = { ...current.paymentMethods };
    for (const key in update.paymentMethods) {
      if (Object.prototype.hasOwnProperty.call(update.paymentMethods, key)) {
        const providerKey = key as keyof PaymentMethods;
        updatedPaymentMethods[providerKey] = {
          ...current.paymentMethods[providerKey],
          ...(update.paymentMethods as any)[providerKey],
          // 确保状态字段存在
          status: (update.paymentMethods as any)[providerKey]?.status || 'disconnected'
        };
      }
    }
    newConfig.paymentMethods = updatedPaymentMethods;
  }

  // 合并外观设置
  if (update.appearance) {
    console.log('[调试] 合并外观设置');
    newConfig.appearance = {
      ...current.appearance,
      ...update.appearance,
      // 确保必填字段有默认值
      primaryColor: update.appearance.primaryColor || current.appearance.primaryColor,
      fontFamily: update.appearance.fontFamily || current.appearance.fontFamily,
      darkMode: update.appearance.darkMode ?? current.appearance.darkMode
    };
  }

  // 合并 AI 客服设置
  if (update.aiCustomerService) {
    console.log('[调试] 合并 AI 客服设置');
    newConfig.aiCustomerService = {
      ...current.aiCustomerService,
      ...update.aiCustomerService,
      // 确保必填字段有默认值
      isEnabled: update.aiCustomerService.isEnabled ?? current.aiCustomerService.isEnabled,
      agentName: update.aiCustomerService.agentName || current.aiCustomerService.agentName,
      systemPrompt: update.aiCustomerService.systemPrompt || current.aiCustomerService.systemPrompt,
      welcomeMessage: update.aiCustomerService.welcomeMessage || current.aiCustomerService.welcomeMessage,
      // 可选字段
      keyBusinessInfo: update.aiCustomerService.keyBusinessInfo || current.aiCustomerService.keyBusinessInfo,
      humanHandoffInstructions: update.aiCustomerService.humanHandoffInstructions || current.aiCustomerService.humanHandoffInstructions,
      conversationStarters: Array.isArray(update.aiCustomerService.conversationStarters) 
        ? update.aiCustomerService.conversationStarters 
        : current.aiCustomerService.conversationStarters
    };
  }

  // 合并支持会话
  if (update.supportConversations) {
    console.log('[调试] 合并支持会话');
    newConfig.supportConversations = [...update.supportConversations];
  }

  console.log('[调试] 合并后的配置:', newConfig);
  return newConfig;
};

interface ButtonProps {
  children: string;
  onClick: () => void;
  variant: "primary" | "secondary" | "ghost";
  isColorDark?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant, isColorDark = false }) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} ${isColorDark ? 'dark' : ''}`}
    >
      {children}
    </button>
  );
};

// 添加随机选择模板的函数
const getRandomTemplate = () => {
  // 排除默认模板
  const availableTemplates = STORE_TEMPLATES.filter(template => template.id !== 'default');
  const randomIndex = Math.floor(Math.random() * availableTemplates.length);
  return availableTemplates[randomIndex];
};

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.NORMAL);
  const [previewDisplayMode, setPreviewDisplayMode] = useState<'mobile' | 'desktop'>('mobile');
  const [storeConfig, setStoreConfig] = useState<StoreConfiguration>(() => ({
    basicInfo: {
      storeName: '',
      tagline: '',
      logoUrl: '',
      storeEmail: '',
      storePhoneNumber: '',
      storeAddress: '',
      country: '',
      currency: '',
      timezone: '',
      industry: '',
      legalNameOfBusiness: '',
      facebookPageUrl: '',
      instagramHandle: '',
      tiktokHandle: '',
      xHandle: '',
      linkedinPageUrl: '',
      youtubeChannelUrl: '',
      pinterestProfileUrl: '',
      metaDescription: '',
      seoTitle: '',
      focusKeywords: '',
      storeWelcomeMessage: '',
    },
    products: [],
    promotions: [],
    paymentMethods: {
      stripe: { status: 'disconnected' },
      paypal: { status: 'disconnected' },
      square: { status: 'disconnected' },
      alipay: { status: 'disconnected' },
      wechatPay: { status: 'disconnected' },
    },
    appearance: {
      primaryColor: '',
      fontFamily: '',
      darkMode: false,
    },
    aiCustomerService: {
      isEnabled: false,
      agentName: '',
      systemPrompt: '',
      welcomeMessage: '',
      keyBusinessInfo: '',
      humanHandoffInstructions: '',
      conversationStarters: [],
    },
    supportConversations: [],
  }));
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Welcome to Miniy! I'm your AI Store Assistant. I can help you build your online store step by step. Please say 'Hi' to start, then describe the store you want to build.",
      timestamp: new Date(),
      contentType: 'text'
    }
  ]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentAiOperation, setCurrentAiOperation] = useState<string>('');
  const [appError, setAppError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isElementSelectionActive, setIsElementSelectionActive] = useState(false);
  const [selectedElementInfo, setSelectedElementInfo] = useState<{ id: string; name: string } | null>(null);
  const [activelySelectedPreviewElementId, setActivelySelectedPreviewElementId] = useState<string | null>(null);
  const [elementToHighlightInPreview, setElementToHighlightInPreview] = useState<string | null>(null);


  const [currentAiModel, setCurrentAiModel] = useState<string>(GEMINI_MODEL_NAME);
  const [developerModeTargetSection, setDeveloperModeTargetSection] = useState<DeveloperSection | null>(null);
  const [currentDeveloperSection, setCurrentDeveloperSection] = useState<DeveloperSection | null>(null);

  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem(EDITOR_THEME_KEY) as 'light' | 'dark' | null;
    return savedTheme || 'dark'; 
  });

  const [contextualHelpEnabled, setContextualHelpEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(CONTEXTUAL_HELP_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true; 
  });

  const [dismissedContextualHelpIds, setDismissedContextualHelpIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(DISMISSED_CONTEXTUAL_HELP_IDS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const lastContextualHelpSentRef = useRef<string | null>(null);

  const [hoveredElementName, setHoveredElementName] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });


  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(0); 
  const [initialWidthSet, setInitialWidthSet] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartX = useRef(0);
  const initialLeftPanelWidthRef = useRef(0);
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const { showToast } = useToast();
  const [ycModeEnabled, setYcModeEnabled] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMdScreen(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (editorTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(EDITOR_THEME_KEY, editorTheme);
  }, [editorTheme]);

  const toggleEditorTheme = useCallback(() => {
    setEditorTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Theme`, "info");
      return newTheme;
    });
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(storeConfig));
      // Persist support conversations separately or as part of storeConfig
      localStorage.setItem(SUPPORT_CONVERSATIONS_KEY, JSON.stringify(storeConfig.supportConversations || []));
    }
  }, [storeConfig, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(chatMessages));
    }
  }, [chatMessages, isInitialized]);
  

  useEffect(() => {
    localStorage.setItem(CONTEXTUAL_HELP_ENABLED_KEY, JSON.stringify(contextualHelpEnabled));
  }, [contextualHelpEnabled]);

  useEffect(() => {
    localStorage.setItem(DISMISSED_CONTEXTUAL_HELP_IDS_KEY, JSON.stringify(dismissedContextualHelpIds));
  }, [dismissedContextualHelpIds]);
  

  const handleAiModelChange = useCallback((modelId: string) => {
    setCurrentAiModel(modelId);
  }, []);

  const handleModeChange = (mode: Mode) => {
    setCurrentMode(mode);
    setIsElementSelectionActive(false); 
    clearSelectedElementInfo();
    if (mode === Mode.NORMAL) setCurrentDeveloperSection(null);
  };

  const handleSetPreviewDisplayMode = (mode: 'mobile' | 'desktop') => {
    setPreviewDisplayMode(mode);
  };

  const toggleElementSelectionMode = useCallback(() => {
    setIsElementSelectionActive(prev => !prev);
    if (!isElementSelectionActive) { 
        setHoveredElementName(null); 
    }
  }, [isElementSelectionActive]);

  const handleElementSelected = useCallback((elementInfo: { id: string; name: string }) => {
    setSelectedElementInfo(elementInfo);
    setActivelySelectedPreviewElementId(elementInfo.id); 
    setIsElementSelectionActive(false);
    setHoveredElementName(null); 
    
    let cardContent: CardContent | undefined = undefined;
    const commonOptions: CardOption[] = [
        { label: `Ask AI to improve "${elementInfo.name.substring(0, 20)}${elementInfo.name.length > 20 ? '...' : ''}"`, actionId: `prefill_ai_improve_${elementInfo.id}` },
    ];
    if (currentMode === Mode.DEVELOPER) {
        commonOptions.push({ label: "Edit in Developer Mode", actionId: `nav_to_edit_${elementInfo.id}`, variant: 'secondary' });
    }

    if (elementInfo.id === 'store-header') {
        cardContent = {
            title: `Selected: Store Header`,
            description: "What would you like to do with the store header?",
            options: [
                { label: "Change Store Name", actionId: "prefill_change_store_name" },
                { label: "Update Tagline", actionId: "prefill_update_tagline" },
                ...commonOptions
            ]
        };
    } else if (elementInfo.name.startsWith('Product:')) { 
        const productName = elementInfo.name.replace('Product: ', '');
        cardContent = {
            title: `Selected: ${productName}`,
            description: "How can I help you with this product?",
            options: [
                { label: "Edit Description", actionId: `prefill_edit_product_desc_${elementInfo.id}` },
                { label: "Change Price", actionId: `prefill_edit_product_price_${elementInfo.id}` },
                ...commonOptions
            ]
        };
    } else if (elementInfo.id === 'store-welcome-message-display') {
        cardContent = {
            title: `Selected: Store Welcome Message`,
            description: "How would you like to modify the welcome message?",
            options: [
                { label: "Rewrite Welcome Message", actionId: "prefill_rewrite_welcome_message" },
                { label: "Make it Shorter", actionId: "prefill_shorten_welcome_message" },
                { label: "Change the Tone", actionId: "prefill_change_tone_welcome_message" },
                ...commonOptions
            ]
        };
    } else if (elementInfo.id === 'store-footer') {
      cardContent = {
        title: `Selected: Store Footer`,
        description: "What would you like to adjust in the footer?",
        options: [
            { label: "Edit Copyright Text", actionId: "prefill_edit_copyright" },
            ...commonOptions
        ]
      };
    }

    if (cardContent) {
        const aiCardMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'ai',
            text: `You selected "${elementInfo.name}". Here are some options:`,
            timestamp: new Date(),
            contentType: 'card',
            cardContent: cardContent
        };
        setChatMessages(prev => [...prev, aiCardMessage]);
    }

  }, [storeConfig.products, currentMode]);

  const clearSelectedElementInfo = useCallback(() => {
    setSelectedElementInfo(null);
    setActivelySelectedPreviewElementId(null);
  }, []);

  const navigateToSelectedElementInDevMode = useCallback((elementInfo: { id: string; name: string } | null) => {
    if (!elementInfo || currentMode !== Mode.DEVELOPER) return;
    let targetSection: DeveloperSection | null = null;
    if (elementInfo.id === 'store-header' || elementInfo.id === 'store-footer' || elementInfo.id === 'store-welcome-message-display') {
      targetSection = 'storeInfo'; 
    } else if (storeConfig.products.some(p => p.id === elementInfo.id)) {
      targetSection = 'products';
    }
    if (targetSection) {
      setDeveloperModeTargetSection(targetSection);
    } else {
      showToast(`No specific developer section mapped for "${elementInfo.name}".`, "info");
    }
    clearSelectedElementInfo();
  }, [currentMode, storeConfig.products, showToast, clearSelectedElementInfo]);
  
  const handleSendMessage = useCallback(async (messageText: string, file?: File) => {
    try {
      setIsAiLoading(true);
      setCurrentAiOperation('analyzing your request');
      console.log('[调试] handleSendMessage called', { messageText, file, ycModeEnabled, currentAiModel });

      const displayMessageText = file ? `[File: ${file.name}] ${messageText}` : messageText;
      const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: displayMessageText, timestamp: new Date(), contentType: 'text' };
      setChatMessages(prev => [...prev, newUserMessage]);
      setAppError(null);
      clearSelectedElementInfo();
      lastContextualHelpSentRef.current = null;

      // 检查是否是第一次成功解析
      const isFirstSuccessfulParse = !storeConfig.appearance.primaryColor || storeConfig.appearance.primaryColor === '#4338CA';

      let storeConfigUpdate: Partial<StoreConfiguration> = {};
      let responseAiMessage: string | null = null;
      let aiResponseMessage: Partial<ChatMessage> = { contentType: 'text' };
      let highlightElementId: string | null = null;
      const lowerMessageText = messageText.toLowerCase();

      if (ycModeEnabled) {
        console.log('[调试] 进入 YC mock 分支');
        // YC模式：走mock
        if (file) {
          if ((file.type.startsWith('image/') || file.type.startsWith('video/')) && (lowerMessageText.includes('create product') || lowerMessageText.includes('add this item'))) {
            const newProductId = `sim_prod_${Date.now()}`;
            const newProduct: Product = { id: newProductId, name: `"${file.name.split('.')[0]}" (AI Suggested)`, description: messageText || "Generated from your uploaded image and text.", price: parseFloat((Math.random() * 50 + 20).toFixed(2)), imageUrl: URL.createObjectURL(file), category: "AI Generated", sku: `AI-${newProductId.slice(-4)}`, stockQuantity: Math.floor(Math.random() * 50 + 10), tags: ["new", "ai-created"], isFeatured: false, isPublished: true, };
            const productDisplayInfo: ProductDisplayInfo = { id: newProduct.id, name: newProduct.name, price: newProduct.price, imageUrl: newProduct.imageUrl };
            setStoreConfig(prev => {
              const updatedProducts = [...prev.products, newProduct];
              return {...prev, products: updatedProducts};
            });
            aiResponseMessage.cardContent = { title: "New Product Created!", description: `I've created \"${newProduct.name}\" for you.`, status: 'success', products: [productDisplayInfo], options: [{ label: "Edit Details", actionId: "edit_created_product", value: newProduct.id }, { label: "Looks Good!", actionId: "acknowledge_product_creation", variant: "primary" }]};
          }
          aiResponseMessage.contentType = 'card';
          aiResponseMessage.cardContent = { title: "Knowledge Base Updated", documentName: file.name, description: `Processed \"${file.name}\" and updated AI Agent.`, status: 'success', options: [ { label: "Test AI Agent", actionId: "test_ai_agent_kb" , variant: "secondary" }, { label: "Okay!", actionId: "acknowledge_kb_update", variant: "primary" }]};
        } else {
          const result = await generateStoreUpdateFromText(messageText, storeConfig, currentAiModel);
          storeConfigUpdate = result?.storeConfig;
          responseAiMessage = result?.aiMessage;
        }
      } else {
        console.log('[调试] 进入 LLM 分支，准备调用 callClaudeApi');
        try {
          const result = await callClaudeApi(messageText, storeConfig, currentAiModel);
          console.log('[调试] callClaudeApi 返回的原始数据:', result);
          
          // 验证返回的数据结构
          if (!result || typeof result !== 'object') {
            throw new Error('无效的 API 响应格式');
          }

          // 分离处理不同类型的响应数据
          const { storeConfig: newStoreConfig, aiMessage, aiCard } = result;
          
          // 验证数据
          if (typeof aiMessage !== 'string') {
            throw new Error('无效的 AI 消息格式');
          }

          if (newStoreConfig && typeof newStoreConfig === 'object') {
            storeConfigUpdate = newStoreConfig;
          }
          responseAiMessage = aiMessage;

          console.log('[调试] 解析后的数据:', {
            storeConfigUpdate,
            responseAiMessage,
            aiCard
          });
          
          // 处理商店配置更新
          if (Object.keys(storeConfigUpdate).length > 0) {
            console.log('[调试] 开始更新商店配置，当前配置:', storeConfig);
            console.log('[调试] 要更新的配置:', storeConfigUpdate);
            
            // 使用函数式更新确保获取最新的状态
            setStoreConfig(prevConfig => {
              console.log('[调试] 更新前的配置:', prevConfig);
              
              // 深度合并配置
              const mergedConfig = {
                ...prevConfig,
                basicInfo: {
                  ...prevConfig.basicInfo,
                  ...(storeConfigUpdate.basicInfo || {})
                },
                products: storeConfigUpdate.products || prevConfig.products,
                promotions: storeConfigUpdate.promotions || prevConfig.promotions,
                paymentMethods: {
                  ...prevConfig.paymentMethods,
                  ...(storeConfigUpdate.paymentMethods || {})
                },
                appearance: {
                  ...prevConfig.appearance,
                  ...(storeConfigUpdate.appearance || {})
                },
                aiCustomerService: {
                  ...prevConfig.aiCustomerService,
                  ...(storeConfigUpdate.aiCustomerService || {})
                },
                supportConversations: storeConfigUpdate.supportConversations || prevConfig.supportConversations
              };
              
              console.log('[调试] 合并后的配置:', mergedConfig);
              return mergedConfig;
            });

            // 显示配置更新成功的消息
            aiResponseMessage.text = responseAiMessage || "商店配置已更新！";
            aiResponseMessage.contentType = 'text';
          }

          // 处理 AI 卡片
          if (aiCard) {
            aiResponseMessage.contentType = 'card';
            aiResponseMessage.cardContent = aiCard;
          }

          // 在成功解析后，如果是第一次，应用随机模板
          if (isFirstSuccessfulParse && Object.keys(storeConfigUpdate).length > 0) {
            const randomTemplate = getRandomTemplate();
            storeConfigUpdate.appearance = {
              ...storeConfigUpdate.appearance,
              ...randomTemplate.appearance
            };
            responseAiMessage = `已为您随机选择了一个精美的样式模板：${randomTemplate.name}。您可以随时在开发者模式中修改样式。`;
          }

        } catch (error) {
          console.error('[调试] 处理 API 响应时出错:', error);
          throw new Error(error instanceof Error ? error.message : '处理 API 响应时出错');
        }
      }

      // 添加 AI 响应消息
      if (aiResponseMessage.text || aiResponseMessage.cardContent) {
        const newAiMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          text: aiResponseMessage.text || '',
          timestamp: new Date(),
          contentType: aiResponseMessage.contentType || 'text',
          cardContent: aiResponseMessage.cardContent
        };
        setChatMessages(prev => [...prev, newAiMessage]);
      }

    } catch (error) {
      console.error('[调试] handleSendMessage 错误:', error);
      const errorMessage = error instanceof Error ? error.message : '发送消息时出错';
      setAppError(errorMessage);
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: errorMessage, timestamp: new Date(), contentType: 'text' }]);
    } finally {
      setIsAiLoading(false);
      console.log('handleSendMessage finally: isAiLoading set to false');
      if (file && file.type.startsWith('image/') && aiResponseMessage.cardContent?.products?.[0]?.imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(aiResponseMessage.cardContent.products[0].imageUrl);
      }
    }
  }, [storeConfig, selectedElementInfo, clearSelectedElementInfo, currentAiModel, ycModeEnabled]);
  
  const handleCardAction = useCallback(async (actionId: string, value?: string | number | boolean) => {
    if (actionId.startsWith('prefill_')) {
      let userMessage = '';
      if (actionId.startsWith('prefill_edit_product_desc_')) {
        const productId = actionId.replace('prefill_edit_product_desc_', '');
        userMessage = `I want to edit the description for product ID ${productId}.`;
      } else if (actionId.startsWith('prefill_edit_product_price_')) {
        const productId = actionId.replace('prefill_edit_product_price_', '');
        userMessage = `I need to change the price for product ID ${productId}.`;
      } else if (actionId.startsWith('prefill_ai_improve_')) {
        const elementId = actionId.replace('prefill_ai_improve_', '');
        userMessage = `Can you help me improve the content for element ID ${elementId}?`;
      } else {
        const prefillActions: Record<string, { user: string; ai: string }> = {
          prefill_change_store_name: { user: "I'd like to change my store name.", ai: "Great! What would you like to name your store?" },
          prefill_update_tagline: { user: "Let's update the tagline.", ai: "Sounds good! What's the new tagline?" },
          prefill_rewrite_welcome_message: { user: "Help me rewrite the store welcome message.", ai: "I can help with that! What style or key points should I focus on?" },
          prefill_shorten_welcome_message: { user: "Make the welcome message shorter.", ai: "Okay, I'll try to make it more concise. I'll provide an update." },
          prefill_change_tone_welcome_message: { user: "Change the tone of the welcome message.", ai: "What kind of tone are you going for? (e.g., friendly, professional, quirky)" },
          prefill_edit_copyright: { user: "I want to edit the copyright text in the footer.", ai: "Okay, what should the new copyright text be?" },
        };
        userMessage = prefillActions[actionId]?.user || '';
      }
      if (userMessage) {
        void handleSendMessage(userMessage);
        return;
      } else {
        showToast('Failed to trigger the mock action. Please try again.', 'error');
        return;
      }
    }
    // 其它 actionId 逻辑保持不变
    let userMessageText = `User clicked: ${actionId}`;
    let aiResponseText = `Okay, action "${actionId}" processed.`;
    let aiFollowUpCard: CardContent | undefined = undefined;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessageText, timestamp: new Date(), contentType: 'text' }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText, timestamp: new Date(), contentType: 'text', cardContent: aiFollowUpCard }]);
    }, 800);
  }, [handleSendMessage, showToast]);


  const handleDeploymentSuccess = useCallback((settings: DeploymentSettings) => {
    const deployedUrl = settings.domainType === 'subdomain' 
      ? `https://${settings.subdomainName || storeConfig.basicInfo.storeName.toLowerCase().replace(/\s+/g, '-')}.miniy.app` 
      : `https://${settings.customDomainName || 'your-custom-domain.com'}`;
    const successMessage: ChatMessage = { id: Date.now().toString(), sender: 'ai', text: "", timestamp: new Date(), contentType: 'card', cardContent: { title: "🎉 Store Deployed!", description: `Store "${storeConfig.basicInfo.storeName}" is live at: ${deployedUrl}`, status: 'success', options: [{ label: "Visit Store", actionId: "visit_deployed_store_link", value: deployedUrl, variant: 'primary' }] } as CardContent };
    setChatMessages(prev => [...prev, successMessage]);
  }, [storeConfig.basicInfo.storeName]);

  const calculateWidthConstraints = useCallback(() => {
      if (!containerRef.current || !isMdScreen) return { min: MIN_LEFT_PANEL_WIDTH_PX, max: window.innerWidth };
      const containerTotalWidth = containerRef.current.offsetWidth;
      const previewComponentBaseWidth = previewDisplayMode === 'mobile' ? 360 : 600; 
      const minRightPanelEffectiveWidth = previewComponentBaseWidth + (2 * 8); 
      const maxAllowedLeftWidth = containerTotalWidth - minRightPanelEffectiveWidth - RESIZER_WIDTH_PX - (2 * GAP_WIDTH_PX);
      return { min: MIN_LEFT_PANEL_WIDTH_PX, max: Math.max(MIN_LEFT_PANEL_WIDTH_PX, maxAllowedLeftWidth) };
  }, [isMdScreen, previewDisplayMode]);

  useEffect(() => {
    if (!isInitialized || !containerRef.current) return;
    if (!initialWidthSet) {
      const savedWidth = localStorage.getItem(LEFT_PANEL_WIDTH_KEY);
      if (isMdScreen) {
          const { min, max } = calculateWidthConstraints();
          let initialWidth = max * 0.45; 
          if (savedWidth) {
              const parsedSavedWidth = parseInt(savedWidth, 10);
              if (!isNaN(parsedSavedWidth)) initialWidth = Math.max(min, Math.min(parsedSavedWidth, max));
          }
          setLeftPanelWidth(initialWidth);
      } else { setLeftPanelWidth(window.innerWidth); }
      setInitialWidthSet(true);
    } else {
      if (isMdScreen) {
        const { min, max } = calculateWidthConstraints();
        setLeftPanelWidth(prev => Math.max(min, Math.min(prev, max)));
      } else { setLeftPanelWidth(window.innerWidth); }
    }
  }, [isInitialized, isMdScreen, initialWidthSet, calculateWidthConstraints, previewDisplayMode]);

  useEffect(() => {
    if (isInitialized && initialWidthSet && isMdScreen && leftPanelWidth > 0 && leftPanelWidth !== window.innerWidth) {
        localStorage.setItem(LEFT_PANEL_WIDTH_KEY, leftPanelWidth.toString());
    }
  }, [leftPanelWidth, isInitialized, isMdScreen, initialWidthSet]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (!isMdScreen) return;
      e.preventDefault(); setIsResizing(true); dragStartX.current = e.clientX; initialLeftPanelWidthRef.current = leftPanelWidth;
      document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  }, [isMdScreen, leftPanelWidth]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (!isMdScreen) return;
      if (e.target === e.currentTarget) { setIsResizing(true); dragStartX.current = e.touches[0].clientX; initialLeftPanelWidthRef.current = leftPanelWidth; }
  }, [isMdScreen, leftPanelWidth]);

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
          if (!isResizing || !isMdScreen) return;
          const isTouchEvent = 'touches' in e;
          if (isTouchEvent && e.cancelable) e.preventDefault(); else if (!isTouchEvent && e.cancelable) e.preventDefault();
          const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
          const deltaX = currentX - dragStartX.current;
          const newWidth = initialLeftPanelWidthRef.current + deltaX;
          const { min, max } = calculateWidthConstraints();
          const constrainedWidth = Math.max(min, Math.min(newWidth, max));
          if (constrainedWidth > 0 && constrainedWidth !== leftPanelWidth) setLeftPanelWidth(constrainedWidth);
      };
      const handleMouseUpOrEnd = () => {
          if (isResizing) { setIsResizing(false); document.body.style.cursor = 'default'; document.body.style.userSelect = 'auto'; }
      };
      if (isResizing) {
          document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUpOrEnd);
          document.addEventListener('touchmove', handleMouseMove, { passive: false }); document.addEventListener('touchend', handleMouseUpOrEnd);
      }
      return () => {
          document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUpOrEnd);
          document.removeEventListener('touchmove', handleMouseMove); document.removeEventListener('touchend', handleMouseUpOrEnd);
          if (document.body.style.cursor === 'col-resize') document.body.style.cursor = 'default';
          if (document.body.style.userSelect === 'none') document.body.style.userSelect = 'auto';
      };
  }, [isResizing, isMdScreen, leftPanelWidth, calculateWidthConstraints]);


  useEffect(() => {
    if (currentMode !== Mode.DEVELOPER || !contextualHelpEnabled || isAiLoading) {
      return;
    }
    
    let helpCardId: string | null = null;
    let cardContent: CardContent | null = null;

    if (currentDeveloperSection === 'payments') {
      const allDisconnected = Object.values(storeConfig.paymentMethods).every(p => p.status === 'disconnected');
      if (allDisconnected) {
        helpCardId = 'payments_no_providers_setup';
        if (!dismissedContextualHelpIds.includes(helpCardId) && lastContextualHelpSentRef.current !== helpCardId) {
          cardContent = {
            title: "Set Up Payments",
            description: "It looks like you haven't connected any payment providers yet. Customers won't be able to purchase items.",
            status: 'warning',
            options: [
              { label: "Guide Me to Set Up Payments", actionId: "guide_setup_payments", variant: 'primary' },
              { label: "Dismiss This Tip", actionId: `dismiss_tip_${helpCardId}`, variant: 'ghost' },
              { label: "Disable All Contextual Tips", actionId: "disable_all_contextual_help", variant: 'ghost' },
            ]
          };
        }
      }
    }
    else if (currentDeveloperSection === 'products') {
      if (storeConfig.products.length === 0) {
        helpCardId = 'products_no_products_added';
        if (!dismissedContextualHelpIds.includes(helpCardId) && lastContextualHelpSentRef.current !== helpCardId) {
          cardContent = {
            title: "Add Your First Product",
            description: "Your store doesn't have any products yet. Let's add some to get started!",
            status: 'info',
            options: [
              { label: "Help Me Add a Product", actionId: "guide_add_first_product", variant: 'primary' },
              { label: "Dismiss This Tip", actionId: `dismiss_tip_${helpCardId}`, variant: 'ghost' },
              { label: "Disable All Contextual Tips", actionId: "disable_all_contextual_help", variant: 'ghost' },
            ]
          };
        }
      }
    }
    
    if (cardContent && helpCardId) {
      const aiContextualMessage: ChatMessage = {
        id: `contextual_${helpCardId}_${Date.now()}`,
        sender: 'ai',
        text: "I noticed something you might want to address:",
        timestamp: new Date(),
        contentType: 'card',
        cardContent: cardContent
      };
      setChatMessages(prev => [...prev, aiContextualMessage]);
      lastContextualHelpSentRef.current = helpCardId; 
    }
  }, [
    currentMode, 
    currentDeveloperSection, 
    storeConfig.paymentMethods, 
    storeConfig.products, 
    contextualHelpEnabled, 
    dismissedContextualHelpIds,
    isAiLoading 
  ]);

  const toggleContextualHelpGlobally = useCallback(() => {
    setContextualHelpEnabled(prev => {
      const newState = !prev;
      showToast(`Contextual help tips ${newState ? 'enabled' : 'disabled'}.`, 'info');
      if (!newState) { 
        lastContextualHelpSentRef.current = null;
      }
      return newState;
    });
  }, [showToast]);

  const handleSendMessageToSupport = useCallback((
    conversationId: string | null, 
    messageText: string, 
    sender: 'customer' | 'storeOwner',
    customerName?: string 
  ): string => {
    let targetConversationId = conversationId;
    let updatedConversations = [...(storeConfig.supportConversations || [])];
    let isNewConversation = false;
    
    const newMessage: SupportChatMessage = {
      id: `sp_msg_${Date.now()}`,
      sender,
      text: messageText,
      timestamp: new Date(),
      conversationId: '', 
      isReadByOwner: sender === 'customer' ? false : true,
    };

    if (targetConversationId) {
      const convIndex = updatedConversations.findIndex(c => c.id === targetConversationId);
      if (convIndex !== -1) {
        newMessage.conversationId = targetConversationId;
        const updatedConv = { ...updatedConversations[convIndex] };
        updatedConv.messages = [...updatedConv.messages, newMessage];
        updatedConv.lastMessagePreview = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
        updatedConv.lastMessageTimestamp = newMessage.timestamp;
        if (sender === 'customer') {
          updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
        } else { 
          updatedConv.unreadCount = 0; 
        }
        updatedConversations[convIndex] = updatedConv;
      } else {
        targetConversationId = null; 
      }
    }
    
    if (!targetConversationId && sender === 'customer') { 
      isNewConversation = true;
      targetConversationId = `sp_conv_${Date.now()}`;
      newMessage.conversationId = targetConversationId;
      const newConversation: SupportConversation = {
        id: targetConversationId,
        customerId: `cust_mobile_${Date.now().toString().slice(-5)}`, 
        customerName: customerName || "Valued Customer",
        lastMessagePreview: messageText.substring(0, 30) + (messageText.length > 30 ? '...' : ''),
        lastMessageTimestamp: newMessage.timestamp,
        unreadCount: 1,
        messages: [newMessage],
        isAiAssisted: false, // Default for new conversations
      };
      updatedConversations.push(newConversation);
    } else if (!targetConversationId && sender === 'storeOwner') {
        console.warn("Store owner tried to send message without a selected conversation.");
        showToast("Please select a conversation to reply to.", "error");
        return '';
    }
    
    // AI Agent intervention for customer messages
    if (sender === 'customer' && storeConfig.aiCustomerService.isEnabled) {
        const currentConv = updatedConversations.find(c => c.id === targetConversationId);
        if (currentConv && currentConv.isAiAssisted) {
            setIsAiLoading(true);
            setCurrentAiOperation('generating support response');
            generateAiSupportResponse(
                messageText, 
                storeConfig.aiCustomerService, // Pass full AI settings
                currentConv.messages 
            ).then(aiResponseText => {
                if (aiResponseText) {
                    const aiMessage: SupportChatMessage = {
                        id: `sp_msg_ai_${Date.now()}`,
                        sender: 'aiAgent', 
                        text: aiResponseText,
                        timestamp: new Date(),
                        conversationId: currentConv.id,
                        isReadByOwner: false, 
                    };
                    const convIndex = updatedConversations.findIndex(c => c.id === currentConv.id);
                    if (convIndex !== -1) {
                        updatedConversations[convIndex].messages.push(aiMessage);
                        updatedConversations[convIndex].lastMessagePreview = aiMessage.text.substring(0, 30) + (aiMessage.text.length > 30 ? '...' : '');
                        updatedConversations[convIndex].lastMessageTimestamp = aiMessage.timestamp;
                        updatedConversations[convIndex].unreadCount = (updatedConversations[convIndex].unreadCount || 0) + 1;
                        setStoreConfig(prev => ({...prev, supportConversations: [...updatedConversations] }));
                    }
                }
            }).catch(error => {
                console.error("Error generating AI support response:", error);
                showToast("AI agent failed to respond.", "error");
            }).finally(() => {
                setIsAiLoading(false);
            });
        }
    }
    
    setStoreConfig(prev => ({...prev, supportConversations: updatedConversations }));
    return targetConversationId || '';
  }, [storeConfig.supportConversations, storeConfig.aiCustomerService, showToast, setIsAiLoading]);


  const handleMarkConversationAsRead = useCallback((conversationId: string) => {
    setStoreConfig(prev => {
      const conversations = prev.supportConversations || [];
      const convIndex = conversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1 && conversations[convIndex].unreadCount > 0) {
        const updatedConversations = [...conversations];
        updatedConversations[convIndex] = {
          ...updatedConversations[convIndex],
          unreadCount: 0,
          messages: updatedConversations[convIndex].messages.map(msg => 
            msg.sender === 'customer' && !msg.isReadByOwner ? { ...msg, isReadByOwner: true } : msg
          )
        };
        return { ...prev, supportConversations: updatedConversations };
      }
      return prev;
    });
  }, []);

  const handleToggleAiAssistanceForConversation = useCallback((conversationId: string, enable: boolean) => {
    setStoreConfig(prev => {
        const conversations = prev.supportConversations || [];
        const convIndex = conversations.findIndex(c => c.id === conversationId);
        if (convIndex !== -1) {
            const updatedConversations = [...conversations];
            updatedConversations[convIndex] = {
                ...updatedConversations[convIndex],
                isAiAssisted: enable,
            };
            showToast(`AI Assist ${enable ? 'enabled' : 'disabled'} for ${updatedConversations[convIndex].customerName}.`, "info");
            return { ...prev, supportConversations: updatedConversations };
        }
        return prev;
    });
  }, [showToast]);

  const handleCreateSupportConversation = (customerName: string, firstMessage: string): string => {
    return handleSendMessageToSupport(null, firstMessage, 'customer', customerName);
  };

  const handleToggleYcMode = (enabled: boolean) => {
    setYcModeEnabled(enabled);
    if (enabled) {
      showToast('YC Mode enabled. You can now experience the mock flow.', 'info');
    }
  };

  if (!isInitialized) return <div className="flex items-center justify-center h-screen bg-BACKGROUND_MAIN dark:bg-replit-dark-bg"><LoadingSpinner size="lg" text="Initializing Miniy..." /></div>;
  if (appError) return <div className="flex items-center justify-center h-screen bg-BACKGROUND_MAIN dark:bg-replit-dark-bg text-center p-4"><div><h2 className="text-xl font-bold text-ERROR_RED mb-3">Oops!</h2><p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mb-5">{appError}</p><Button onClick={() => window.location.reload()} variant="primary">Refresh</Button></div></div>;

  const leftPanelStyle = isMdScreen ? { width: `${leftPanelWidth}px`, flexShrink: 0 } : { width: '100%', height: '100%' };
  const rightPanelMinRequiredWidth = (previewDisplayMode === 'mobile' ? 360 : 600) + 16; 
  const rightPanelStyle = isMdScreen ? { flexGrow: 1, minWidth: `${Math.max(320, rightPanelMinRequiredWidth)}px` } : { display: 'none' };

  return (
    <Routes>
      <Route path="/store-preview" element={<StorePreview />} />
      <Route path="*" element={
        <>
          <div className="flex flex-col h-screen font-sans bg-BACKGROUND_MAIN dark:bg-replit-dark-bg text-TEXT_PRIMARY dark:text-replit-dark-text-main">
            <Header 
              currentMode={currentMode} 
              onModeChange={handleModeChange} 
              isAiLoading={isAiLoading} 
              editorTheme={editorTheme} 
              toggleEditorTheme={toggleEditorTheme} 
              contextualHelpEnabled={contextualHelpEnabled} 
              toggleContextualHelpGlobally={toggleContextualHelpGlobally}
              ycModeEnabled={ycModeEnabled}
              onToggleYcMode={handleToggleYcMode}
            />
            <main ref={containerRef} className="flex-grow overflow-hidden flex md:flex-row flex-col">
              <div 
                style={leftPanelStyle} 
                className={`md:h-full overflow-auto bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg ${isMdScreen ? 'border-r border-BORDER_DEFAULT dark:border-replit-dark-border' : ''}`}
              >
                {currentMode === Mode.NORMAL ? (
                  <NormalModeView 
                    chatMessages={chatMessages} 
                    onSendMessage={handleSendMessage} 
                    isAiLoading={isAiLoading} 
                    currentAiOperation={currentAiOperation}
                    selectedElementInfo={selectedElementInfo} 
                    onClearSelectedElementInfo={clearSelectedElementInfo} 
                    onCardAction={handleCardAction} 
                    currentAiModel={currentAiModel} 
                    onAiModelChange={handleAiModelChange} 
                    currentAppMode={currentMode} 
                    navigateToSelectedElementInDevMode={navigateToSelectedElementInDevMode} 
                  />
                ) : (
                  <DeveloperModeView 
                    storeConfig={storeConfig} 
                    onUpdateConfig={setStoreConfig} 
                    currentAppMode={currentMode} 
                    onAppModeChange={handleModeChange} 
                    onDeploymentSuccess={handleDeploymentSuccess} 
                    targetSection={developerModeTargetSection} 
                    onTargetSectionConsumed={() => setDeveloperModeTargetSection(null)}
                    onActiveSectionChange={setCurrentDeveloperSection}
                    supportConversations={storeConfig.supportConversations || []}
                    onSendMessageToSupport={(convId, text) => handleSendMessageToSupport(convId, text, 'storeOwner')}
                    onMarkConversationAsRead={handleMarkConversationAsRead}
                    onCreateSupportConversation={handleCreateSupportConversation}
                    onToggleAiAssistanceForConversation={handleToggleAiAssistanceForConversation}
                  />
                )}
              </div>

              {isMdScreen && (
                <div
                  className="w-1.5 cursor-col-resize bg-BORDER_DEFAULT dark:bg-replit-dark-border hover:bg-replit-primary-blue transition-colors duration-150"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  title="Resize panels"
                ></div>
              )}

              <div 
                style={rightPanelStyle} 
                className="md:h-full overflow-auto flex items-center justify-center bg-BACKGROUND_MAIN dark:bg-replit-dark-bg p-2"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <MobilePreview
                    config={storeConfig}
                    displayMode={previewDisplayMode}
                    isElementSelectionActive={isElementSelectionActive}
                    onElementSelected={handleElementSelected}
                    activelySelectedPreviewElementId={activelySelectedPreviewElementId}
                    elementToHighlight={elementToHighlightInPreview}
                    setHoveredElementName={setHoveredElementName} 
                    setTooltipPosition={setTooltipPosition}  
                    supportConversations={storeConfig.supportConversations || []}
                    onSendMessageToSupport={(convId, text, custName) => handleSendMessageToSupport(convId, text, 'customer', custName)}
                  />
                  <PreviewControls
                    currentAppMode={currentMode} 
                    onAppModeChange={handleModeChange}
                    currentPreviewMode={previewDisplayMode}
                    onPreviewModeChange={handleSetPreviewDisplayMode}
                    isElementSelectionActive={isElementSelectionActive}
                    onToggleElementSelectionMode={toggleElementSelectionMode}
                    storeConfig={storeConfig}
                    onDeploymentSuccess={handleDeploymentSuccess}
                  />
                </div>
              </div>
            </main>
          </div>
          <ElementHoverTooltip
            name={hoveredElementName}
            position={tooltipPosition}
            visible={isElementSelectionActive && !!hoveredElementName}
          />
        </>
      } />
    </Routes>
  );
};

export default App;
