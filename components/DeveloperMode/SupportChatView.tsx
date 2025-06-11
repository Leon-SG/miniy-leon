
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SupportConversation, SupportChatMessage, AICustomerServiceSettings } from '../../types';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import ToggleSwitch from '../common/ToggleSwitch';
import { SendIcon, UserIcon, StoreIcon, AISparkleIcon } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';

interface SupportChatViewProps {
  conversations: SupportConversation[];
  onSendMessage: (conversationId: string, messageText: string) => void;
  onMarkAsRead: (conversationId: string) => void;
  storeOwnerName: string;
  isGlobalAiEnabled: boolean;
  aiSettings?: AICustomerServiceSettings; // Optional, as global AI might be off
  onToggleAiAssist: (conversationId: string, enable: boolean) => void;
}

const SupportChatView: React.FC<SupportChatViewProps> = ({
  conversations,
  onSendMessage,
  onMarkAsRead,
  storeOwnerName,
  isGlobalAiEnabled,
  aiSettings,
  onToggleAiAssist,
}) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sortedConversations = [...conversations].sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

  const selectedConversation = sortedConversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    if (sortedConversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(sortedConversations[0].id);
    }
  }, [sortedConversations, selectedConversationId]);
  
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.unreadCount && selectedConversation.unreadCount > 0) {
        onMarkAsRead(selectedConversationId);
    }
  }, [selectedConversationId, selectedConversation, onMarkAsRead]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setReplyText(''); 
    textareaRef.current?.focus();
  };

  const handleSendReply = () => {
    if (selectedConversationId && replyText.trim()) {
      onSendMessage(selectedConversationId, replyText.trim());
      setReplyText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const customerBubbleClasses = "bg-BACKGROUND_MAIN dark:bg-replit-dark-border/40 text-TEXT_PRIMARY dark:text-replit-dark-text-main rounded-t-lg rounded-br-lg";
  const ownerBubbleClasses = "bg-replit-primary-blue text-white rounded-t-lg rounded-bl-lg";
  const aiAgentBubbleClasses = "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 rounded-t-lg rounded-br-lg";


  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] md:h-full border border-BORDER_DEFAULT dark:border-replit-dark-border rounded-lg bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg overflow-hidden">
      <div className="w-full md:w-1/3 border-r border-BORDER_DEFAULT dark:border-replit-dark-border overflow-y-auto styled-scrollbar flex-shrink-0 h-1/3 md:h-full">
        <div className="p-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h3 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">Customer Messages</h3>
        </div>
        {sortedConversations.length === 0 ? (
            <div className="p-4 text-center text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">
                <UserIcon className="w-10 h-10 mx-auto mb-2 text-TEXT_MUTED dark:text-replit-dark-text-disabled" />
                No customer messages yet.
            </div>
        ) : (
            <ul className="divide-y divide-BORDER_DEFAULT dark:divide-replit-dark-border">
            {sortedConversations.map(conv => (
                <li key={conv.id}>
                <button
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3 hover:bg-BACKGROUND_MAIN dark:hover:bg-replit-dark-bg focus:outline-none transition-colors duration-150 relative
                                ${selectedConversationId === conv.id ? 'bg-replit-primary-blue/10 dark:bg-replit-primary-blue/20' : ''}`}
                >
                    {selectedConversationId === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-replit-primary-blue"></div>}
                    <div className="flex justify-between items-center mb-0.5">
                    <h4 className={`text-sm font-medium truncate ${selectedConversationId === conv.id ? 'text-replit-primary-blue' : 'text-TEXT_PRIMARY dark:text-replit-dark-text-main'}`}>
                        {conv.customerName}
                    </h4>
                    {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {conv.unreadCount}
                        </span>
                    )}
                    </div>
                    <p className="text-xs text-TEXT_SECONDARY dark:text-replit-dark-text-secondary truncate pr-8">{conv.lastMessagePreview}</p>
                    <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mt-0.5 text-right">
                    {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </p>
                </button>
                </li>
            ))}
            </ul>
        )}
      </div>

      <div className="flex flex-col flex-grow h-2/3 md:h-full">
        {selectedConversation ? (
          <>
            <div className="p-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <UserIcon className="w-5 h-5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary flex-shrink-0" />
                <h3 className="text-md font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">{selectedConversation.customerName}</h3>
              </div>
              {isGlobalAiEnabled && aiSettings && (
                <ToggleSwitch
                  id={`ai-assist-toggle-${selectedConversation.id}`}
                  checked={selectedConversation.isAiAssisted || false}
                  onChange={(checked) => onToggleAiAssist(selectedConversation.id, checked)}
                  label="AI Assist"
                  labelPosition="left"
                  size="sm"
                  disabled={!isGlobalAiEnabled} 
                  title={isGlobalAiEnabled ? (selectedConversation.isAiAssisted ? "Disable AI Assist" : "Enable AI Assist") : "Global AI Agent is disabled"}
                />
              )}
            </div>
            <div className="flex-grow p-3 space-y-3 overflow-y-auto styled-scrollbar" aria-live="polite">
              {selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'storeOwner' || msg.sender === 'aiAgent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-3 py-2 text-sm shadow-sm leading-relaxed
                                  ${msg.sender === 'storeOwner' ? ownerBubbleClasses : (msg.sender === 'aiAgent' ? aiAgentBubbleClasses : customerBubbleClasses)}`}>
                    {msg.sender === 'aiAgent' && (
                      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mb-1">
                        <AISparkleIcon className="w-3.5 h-3.5 mr-1" />
                        <span>{aiSettings?.agentName || 'AI Agent'}:</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'storeOwner' ? 'text-white/70' : (msg.sender === 'aiAgent' ? 'text-blue-600/70 dark:text-blue-400/70' : 'text-TEXT_MUTED dark:text-replit-dark-text-disabled')} text-right`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-BORDER_DEFAULT dark:border-replit-dark-border">
              <div className="flex items-center space-x-2">
                <Textarea
                  ref={textareaRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Reply to ${selectedConversation.customerName}...`}
                  className="flex-grow !py-2 !px-2.5 text-sm"
                  rows={2}
                  aria-label="Type your reply"
                  disabled={selectedConversation.isAiAssisted && isGlobalAiEnabled} // Disable if AI is assisting this chat
                />
                <Button
                  variant="primary"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || (selectedConversation.isAiAssisted && isGlobalAiEnabled)}
                  className="self-end !py-2"
                  aria-label="Send reply"
                  title={(selectedConversation.isAiAssisted && isGlobalAiEnabled) ? "AI Assist is active for this chat" : "Send reply"}
                >
                  <SendIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
             <StoreIcon className="w-12 h-12 text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-3" />
            <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Select a conversation to view messages.</p>
            {sortedConversations.length === 0 && <p className="text-sm text-TEXT_MUTED dark:text-replit-dark-text-disabled mt-1">No messages yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatView;
