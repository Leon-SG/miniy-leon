import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App'; // Changed from './App'
import { ToastProvider } from './contexts/ToastContext';
import GlobalToastContainer from './components/common/GlobalToastContainer';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastProvider>
      <App />
      <GlobalToastContainer />
    </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// End of file