
import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string; // Optional label to display next to the toggle
  labelPosition?: 'left' | 'right';
  disabled?: boolean;
  size?: 'sm' | 'md';
  title?: string; // Added optional title prop
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  id, 
  checked, 
  onChange, 
  label, 
  labelPosition = 'left', 
  disabled,
  size = 'md',
  title // Destructure title
}) => {
  
  const knobSizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const trackWidthClass = size === 'sm' ? 'w-8' : 'w-10'; // e.g., w-8 (2rem) for sm, w-10 (2.5rem) for md
  const trackHeightClass = size === 'sm' ? 'h-5' : 'h-6'; // e.g., h-5 (1.25rem) for sm, h-6 (1.5rem) for md
  const translateClass = size === 'sm' ? 'checked:translate-x-3' : 'checked:translate-x-4'; // Adjust based on (trackWidth - knobWidth - offset*2)
  const knobOffsetClass = size === 'sm' ? 'left-[0.125rem] top-[0.125rem]' : 'left-0.5 top-0.5';


  return (
    <div 
      className={`flex items-center ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      title={title} // Apply title to the container div
    >
      {label && labelPosition === 'left' && (
        <label htmlFor={id} className={`mr-2 text-sm font-medium ${disabled ? 'text-TEXT_MUTED dark:text-DARK_TEXT_MUTED' : 'text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY'}`}>
          {label}
        </label>
      )}
      <div className={`relative inline-block ${trackWidthClass} ${trackHeightClass} align-middle select-none`}>
        <input
          type="checkbox"
          name={id}
          id={id}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className={`absolute block ${knobSizeClass} rounded-full border-2 appearance-none 
                     peer transition-all duration-200 ease-in-out
                     bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT 
                     ${knobOffsetClass}
                     checked:bg-PRIMARY_MAIN checked:border-PRIMARY_DARK 
                     dark:checked:bg-PRIMARY_MAIN dark:checked:border-PRIMARY_DARK
                     ${translateClass}
                     focus:outline-none focus:ring-2 focus:ring-PRIMARY_MAIN/50 focus:ring-offset-BACKGROUND_CONTENT dark:focus:ring-offset-DARK_BACKGROUND_CONTENT
                     ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
        <label
          htmlFor={id}
          className={`block overflow-hidden ${trackHeightClass} ${trackWidthClass} rounded-full 
                     transition-colors duration-200 ease-in-out
                     bg-BORDER_DEFAULT dark:bg-DARK_BORDER_DEFAULT peer-checked:bg-PRIMARY_MAIN/30 dark:peer-checked:bg-PRIMARY_MAIN/40
                     ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        ></label>
      </div>
      {label && labelPosition === 'right' && (
        <label htmlFor={id} className={`ml-2 text-sm font-medium ${disabled ? 'text-TEXT_MUTED dark:text-DARK_TEXT_MUTED' : 'text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY'}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;