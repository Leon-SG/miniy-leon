
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Toast } from './Toast'; // The individual Toast component

const GlobalToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 left-4 z-[1000] space-y-3 w-auto max-w-sm"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      ))}
    </div>
  );
};

export default GlobalToastContainer;
