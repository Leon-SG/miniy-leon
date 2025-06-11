import React, { useState, useCallback } from 'react';
import { BasicInfo, AppearanceSettings } from '../../../types';
import { FacebookIcon, InstagramIcon, TiktokIcon, XIcon, LinkedInIcon, YoutubeIcon } from '../../../icons';

interface ModernHeaderProps {
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

const ModernHeader: React.FC<ModernHeaderProps> = ({
  basicInfo,
  appearance,
  isElementSelectionActive = false,
  onElementSelected = () => {},
  activelySelectedPreviewElementId,
  cartItemCount,
  onToggleCartModal,
  searchTerm,
  onSearchTermChange,
  isSearchActive,
  onToggleSearchActive,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchClick = useCallback(() => {
    if (isElementSelectionActive) return;
    onToggleSearchActive(true);
  }, [isElementSelectionActive, onToggleSearchActive]);

  const handleSearchClose = useCallback(() => {
    onToggleSearchActive(false);
    onSearchTermChange('');
  }, [onToggleSearchActive, onSearchTermChange]);

  const handleCartClick = useCallback(() => {
    if (isElementSelectionActive) return;
    onToggleCartModal();
  }, [isElementSelectionActive, onToggleCartModal]);

  const storeNameElementId = 'store-name-display';
  const isStoreNameHighlighted = activelySelectedPreviewElementId === storeNameElementId;

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ borderColor: `${appearance.primaryColor}20` }}
    >
      <div className="container flex h-16 items-center px-4">
        {/* Logo/Store Name */}
        <div 
          data-selectable-id={storeNameElementId}
          data-selectable-name="Store Name"
          onClick={() => isElementSelectionActive && onElementSelected({ id: storeNameElementId, name: "Store Name" })}
          className={`flex items-center space-x-2 ${
            isElementSelectionActive ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-primary' : ''
          } ${isStoreNameHighlighted ? 'preview-element-actively-selected' : ''}`}
        >
          {basicInfo.logoUrl ? (
            <img 
              src={basicInfo.logoUrl} 
              alt={basicInfo.storeName || 'Store Logo'} 
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div 
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: appearance.primaryColor }}
            >
              <span className="text-white text-sm font-medium">
                {basicInfo.storeName?.[0]?.toUpperCase() || 'S'}
              </span>
            </div>
          )}
          <h1 
            className="text-lg font-semibold"
            style={{ color: appearance.primaryColor }}
          >
            {basicInfo.storeName || 'My Store'}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          {isSearchActive ? (
            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-4 rounded-full border bg-background focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: `${appearance.primaryColor}40`,
                  '--tw-ring-color': appearance.primaryColor,
                } as React.CSSProperties}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                onClick={handleSearchClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSearchClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border hover:bg-gray-50 transition-colors"
              style={{ borderColor: `${appearance.primaryColor}40` }}
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-gray-500">Search products...</span>
            </button>
          )}
        </div>

        {/* 新增：社交媒体图标区域 */}
        <div className="flex items-center space-x-2 mr-4">
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <FacebookIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <TiktokIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <XIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <LinkedInIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
            <YoutubeIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Cart Button */}
        <button
          onClick={handleCartClick}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: appearance.primaryColor }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Store Tagline */}
      {!isSearchActive && basicInfo.tagline && (
        <div 
          data-selectable-id="store-tagline-display"
          data-selectable-name="Store Tagline"
          onClick={() => isElementSelectionActive && onElementSelected({ id: 'store-tagline-display', name: "Store Tagline" })}
          className={`px-4 py-2 text-sm text-center ${
            isElementSelectionActive ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-primary' : ''
          } ${activelySelectedPreviewElementId === 'store-tagline-display' ? 'preview-element-actively-selected' : ''}`}
          style={{ 
            backgroundColor: `${appearance.primaryColor}10`,
            color: appearance.primaryColor,
          }}
        >
          {basicInfo.tagline}
        </div>
      )}
    </header>
  );
};

export default ModernHeader; 