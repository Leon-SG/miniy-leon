import React, { useEffect, useRef, useState } from 'react';
import { FireIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

const BANNER_COLOR = '#D4FF00';
const BANNER_TEXTS = [
  '⚡ Flash Sale: Up to 50% OFF every day!',
  '🎁 New users get exclusive coupons!',
  '🚚 Free shipping on orders over $99',
];

// 用户自定义消息板内容
const USER_MESSAGE = {
  title: 'Welcome to Our Store!',
  content: 'We are excited to have you here. Check out our latest products and exclusive deals. Don\'t forget to sign up for our newsletter to get the latest updates and special offers.',
  more: 'Join our community and be the first to know about new arrivals and special promotions. Follow us on social media for more updates!'
};

function getTimeLeft(target: Date) {
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

interface ModernBannerProps {
  children?: React.ReactNode;
  showUserMessage?: boolean;
}

const ModernBanner: React.FC<ModernBannerProps> = ({ children, showUserMessage = true }) => {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  // 假设秒杀活动24小时后结束
  const endTime = useRef(new Date(Date.now() + 24 * 60 * 60 * 1000));

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_TEXTS.length);
      setTimeLeft(getTimeLeft(endTime.current));
    }, 3500);
    setTimeLeft(getTimeLeft(endTime.current));
    return () => timer.current && clearInterval(timer.current);
  }, []);

  return (
    <>
      <div
        className="w-full rounded-2xl px-3 py-3 flex items-center gap-3 shadow-lg animate-fade-in"
        style={{ background: BANNER_COLOR, color: '#222', fontWeight: 600, fontSize: '1.1rem', minHeight: 30 }}
      >
        <FireIcon className="w-6 h-6 text-[#222]" />
        <span className="flex-1 truncate">{BANNER_TEXTS[current]}</span>
        <span className="text-xs font-mono bg-black/10 rounded px-2 py-1 ml-2 flex items-center gap-1" style={{ color: '#222' }}>
          <ClockIcon className="w-4 h-4" /> {timeLeft} left
        </span>
      </div>
      {children}
      {/* 用户自定义消息板 */}
      {showUserMessage && (
        <div className="w-full mt-4 rounded-2xl bg-[#181818] p-4 shadow-lg border-2 border-[#D4FF00]">
          <h3 className="text-lg font-bold text-[#D4FF00] mb-2">{USER_MESSAGE.title}</h3>
          <p className="text-sm text-[#D4FF00] opacity-80">
            {isExpanded ? USER_MESSAGE.content + ' ' + USER_MESSAGE.more : USER_MESSAGE.content}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[#D4FF00] text-sm font-bold hover:underline"
          >
            {isExpanded ? 'Show Less' : 'More'}
          </button>
        </div>
      )}
    </>
  );
};

export default ModernBanner; 