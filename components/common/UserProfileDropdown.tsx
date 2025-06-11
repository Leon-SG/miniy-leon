import React from 'react';
import { Mode } from '../../types';
import { 
    CodeBracketIcon, 
    ChatBubbleIcon, 
    ArrowRightOnRectangleIcon, 
    SettingsIcon,
    UserIcon,
    SunIcon,
    MoonIcon,
    InfoIcon // For contextual help toggle
} from '../../constants';
import ToggleSwitch from './ToggleSwitch';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  editorTheme: 'light' | 'dark';
  toggleEditorTheme: () => void;
  contextualHelpEnabled: boolean; // New prop
  toggleContextualHelpGlobally: () => void; // New prop
  username?: string; 
  userEmail?: string;
  ycModeEnabled: boolean;
  onToggleYcMode: (enabled: boolean) => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
  editorTheme,
  toggleEditorTheme,
  contextualHelpEnabled, // Destructure new prop
  toggleContextualHelpGlobally, // Destructure new prop
  username = "Miniy User",
  userEmail = "user@miniy.app",
  ycModeEnabled,
  onToggleYcMode
}) => {
  if (!isOpen) return null;

  const handleModeToggle = () => {
    const newMode = currentMode === Mode.NORMAL ? Mode.DEVELOPER : Mode.NORMAL;
    onModeChange(newMode);
  };

  const menuItems = [
    { 
      type: 'item' as const,
      label: "My Account", 
      icon: <UserIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />, 
      action: () => alert("My Account clicked (placeholder)"),
      title: "View and manage your account details"
    },
    { 
      type: 'item' as const,
      label: "Settings", 
      icon: <SettingsIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />, 
      action: () => alert("Settings clicked (placeholder)"),
      title: "Access application settings"
    },
    { 
      type: 'item' as const,
      label: currentMode === Mode.NORMAL ? "Switch to Developer Mode" : "Switch to Creator Mode", 
      icon: currentMode === Mode.NORMAL 
        ? <CodeBracketIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" /> 
        : <ChatBubbleIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />,
      action: handleModeToggle,
      title: currentMode === Mode.NORMAL ? "Access detailed store configuration" : "Return to AI chat interface for creation"
    },
    {
      type: 'item' as const,
      label: editorTheme === 'light' ? "Switch to Dark Theme" : "Switch to Light Theme",
      icon: editorTheme === 'light' 
        ? <MoonIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" /> 
        : <SunIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />,
      action: toggleEditorTheme,
      title: `Switch to ${editorTheme === 'light' ? 'Dark' : 'Light'} Theme`
    },
    {
      type: 'item' as const,
      label: contextualHelpEnabled ? "Disable Contextual Tips" : "Enable Contextual Tips",
      icon: <InfoIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />,
      action: toggleContextualHelpGlobally,
      title: contextualHelpEnabled ? "Turn off AI's proactive help tips" : "Turn on AI's proactive help tips"
    },
    { type: 'divider' as const }, 
    { 
      type: 'item' as const,
      label: "Logout", 
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5 text-TEXT_SECONDARY group-hover:text-PRIMARY_MAIN dark:text-replit-dark-text-secondary dark:group-hover:text-replit-primary-blue" />, 
      action: () => alert("Logout clicked (placeholder)"),
      title: "Log out of your account"
    },
  ];

  return (
    <div 
      className="absolute top-full right-0 mt-2 w-64 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border z-50 py-1 shadow-light-subtle dark:shadow-subtle"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-profile-button"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="px-4 py-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border">
        <p className="text-sm font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">{username}</p>
        <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled truncate">{userEmail}</p>
      </div>
      <div className="px-4 py-2 border-b border-BORDER_DEFAULT dark:border-replit-dark-border flex items-center justify-between">
        <span className="text-xs text-TEXT_SECONDARY dark:text-replit-dark-text-secondary font-medium">YC Mode</span>
        <ToggleSwitch checked={ycModeEnabled} onChange={onToggleYcMode} size="sm" />
      </div>
      <ul className="space-y-1 p-1">
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <li key={`divider-${index}`}><div className="h-px my-1 bg-BORDER_DEFAULT dark:bg-replit-dark-border-muted mx-1"></div></li>;
          }
          return (
            <li key={index}>
              <button
                onClick={() => { item.action(); onClose(); }}
                title={item.title}
                className="w-full flex items-center px-3 py-2.5 text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-PRIMARY_MAIN/10 dark:hover:bg-replit-primary-blue/20 hover:text-PRIMARY_MAIN dark:hover:text-replit-primary-blue rounded-md transition-colors duration-150 group"
                role="menuitem"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserProfileDropdown;
