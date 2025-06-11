
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SupportChatMessage, AppearanceSettings } from '../../types';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { XMarkIcon, SendIcon } from '../../constants';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  conversationMessages: SupportChatMessage[];
  onSendMessage: (messageText: string) => void;
  appearance: AppearanceSettings;
}

const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  storeName,
  conversationMessages,
  onSendMessage,
  appearance,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
        textareaRef.current?.focus();
    }
  }, [isOpen, conversationMessages, scrollToBottom]);


  const handleSendMessageInternal = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageInternal();
    }
  };
  
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const customerBubbleClasses = "bg-replit-primary-blue text-white rounded-t-lg rounded-bl-lg";
  const ownerBubbleClasses = "bg-BACKGROUND_MAIN dark:bg-DARK_BORDER_MUTED/40 text-TEXT_PRIMARY dark:text-DARK_TEXT_PRIMARY rounded-t-lg rounded-br-lg";

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-DARK_BACKGROUND_CONTENT/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-chat-modal-title"
    >
      <div
        className="bg-BACKGROUND_CONTENT dark:bg-DARK_BACKGROUND_CONTENT rounded-t-xl border-t border-x border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT w-full max-w-sm h-[70%] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div
          id="support-chat-modal-title"
          className="flex items-center justify-between p-3 rounded-t-xl flex-shrink-0"
          style={{ backgroundColor: appearance.primaryColor }}
        >
          <h2 className="text-base font-semibold text-white truncate pr-2">Chat with {storeName}</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 -mr-1"
            aria-label="Close support chat"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow p-3 space-y-2 overflow-y-auto styled-scrollbar">
          {conversationMessages.length === 0 && (
            <div className="text-center text-xs text-TEXT_MUTED dark:text-DARK_TEXT_MUTED py-4">
              Ask a question or send us a message!
            </div>
          )}
          {conversationMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-1.5 text-sm shadow-sm leading-relaxed
                              ${msg.sender === 'customer' ? customerBubbleClasses : ownerBubbleClasses}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-0.5 opacity-70 ${msg.sender === 'customer' ? 'text-white/70 text-right' : 'text-TEXT_MUTED dark:text-DARK_TEXT_MUTED text-right'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 sm:p-3 border-t border-BORDER_DEFAULT dark:border-DARK_BORDER_DEFAULT flex-shrink-0 bg-BACKGROUND_MAIN dark:bg-DARK_BACKGROUND_CONTENT">
          <div className="flex items-center space-x-2">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow !py-2 !px-2.5 text-sm"
              rows={1}
              aria-label="Type your message to support"
            />
            <Button
              variant="primary"
              onClick={handleSendMessageInternal}
              disabled={!inputText.trim()}
              className="self-end !py-2"
              style={{ backgroundColor: appearance.primaryColor }}
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatModal;
