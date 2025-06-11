import React from 'react';
import {
  siVisa,
  siMastercard,
  siAmericanexpress,
  siApplepay,
  siGooglepay,
  siStripe,
  siPaypal,
  siSquare,
  siAlipay,
  siWechat,
} from 'simple-icons';

const paymentIconClass = "w-10 h-6 transition-all duration-200 hover:scale-110";

// 品牌颜色映射
const brandColors = {
  visa: '#142688',
  mastercard: '#EB001B',
  amex: '#006FCF',
  applepay: '#000000',
  googlepay: '#5F6368',
  stripe: '#635BFF',
  paypal: '#003087',
  square: '#000000',
  alipay: '#1677FF',
  wechat: '#07C160',
};

export const VisaIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.visa}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siVisa.path} />
  </svg>
);

export const MastercardIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.mastercard}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siMastercard.path} />
  </svg>
);

export const AmexIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.amex}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siAmericanexpress.path} />
  </svg>
);

export const ApplePayIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.applepay}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siApplepay.path} />
  </svg>
);

export const GooglePayIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.googlepay}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siGooglepay.path} />
  </svg>
);

export const StripeIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.stripe}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siStripe.path} />
  </svg>
);

export const PayPalIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.paypal}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siPaypal.path} />
  </svg>
);

export const SquareIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.square}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siSquare.path} />
  </svg>
);

export const AlipayIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.alipay}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siAlipay.path} />
  </svg>
);

export const WeChatPayIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className={paymentIconClass}
    fill={brandColors.wechat}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={siWechat.path} />
  </svg>
); 