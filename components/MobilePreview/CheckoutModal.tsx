
import React, { useState, useEffect, useMemo } from 'react';
import { CartItem, AppearanceSettings, StoreConfiguration, PaymentProvider } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch'; // Added for Social Bill
import { 
  XMarkIcon, 
  CreditCardIcon, 
  SUPPORTED_PAYMENT_PROVIDERS,
  ShareNetworkIcon, // Added for Social Bill
  LinkIcon,         // Added for Social Bill
  UserGroupIcon     // Added for Social Bill
} from '../../constants';
import { COUNTRIES } from '../../constants'; 
import { useToast } from '../../contexts/ToastContext'; // Added for Social Bill

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appearance: AppearanceSettings;
  onPlaceOrder: (finalAmount: number) => void; // Updated to accept final amount
  storeConfig: StoreConfiguration;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appearance,
  onPlaceOrder,
  storeConfig,
}) => {
  const { showToast } = useToast();
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: storeConfig.basicInfo.country || COUNTRIES[0]?.value || '',
  });

  // Social Bill State
  const [isSocialBillEnabled, setIsSocialBillEnabled] = useState(false);
  const [socialBillParticipants, setSocialBillParticipants] = useState(1); // Starts with the user
  const [socialBillDiscountPercent, setSocialBillDiscountPercent] = useState(0);
  const [mockShareLink, setMockShareLink] = useState('');


  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cartItems]);

  // Calculate discount based on participants
  useEffect(() => {
    if (isSocialBillEnabled) {
      if (socialBillParticipants >= 4) {
        setSocialBillDiscountPercent(10); // 10% for 4+
      } else if (socialBillParticipants >= 2) {
        setSocialBillDiscountPercent(5); // 5% for 2-3
      } else {
        setSocialBillDiscountPercent(0); // 0% for 1
      }
    } else {
      setSocialBillDiscountPercent(0);
      // setSocialBillParticipants(1); // Reset participants when disabled
    }
  }, [isSocialBillEnabled, socialBillParticipants]);
  
  useEffect(() => {
    if (isSocialBillEnabled) {
        // Generate a mock share link when enabled
        setMockShareLink(`https://miniy.app/social-bill/${Math.random().toString(36).substring(2, 9)}`);
    } else {
        setMockShareLink('');
    }
  }, [isSocialBillEnabled]);


  const discountedSubtotal = useMemo(() => subtotal * (1 - socialBillDiscountPercent / 100), [subtotal, socialBillDiscountPercent]);
  const shippingCost = 5.00; // Example shipping
  const taxes = useMemo(() => discountedSubtotal * 0.08, [discountedSubtotal]); // Example tax rate
  const orderTotal = useMemo(() => discountedSubtotal + shippingCost + taxes, [discountedSubtotal, shippingCost, taxes]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      setShippingDetails(prev => ({
        ...prev,
        country: prev.country || storeConfig.basicInfo.country || COUNTRIES[0]?.value || ''
      }));
       // Reset social bill on modal open if needed, or maintain state
      // setIsSocialBillEnabled(false); 
      // setSocialBillParticipants(1);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, storeConfig.basicInfo.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = () => {
    if (!shippingDetails.fullName || !shippingDetails.addressLine1 || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country) {
      showToast("Please fill in all shipping details.", "error");
      return;
    }
    onPlaceOrder(orderTotal); // Pass the final calculated total
  };

  if (!isOpen) return null;

  const countryOptions = COUNTRIES.map(c => ({ value: c.value, label: c.label }));

  const connectedPaymentProviders = SUPPORTED_PAYMENT_PROVIDERS.filter(
    p => storeConfig.paymentMethods[p.key]?.status === 'connected'
  );

  const handleSocialBillToggle = (checked: boolean) => {
    setIsSocialBillEnabled(checked);
    if (!checked) {
        setSocialBillParticipants(1); // Reset participants if disabled
    }
  };

  const handleSimulateFriendJoining = () => {
    if (socialBillParticipants < 10) { // Max 10 simulated participants
        setSocialBillParticipants(prev => prev + 1);
        showToast(`A friend joined your social bill! Total ${socialBillParticipants + 1} participants.`, 'success');
    } else {
        showToast("Maximum number of simulated friends reached.", 'info');
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockShareLink)
      .then(() => showToast("Link copied to clipboard!", 'success'))
      .catch(() => showToast("Failed to copy link.", 'error'));
  };

  const inputFieldClasses = "bg-white dark:bg-white text-black dark:text-black placeholder-gray-400 dark:placeholder-gray-400 border-gray-300 dark:border-gray-300 focus:ring-replit-primary-blue focus:border-replit-primary-blue";


  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 dark:bg-DARK_BACKGROUND_CONTENT/80 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div
        className="relative z-50 bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-xl border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT w-full max-w-md shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="checkout-modal-title"
          className="flex items-center justify-between p-3 sm:p-4 rounded-t-xl flex-shrink-0"
          style={{ backgroundColor: appearance.primaryColor }}
        >
          <h2 className="text-base sm:text-lg font-semibold text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
            aria-label="Close checkout"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-5 styled-scrollbar">
          {/* Order Summary */}
          <section>
            <h3 className="text-sm sm:text-md font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-1.5 sm:mb-2">Order Summary</h3>
            <div className="bg-gray-50 dark:bg-DARK_BORDER_MUTED/30 p-2 sm:p-3 rounded-md border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT">
              <div className="flex justify-between text-xs sm:text-sm text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} item(s)</span>
                <span className="font-medium" style={{color: appearance.primaryColor}}>${subtotal.toFixed(2)}</span>
              </div>
              {isSocialBillEnabled && socialBillDiscountPercent > 0 && (
                <div className="flex justify-between text-xs text-SUCCESS_GREEN dark:text-green-400">
                  <span>Social Bill Discount ({socialBillDiscountPercent}%)</span>
                  <span>-${(subtotal * socialBillDiscountPercent / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mt-1">
                <span>Shipping (Simulated)</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED">
                <span>Taxes (Simulated)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex justify-between text-sm sm:text-md font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY">
                <span>Total</span>
                <span style={{color: appearance.primaryColor}}>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>
          
          {/* Social Bill Section */}
          <section className="p-3 sm:p-4 border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT rounded-lg bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm sm:text-md font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue">Social Bill & Save Together!</h3>
                <ToggleSwitch
                    id="social-bill-toggle"
                    checked={isSocialBillEnabled}
                    onChange={handleSocialBillToggle}
                    label={isSocialBillEnabled ? "Enabled" : "Disabled"}
                    labelPosition="left"
                    size="sm"
                />
            </div>
            {isSocialBillEnabled && (
                <div className="space-y-2 text-xs text-TEXT_SECONDARY dark:text-DARK_TEXT_SECONDARY">
                    <p>Invite friends to join your order, the more the merrier, the cheaper it gets!</p>
                    <div className="p-2 bg-gray-100 dark:bg-DARK_BORDER_MUTED/40 rounded break-all">
                        <span className="font-medium">Share Link: </span>{mockShareLink}
                    </div>
                    <div className="flex space-x-2 mt-1">
                        <Button variant="secondary" size="sm" onClick={handleCopyLink} leftIcon={<LinkIcon className="w-3.5 h-3.5"/>} className="!text-xs">Copy Link</Button>
                        <Button variant="ghost" size="sm" onClick={() => showToast("Sharing via WhatsApp... (Simulated)", 'info')} leftIcon={<i className="ph-whatsapp-logo text-sm"></i>} className="!text-xs">WhatsApp</Button>
                        <Button variant="ghost" size="sm" onClick={() => showToast("Sharing via Messenger... (Simulated)", 'info')} leftIcon={<i className="ph-messenger-logo text-sm"></i>} className="!text-xs">Messenger</Button>
                    </div>
                    <div className="flex items-center mt-1.5 pt-1.5 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT">
                        <UserGroupIcon className="w-4 h-4 mr-1.5 text-PRIMARY_MAIN dark:text-replit-primary-blue"/>
                        Participants: You + {socialBillParticipants - 1} friend(s)
                    </div>
                    <Button variant="primary" size="sm" onClick={handleSimulateFriendJoining} className="w-full !text-xs mt-1" style={{ backgroundColor: appearance.primaryColor, opacity: 0.8 }} disabled={socialBillParticipants >= 10}>
                        Simulate Friend Joining
                    </Button>
                    {socialBillDiscountPercent > 0 && (
                        <p className="font-semibold text-SUCCESS_GREEN dark:text-green-400 text-sm text-center mt-1">
                            Current Discount: {socialBillDiscountPercent}% OFF!
                        </p>
                    )}
                </div>
            )}
          </section>

          {/* Shipping Information */}
          <section>
            <h3 className="text-sm sm:text-md font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-1.5 sm:mb-2">Shipping Address</h3>
            <div className="space-y-2 sm:space-y-3">
              <Input label="Full Name" name="fullName" value={shippingDetails.fullName} onChange={handleInputChange} placeholder="Your Name" required className={inputFieldClasses} />
              <Input label="Address Line 1" name="addressLine1" value={shippingDetails.addressLine1} onChange={handleInputChange} placeholder="Street Address" required className={inputFieldClasses} />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Input label="City" name="city" value={shippingDetails.city} onChange={handleInputChange} placeholder="City Name" required className={inputFieldClasses} />
                <Input label="Postal Code" name="postalCode" value={shippingDetails.postalCode} onChange={handleInputChange} placeholder="Zip Code" required className={inputFieldClasses} />
              </div>
              <Select label="Country/Region" name="country" value={shippingDetails.country} onChange={handleInputChange} options={countryOptions} required className={inputFieldClasses} />
            </div>
          </section>

          {/* Payment Information */}
          <section>
            <h3 className="text-sm sm:text-md font-semibold text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY mb-1.5 sm:mb-2">Payment Options</h3>
            {connectedPaymentProviders.length > 0 ? (
              <div className="p-3 sm:p-4 border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT rounded-md bg-gray-50 dark:bg-DARK_BORDER_MUTED/30">
                <p className="text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mb-2">Payment Methods:</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {connectedPaymentProviders.map(provider => (
                    <div key={provider.key} title={provider.name} className="p-1.5 bg-white dark:bg-gray-700 border border-BORDER_MUTED dark:border-DARK_BORDER_MUTED rounded-md shadow-sm flex items-center justify-center">
                      <provider.Icon className="h-6 w-10 object-contain" />
                    </div>
                  ))}
                </div>
                 <p className="text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED mt-3">Actual payment process is simulated in this preview.</p>
              </div>
            ) : (
              <div className="p-3 sm:p-4 border border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT rounded-md bg-yellow-50 dark:bg-yellow-900/30 text-center">
                <CreditCardIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 dark:text-yellow-400 mx-auto mb-1.5 sm:mb-2" />
                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                  No payment methods available currently.
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400/80 mt-1">
                  Please configure payment providers in Developer Mode.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="p-3 sm:p-4 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex-shrink-0 bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-b-xl">
          <div className="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-2 space-y-2 sm:space-y-0">
            <Button
              variant="primary"
              className="w-full sm:flex-1 text-sm"
              style={{ backgroundColor: appearance.primaryColor }}
              onClick={handleSubmitOrder}
              disabled={connectedPaymentProviders.length === 0 || cartItems.length === 0}
            >
              Confirm Order
            </Button>
            <Button variant="ghost" className="w-full sm:flex-1 text-sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
