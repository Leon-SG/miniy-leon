

import React, { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleEscKey]);

  if (!isOpen) return null;

  let sizeClasses = "max-w-md"; // Default md
  if (size === 'sm') sizeClasses = "max-w-sm";
  if (size === 'lg') sizeClasses = "max-w-lg";
  if (size === 'xl') sizeClasses = "max-w-xl";
  if (size === '2xl') sizeClasses = "max-w-2xl";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-replit-dark-bg/80 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        className={`w-full ${sizeClasses} rounded-md shadow-light-subtle dark:shadow-subtle ${!title ? 'p-0' : 'p-4'} transform transition-all duration-300 ease-in-out bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg border border-BORDER_DEFAULT dark:border-replit-dark-border`}
        onClick={(e) => e.stopPropagation()} 
      >
        {title && (
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border">
            <h2 id="modal-title" className="text-lg font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">{title}</h2>
            <button
              onClick={onClose}
              className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main transition-colors rounded-full p-1 -mr-1 -mt-1 focus:outline-none focus:ring-1 focus:ring-replit-primary-blue"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
// End of file
