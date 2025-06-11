import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  title?: string;
  appearance?: {
    primaryColor?: string;
  };
  isColorDark?: (color: string) => boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  title,
  appearance,
  isColorDark,
  ...props
}, ref) => {
  const baseStyles = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-replit-dark-panel-bg focus:ring-offset-BACKGROUND_CONTENT transition-all duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyles = "";
  let primaryTextColor = 'text-white';
  if (variant === 'primary' && appearance?.primaryColor) {
    primaryTextColor = isColorDark?.(appearance.primaryColor) ? 'text-white' : 'text-gray-900';
  }
  switch (variant) {
    case 'primary':
      // Shared blue background, white text
      variantStyles = "bg-replit-primary-blue text-white hover:bg-replit-primary-blue-darker focus:ring-replit-primary-blue/70";
      break;
    case 'secondary':
      // Light: Gray border, white bg, dark text. Hover: light blue bg.
      // Dark: Dark border, transparent bg, light text. Hover: darker border bg.
      variantStyles = `
        border border-BORDER_DEFAULT bg-BACKGROUND_MAIN text-TEXT_PRIMARY 
        hover:bg-replit-primary-blue/10 hover:border-replit-primary-blue/30 hover:text-replit-primary-blue
        dark:border-replit-dark-border dark:bg-transparent dark:text-replit-dark-text-secondary 
        dark:hover:bg-replit-dark-border/50 dark:hover:text-replit-dark-text-main
        focus:ring-replit-primary-blue/70
      `;
      break;
    case 'danger':
      // Light: Red border, red text. Hover: Red bg, white text.
      // Dark: Red bg, white text. Hover: Darker red bg.
      variantStyles = `
        border border-replit-light-red-border text-replit-light-red-text bg-BACKGROUND_MAIN
        hover:bg-replit-light-red hover:text-white
        dark:bg-replit-dark-red dark:text-replit-dark-text-main dark:border-transparent
        dark:hover:bg-red-700 
        focus:ring-replit-dark-red/70 dark:focus:ring-replit-light-red/70
      `;
      break;
    case 'ghost':
      // Light: Darker text, transparent. Hover: Light gray bg.
      // Dark: Lighter text, transparent. Hover: Darker border bg.
      variantStyles = `
        bg-transparent text-TEXT_SECONDARY 
        hover:bg-BORDER_DEFAULT/50 hover:text-TEXT_PRIMARY
        dark:text-replit-dark-text-secondary 
        dark:hover:bg-replit-dark-border/50 dark:hover:text-replit-dark-text-main
        focus:ring-replit-primary-blue/70
      `;
      break;
  }

  let sizeStyles = "";
  let iconSizeClass = "w-4 h-4"; 
  switch (size) {
    case 'sm':
      sizeStyles = "px-2.5 py-1 text-xs"; 
      iconSizeClass = "w-3.5 h-3.5";
      break;
    case 'md':
      sizeStyles = "px-3 py-1.5 text-sm"; 
      break;
    case 'lg':
      sizeStyles = "px-4 py-2 text-base"; 
      iconSizeClass = "w-5 h-5";
      break;
  }
  
  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon) && typeof icon.type !== 'string') {
      const currentProps = icon.props as Record<string, unknown>;
      const originalClassName = typeof currentProps.className === 'string' ? currentProps.className : '';
      
      const classes = [];
      if (originalClassName) classes.push(originalClassName);
      if (iconSizeClass) classes.push(iconSizeClass);
      const newClassName = classes.join(' ');

      return React.cloneElement(icon as React.ReactElement<any>, {
        className: newClassName
      });
    }
    // Fallback for non-element icons, or string icons (though less common now)
    // Ensure the span itself doesn't override icon's intrinsic color if it's set by parent's text color
    return <span className={`${iconSizeClass}`}>{icon}</span>;
  };


  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      title={title}
      {...props}
    >
      {leftIcon && <span className="mr-1.5">{renderIcon(leftIcon)}</span>}
      {children}
      {rightIcon && <span className="ml-1.5">{renderIcon(rightIcon)}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
// End of file
