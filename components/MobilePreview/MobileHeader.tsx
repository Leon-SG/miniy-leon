import React from 'react';
import { BasicInfo, AppearanceSettings } from '../../types';
import { 
  FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon, PinterestIcon, 
  SnapchatIcon, WhatsAppIcon, TelegramIcon, RedditIcon, DiscordIcon, TwitchIcon, BehanceIcon, DribbbleIcon,
  XMarkIcon // Import XMarkIcon for clearing search
} from '../../constants'; 
import { isColorDark } from '../MobilePreview';

interface MobileHeaderProps {
  basicInfo: BasicInfo;
  appearance: AppearanceSettings;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null; 
  cartItemCount: number;
  onToggleCartModal: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  isSearchActive: boolean;
  onToggleSearchActive: (active: boolean) => void;
}

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


const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  basicInfo, 
  appearance, 
  isElementSelectionActive, 
  onElementSelected,
  activelySelectedPreviewElementId,
  cartItemCount,
  onToggleCartModal,
  searchTerm,
  onSearchTermChange,
  isSearchActive,
  onToggleSearchActive,
}) => {
  const elementId = 'store-header';
  const elementName = 'Store Header'; // Name for selection context
  const handleSelect = () => {
    if (isElementSelectionActive && onElementSelected) {
      onElementSelected({ id: elementId, name: elementName });
    }
  };

  const selectableClasses = isElementSelectionActive 
    ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-replit-primary-blue transition-all duration-100' 
    : '';
  const activeSelectionClasses = activelySelectedPreviewElementId === elementId ? 'preview-element-actively-selected' : '';

  const activeSocialLinks = socialLinkDefinitions.filter(
    (linkDef) => basicInfo[linkDef.key] && (basicInfo[linkDef.key] as string).trim() !== ''
  );
  
  const headerTextColor = isColorDark(appearance.primaryColor) ? 'text-white' : 'text-TEXT_PRIMARY';
  const headerIconColor = isColorDark(appearance.primaryColor) ? 'text-white/90 hover:text-white' : 'text-TEXT_SECONDARY hover:text-TEXT_PRIMARY';
  const searchInputBg = isColorDark(appearance.primaryColor) ? 'bg-white/10' : 'bg-BACKGROUND_MAIN';
  const searchInputText = isColorDark(appearance.primaryColor) ? 'text-white placeholder-white/60' : 'text-TEXT_PRIMARY placeholder-TEXT_SECONDARY';


  return (
    <div className="mobile-header" style={{ background: '#181818', color: '#fff', borderRadius: '32px', padding: '20px 0', marginBottom: 16 }}>
      <div 
        className={`p-3 sticky top-0 z-20 ${selectableClasses} ${activeSelectionClasses}`}
        style={{ backgroundColor: appearance.primaryColor }} 
        onClick={handleSelect}
        data-selectable-id={elementId}
        data-selectable-name={elementName}
      >
        <div className="flex justify-between items-center h-9"> {/* Fixed height for stable layout */}
          {isSearchActive ? (
            <div className="flex items-center w-full">
              <div className={`relative flex-grow ${searchInputBg} rounded-lg`}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className={`w-full pl-3 pr-8 py-1.5 text-sm ${searchInputText} bg-transparent focus:outline-none rounded-lg`}
                  autoFocus
                  aria-label="Search products"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchTermChange('')}
                    className={`absolute inset-y-0 right-0 flex items-center pr-2 ${isColorDark(appearance.primaryColor) ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => onToggleSearchActive(false)}
                className={`ml-2 text-xs ${headerTextColor} hover:underline`}
                aria-label="Cancel search"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 min-w-0">
                {basicInfo.logoUrl && (
                  <img 
                    src={basicInfo.logoUrl} 
                    alt={`${basicInfo.storeName} logo`} 
                    className={`h-8 w-8 rounded-full object-cover border-2 ${isColorDark(appearance.primaryColor) ? 'border-white/70' : 'border-black/20'} pointer-events-none`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = 'https://picsum.photos/seed/logo_error_fallback/80/80'; 
                    }}
                  />
                )}
                <h1 className={`text-xl font-bold ${headerTextColor} truncate pointer-events-none max-w-[120px] sm:max-w-[150px]`}>{basicInfo.storeName}</h1>
              </div>
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <button
                      onClick={() => onToggleSearchActive(true)}
                      className={`${headerIconColor} p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors`}
                      aria-label="Search products"
                      title="Search products"
                      tabIndex={isElementSelectionActive ? -1 : 0}
                  >
                      <i className="ph-magnifying-glass text-xl sm:text-2xl"></i>
                  </button>
                  <button 
                      onClick={onToggleCartModal}
                      className={`relative ${headerIconColor} p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors`}
                      aria-label="View shopping cart"
                      title="View shopping cart"
                      tabIndex={isElementSelectionActive ? -1 : 0}
                  >
                      <i className="ph-shopping-cart-simple text-xl sm:text-2xl"></i>
                      {cartItemCount > 0 && (
                      <span 
                          className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold pointer-events-none px-1 ring-1 ring-white/70"
                      >
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                      )}
                  </button>
                  <button 
                      className={`${headerIconColor} p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors`} 
                      aria-label="Menu"
                      title="Menu"
                      tabIndex={isElementSelectionActive ? -1 : 0}
                  >
                      <i className="ph-list text-xl sm:text-2xl"></i>
                  </button>
              </div>
            </>
          )}
        </div>
        {!isSearchActive && basicInfo.tagline && (
          <p className={`text-xs ${isColorDark(appearance.primaryColor) ? 'text-white/80' : 'text-gray-700/80'} mt-1 truncate pointer-events-none`}>{basicInfo.tagline}</p>
        )}

        {!isSearchActive && activeSocialLinks.length > 0 && (
          <div className="mt-2 flex items-center space-x-2 overflow-x-auto pb-1 social-links-scrollbar pointer-events-auto">
            {activeSocialLinks.map(({ key, platformName, baseUrl, isHandle, IconComponent }) => {
              const value = basicInfo[key] as string;
              const finalUrl = isHandle ? `${baseUrl}${value.replace('@', '')}` : value;
              return (
                <a
                  key={key}
                  href={finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platformName}
                  className={`${isColorDark(appearance.primaryColor) ? 'text-white/80 hover:text-white' : 'text-gray-700/80 hover:text-gray-900'} transition-colors p-1 flex-shrink-0`}
                  tabIndex={isElementSelectionActive ? -1 : 0}
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
