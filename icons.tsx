import React from 'react';
import {
  IconProps as PhosphorIconProps,
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  PinterestLogo,
  SnapchatLogo,
  WhatsappLogo,
  TelegramLogo,
  RedditLogo,
  DiscordLogo,
  TwitchLogo,
  BehanceLogo,
  DribbbleLogo,
  Gear,
  ChatCircleDots,
  Code,
  Package,
  Tag,
  CreditCard,
  PaintBrush,
  DeviceMobile,
  Desktop,
  Cursor,
  UserCircle,
  User,
  Storefront,
  ArrowSquareOut,
  Link,
  LinkBreak,
  UploadSimple,
  CaretDown,
  Star,
  Eye,
  EyeSlash,
  Info,
  IdentificationCard,
  PaintBrushBroad,
  Robot,
  ShareNetwork,
  ChartBar,
  CaretDoubleLeft,
  CaretDoubleRight,
  HardDrives,
  ChatDots,
  FileText,
  ArrowUp,
  ArrowDown,
  PencilSimple,
  Trash,
  PlusCircle,
  RocketLaunch,
  Clock,
  ArrowClockwise,
  Image as PhosphorImage,
  X,
  Paperclip,
  Sparkle,
  PaperPlaneTilt,
  Check,
  FilePdf,
  File as PhosphorFile,
  CurrencyDollar,
  ShoppingCartSimple,
  UsersThree,
  TrendUp,
  MagnifyingGlass,
  Sun,
  Moon,
  SignOut,
  ChatTeardropDots,
} from 'phosphor-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcApplePay,
  faGooglePay,
  faStripe,
  faPaypal,
  faSquareFull,
  faAlipay,
  faWeixin
} from '@fortawesome/free-brands-svg-icons';

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
} from './assets/payment-icons';

// Define a common interface for our wrapped icons
// It extends SVGProps to allow passing standard SVG attributes like className
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string; // Phosphor's size prop
  weight?: PhosphorIconProps['weight'];
  color?: string; // Phosphor's color prop (though className for Tailwind is preferred)
  mirrored?: boolean; // Phosphor's mirrored prop
}

const DEFAULT_ICON_WEIGHT: PhosphorIconProps['weight'] = "regular";
// Let className (e.g., w-5 h-5) primarily control the size.
// Phosphor's default size is "1em", which scales with parent's font-size.
// If a fixed pixel size is desired without Tailwind classes, it can be passed via the `size` prop.
const FALLBACK_PHOSPHOR_SIZE = "1em"; 

// Helper to create wrapped Phosphor components
const createIcon = (PhosphorComponent: React.ElementType<PhosphorIconProps>): React.FC<IconProps> => {
  return ({ className, size, weight, color, mirrored, ...rest }) => (
    <PhosphorComponent
      size={size || FALLBACK_PHOSPHOR_SIZE}
      weight={weight || DEFAULT_ICON_WEIGHT}
      color={color}
      mirrored={mirrored}
      className={className} // Pass through className for Tailwind (e.g., text-blue-500, w-5 h-5)
      {...rest} // Pass other SVG props
    />
  );
};

// Social Icons (using Phosphor)
export const FacebookIcon = createIcon(FacebookLogo);
export const InstagramIcon = createIcon(InstagramLogo);
export const TiktokIcon = createIcon(TiktokLogo);
export const XIcon = createIcon(TwitterLogo); // TwitterLogo for X
export const LinkedInIcon = createIcon(LinkedinLogo);
export const YoutubeIcon = createIcon(YoutubeLogo);
export const PinterestIcon = createIcon(PinterestLogo);
export const SnapchatIcon = createIcon(SnapchatLogo);
export const WhatsAppIcon = createIcon(WhatsappLogo);
export const TelegramIcon = createIcon(TelegramLogo);
export const RedditIcon = createIcon(RedditLogo);
export const DiscordIcon = createIcon(DiscordLogo);
export const TwitchIcon = createIcon(TwitchLogo);
export const BehanceIcon = createIcon(BehanceLogo);
export const DribbbleIcon = createIcon(DribbbleLogo);

// --- Payment Brand Logos (Using SVG) ---
export const paymentIconClass = "w-10 h-6";

export const VisaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="visaTitle">
    <title id="visaTitle">Visa</title>
    <rect width="38" height="24" rx="3" fill="#142688"/>
    <path d="M15.5 16.5h-2.2l1.3-8.5h2.2l-1.3 8.5zm-4.5 0H8.8l1.3-8.5h2.2l-1.3 8.5zm8.9 0h-2.1l1.3-8.5h2.1l-1.3 8.5zm-4.5-6.5c-.3 0-.5.2-.5.5v1.5c0 .3.2.5.5.5h1.5c.3 0 .5-.2.5-.5v-1.5c0-.3-.2-.5-.5-.5h-1.5z" fill="#fff"/>
  </svg>
);

export const MastercardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="mastercardTitle">
    <title id="mastercardTitle">Mastercard</title>
    <rect width="38" height="24" rx="3" fill="#fff"/>
    <circle cx="15" cy="12" r="7" fill="#EB001B"/>
    <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
    <path d="M19 12c0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7 7-3.1 7-7z" fill="#FF5F00"/>
  </svg>
);

export const AmexIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="amexTitle">
    <title id="amexTitle">American Express</title>
    <rect width="38" height="24" rx="3" fill="#006FCF"/>
    <path d="M19 7.5l-3 4.5h6l-3-4.5zm-6 9l3-4.5-3-4.5h12l-3 4.5 3 4.5H13z" fill="#fff"/>
  </svg>
);

export const ApplePayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="applePayTitle">
    <title id="applePayTitle">Apple Pay</title>
    <rect width="38" height="24" rx="3" fill="#000"/>
    <path d="M19 7.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7zm0 4c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z" fill="#fff"/>
  </svg>
);

export const GooglePayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="googlePayTitle">
    <title id="googlePayTitle">Google Pay</title>
    <rect width="38" height="24" rx="3" fill="#fff"/>
    <path d="M19 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#5F6368"/>
  </svg>
);

export const StripeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="stripeTitle">
    <title id="stripeTitle">Stripe</title>
    <rect width="38" height="24" rx="3" fill="#635BFF"/>
    <path d="M13.976 9.15c-2.172-.002-3.976 1.757-3.976 3.95 0 2.193 1.804 3.95 3.976 3.95h10.048c2.172 0 3.976-1.757 3.976-3.95 0-2.193-1.804-3.95-3.976-3.95H13.976zm10.048 6.3H13.976c-1.3 0-2.386-1.053-2.386-2.35 0-1.297 1.086-2.35 2.386-2.35h10.048c1.3 0 2.386 1.053 2.386 2.35 0 1.297-1.086 2.35-2.386 2.35z" fill="#fff"/>
  </svg>
);

export const PayPalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="paypalTitle">
    <title id="paypalTitle">PayPal</title>
    <rect width="38" height="24" rx="3" fill="#003087"/>
    <path d="M23.5 7.5c-.5-.5-1.2-.8-2-.8h-3.5c-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8v7.5c0 .3.1.6.3.8.2.2.5.3.8.3h1.5c.3 0 .6-.1.8-.3.2-.2.3-.5.3-.8v-5h1.5c.3 0 .6-.1.8-.3.2-.2.3-.5.3-.8 0-.3-.1-.6-.3-.8zm-7.5 0c-.5-.5-1.2-.8-2-.8H10c-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8v7.5c0 .3.1.6.3.8.2.2.5.3.8.3h1.5c.3 0 .6-.1.8-.3.2-.2.3-.5.3-.8 0-.3-.1-.6-.3-.8z" fill="#fff"/>
  </svg>
);

export const SquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="squareTitle">
    <title id="squareTitle">Square</title>
    <rect width="38" height="24" rx="3" fill="#000"/>
    <path d="M19 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#fff"/>
  </svg>
);

export const AlipayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="alipayTitle">
    <title id="alipayTitle">Alipay</title>
    <rect width="38" height="24" rx="3" fill="#1677FF"/>
    <path d="M19 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#fff"/>
  </svg>
);

export const WeChatPayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" className={className || paymentIconClass} role="img" aria-labelledby="wechatPayTitle">
    <title id="wechatPayTitle">WeChat Pay</title>
    <rect width="38" height="24" rx="3" fill="#07C160"/>
    <path d="M19 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#fff"/>
  </svg>
);

// --- End Payment Brand Logos ---


// General UI Icons (using Phosphor)
export const SettingsIcon = createIcon(Gear);
export const ChatBubbleIcon = createIcon(ChatCircleDots); // Used for General AI Chat Mode Button
export const CodeBracketIcon = createIcon(Code);
export const PackageIcon = createIcon(Package);
export const TagIcon = createIcon(Tag);
export const CreditCardIcon = createIcon(CreditCard);
export const PaletteIcon = createIcon(PaintBrush); // Or Palette icon from Phosphor
export const DevicePhoneMobileIcon = createIcon(DeviceMobile);
export const ComputerDesktopIcon = createIcon(Desktop);
export const CursorArrowRaysIcon = createIcon(Cursor);
export const UserCircleIcon = createIcon(UserCircle);
export const UserIcon = createIcon(User);
export const StoreIcon = createIcon(Storefront);
export const ExternalLinkIcon = createIcon(ArrowSquareOut);
export const LinkIcon = createIcon(Link);
export const UnlinkIcon = createIcon(LinkBreak);
export const UploadIcon = createIcon(UploadSimple);
export const ChevronDownIcon = createIcon(CaretDown);
export const StarIcon = createIcon(Star);
export const EyeIcon = createIcon(Eye);
export const EyeSlashIcon = createIcon(EyeSlash);
export const InfoIcon = createIcon(Info);
export const NewBasicInfoIcon = createIcon(IdentificationCard);
export const NewProductsIcon = createIcon(Package); // Re-using Package, or could use PlusCircle
export const NewPromotionIcon = createIcon(Tag); // Re-using Tag, or could use Ticket
export const NewThemeIcon = createIcon(PaintBrushBroad); // Or Swatches
export const NewAIAgentIcon = createIcon(Robot); // Or Sparkle
export const ShareNetworkIcon = createIcon(ShareNetwork);
export const ChartBarSquareIcon = createIcon(ChartBar);
export const CaretDoubleLeftIcon = createIcon(CaretDoubleLeft);
export const CaretDoubleRightIcon = createIcon(CaretDoubleRight);
export const ServerIcon = createIcon(HardDrives); // Or Database
export const ChatBubbleOvalLeftEllipsisIcon = createIcon(ChatDots); // Used for Dev Mode "Support" section
export const DocumentTextIcon = createIcon(FileText);
export const ArrowUpIcon = createIcon(ArrowUp);
export const ArrowDownIcon = createIcon(ArrowDown);
export const EditIcon = createIcon(PencilSimple);
export const TrashIcon = createIcon(Trash);
export const AddCircleIcon = createIcon(PlusCircle);
export const DeployIcon = createIcon(RocketLaunch);
export const ClockIcon = createIcon(Clock);
export const ArrowPathIcon = createIcon(ArrowClockwise);
export const PhotoIcon = createIcon(PhosphorImage);
export const XMarkIcon = createIcon(X);
export const AttachFileIcon = createIcon(Paperclip);
export const AISparkleIcon = createIcon(Sparkle);
export const SendIcon = createIcon(PaperPlaneTilt);
export const CheckIcon = createIcon(Check);
export const FileImageIcon = createIcon(PhosphorImage); // Re-use Image
export const FileTextIcon = createIcon(FileText); // Re-use FileText
export const FilePdfIcon = createIcon(FilePdf);
export const GenericFileIcon = createIcon(PhosphorFile);

// --- Font Display Indicators (Kept as custom SVGs) ---
export const ClashGroteskDisplayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-4 h-4"}><text x="0" y="13" fontSize="14px" fontFamily="monospace" fontWeight="bold">Ag</text></svg>
);
export const InterDisplayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-4 h-4"}><text x="0" y="13" fontSize="14px" fontFamily="monospace" fontWeight="normal">Ag</text></svg>
);
// --- End Font Display Indicators ---

// Former Heroicons (now Phosphor)
export const CurrencyDollarIcon = createIcon(CurrencyDollar);
export const ShoppingCartIcon = createIcon(ShoppingCartSimple);
export const UserGroupIcon = createIcon(UsersThree);
export const ArrowTrendingUpIcon = createIcon(TrendUp);
export const MagnifyingGlassCircleIcon = createIcon(MagnifyingGlass); // Note: Phosphor's MagnifyingGlass is not circled by default. Use as is or wrap if circle is critical.

export const SunIcon = createIcon(Sun);
export const MoonIcon = createIcon(Moon);
export const ArrowRightOnRectangleIcon = createIcon(SignOut);

// New Icon for Store Support FAB
export const StoreSupportChatIcon = createIcon(ChatTeardropDots);


// Placeholder for any icons not yet mapped or for future use
export const IconPlaceholder: React.FC<IconProps> = ({ className, size, weight }) => (
  <Sparkle size={size || FALLBACK_PHOSPHOR_SIZE} weight={weight || "duotone"} className={className} color="orange" /> // Using Sparkle as a distinct placeholder
);