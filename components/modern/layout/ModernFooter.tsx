import React from 'react';
import { AppearanceSettings } from '../../../types';
import { FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon, PinterestIcon, SnapchatIcon, WhatsAppIcon, TelegramIcon, RedditIcon, DiscordIcon, TwitchIcon, BehanceIcon, DribbbleIcon } from '../../../constants';

interface ModernFooterProps {
  storeName: string;
  appearance: AppearanceSettings;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null;
}

const ModernFooter: React.FC<ModernFooterProps> = ({
  storeName,
  appearance,
  isElementSelectionActive = false,
  onElementSelected = () => {},
  activelySelectedPreviewElementId,
}) => {
  const footerElementId = 'store-footer';
  const isFooterHighlighted = activelySelectedPreviewElementId === footerElementId;

  return (
    <footer
      data-selectable-id={footerElementId}
      data-selectable-name="Store Footer"
      onClick={() => isElementSelectionActive && onElementSelected({ id: footerElementId, name: "Store Footer" })}
      className={`mt-12 border-t ${
        isElementSelectionActive ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-primary' : ''
      } ${isFooterHighlighted ? 'preview-element-actively-selected' : ''}`}
      style={{ borderColor: `${appearance.primaryColor}20` }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* 商店名称 */}
          <div 
            data-selectable-id="footer-store-name"
            data-selectable-name="Footer Store Name"
            onClick={() => isElementSelectionActive && onElementSelected({ id: 'footer-store-name', name: "Footer Store Name" })}
            className={`text-center ${
              isElementSelectionActive ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-primary' : ''
            } ${activelySelectedPreviewElementId === 'footer-store-name' ? 'preview-element-actively-selected' : ''}`}
          >
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: appearance.primaryColor }}
            >
              {storeName || 'My Store'}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            {/* 社交媒体链接，移到商店名下方 */}
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <TiktokIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <XIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <LinkedInIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <YoutubeIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <PinterestIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <SnapchatIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <WhatsAppIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <TelegramIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <RedditIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <DiscordIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <TwitchIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <BehanceIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <DribbbleIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* 页脚链接 */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Shipping Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Refund Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter; 