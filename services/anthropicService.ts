import Anthropic from '@anthropic-ai/sdk';
import { StoreConfiguration, Product, BasicInfo, PaymentMethods, PaymentProviderDetails, AICustomerServiceSettings, SupportChatMessage, CardContent } from '../types';
import { INITIAL_STORE_CONFIG } from '../constants';
import { STORE_ASSISTANT_PROMPT } from '../prompts/storeAssistantPrompt';
import { getCachedProductImage } from './imageService';

// const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
// const anthropic = new Anthropic({ apiKey: API_KEY });

const API_URL = 'http://localhost:3001/anthropic';

// Helper to ensure all BasicInfo fields are present for the prompt example
const createFullBasicInfoExample = (basicInfo?: Partial<BasicInfo>): BasicInfo => {
  const defaults = INITIAL_STORE_CONFIG.basicInfo;
  return {
    storeName: basicInfo?.storeName || defaults.storeName,
    tagline: basicInfo?.tagline || defaults.tagline,
    logoUrl: basicInfo?.logoUrl || defaults.logoUrl,
    storeEmail: basicInfo?.storeEmail || defaults.storeEmail,
    storePhoneNumber: basicInfo?.storePhoneNumber || defaults.storePhoneNumber,
    storeAddress: basicInfo?.storeAddress || defaults.storeAddress,
    country: basicInfo?.country || defaults.country,
    currency: basicInfo?.currency || defaults.currency,
    timezone: basicInfo?.timezone || defaults.timezone,
    industry: basicInfo?.industry || defaults.industry,
    legalNameOfBusiness: basicInfo?.legalNameOfBusiness || defaults.legalNameOfBusiness,
    facebookPageUrl: basicInfo?.facebookPageUrl || defaults.facebookPageUrl,
    instagramHandle: basicInfo?.instagramHandle || defaults.instagramHandle,
    tiktokHandle: basicInfo?.tiktokHandle || defaults.tiktokHandle,
    xHandle: basicInfo?.xHandle || defaults.xHandle,
    linkedinPageUrl: basicInfo?.linkedinPageUrl || defaults.linkedinPageUrl,
    youtubeChannelUrl: basicInfo?.youtubeChannelUrl || defaults.youtubeChannelUrl,
    pinterestProfileUrl: basicInfo?.pinterestProfileUrl || defaults.pinterestProfileUrl,
    metaDescription: basicInfo?.metaDescription || defaults.metaDescription,
    seoTitle: basicInfo?.seoTitle || defaults.seoTitle,
    focusKeywords: basicInfo?.focusKeywords || defaults.focusKeywords,
    storeWelcomeMessage: basicInfo?.storeWelcomeMessage || defaults.storeWelcomeMessage,
  };
};

// Global ref for persisting mockStep and mockStore
let _mockStep = 0;
let _mockStore: StoreConfiguration = {
  basicInfo: {
    storeName: '', tagline: '', logoUrl: '', storeEmail: '', storePhoneNumber: '', storeAddress: '', country: '', currency: '', timezone: '', industry: '', legalNameOfBusiness: '', facebookPageUrl: '', instagramHandle: '', tiktokHandle: '', xHandle: '', linkedinPageUrl: '', youtubeChannelUrl: '', pinterestProfileUrl: '', metaDescription: '', seoTitle: '', focusKeywords: '', storeWelcomeMessage: '',
  },
  products: [], promotions: [],
  paymentMethods: {
    stripe: { status: 'disconnected' }, paypal: { status: 'disconnected' }, square: { status: 'disconnected' }, alipay: { status: 'disconnected' }, wechatPay: { status: 'disconnected' },
  },
  appearance: { primaryColor: '#0098ff', fontFamily: 'Inter, Arial, sans-serif', darkMode: false },
  aiCustomerService: { isEnabled: false, agentName: '', systemPrompt: '', welcomeMessage: '', keyBusinessInfo: '', humanHandoffInstructions: '', conversationStarters: [] },
};

export function getMockStep() { return _mockStep; }
export function setMockStep(step: number) { _mockStep = step; }
export function getMockStore() { return _mockStore; }
export function setMockStore(store: StoreConfiguration) { _mockStore = store; }
export function resetMockFlow() { _mockStep = 0; _mockStore = {
  basicInfo: {
    storeName: '', tagline: '', logoUrl: '', storeEmail: '', storePhoneNumber: '', storeAddress: '', country: '', currency: '', timezone: '', industry: '', legalNameOfBusiness: '', facebookPageUrl: '', instagramHandle: '', tiktokHandle: '', xHandle: '', linkedinPageUrl: '', youtubeChannelUrl: '', pinterestProfileUrl: '', metaDescription: '', seoTitle: '', focusKeywords: '', storeWelcomeMessage: '',
  },
  products: [], promotions: [],
  paymentMethods: {
    stripe: { status: 'disconnected' }, paypal: { status: 'disconnected' }, square: { status: 'disconnected' }, alipay: { status: 'disconnected' }, wechatPay: { status: 'disconnected' },
  },
  appearance: { primaryColor: '#0098ff', fontFamily: 'Inter, Arial, sans-serif', darkMode: false },
  aiCustomerService: { isEnabled: false, agentName: '', systemPrompt: '', welcomeMessage: '', keyBusinessInfo: '', humanHandoffInstructions: '', conversationStarters: [] },
}; }

export const generateStoreUpdateFromText = async (
  currentStoreConfig: StoreConfiguration,
  userInput: string
): Promise<{
  storeConfig: Partial<StoreConfiguration>;
  aiMessage: string;
  aiCard?: CardContent;
}> => {
  try {
    const response = await callClaudeApi(userInput, currentStoreConfig, 'claude-3-7-sonnet-20250219');
    
    // If response contains product information, automatically get product image
    if (response.storeConfig?.products) {
      const updatedProducts = await Promise.all(
        response.storeConfig.products.map(async (product: any) => {
          if (!product.image) {
            try {
              const imageUrl = await getCachedProductImage(product.name);
              return {
                ...product,
                image: imageUrl
              };
            } catch (error) {
              console.error(`Failed to get image for product ${product.name}:`, error);
              return product;
            }
          }
          return product;
        })
      );
      
      response.storeConfig.products = updatedProducts;
    }

    return {
      storeConfig: response.storeConfig || {},
      aiMessage: response.aiMessage,
      aiCard: response.aiCard
    };
  } catch (error) {
    console.error('Failed to generate store update:', error);
    throw error;
  }
};

export const optimizeTextWithAI = async (
  textToOptimize: string,
  fieldHint: 'tagline' | 'meta description' | 'seo title' | 'user prompt',
): Promise<string | null> => {
  // Simple mock: just return a more engaging version
  return `🔥 ${textToOptimize} (optimized for ${fieldHint})`;
};

export const generateAiSupportResponse = async (
  userMessage: string,
  aiSettings: any,
  conversationHistory: any[],
): Promise<string | null> => {
  // Simple mock: echo with a friendly AI prefix
  return `AI Support: Thank you for your message! (${userMessage})`;
};

// LLM mode API call function
export async function callClaudeApi(
  messageText: string,
  storeConfig: any,
  modelId: string
): Promise<{ aiMessage: string; storeConfig?: Partial<any>; aiCard?: any }> {
  console.log('[调试] callClaudeApi 入口', { messageText, storeConfig, modelId });
  
  if (modelId !== 'claude-3-7-sonnet-20250219') {
    console.log('[调试] 走 mock 分支', modelId);
    return { aiMessage: `Claude LLM: ${messageText}`, storeConfig: {} };
  }

  console.log('[调试] 走真实 API 分支', modelId);
  const prompt = `${STORE_ASSISTANT_PROMPT}\n\nCurrent store config: ${JSON.stringify(storeConfig)}\n\nUser input: ${messageText}`;

  let body: any = {
    model: modelId,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }]
  };

  let fetchOptions: any = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };

  console.log('[调试] fetch /api/claude-store-assistant', fetchOptions);
  const res = await fetch('/api/claude-store-assistant', fetchOptions);
  const data = await res.json();
  console.log('[调试] Claude API 原始响应:', data);

  let aiMessage = '';
  let storeConfigUpdate = {};
  let aiCard = undefined;

  try {
    // 首先尝试直接解析响应中的 JSON
    if (typeof data === 'object' && data !== null) {
      console.log('[调试] 开始处理响应数据');
      
      // 处理 aiMessage
      if (data.aiMessage) {
        try {
          // 尝试解析 aiMessage 中的 JSON
          const parsedAiMessage = JSON.parse(data.aiMessage);
          console.log('[调试] 解析后的 aiMessage:', parsedAiMessage);
          
          // 提取实际的 aiMessage 和 storeConfig
          aiMessage = parsedAiMessage.aiMessage || '';
          if (parsedAiMessage.storeConfig) {
            storeConfigUpdate = parsedAiMessage.storeConfig;
            console.log('[调试] 从 aiMessage 中提取的 storeConfig:', storeConfigUpdate);
          }
        } catch (error) {
          console.log('[调试] aiMessage 不是 JSON 格式，尝试从字符串中提取 JSON');
          // 尝试从字符串中提取 JSON
          const jsonMatch = data.aiMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const extractedJson = JSON.parse(jsonMatch[0]);
              console.log('[调试] 从字符串中提取的 JSON:', extractedJson);
              
              aiMessage = extractedJson.aiMessage || '';
              if (extractedJson.storeConfig) {
                storeConfigUpdate = extractedJson.storeConfig;
                console.log('[调试] 从提取的 JSON 中获取的 storeConfig:', storeConfigUpdate);
              }
            } catch (parseError) {
              console.log('[调试] 提取的 JSON 解析失败，使用原始值');
              aiMessage = data.aiMessage;
            }
          } else {
            console.log('[调试] 未找到 JSON，使用原始值');
            aiMessage = data.aiMessage;
          }
        }
      }

      // 如果 storeConfig 存在且为空，尝试从 aiMessage 中提取
      if (Object.keys(storeConfigUpdate).length === 0 && data.storeConfig) {
        console.log('[调试] 使用 data.storeConfig');
        storeConfigUpdate = data.storeConfig;
      }

      // 处理 aiCard
      if (data.aiCard) {
        aiCard = data.aiCard;
        console.log('[调试] 找到 aiCard:', aiCard);
      }
    }

    // 确保 aiMessage 不为空
    if (!aiMessage) {
      aiMessage = '抱歉，我无法理解您的请求。请重试。';
      console.log('[调试] 使用默认 aiMessage');
    }

    console.log('[调试] 最终返回的数据:', {
      aiMessage,
      storeConfig: storeConfigUpdate,
      aiCard
    });

    return { aiMessage, storeConfig: storeConfigUpdate, aiCard };
  } catch (error) {
    console.error('[调试] 处理 Claude API 响应时出错:', error);
    return { 
      aiMessage: '抱歉，处理您的请求时出现错误。请重试。',
      storeConfig: {},
      aiCard: undefined
    };
  }
} 