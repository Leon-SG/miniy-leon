import React, { useState, useRef, useEffect } from 'react';
import { AppearanceSettings, SupportChatMessage } from '../../types';

interface ModernSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  conversationMessages: SupportChatMessage[];
  onSendMessage: (messageText: string) => void;
  appearance: AppearanceSettings;
}

const ModernSupportChat: React.FC<ModernSupportChatProps> = ({
  isOpen,
  onClose,
  storeName,
  conversationMessages,
  onSendMessage,
  appearance,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    onSendMessage(messageText.trim());
    setMessageText('');
    
    // 模拟发送延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* 聊天窗口 */}
        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          {/* 头部 */}
          <div 
            className="px-4 py-3 flex items-center justify-between border-b"
            style={{ backgroundColor: appearance.primaryColor }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6" style={{ color: appearance.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{storeName} Support</h3>
                <p className="text-sm text-white text-opacity-80">We're here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 消息列表 */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {conversationMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isFromCustomer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isFromCustomer
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor: message.isFromCustomer ? undefined : appearance.primaryColor,
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none"
                  style={{ 
                    minHeight: '40px',
                    maxHeight: '120px',
                    focusRingColor: appearance.primaryColor,
                  }}
                  rows={1}
                />
              </div>
              <button
                type="submit"
                disabled={!messageText.trim() || isSending}
                className="p-2 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: appearance.primaryColor }}
              >
                {isSending ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModernSupportChat; 