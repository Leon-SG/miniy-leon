import React from 'react';
import { StoreConfiguration, Product, PaymentProvider, PaymentProviderDetails, StoreTemplate, AppearanceSettings, TemplateCategory, PaymentMethods, ChatMessage, CardContent, AIModelInfo, ProductDisplayInfo, SupportConversation, SupportChatMessage } from './types'; // Added SupportConversation, SupportChatMessage
import {
  FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon, PinterestIcon,
  SnapchatIcon, WhatsAppIcon, TelegramIcon, RedditIcon, DiscordIcon, TwitchIcon, BehanceIcon, DribbbleIcon,
  SettingsIcon, ChatBubbleIcon, CodeBracketIcon, PackageIcon, TagIcon, CreditCardIcon, PaletteIcon,
  DevicePhoneMobileIcon, ComputerDesktopIcon, CursorArrowRaysIcon, UserCircleIcon, UserIcon, StoreIcon,
  ExternalLinkIcon, LinkIcon, UnlinkIcon, UploadIcon, ChevronDownIcon, StarIcon, EyeIcon, EyeSlashIcon,
  InfoIcon, NewBasicInfoIcon, NewProductsIcon, NewPromotionIcon, NewThemeIcon, NewAIAgentIcon,
  ShareNetworkIcon, ChartBarSquareIcon, CaretDoubleLeftIcon, CaretDoubleRightIcon, ServerIcon,
  ChatBubbleOvalLeftEllipsisIcon, DocumentTextIcon, ArrowUpIcon, ArrowDownIcon, EditIcon, TrashIcon,
  AddCircleIcon, DeployIcon, ClockIcon, ArrowPathIcon, PhotoIcon, XMarkIcon, AttachFileIcon, AISparkleIcon,
  SendIcon, CheckIcon, FileImageIcon, FileTextIcon, FilePdfIcon, GenericFileIcon,
  ClashGroteskDisplayIcon, InterDisplayIcon,
  CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon, ArrowTrendingUpIcon, MagnifyingGlassCircleIcon,
  SunIcon, MoonIcon, ArrowRightOnRectangleIcon,
  StoreSupportChatIcon
} from './icons';

// Import payment icons from assets
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  ApplePayIcon,
  GooglePayIcon,
  StripeIcon,
  PayPalIcon,
  SquareIcon,
  AlipayIcon,
  WeChatPayIcon,
} from './payment-icons';

// Re-export all imported icons
export { 
  FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon, PinterestIcon,
  SnapchatIcon, WhatsAppIcon, TelegramIcon, RedditIcon, DiscordIcon, TwitchIcon, BehanceIcon, DribbbleIcon,
  VisaIcon, MastercardIcon, AmexIcon, ApplePayIcon, GooglePayIcon,
  StripeIcon, PayPalIcon, SquareIcon, AlipayIcon, WeChatPayIcon,
  SettingsIcon, ChatBubbleIcon, CodeBracketIcon, PackageIcon, TagIcon, CreditCardIcon, PaletteIcon,
  DevicePhoneMobileIcon, ComputerDesktopIcon, CursorArrowRaysIcon, UserCircleIcon, UserIcon, StoreIcon,
  ExternalLinkIcon, LinkIcon, UnlinkIcon, UploadIcon, ChevronDownIcon, StarIcon, EyeIcon, EyeSlashIcon,
  InfoIcon, NewBasicInfoIcon, NewProductsIcon, NewPromotionIcon, NewThemeIcon, NewAIAgentIcon,
  ShareNetworkIcon, ChartBarSquareIcon, CaretDoubleLeftIcon, CaretDoubleRightIcon, ServerIcon,
  ChatBubbleOvalLeftEllipsisIcon, DocumentTextIcon, ArrowUpIcon, ArrowDownIcon, EditIcon, TrashIcon,
  AddCircleIcon, DeployIcon, ClockIcon, ArrowPathIcon, PhotoIcon, XMarkIcon, AttachFileIcon, AISparkleIcon,
  SendIcon, CheckIcon, FileImageIcon, FileTextIcon, FilePdfIcon, GenericFileIcon,
  ClashGroteskDisplayIcon, InterDisplayIcon,
  CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon, ArrowTrendingUpIcon, MagnifyingGlassCircleIcon,
  SunIcon, MoonIcon, ArrowRightOnRectangleIcon,
  StoreSupportChatIcon
};


const defaultDisconnectedStatus: PaymentProviderDetails = { status: 'disconnected' };

export const INITIAL_STORE_CONFIG: StoreConfiguration = {
  basicInfo: {
    storeName: "Pixel & Play Emporium",
    tagline: "Your Portal to Cool Stuffs & Digital Dreams!",
    logoUrl: "https://picsum.photos/seed/pixelplay_logo/200/200",
    storeEmail: "hello@pixelplay.store",
    storePhoneNumber: "+1-555-0101",
    storeAddress: "404 Gamer's Glade, Suite G, Tech City, CA 90220",
    country: "USA",
    currency: "USD",
    timezone: "America/Los_Angeles",
    industry: "Gaming & Digital Collectibles",
    legalNameOfBusiness: "PixelPlay LLC",
    facebookPageUrl: "https://facebook.com/pixelplaystore",
    instagramHandle: "pixelplay.vibes",
    tiktokHandle: "pixelplayofficial",
    xHandle: "PixelPlayX",
    linkedinPageUrl: "https://linkedin.com/company/pixelplay",
    youtubeChannelUrl: "https://youtube.com/@PixelPlayHighlights",
    pinterestProfileUrl: "https://pinterest.com/pixelplay",
    snapchatUsername: "",
    whatsappNumber: "",
    telegramUsername: "",
    redditProfileUrl: "",
    discordServerInviteUrl: "",
    twitchChannelUrl: "",
    behanceProfileUrl: "",
    dribbbleProfileUrl: "",
    metaDescription: "Level up your lifestyle with unique finds at Pixel & Play Emporium! From gaming gear to digital art, we've got your vibe covered.",
    seoTitle: "Pixel & Play Emporium | Gamer Gear, Digital Art & Trendy Finds",
    focusKeywords: "gaming, digital art, streetwear, cool gadgets, collectibles, pixelplay",
    storeWelcomeMessage: "🌟 Welcome to our store! Discover amazing products and enjoy your shopping experience. Let us know if you need anything! 🌟",
  },
  products: [
    { 
      id: '1', 
      name: "Eco-Friendly Water Bottle", 
      description: "Stay hydrated with this stylish and sustainable water bottle. Made from recycled materials and BPA-free. Perfect for on-the-go gamers and creators.", 
      price: 25.99, 
      imageUrl: "https://picsum.photos/seed/ecobottle_pixel/400/300", 
      category: "Lifestyle", 
      sku: "PIXEL-WB-ECO-001", 
      stockQuantity: 120, 
      tags: ["eco-friendly", "reusable", "water bottle", "sustainable", "health", "merch"], 
      isFeatured: true, 
      isPublished: true 
    },
    { 
      id: '2', 
      name: "Wireless Bluetooth Headphones - Nebula Edition", 
      description: "Immersive sound for your gaming sagas or daily commute. Nebula purple finish, long-lasting battery, and crisp audio quality.",
      price: 89.50, 
      imageUrl: "https://picsum.photos/seed/headphones_pixel/400/300", 
      category: "Electronics", 
      sku: "PIXEL-HP-WLN-002", 
      stockQuantity: 65, 
      tags: ["audio", "wireless", "tech", "gadgets", "gaming gear", "nebula"], 
      isFeatured: false, 
      isPublished: true 
    },
    { 
      id: '3', 
      name: "Organic Cotton Tote Bag - 'Glitch Art' Design (DRAFT)", 
      description: "A versatile and durable tote bag made from 100% organic cotton, featuring a unique glitch art print. Perfect for carrying your essentials. (This product is currently a draft).", 
      price: 22.75, 
      imageUrl: "https://picsum.photos/seed/glitchtote_pixel/400/300", 
      category: "Accessories", 
      sku: "PIXEL-TB-ORGGLITCH-003", 
      stockQuantity: 180, 
      tags: ["organic", "cotton", "tote bag", "glitch art", "fashion", "eco"], 
      isFeatured: false, 
      isPublished: false 
    },
    { 
      id: 'prod_gamer_hoodie', 
      name: "Retro Gamer Hoodie - Pixel Pro", 
      description: "Level up your style with this comfy retro gamer hoodie. Pixel art 'Pro Gamer' design, 100% premium cotton comfort. Limited edition!", 
      price: 59.99, 
      imageUrl: "https://picsum.photos/seed/gamerhoodie_pixel/400/300", 
      category: "Apparel", 
      sku: "PIXEL-HOODIE-RETRO-004", 
      stockQuantity: 90, 
      tags: ["gaming", "hoodie", "retro", "pixel art", "fashion", "streetwear"], 
      isFeatured: false, 
      isPublished: true 
    },
    { 
      id: 'prod_neon_deskmat', 
      name: "Neon Dreams Desk Mat XL", 
      description: "Light up your gaming or work setup with this vibrant neon dreams desk mat. Ultra-smooth surface for ultimate mouse control and precision. RGB-ish vibes!", 
      price: 29.50, 
      imageUrl: "https://picsum.photos/seed/neondeskmat_pixel/400/300", 
      category: "Accessories", 
      sku: "PIXEL-DESKMAT-NEON-005", 
      stockQuantity: 110, 
      tags: ["desk mat", "gaming setup", "neon", "office", "pc accessories", "RGB"], 
      isFeatured: true, 
      isPublished: true 
    },
    { 
      id: 'prod_sticker_pack', 
      name: "Digital Sticker Pack Vol. 1 - Cyber Critters", 
      description: "A collection of 50 unique, high-res digital stickers featuring cybernetic critters. Perfect for your notes, digital planners, or social media. Instant download!", 
      price: 4.99, 
      imageUrl: "https://picsum.photos/seed/digitalstickers_pixel/400/300", 
      category: "Digital Goods", 
      sku: "PIXEL-STICKER-CYBER-006", 
      stockQuantity: 9999, // Digital product
      tags: ["digital art", "stickers", "planner", "downloadable", "cyberpunk"], 
      isFeatured: false, 
      isPublished: true 
    },
    { 
      id: 'prod_mystery_figure', 
      name: "Mystery Collectible Figure (Series Alpha)", 
      description: "Unbox the excitement! One random highly-detailed collectible figure from our exclusive Series Alpha. Which one will you get? Trade with friends!", 
      price: 12.00, 
      imageUrl: "https://picsum.photos/seed/mysteryfigure_pixel/400/300", 
      category: "Collectibles", 
      sku: "PIXEL-FIGURE-ALPHA-007", 
      stockQuantity: 250, 
      tags: ["mystery box", "collectible", "toys", "limited edition", "unboxing"], 
      isFeatured: true, 
      isPublished: true 
    },
  ],
  promotions: [
    { 
      id: 'promo1', 
      code: "MINIY10", 
      description: "10% off on all Miniy items for new customers. Welcome aboard!", 
      discountPercentage: 10, 
      isActive: true 
    },
    { 
      id: 'promo2', 
      code: "SUMMER20SALE", 
      description: "20% off on all summer collection items. (This promotion is currently inactive).", 
      discountPercentage: 20, 
      isActive: false 
    },
    { 
      id: 'promo_pixelpower', 
      code: "PIXELPOWER15", 
      description: "Get 15% OFF your first order! Welcome to the Emporium.", 
      discountPercentage: 15, 
      isActive: true 
    },
    { 
      id: 'promo_digitaldeal', 
      code: "DIGIDEAL50", 
      description: "50% OFF all Digital Sticker Packs this week! Grab 'em now.", 
      discountPercentage: 50, 
      isActive: true 
    }
  ],
  paymentMethods: {
    stripe: { 
      status: 'connected', 
      accountId: 'acct_mock_stripe_1B23tgY', 
      lastConnected: new Date(Date.now() - 86400000 * 7).toISOString() 
    },
    paypal: { 
      status: 'connected', 
      accountId: 'mock-paypal-merchant-ABC001', 
      lastConnected: new Date(Date.now() - 86400000 * 2).toISOString() 
    },
    square: { 
      status: 'error', 
      errorMessage: 'Failed to verify bank account details. Please update your information in Square Dashboard.' 
    },
    alipay: { ...defaultDisconnectedStatus },
    wechatPay: { ...defaultDisconnectedStatus },
    visa: { status: 'connected' }, 
    mastercard: { status: 'connected' },
    amex: { status: 'disconnected' },
    applepay: { status: 'disconnected' },
    googlepay: { status: 'disconnected' },
  },
  appearance: { 
    primaryColor: '#4338CA', 
    fontFamily: 'Proxima Nova', 
    darkMode: false,
  },
  aiCustomerService: {
    isEnabled: false,
    agentName: 'PixelPal',
    systemPrompt: 'You are PixelPal, a friendly and super helpful shopping assistant for Pixel & Play Emporium. Your primary goal is to help customers find cool gaming gear, digital art, and trendy collectibles. Be enthusiastic, use emojis occasionally, and provide clear answers. If you cannot answer a question, politely say you will find a human teammate to help.',
    welcomeMessage: 'Hey there, gamer! 👋 I\'m PixelPal. What awesome stuff are you looking for today? ✨',
    keyBusinessInfo: 'Pixel & Play Emporium offers unique gaming accessories, digital art, and collectibles. We ship worldwide within 3-5 business days. Returns are accepted within 30 days for most items in original condition (digital goods are non-refundable). Contact us at support@pixelplay.example.com for any issues.',
    humanHandoffInstructions: "Hmm, that's a tricky one! Let me connect you with one of our human experts. Please email us at help@pixelplay.example.com and they'll get back to you ASAP!",
    conversationStarters: ["What's new?", "Tell me about shipping", "Any sales on hoodies?", "Got any game recommendations?"],
  },
  supportConversations: [], // Initialize with empty array
};

export const GEMINI_MODEL_NAME = 'claude-3-7-sonnet-20250219';

export const AVAILABLE_AI_MODELS: AIModelInfo[] = [
  { 
    id: 'claude-3-7-sonnet-20250219', 
    name: 'Claude 3.7 Sonnet', 
    category: 'Free', 
    description: '强大的 AI 助手，擅长多语言对话和结构化推理。', 
    badge: 'Default' 
  },
  { 
    id: 'max-placeholder', 
    name: 'Max', 
    category: 'Paid', 
    description: '即将推出：最强大的 AI 模型，支持最复杂的任务。', 
    badge: 'Silver' 
  },
  { 
    id: 'pro-placeholder', 
    name: 'Pro', 
    category: 'Paid', 
    description: '即将推出：专业级 AI 模型，适合高级分析和创意任务。', 
    badge: 'Gold' 
  }
];

export const COUNTRIES = [
  { value: 'USA', label: 'United States' },
  { value: 'CAN', label: 'Canada' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'AUS', label: 'Australia' },
  { value: 'DEU', label: 'Germany' },
  { value: 'JPN', label: 'Japan' },
];

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const SERVER_PLANS = [
  { value: 'starter', label: 'Starter (up to 1,000 visits/month)' },
  { value: 'growth', label: 'Growth (up to 10,000 visits/month)' },
  { value: 'pro', label: 'Pro (up to 100,000 visits/month)' },
  { value: 'enterprise', label: 'Enterprise (Custom)' },
];

export const DEPLOYMENT_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
];

export const BACKUP_FREQUENCIES = [
  { value: 'daily', label: 'Daily Backups' },
  { value: 'weekly', label: 'Weekly Backups' },
  { value: 'monthly', label: 'Monthly Backups' },
  { value: 'none', label: 'No Automated Backups' },
];

const DEFAULT_APPEARANCE: AppearanceSettings = {
  primaryColor: '#4338CA', 
  fontFamily: 'Proxima Nova',
  darkMode: false,
};

const MINIMALIST_TEMPLATE: StoreTemplate = {
  id: 'template_minimalist',
  name: 'Minimalist Chic',
  description: 'A clean, modern design focusing on product imagery and readability. Uses Inter font.',
  thumbnailUrl: 'https://picsum.photos/seed/minimal_template/600/400',
  category: 'Minimalist',
  appearance: { primaryColor: '#4B5563', fontFamily: 'Inter', darkMode: false },
  defaultBasicInfoOverrides: { storeName: 'Chic Finds', tagline: 'Curated essentials for modern living.', industry: 'Fashion Accessories' },
};

const VIBRANT_TEMPLATE: StoreTemplate = {
  id: 'template_vibrant',
  name: 'Vibrant Pop',
  description: 'A bold and colorful template perfect for art, crafts, or youth-oriented brands. Uses Clash Grotesk font.',
  thumbnailUrl: 'https://picsum.photos/seed/vibrant_template/600/400',
  category: 'Arts & Crafts',
  appearance: { primaryColor: '#EC4899', fontFamily: 'Clash Grotesk', darkMode: false },
  defaultBasicInfoOverrides: { storeName: 'Pop Art Store', tagline: 'Unleash Your Inner Artist!', industry: 'Arts & Crafts' },
};

const DARK_MODE_TEMPLATE: StoreTemplate = {
  id: 'template_dark',
  name: 'Elegant Dark',
  description: 'A sophisticated dark theme that makes product colors pop. Ideal for luxury goods. Uses Proxima Nova.',
  thumbnailUrl: 'https://picsum.photos/seed/dark_template/600/400',
  category: 'Electronics',
  appearance: { primaryColor: '#FBBF24', fontFamily: 'Proxima Nova', darkMode: true },
   defaultBasicInfoOverrides: { storeName: 'Lux Tech', tagline: 'Experience the Future, Today.', industry: 'Electronics' },
};

const ECO_FRIENDLY_TEMPLATE: StoreTemplate = {
  id: 'template_eco',
  name: 'Green Earth',
  description: 'A natural and earthy theme, perfect for sustainable and organic products. Uses Inter font.',
  thumbnailUrl: 'https://picsum.photos/seed/eco_template/600/400',
  category: 'Home Goods',
  appearance: { primaryColor: '#10B981', fontFamily: 'Inter', darkMode: false },
  defaultBasicInfoOverrides: { storeName: 'Green Living Co.', tagline: 'Sustainable Choices for a Better Planet.', industry: 'Home Goods' },
};

const NEON_NIGHTS_TEMPLATE: StoreTemplate = {
  id: 'template_neon_nights',
  name: 'Neon Nights',
  description: "A vibrant dark theme with glowing neon accents, perfect for gaming, streetwear, or edgy brands.",
  thumbnailUrl: 'https://picsum.photos/seed/neon_nights_template/600/400',
  category: 'Electronics', 
  appearance: { primaryColor: '#00FFFF', fontFamily: 'Clash Grotesk', darkMode: true },
  defaultBasicInfoOverrides: { storeName: 'Neon Alibi', tagline: 'Glow Up Your Game.', industry: 'Gaming & Streetwear' },
};

const PASTEL_DREAMS_TEMPLATE: StoreTemplate = {
  id: 'template_pastel_dreams',
  name: 'Pastel Dreams',
  description: "Soft, dreamy pastels create a gentle and inviting atmosphere. Ideal for handmade crafts, cute accessories, or wellness products.",
  thumbnailUrl: 'https://picsum.photos/seed/pastel_dreams_template/600/400',
  category: 'Arts & Crafts',
  appearance: { primaryColor: '#E6E6FA', fontFamily: 'Inter', darkMode: false }, 
  defaultBasicInfoOverrides: { storeName: 'Cloud Candy', tagline: 'Sweet & Soft Creations.', industry: 'Handmade & Kawaii' },
};

const GRADIENT_GROOVE_TEMPLATE: StoreTemplate = {
  id: 'template_gradient_groove',
  name: 'Gradient Groove',
  description: "Dynamic and modern, this template uses a striking primary color inspired by popular gradients. Great for digital products or creative studios.",
  thumbnailUrl: 'https://picsum.photos/seed/gradient_groove_template/600/400',
  category: 'Digital Products',
  appearance: { primaryColor: '#833AB4', fontFamily: 'Proxima Nova', darkMode: false }, 
  defaultBasicInfoOverrides: { storeName: 'Chroma Shift', tagline: 'Colors in Motion.', industry: 'Digital Art & Design' },
};

const Y2K_BLAST_TEMPLATE: StoreTemplate = {
  id: 'template_y2k_blast',
  name: 'Y2K Blast',
  description: "A fun, retro-futuristic theme with bright colors and a touch of nostalgia. Perfect for Y2K fashion, quirky brands, or anything that pops.",
  thumbnailUrl: 'https://picsum.photos/seed/y2k_blast_template/600/400',
  category: 'Fashion',
  appearance: { primaryColor: '#FF1493', fontFamily: 'Clash Grotesk', darkMode: false }, 
  defaultBasicInfoOverrides: { storeName: 'ReplayRealm', tagline: 'Your Y2K Throwback Central.', industry: 'Retro Fashion & Collectibles' },
};

const URBAN_MINIMAL_TEMPLATE: StoreTemplate = {
  id: 'template_urban_minimal',
  name: 'Urban Minimal',
  description: "A sleek, minimalist dark theme with a sharp accent color. Ideal for modern tech, photography, or sophisticated brands.",
  thumbnailUrl: 'https://picsum.photos/seed/urban_minimal_template/600/400',
  category: 'Minimalist',
  appearance: { primaryColor: '#FDE047', fontFamily: 'Inter', darkMode: true }, 
  defaultBasicInfoOverrides: { storeName: 'Studio Kōdo', tagline: 'Design. Distilled.', industry: 'Tech & Design' },
};

export const STORE_TEMPLATES: StoreTemplate[] = [
  {...MINIMALIST_TEMPLATE, id: 'default', name: 'Default Theme (Inter)', appearance: DEFAULT_APPEARANCE, defaultBasicInfoOverrides: { storeName: 'My Miniy Store', tagline: 'Your amazing products, online!', industry: 'General' } },
  MINIMALIST_TEMPLATE,
  VIBRANT_TEMPLATE,
  DARK_MODE_TEMPLATE,
  ECO_FRIENDLY_TEMPLATE,
  NEON_NIGHTS_TEMPLATE,
  PASTEL_DREAMS_TEMPLATE,
  GRADIENT_GROOVE_TEMPLATE,
  Y2K_BLAST_TEMPLATE,
  URBAN_MINIMAL_TEMPLATE,
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'msg1_welcome', sender: 'ai', text: "Welcome to Miniy! I'm your AI assistant. How can I help you build your store today?", timestamp: new Date(Date.now() - 60000 * 10), contentType: 'text' },
  { id: 'msg2_user_name_change_req', sender: 'user', text: "Hi! I want to change my store name to 'Crafty Corner'.", timestamp: new Date(Date.now() - 60000 * 9), contentType: 'text' },
  { 
    id: 'msg3_ai_name_change_confirm', 
    sender: 'ai', 
    text: "Okay, I've updated your store name to 'Crafty Corner'. You can see it in the preview!", 
    timestamp: new Date(Date.now() - 60000 * 8), 
    contentType: 'card',
    cardContent: {
      title: "Store Name Updated",
      description: "Your store name is now 'Crafty Corner'.",
      status: 'success',
      options: [
        { label: "Undo Change", actionId: "undo_store_name_change", variant: 'ghost' },
        { label: "What's next?", actionId: "ai_suggest_next_step", variant: 'secondary' }
      ]
    } as CardContent,
  },
  { 
    id: 'msg4_ai_logo_prompt', 
    sender: 'ai', 
    text: "I noticed your store doesn't have a logo yet. A logo helps build your brand identity!",
    timestamp: new Date(Date.now() - 60000 * 7), 
    contentType: 'card',
    cardContent: {
      title: "Upload Store Logo?",
      description: "A unique logo makes your store memorable. Would you like to upload one now?",
      status: 'warning', 
      imageUrl: "https://picsum.photos/seed/miniy_logo_placeholder/300/150",
      options: [
        { label: "Upload Logo Now", actionId: "trigger_logo_upload_flow", variant: 'primary' },
        { label: "Skip for Now", actionId: "skip_logo_upload", variant: 'ghost' }
      ]
    } as CardContent,
  },
   { id: 'msg5_user_product_req', sender: 'user', text: "Okay, let's add a new product.", timestamp: new Date(Date.now() - 60000 * 6), contentType: 'text' },
  { 
    id: 'msg6_ai_product_suggestion', 
    sender: 'ai', 
    text: "Great! Based on current trends for 'Crafty Corner', how about adding this?",
    timestamp: new Date(Date.now() - 60000 * 5), 
    contentType: 'card',
    cardContent: {
      title: "Product Suggestion: Handcrafted Leather Wallets",
      description: "High-quality, artisanal leather wallets could be a great addition to your crafty theme. They are currently popular.",
      status: 'info',
      imageUrl: "https://picsum.photos/seed/leather_wallet_suggestion/400/250",
      options: [
        { label: "Add this Product", actionId: "add_suggested_product_wallet", variant: 'primary' },
        { label: "Customize Details", actionId: "customize_suggested_product_wallet", variant: 'secondary' },
        { label: "Not Interested", actionId: "reject_product_suggestion", variant: 'ghost' }
      ]
    } as CardContent,
  },
  { id: 'msg7_user_activate_promo', sender: 'user', text: "Activate the 'SUMMER20SALE' promotion.", timestamp: new Date(Date.now() - 60000 * 4), contentType: 'text' },
  { 
    id: 'msg8_ai_promo_activated', 
    sender: 'ai', 
    text: "Done!",
    timestamp: new Date(Date.now() - 60000 * 3.5), 
    contentType: 'card',
    cardContent: {
      title: "Promotion Activated!",
      description: "The promotion 'SUMMER20SALE' is now active and available for your customers.",
      status: 'success',
      options: [
        { label: "View All Promotions", actionId: "view_all_promotions", variant: 'secondary' },
        { label: "Create Another Promotion", actionId: "create_new_promotion", variant: 'ghost' }
      ]
    } as CardContent,
  },
  { 
    id: 'msg9_ai_theme_choice_intro', 
    sender: 'ai', 
    text: "To further customize your store's look, you can choose a theme. Here are some popular options:", 
    timestamp: new Date(Date.now() - 60000 * 3), 
    contentType: 'card',
    cardContent: {
      title: "Choose a Theme Style",
      description: "Select a theme to instantly apply a new look and feel to your store preview.",
      imageUrl: "https://picsum.photos/seed/miniy_themes_banner/400/150", 
      status: 'info', 
      visualOptions: [
        { label: "Minimalist Chic (Inter font)", actionId: "apply_theme_minimalist", value: "minimalist_theme_values", fontFamily: "Inter" },
        { label: "Vibrant Pop (Clash Grotesk font)", actionId: "apply_theme_vibrant", value: "vibrant_theme_values", fontFamily: "Clash Grotesk" },
        { label: "Elegant Dark (Proxima Nova font)", actionId: "apply_theme_dark", value: "dark_theme_values", fontFamily: "Proxima Nova" },
      ],
    } as CardContent,
  },
  { id: 'msg10_user_payment_req', sender: 'user', text: "I need to set up my payment methods.", timestamp: new Date(Date.now() - 60000 * 2), contentType: 'text' },
  { 
    id: 'msg11_ai_payment_clarification', 
    sender: 'ai', 
    text: "Sure! Which payment provider would you like to configure first?",
    timestamp: new Date(Date.now() - 60000 * 1.5), 
    contentType: 'card',
    cardContent: {
      title: "Configure Payment Provider",
      description: "Select a provider to connect or manage its settings.",
      status: 'default',
      options: [
        { label: "Connect Stripe", actionId: "connect_stripe_provider", variant: 'primary' },
        { label: "Manage PayPal", actionId: "manage_paypal_provider", variant: 'secondary' },
        { label: "Connect Square", actionId: "connect_square_provider", variant: 'secondary' }
      ]
    } as CardContent,
  },
  { id: 'msg12_user_delete_req', sender: 'user', text: "Delete the 'Old T-Shirt' product if it exists.", timestamp: new Date(Date.now() - 60000 * 1), contentType: 'text' },
  { 
    id: 'msg13_ai_delete_confirm', 
    sender: 'ai', 
    text: "Just to confirm:",
    timestamp: new Date(Date.now() - 60000 * 0.5), 
    contentType: 'card',
    cardContent: {
      title: "Confirm Product Deletion",
      description: "Are you sure you want to permanently delete the product 'Old T-Shirt'? This action cannot be undone.",
      status: 'warning',
      imageUrl: "https://picsum.photos/seed/miniy_trash_can/300/100",
      confirmation: {
        confirmActionId: "confirm_delete_product_old_tshirt",
        confirmLabel: "Yes, Delete It",
        confirmVariant: 'danger',
        cancelActionId: "cancel_delete_product_action",
        cancelLabel: "No, Keep It"
      }
    } as CardContent,
  },
  { 
    id: 'msg14_ai_pro_tip', 
    sender: 'ai', 
    text: "Pro Tip:",
    timestamp: new Date(Date.now() - 30000), 
    contentType: 'card',
    cardContent: {
      title: "Boost Sales with High-Quality Images!",
      description: "Using clear, professional product images can significantly increase customer trust and conversion rates. Consider investing in good photography!",
      status: 'info',
      imageUrl: "https://picsum.photos/seed/miniy_photo_tip/300/120",
      options: [
        { label: "Learn More About Product Photography", actionId: "learn_product_photography", variant: 'secondary' },
        { label: "Got it, Thanks!", actionId: "acknowledge_tip", variant: 'ghost' }
      ]
    } as CardContent,
  },
  {
    id: 'msg15_ai_product_created_confirm',
    sender: 'ai',
    text: "I've created a new product based on the image and details you provided!",
    timestamp: new Date(Date.now() - 25000),
    contentType: 'card',
    cardContent: {
      title: "Product Created!",
      description: "Here's a summary of the new product added to your store:",
      status: 'success',
      products: [
        { id: 'ai_prod_123', name: 'AI Generated "Cool Kicks"', price: 79.99, imageUrl: 'https://picsum.photos/seed/coolkicks_ai/200/200' } as ProductDisplayInfo,
      ],
      options: [
        { label: 'View in Product Manager', actionId: 'view_product_manager_item', value: 'ai_prod_123', variant: 'secondary' },
        { label: 'Add Another Product', actionId: 'add_another_product_flow', variant: 'primary' },
      ],
    } as CardContent,
  },
  {
    id: 'msg16_ai_kb_updated_confirm',
    sender: 'ai',
    text: "Understood! I've processed the document.",
    timestamp: new Date(Date.now() - 20000),
    contentType: 'card',
    cardContent: {
      title: "Knowledge Base Updated",
      documentName: "StoreFAQs_v2.pdf",
      description: "I've successfully processed 'StoreFAQs_v2.pdf' and updated the AI Agent's knowledge base.",
      status: 'success',
      options: [
        { label: 'Test AI Agent', actionId: 'test_ai_agent_kb' , variant: 'secondary' },
        { label: 'Configure AI Agent', actionId: 'nav_to_ai_agent_settings', variant: 'ghost' },
        { label: 'Great, Thanks!', actionId: 'acknowledge_kb_update', variant: 'primary' },
      ],
    } as CardContent,
  },
  { 
    id: 'msg17_ai_generic_error_example', 
    sender: 'ai', 
    text: "Oh no, something went wrong!",
    timestamp: new Date(Date.now() - 15000), 
    contentType: 'card',
    cardContent: {
      title: "Operation Failed",
      description: "We couldn't complete your last request due to an unexpected issue. Please try again later or contact support if the problem persists.",
      status: 'error',
      imageUrl: "https://picsum.photos/seed/miniy_error_oops/300/100",
      options: [
        { label: "Try Again", actionId: "retry_last_operation_generic", variant: 'secondary' },
        { label: "Contact Support", actionId: "contact_support_generic", variant: 'ghost' }
      ]
    } as CardContent,
  },
];

export const SORT_OPTIONS = [
  { value: 'default', label: 'Sort by Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

export const SUPPORTED_PAYMENT_PROVIDERS = [
  { key: 'stripe' as PaymentProvider, name: 'Stripe', description: 'Industry-leading payment processing for online businesses.', Icon: StripeIcon },
  { key: 'paypal' as PaymentProvider, name: 'PayPal', description: 'Widely recognized and trusted online payment system.', Icon: PayPalIcon },
  { key: 'square' as PaymentProvider, name: 'Square', description: 'Payment solutions for businesses of all sizes.', Icon: SquareIcon },
  { key: 'alipay' as PaymentProvider, name: 'Alipay', description: 'Popular digital wallet in China and other regions.', Icon: AlipayIcon },
  { key: 'wechatPay' as PaymentProvider, name: 'WeChat Pay', description: 'Widely used mobile payment in China.', Icon: WeChatPayIcon },
  { key: 'visa' as PaymentProvider, name: 'Visa Direct', description: 'Accept Visa cards directly.', Icon: VisaIcon },
  { key: 'mastercard' as PaymentProvider, name: 'Mastercard Direct', description: 'Accept Mastercard cards directly.', Icon: MastercardIcon },
  { key: 'amex' as PaymentProvider, name: 'American Express', description: 'Accept Amex cards directly.', Icon: AmexIcon },
  { key: 'applepay' as PaymentProvider, name: 'Apple Pay', description: 'Enable Apple Pay for quick checkouts.', Icon: ApplePayIcon },
  { key: 'googlepay' as PaymentProvider, name: 'Google Pay', description: 'Enable Google Pay for easy payments.', Icon: GooglePayIcon },
];


// Initial mock data for Support Conversations
export const INITIAL_SUPPORT_CONVERSATIONS: SupportConversation[] = [
  {
    id: 'conv_1',
    customerId: 'cust_abc_123',
    customerName: 'Alex Rider',
    lastMessagePreview: "Okay, thanks for the update on the shipping!",
    lastMessageTimestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    unreadCount: 0,
    messages: [
      { id: 'msg_s1_1', conversationId: 'conv_1', sender: 'customer', text: "Hi, I have a question about my recent order #ORD12345.", timestamp: new Date(Date.now() - 3600000 * 2.5), isReadByOwner: true },
      { id: 'msg_s1_2', conversationId: 'conv_1', sender: 'storeOwner', text: "Hello Alex, I can help with that. What's your question regarding order #ORD12345?", timestamp: new Date(Date.now() - 3600000 * 2.2), isReadByOwner: true },
      { id: 'msg_s1_3', conversationId: 'conv_1', sender: 'customer', text: "I was wondering about the estimated delivery date.", timestamp: new Date(Date.now() - 3600000 * 2.1), isReadByOwner: true },
      { id: 'msg_s1_4', conversationId: 'conv_1', sender: 'storeOwner', text: "Your order is currently scheduled for delivery by tomorrow end of day. You can track it here: [mock_tracking_link]", timestamp: new Date(Date.now() - 3600000 * 2.05), isReadByOwner: true },
      { id: 'msg_s1_5', conversationId: 'conv_1', sender: 'customer', text: "Okay, thanks for the update on the shipping!", timestamp: new Date(Date.now() - 3600000 * 2), isReadByOwner: true },
    ],
  },
  {
    id: 'conv_2',
    customerId: 'cust_xyz_789',
    customerName: 'Jamie Fox',
    lastMessagePreview: "Can I return the 'Neon Dreams Desk Mat XL'?",
    lastMessageTimestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    unreadCount: 1,
    messages: [
      { id: 'msg_s2_1', conversationId: 'conv_2', sender: 'customer', text: "Hello, I'd like to inquire about the return policy.", timestamp: new Date(Date.now() - 3600000 * 5.2), isReadByOwner: true },
      { id: 'msg_s2_2', conversationId: 'conv_2', sender: 'customer', text: "Can I return the 'Neon Dreams Desk Mat XL'?", timestamp: new Date(Date.now() - 3600000 * 5), isReadByOwner: false },
    ],
  },
  {
    id: 'conv_3',
    customerId: 'cust_pqr_456',
    customerName: 'Customer #77812',
    lastMessagePreview: "I love the Retro Gamer Hoodie! Do you have it in XXL?",
    lastMessageTimestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
    unreadCount: 0,
    messages: [
      { id: 'msg_s3_1', conversationId: 'conv_3', sender: 'customer', text: "I love the Retro Gamer Hoodie! Do you have it in XXL?", timestamp: new Date(Date.now() - 86400000 * 1), isReadByOwner: true },
      { id: 'msg_s3_2', conversationId: 'conv_3', sender: 'storeOwner', text: "Thanks for reaching out! Let me check the stock for the XXL size. One moment...", timestamp: new Date(Date.now() - 86400000 * 0.9), isReadByOwner: true },
      { id: 'msg_s3_3', conversationId: 'conv_3', sender: 'storeOwner', text: "Yes, we do have a few XXL Retro Gamer Hoodies left! Would you like to order one?", timestamp: new Date(Date.now() - 86400000 * 0.85), isReadByOwner: true },
    ],
  },
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CNY', label: 'CNY (¥)' },
  { value: 'HKD', label: 'HKD (HK$)' },
  { value: 'TWD', label: 'TWD (NT$)' },
  { value: 'KRW', label: 'KRW (₩)' },
  { value: 'SGD', label: 'SGD (S$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'CHF', label: 'CHF (Fr)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'RUB', label: 'RUB (₽)' },
  { value: 'MXN', label: 'MXN (Mex$)' },
  { value: 'THB', label: 'THB (฿)' },
  { value: 'MYR', label: 'MYR (RM)' },
  { value: 'IDR', label: 'IDR (Rp)' },
  { value: 'PHP', label: 'PHP (₱)' }
];
