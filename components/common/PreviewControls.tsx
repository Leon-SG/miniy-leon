import React, { useState, useRef, useEffect } from 'react';
import { Mode, StoreConfiguration } from '../../types';
import {
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    CodeBracketIcon,
    ChatBubbleIcon,
    CursorArrowRaysIcon,
    DeployIcon,
    ExternalLinkIcon,
    ClockIcon,
    ChevronDownIcon
} from '../../constants';
import DeploymentSettingsModal, { DeploymentSettings } from '../DeveloperMode/DeploymentSettingsModal';
import { useToast } from '../../contexts/ToastContext';

interface PreviewControlsProps {
  currentAppMode: Mode;
  onAppModeChange: (mode: Mode) => void;
  currentPreviewMode: 'mobile' | 'desktop';
  onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
  isElementSelectionActive: boolean;
  onToggleElementSelectionMode: () => void;
  storeConfig: StoreConfiguration;
  onDeploymentSuccess: (settings: DeploymentSettings) => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  currentAppMode,
  onAppModeChange,
  currentPreviewMode,
  onPreviewModeChange,
  isElementSelectionActive,
  onToggleElementSelectionMode,
  storeConfig,
  onDeploymentSuccess,
}) => {
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [currentDisplayVersion, setCurrentDisplayVersion] = useState("Latest (Current)");
  const { showToast } = useToast();
  
  const mockVersions = [
    "Latest (Current)", 
    "V4 - 2 hr ago (Mock)", 
    "V3 - Yesterday (Mock)", 
    "V2 - Last Week (Mock)", 
    "V1 - Initial (Mock)"
  ];
  const versionDropdownRef = useRef<HTMLDivElement>(null);
  const versionButtonRef = useRef<HTMLButtonElement>(null);

  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  const groupBaseStyle = "absolute bg-BACKGROUND_CONTENT/80 backdrop-blur-md p-0.3 rounded-lg flex items-center space-x-1 z-30 border border-BORDER_DEFAULT/30";

  const commonButtonClass = "p-1.5 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-PRIMARY_MAIN/50 focus:ring-offset-1 focus:ring-offset-BACKGROUND_MAIN";
  const actionButtonClass = "bg-transparent text-TEXT_SECONDARY hover:text-PRIMARY_MAIN hover:bg-PRIMARY_MAIN/10";
  const activeToggleButtonClass = "bg-PRIMARY_MAIN text-white hover:bg-PRIMARY_DARK";
  const inactiveToggleButtonClass = actionButtonClass; // Same as action for inactive toggles
  const selectionActiveButtonClass = "bg-ACCENT_MAIN text-white hover:bg-ACCENT_DARK";

  const toggleVersionDropdown = () => setIsVersionDropdownOpen(prev => !prev);

  const handleVersionSelect = (version: string) => {
    setCurrentDisplayVersion(version);
    setIsVersionDropdownOpen(false);
    if (version !== "Latest (Current)") {
      showToast(`Version rollback to "${version}" is a planned feature. Displaying latest version.`, "info", 5000);
    }
  };

  const toggleDeploymentModal = () => setIsDeploymentModalOpen(prev => !prev);

  const handleDeploy = (deploymentModalSettings: DeploymentSettings) => {
    onDeploymentSuccess(deploymentModalSettings);
    toggleDeploymentModal();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVersionDropdownOpen &&
        versionDropdownRef.current &&
        !versionDropdownRef.current.contains(event.target as Node) &&
        versionButtonRef.current &&
        !versionButtonRef.current.contains(event.target as Node)
      ) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVersionDropdownOpen]);

  const getPotentialLiveUrl = () => {
    const subdomain = storeConfig.basicInfo.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://${subdomain || 'your-store'}.miniy.app`;
  };

  return (
    <>
      {/* Top-Left Group: Element Selection */}
      <div className={`${groupBaseStyle} top-3 left-3`}>
        <div className="flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT">
            <button
            onClick={onToggleElementSelectionMode}
            className={`${commonButtonClass} ${isElementSelectionActive ? selectionActiveButtonClass : actionButtonClass}`}
            title={isElementSelectionActive ? "Deactivate Element Selection" : "Select Element to Edit"}
            aria-pressed={isElementSelectionActive}
            >
            <CursorArrowRaysIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Top-Right Group: View and Mode Toggles */}
      <div className={`${groupBaseStyle} top-3 right-3`}>
        <div className="flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT">
          <button
            onClick={() => onPreviewModeChange('mobile')}
            className={`${commonButtonClass} ${currentPreviewMode === 'mobile' ? activeToggleButtonClass : inactiveToggleButtonClass}`}
            title="Preview on Mobile Device"
            aria-pressed={currentPreviewMode === 'mobile'}
          >
            <DevicePhoneMobileIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPreviewModeChange('desktop')}
            className={`${commonButtonClass} ${currentPreviewMode === 'desktop' ? activeToggleButtonClass : inactiveToggleButtonClass}`}
            title="Preview on Tablet/Desktop Device"
            aria-pressed={currentPreviewMode === 'desktop'}
          >
            <ComputerDesktopIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT ml-1">
          <button
            onClick={() => onAppModeChange(Mode.NORMAL)}
            className={`${commonButtonClass} ${currentAppMode === Mode.NORMAL ? activeToggleButtonClass : inactiveToggleButtonClass}`}
            title="Switch to Creator Mode (AI Chat)"
            aria-pressed={currentAppMode === Mode.NORMAL}
          >
            <ChatBubbleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAppModeChange(Mode.DEVELOPER)}
            className={`${commonButtonClass} ${currentAppMode === Mode.DEVELOPER ? activeToggleButtonClass : inactiveToggleButtonClass}`}
            title="Switch to Developer Mode (Detailed Settings)"
            aria-pressed={currentAppMode === Mode.DEVELOPER}
          >
            <CodeBracketIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom-Left Group: Deployment Actions */}
      <div className={`${groupBaseStyle} bottom-3 left-3`}>
         <div className="flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT">
            <button
            onClick={toggleDeploymentModal}
            className={`${commonButtonClass} ${actionButtonClass}`}
            title="Deploy Store"
            >
            <DeployIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT ml-1">
            <button
                onClick={() => {
                    const urlToOpen = getPotentialLiveUrl();
                    window.open(urlToOpen, '_blank');
                }}
                className={`${commonButtonClass} ${actionButtonClass}`}
                title="Open Potential Live Store URL"
            >
                <ExternalLinkIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {/* Bottom-Right Group: Version History */}
      <div className={`${groupBaseStyle} bottom-3 right-3`}>
         <div className="relative flex items-center bg-BACKGROUND_MAIN p-0.5 rounded-lg border border-BORDER_DEFAULT">
          <button
            ref={versionButtonRef}
            onClick={toggleVersionDropdown}
            className={`${commonButtonClass} ${actionButtonClass} flex items-center text-xs px-2 min-w-[120px] justify-between`} 
            title="View version history"
            aria-haspopup="true"
            aria-expanded={isVersionDropdownOpen}
          >
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5" />
              <span className="truncate">{currentDisplayVersion.split(" - ")[0]}</span> 
            </div>
            <ChevronDownIcon className="w-3 h-3 ml-1 flex-shrink-0" />
          </button>
          {isVersionDropdownOpen && (
            <div
              ref={versionDropdownRef}
              className="absolute bottom-full right-0 mb-1.5 w-48 bg-BACKGROUND_CONTENT rounded-md border border-BORDER_DEFAULT z-50 py-1 shadow-light-subtle dark:shadow-subtle"
              role="menu"
            >
              {mockVersions.map(version => (
                <button
                  key={version}
                  onClick={() => handleVersionSelect(version)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors
                                ${currentDisplayVersion === version 
                                  ? 'bg-PRIMARY_MAIN/10 text-PRIMARY_MAIN font-medium' 
                                  : 'text-TEXT_SECONDARY hover:bg-BORDER_DEFAULT/50 hover:text-TEXT_PRIMARY'}`}
                  role="menuitem"
                  title={version}
                >
                  {version}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <DeploymentSettingsModal
        isOpen={isDeploymentModalOpen}
        onClose={toggleDeploymentModal}
        onDeploy={handleDeploy}
        currentStoreName={storeConfig.basicInfo.storeName}
      />
    </>
  );
};

export default PreviewControls;
