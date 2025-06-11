import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ToastMessage } from '../../types';
import { XMarkIcon as CloseIcon } from '../../constants';

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Animation duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300); // Animation duration
  };

  let IconComponent;
  let iconColorClass = '';
  let bgColorClass = '';
  let textColorClass = 'text-TEXT_PRIMARY dark:text-replit-dark-text-main';
  let borderColorClass = 'border-BORDER_DEFAULT dark:border-replit-dark-border';

  switch (type) {
    case 'success':
      IconComponent = CheckCircleIcon;
      iconColorClass = 'text-green-500';
      bgColorClass = 'bg-white dark:bg-replit-dark-bg';
      break;
    case 'error':
      IconComponent = XCircleIcon;
      iconColorClass = 'text-red-500';
      bgColorClass = 'bg-white dark:bg-replit-dark-bg';
      break;
    case 'info':
      IconComponent = InformationCircleIcon;
      iconColorClass = 'text-blue-500';
      bgColorClass = 'bg-white dark:bg-replit-dark-bg';
      break;
    default:
      IconComponent = InformationCircleIcon;
      iconColorClass = 'text-blue-500';
      bgColorClass = 'bg-white dark:bg-replit-dark-bg';
  }

  if (!isVisible && !isExiting) return null;

  return (
    <div
      className={`${bgColorClass} ${textColorClass} ${borderColorClass} rounded-lg shadow-lg border p-3 flex items-start space-x-3 transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      role="alert"
    >
      {IconComponent && (
        <div className={`flex-shrink-0 ${iconColorClass}`}>
          <IconComponent className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <p className={`text-sm font-medium ${textColorClass} break-words`}>
          {message}
        </p>
      </div>
      <div className="flex-shrink-0 ml-auto pl-2 -mr-1 -mt-1">
        <button
          type="button"
          className="inline-flex rounded-md p-1 text-TEXT_MUTED dark:text-replit-dark-text-disabled hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main focus:outline-none focus:ring-1 focus:ring-PRIMARY_MAIN/50"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
