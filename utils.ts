
// Placeholder for Tailwind config to be accessible in JS/TS
// In a real project with a build system, you'd import tailwind.config.js or resolveConfig.
// For this environment, we manually define the subset of colors used.

export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        // Replit Shared
        'replit-primary-blue': '#0098ff', 
        'replit-primary-blue-darker': '#007acc', 

        // Replit Dark Theme
        'replit-dark-bg': '#171717',
        'replit-dark-panel-bg': '#1e1e1e',
        'replit-dark-border': '#303030',
        'replit-dark-border-muted': '#4a4a4a',
        'replit-dark-text-main': '#f8f8f2',
        'replit-dark-text-secondary': '#a9a9a9',
        'replit-dark-text-disabled': '#6c6c6c',
        'replit-dark-green': '#4CAF50',
        'replit-dark-yellow': '#FFC107',
        'replit-dark-red': '#F44336',
        'replit-dark-link-blue': '#3b82f6',

        // Replit Light Theme
        'replit-light-bg': '#FFFFFF',
        'replit-light-panel-bg': '#F5F5F5',
        'replit-light-border': '#E0E0E0',
        'replit-light-border-muted': '#BDBDBD',
        'replit-light-text-main': '#212121',
        'replit-light-text-secondary': '#616161',
        'replit-light-text-disabled': '#9E9E9E',
        'replit-light-green': '#2E7D32',
        'replit-light-yellow': '#F9A825',
        'replit-light-red': '#D32F2F',
        'replit-light-link-blue': '#1565C0',
            
        // --- Semantic Aliases ---
        // Light Mode Defaults (as defined in tailwind.config)
        'BACKGROUND_MAIN': '#FFFFFF', 
        'BACKGROUND_CONTENT': '#F5F5F5', 
        'TEXT_PRIMARY': '#212121', 
        'TEXT_SECONDARY': '#616161', 
        'TEXT_MUTED': '#9E9E9E', 
        'BORDER_DEFAULT': '#E0E0E0', 
        'BORDER_MUTED': '#BDBDBD', 
        'BORDER_INPUT_FOCUS': '#0098ff', 
        'SUCCESS_GREEN': '#2E7D32',
        'WARNING_YELLOW': '#F9A825',
        'ERROR_RED': '#D32F2F',
        'INFO_BLUE': '#1565C0', 
        'PRIMARY_MAIN': '#0098ff',
        'PRIMARY_DARK': '#007acc', 
        'ACCENT_MAIN': '#0098ff', // Changed to primary blue for more Replit feel
        'ACCENT_DARK': '#007acc', // Changed to primary blue darker

        // Dark Mode Semantic Aliases (for JS access)
        'DARK_BACKGROUND_MAIN': '#171717',    
        'DARK_BACKGROUND_CONTENT': '#1e1e1e', 
        'DARK_TEXT_PRIMARY': '#f8f8f2',       
        'DARK_TEXT_SECONDARY': '#a9a9a9',     
        'DARK_TEXT_MUTED': '#6c6c6c',         
        'DARK_BORDER_DEFAULT': '#303030',     
        'DARK_BORDER_MUTED': '#4a4a4a',       
        'DARK_SUCCESS_GREEN': '#4CAF50',
        'DARK_WARNING_YELLOW': '#FFC107',
        'DARK_ERROR_RED': '#F44336',
        'DARK_INFO_BLUE': '#3b82f6',
        'DARK_PRIMARY_MAIN': '#0098ff', 
        'DARK_PRIMARY_DARK': '#007acc',
        'DARK_ACCENT_MAIN': '#0098ff', // Changed to primary blue
        'DARK_ACCENT_DARK': '#007acc', // Changed to primary blue darker
      }
    }
  }
};
