import React from 'react';
import { AppearanceSettings } from '../../types';
import { isColorDark } from '../MobilePreview';

interface MobileFooterProps {
  storeName: string;
  appearance: AppearanceSettings;
  isElementSelectionActive?: boolean;
  onElementSelected?: (elementInfo: { id: string; name: string }) => void;
  activelySelectedPreviewElementId?: string | null; 
}

const MobileFooter: React.FC<MobileFooterProps> = ({ 
  storeName, 
  appearance,
  isElementSelectionActive,
  onElementSelected,
  activelySelectedPreviewElementId
}) => {
  const elementId = 'store-footer';
  const elementName = 'Store Footer'; // Name for selection context
  const handleSelect = () => {
    if (isElementSelectionActive && onElementSelected) {
      onElementSelected({ id: elementId, name: elementName });
    }
  };

  const selectableClasses = isElementSelectionActive 
    ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-replit-primary-blue hover:rounded-sm transition-all duration-100' 
    : '';

  const activeSelectionClasses = activelySelectedPreviewElementId === elementId ? 'preview-element-actively-selected' : '';

  const footerTextColor = isColorDark(appearance.primaryColor) ? 'text-white' : 'text-TEXT_PRIMARY';
  const footerIconColor = isColorDark(appearance.primaryColor) ? 'text-white/80 hover:text-white' : 'text-TEXT_SECONDARY hover:text-TEXT_PRIMARY';
  const footerMutedTextColor = isColorDark(appearance.primaryColor) ? 'text-white/60' : 'text-TEXT_SECONDARY';

  return (
    <div 
      className={`p-4 text-center text-xs ${footerTextColor} ${selectableClasses} ${activeSelectionClasses}`}
      style={{ backgroundColor: appearance.primaryColor, opacity: 0.9 }}
      onClick={handleSelect}
      data-selectable-id={elementId}
      data-selectable-name={elementName} // Added for hover tooltip
    >
      <div className="flex justify-center space-x-4 mb-2 pointer-events-none">
        <a href="#" title="Instagram" className={`${footerIconColor} transition-colors`}><i className="ph-instagram-logo text-lg"></i></a>
        <a href="#" title="TikTok" className={`${footerIconColor} transition-colors`}><i className="ph-tiktok-logo text-lg"></i></a>
        <a href="#" title="X (Twitter)" className={`${footerIconColor} transition-colors`}><i className="ph-x-logo text-lg"></i></a>
      </div>
      &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
      <p className={`${footerMutedTextColor} mt-1`}>Powered by Miniy</p>
    </div>
  );
};

export default MobileFooter;
