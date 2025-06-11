export enum Mode {
  NORMAL = 'NORMAL',
  DEVELOPER = 'DEVELOPER',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  sku?: string;
  stockQuantity?: number;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
}

// For displaying minimal product info in cards
export interface ProductDisplayInfo {
  id: string;
  name:string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
}

export interface BasicInfo {
  storeName: string;
  tagline: string;
  logoUrl: string;
  storeEmail: string;
  storePhoneNumber?: string;
  storeAddress: string;
  country: string;
  currency: string; // e.g., USD, EUR
  timezone: string; // e.g., America/New_York
  industry?: string;
  legalNameOfBusiness?: string;
  // Social Media - Existing
  facebookPageUrl?: string;
  instagramHandle?: string; 
  tiktokHandle?: string; 
  xHandle?: string; 
  linkedinPageUrl?: string;
  youtubeChannelUrl?: string;
  pinterestProfileUrl?: string;
  // Social Media - New additions for ~15 platforms
  snapchatUsername?: string;       // Typically username, not full URL
  whatsappNumber?: string;         // Phone number, might need formatting for wa.me link
  telegramUsername?: string;       // Username, for t.me link
  redditProfileUrl?: string;
  discordServerInviteUrl?: string; // Full invite URL
  twitchChannelUrl?: string;
  behanceProfileUrl?: string;
  dribbbleProfileUrl?: string;
  // SEO
  metaDescription?: string;
  seoTitle?: string; 
  focusKeywords?: string; 
  storeWelcomeMessage?: string; // New field for welcome message
  // Social Media Order
  socialMediaOrder?: string[]; // Array of social media platform keys in desired order
}

export type PaymentProvider = 'stripe' | 'paypal' | 'square' | 'alipay' | 'wechatPay' | 'visa' | 'mastercard' | 'amex' | 'applepay' | 'googlepay'; // Added common card brands and digital wallets
export type PaymentProviderStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface PaymentProviderDetails {
  status: PaymentProviderStatus;
  accountId?: string;
  lastConnected?: string; // ISO date string
  errorMessage?: string;
}

export interface PaymentMethods {
  stripe: PaymentProviderDetails;
  paypal: PaymentProviderDetails;
  square: PaymentProviderDetails;
  alipay: PaymentProviderDetails;
  wechatPay: PaymentProviderDetails;
  // Added for direct display, though configuration might still be through a primary gateway like Stripe
  visa?: PaymentProviderDetails;      // Typically processed via a gateway
  mastercard?: PaymentProviderDetails; // Typically processed via a gateway
  amex?: PaymentProviderDetails;       // Typically processed via a gateway
  applepay?: PaymentProviderDetails;   // Can be direct or via gateway
  googlepay?: PaymentProviderDetails;  // Can be direct or via gateway
}

export interface AppearanceSettings {
  primaryColor: string;
  fontFamily: string; 
  darkMode: boolean; 
}

export type TemplateCategory = 'Fashion' | 'Electronics' | 'Home Goods' | 'Food & Beverage' | 'Minimalist' | 'Services' | 'Digital Products' | 'Arts & Crafts';

export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: TemplateCategory;
  appearance: AppearanceSettings;
  defaultBasicInfoOverrides?: Partial<Pick<BasicInfo, 'storeName' | 'tagline' | 'industry'>>;
}

export interface AICustomerServiceSettings {
  isEnabled: boolean;
  agentName: string;
  systemPrompt: string;
  welcomeMessage: string;
  keyBusinessInfo?: string;
  humanHandoffInstructions?: string;
  conversationStarters?: string[]; // Array of strings
}

export interface StoreConfiguration {
  basicInfo: BasicInfo;
  products: Product[];
  promotions: Promotion[];
  paymentMethods: PaymentMethods;
  appearance: AppearanceSettings;
  aiCustomerService: AICustomerServiceSettings;
  supportConversations?: SupportConversation[]; 
}

// --- Card Message Types ---
export interface CardOption {
  label: string;
  actionId: string; // To identify what action to take
  value?: string | number | boolean; // Optional value associated with the action
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Button variant
}

export interface VisualCardOption extends CardOption {
  color?: string; // e.g., hex code for color swatch
  fontFamily?: string; // e.g. 'Clash Grotesk', 'Inter' for font indicator
  // imageUrl?: string; // For small image previews in options
}

export interface ConfirmationDetails {
  confirmActionId: string;
  confirmLabel: string;
  cancelActionId: string;
  cancelLabel: string;
  confirmVariant?: 'danger' | 'primary';
}

export interface CardContent {
  title: string;
  description?: string;
  imageUrl?: string; // For thumbnails or illustrative images
  status?: 'success' | 'warning' | 'error' | 'info' | 'default'; // For visual cues
  options?: CardOption[];
  visualOptions?: VisualCardOption[];
  confirmation?: ConfirmationDetails;
  products?: ProductDisplayInfo[]; // For product creation confirmation
  documentName?: string; // For knowledge base update confirmation
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string; // For AI, this can be leading text if there's a card
  timestamp: Date;
  contentType: 'text' | 'card'; // New field to distinguish message types
  cardContent?: CardContent; // Optional structured content for cards
}
// --- End Card Message Types ---


// Updated DeveloperSection enum
export type DeveloperSection =
  // Store Essentials
  | 'storeInfo'       // Renamed from basicInfo
  | 'social'          // Renamed from socialMedia
  | 'support'         // New section
  | 'aiHelp'          // Renamed from aiAgent
  // Sales Management
  | 'products'
  | 'offers'          // Renamed from promotions
  | 'payments'        // Renamed from payment
  | 'insights'        // Renamed from analytics
  // System Tools
  | 'design'          // Renamed from appearance
  | 'status'          // Renamed from statusCheck
  | 'data';           // New section

// --- Toast Message Type ---
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}
// --- End Toast Message Type ---

// --- AI Model Info Type ---
export interface AIModelInfo {
  id: string;
  name: string;
  category: 'Free' | 'Paid';
  description: string;
  badge?: string; // e.g., 'Default', 'Powerful'
}
// --- End AI Model Info Type ---

// --- Service Status Types ---
export type ServiceCurrentStatus = 'Operational' | 'Degraded' | 'Offline' | 'Checking';

export interface ServiceStatusItem {
  id: string;
  name: string;
  status: ServiceCurrentStatus;
  details?: string;
  lastChecked: Date | null;
}
// --- End Service Status Types ---

// --- Support Chat Types ---
export interface SupportChatMessage {
  id: string;
  sender: 'customer' | 'storeOwner' | 'aiAgent'; // Added 'aiAgent'
  text: string;
  timestamp: Date;
  conversationId: string; 
  isReadByOwner?: boolean; 
}

export interface SupportConversation {
  id: string;
  customerId: string; // Could be a session ID or a user ID
  customerName: string; // e.g., "Customer #123" or "Valued Shopper"
  lastMessagePreview: string;
  lastMessageTimestamp: Date;
  unreadCount: number; // Number of unread messages by the store owner
  messages: SupportChatMessage[];
  isAiAssisted?: boolean; // New field: Tracks if AI is assisting this conversation
}
// --- End Support Chat Types ---
