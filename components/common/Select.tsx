
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({ label, id, error, className = '', options, ...props }) => {
  const baseStyles = "block w-full px-3 py-1.5 border rounded-md shadow-light-subtle dark:shadow-subtle focus:outline-none focus:ring-1 focus:ring-replit-primary-blue focus:border-replit-primary-blue text-sm appearance-none";
  const themeStyles = "bg-BACKGROUND_MAIN dark:bg-replit-dark-bg border-BORDER_DEFAULT dark:border-replit-dark-border text-TEXT_PRIMARY dark:text-replit-dark-text-main placeholder-TEXT_MUTED dark:placeholder-replit-dark-text-disabled";
  const errorThemeStyles = "border-ERROR_RED dark:border-replit-dark-red focus:ring-ERROR_RED dark:focus:ring-replit-dark-red focus:border-ERROR_RED dark:focus:border-replit-dark-red";
  const labelThemeStyles = "text-TEXT_SECONDARY dark:text-replit-dark-text-secondary";
  const errorTextThemeStyles = "text-ERROR_RED dark:text-replit-dark-red";
  const arrowThemeStyles = "text-TEXT_SECONDARY dark:text-replit-dark-text-secondary";
  const optionThemeStyles = "bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg text-TEXT_PRIMARY dark:text-replit-dark-text-main";


  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={`block text-xs font-medium ${labelThemeStyles} mb-1`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`${baseStyles} ${themeStyles} ${error ? errorThemeStyles : ''} ${className}`}
          {...props}
        >
          {props.defaultValue === undefined && (!props.value || props.value === "") && <option value="" disabled className={`text-TEXT_MUTED dark:text-replit-dark-text-disabled ${optionThemeStyles}`}>Select {label?.toLowerCase()}...</option>}
          {options.map(option => (
            <option key={option.value} value={option.value} className={optionThemeStyles}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${arrowThemeStyles}`}>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className={`mt-1 text-xs ${errorTextThemeStyles}`}>{error}</p>}
    </div>
  );
};

export default Select;