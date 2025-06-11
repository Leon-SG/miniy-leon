
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, className = '', ...props }, ref) => {
    const baseStyles = "block w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-replit-primary-blue focus:border-replit-primary-blue text-sm";
    const themeStyles = "bg-BACKGROUND_MAIN dark:bg-replit-dark-bg border-BORDER_DEFAULT dark:border-replit-dark-border text-TEXT_PRIMARY dark:text-replit-dark-text-main placeholder-TEXT_MUTED dark:placeholder-replit-dark-text-disabled";
    const errorThemeStyles = "border-ERROR_RED dark:border-replit-dark-red focus:ring-ERROR_RED dark:focus:ring-replit-dark-red focus:border-ERROR_RED dark:focus:border-replit-dark-red";
    const labelThemeStyles = "text-TEXT_SECONDARY dark:text-replit-dark-text-secondary";
    const errorTextThemeStyles = "text-ERROR_RED dark:text-replit-dark-red";

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className={`block text-xs font-medium ${labelThemeStyles} mb-1`}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref} // Assign the forwarded ref here
          className={`${baseStyles} ${themeStyles} ${error ? errorThemeStyles : ''} ${className}`}
          rows={4}
          {...props}
        />
        {error && <p className={`mt-1 text-xs ${errorTextThemeStyles}`}>{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea'; // Optional: for better debugging messages

export default Textarea;
