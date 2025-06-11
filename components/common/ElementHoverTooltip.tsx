
import React from 'react';

interface ElementHoverTooltipProps {
  name: string | null;
  position: { x: number; y: number };
  visible: boolean;
}

const ElementHoverTooltip: React.FC<ElementHoverTooltipProps> = ({ name, position, visible }) => {
  if (!visible || !name) return null;

  return (
    <div
      style={{
        left: `${position.x + 15}px`, // Offset from cursor
        top: `${position.y + 15}px`,  // Offset from cursor
        transform: 'translateY(-100%)', // Position tooltip above cursor by default
      }}
      className="fixed z-[9999] px-2 py-1 bg-replit-dark-bg text-replit-dark-text-main text-xs rounded-md shadow-xl pointer-events-none border border-replit-dark-border"
    >
      {name}
    </div>
  );
};

export default ElementHoverTooltip;
