
import React from 'react';

interface ColorSwatchProps {
  color: string;
  className?: string;
  size?: 'sm' | 'md'; // sm: w-3 h-3, md: w-4 h-4
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div
      className={`${sizeClasses} rounded border border-black/20 ${className}`}
      style={{ backgroundColor: color }}
      title={`Color: ${color}`}
    ></div>
  );
};

export default ColorSwatch;
