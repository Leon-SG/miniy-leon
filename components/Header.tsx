import React, { useState, useEffect, useRef } from 'react';
import { Mode } from '../types';
import { UserCircleIcon } from '../constants';
import UserProfileDropdown from './common/UserProfileDropdown';

interface HeaderProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  isAiLoading: boolean;
  editorTheme: 'light' | 'dark'; 
  toggleEditorTheme: () => void; 
  contextualHelpEnabled: boolean; // New prop
  toggleContextualHelpGlobally: () => void; // New prop
  ycModeEnabled: boolean;
  onToggleYcMode: (enabled: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentMode, 
  onModeChange, 
  isAiLoading,
  editorTheme,
  toggleEditorTheme,
  contextualHelpEnabled, // Destructure new prop
  toggleContextualHelpGlobally, // Destructure new prop
  ycModeEnabled,
  onToggleYcMode
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <header 
      className="p-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border flex justify-between items-center sticky top-0 z-40 relative bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg" 
    >
      <div className="flex items-center">
        <h1 className="text-xl font-semibold tracking-tight text-TEXT_PRIMARY dark:text-replit-dark-text-main">Miniy</h1>
      </div>
      <div className="relative">
        <button
          ref={profileButtonRef}
          onClick={toggleDropdown}
          className="p-1.5 rounded-md hover:bg-BORDER_DEFAULT/50 dark:hover:bg-replit-dark-border/50 focus:outline-none focus:ring-1 focus:ring-replit-primary-blue focus:ring-offset-1 focus:ring-offset-BACKGROUND_CONTENT dark:focus:ring-offset-replit-dark-panel-bg transition-colors"
          aria-label="User profile and settings"
          aria-haspopup="true"
          aria-expanded={isProfileDropdownOpen}
          id="user-profile-button"
        >
          <UserCircleIcon className="w-6 h-6 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main" />
        </button>
        <div ref={dropdownRef}>
          <UserProfileDropdown
            isOpen={isProfileDropdownOpen}
            onClose={closeDropdown}
            currentMode={currentMode}
            onModeChange={onModeChange}
            editorTheme={editorTheme} 
            toggleEditorTheme={toggleEditorTheme}
            contextualHelpEnabled={contextualHelpEnabled} // Pass down
            toggleContextualHelpGlobally={toggleContextualHelpGlobally} // Pass down
            ycModeEnabled={ycModeEnabled}
            onToggleYcMode={onToggleYcMode}
          />
        </div>
      </div>
      {isAiLoading && (
        <div 
          className="absolute bottom-0 left-0 w-full loading-progress-bar"
          role="progressbar"
          aria-valuetext="AI is processing..."
          aria-busy="true"
          aria-live="polite"
        ></div>
      )}
    </header>
  );
};

export default Header;
