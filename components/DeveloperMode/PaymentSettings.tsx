import React, { useState } from 'react';
import { PaymentMethods, PaymentProvider, PaymentProviderDetails } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { SUPPORTED_PAYMENT_PROVIDERS, ExternalLinkIcon, LinkIcon, UnlinkIcon } from '../../constants';

interface PaymentSettingsProps {
  paymentMethods: PaymentMethods;
  onUpdate: (updatedMethods: PaymentMethods) => void;
}

type ConnectionModalState = {
  isOpen: boolean;
  providerName?: string;
  status?: 'connecting' | 'error';
  message?: string;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ paymentMethods, onUpdate }) => {
  const [currentPaymentMethods, setCurrentPaymentMethods] = useState<PaymentMethods>(paymentMethods);
  const [connectionModalState, setConnectionModalState] = useState<ConnectionModalState>({ isOpen: false });

  const handleConnect = async (providerKey: PaymentProvider) => {
    const provider = SUPPORTED_PAYMENT_PROVIDERS.find(p => p.key === providerKey);
    if (!provider) return;

    setConnectionModalState({ isOpen: true, providerName: provider.name, status: 'connecting', message: `Attempting to connect to ${provider.name}...` });
    
    // Simulate API call / OAuth redirect
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate success
    const updatedProviderDetails: PaymentProviderDetails = {
      status: 'connected',
      accountId: `mock_acct_${providerKey}_${Date.now().toString().slice(-6)}`,
      lastConnected: new Date().toISOString(),
    };
    
    const newMethods = { ...currentPaymentMethods, [providerKey]: updatedProviderDetails };
    setCurrentPaymentMethods(newMethods);
    onUpdate(newMethods);
    setConnectionModalState({ isOpen: false });
  };

  const handleDisconnect = (providerKey: PaymentProvider) => {
    const provider = SUPPORTED_PAYMENT_PROVIDERS.find(p => p.key === providerKey);
    if (!provider) return;

    if (window.confirm(`Are you sure you want to disconnect ${provider.name}?`)) {
      const updatedProviderDetails: PaymentProviderDetails = {
        status: 'disconnected',
      };
      const newMethods = { ...currentPaymentMethods, [providerKey]: updatedProviderDetails };
      setCurrentPaymentMethods(newMethods);
      onUpdate(newMethods);
    }
  };
  
  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-6 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Payment Gateways</h2>
      <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary -mt-4 mb-6">Connect and manage your payment providers to start accepting payments from customers.</p>
      
      <div className="space-y-5">
        {SUPPORTED_PAYMENT_PROVIDERS.map(({ key, name, description, Icon }) => {
          const details = currentPaymentMethods[key] || { status: 'disconnected' };
          const isConnected = details.status === 'connected';
          const isConnecting = details.status === 'connecting';
          const isError = details.status === 'error';

          let statusText = "Not Connected";
          let statusColor = "text-TEXT_MUTED dark:text-replit-dark-text-disabled";
          if (isConnected) {
            statusText = `Connected (Account: ${details.accountId ? details.accountId.substring(0,15) + '...' : 'N/A'})`;
            statusColor = "text-SUCCESS_GREEN dark:text-replit-dark-green";
          } else if (isConnecting) {
            statusText = "Connecting...";
            statusColor = "text-blue-500 dark:text-replit-primary-blue";
          } else if (isError) {
            statusText = `Error: ${details.errorMessage || 'Connection failed'}`;
            statusColor = "text-ERROR_RED dark:text-replit-dark-red";
          }

          return (
            <div key={key} className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center flex-grow min-w-0">
                <div className="p-0 bg-transparent rounded-none mr-4 flex items-center justify-center">
                  <Icon className="w-10 h-6 object-contain" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">{name}</h4>
                  <p className="text-xs text-TEXT_SECONDARY dark:text-replit-dark-text-secondary line-clamp-2 break-words sm:max-w-xs">{description}</p>
                  <p className={`text-xs font-medium mt-1 ${statusColor} truncate`}>{statusText}</p>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
                {isConnected ? (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => alert('Manage Account (mock) - Opens provider dashboard.')} leftIcon={<ExternalLinkIcon className="w-4 h-4"/>}>Manage</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDisconnect(key)} className="text-ERROR_RED hover:bg-ERROR_RED/10 dark:text-replit-dark-red dark:hover:bg-replit-dark-red/20" leftIcon={<UnlinkIcon className="w-4 h-4"/>}>Disconnect</Button>
                  </>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleConnect(key)} 
                    disabled={isConnecting}
                    leftIcon={isConnecting ? <LoadingSpinner size="sm" color="text-white" /> : <LinkIcon className="w-4 h-4" />}
                    className="bg-replit-primary-blue hover:bg-replit-primary-blue-darker"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={connectionModalState.isOpen && connectionModalState.status === 'connecting'} 
        onClose={() => { /* Managed by connection logic */ }} 
        title={`Connecting to ${connectionModalState.providerName}`}
        size="sm"
      >
        <div className="p-4 text-center">
          <LoadingSpinner text={connectionModalState.message || "Processing..."} size="md" />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentSettings;
// End of file
