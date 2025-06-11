import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, CardContent, AIModelInfo, Mode, DeveloperSection } from '../types'; 
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import AICardMessage from './AICardMessage'; 
import { 
  UploadIcon, 
  ChevronDownIcon, 
  UnlinkIcon, 
  AttachFileIcon, 
  AISparkleIcon, 
  SendIcon,
  AVAILABLE_AI_MODELS,
  CheckIcon,
  XMarkIcon, 
  InfoIcon,
  FileImageIcon,
  FileTextIcon,
  FilePdfIcon,
  GenericFileIcon,
  EditIcon,
} from '../constants';
import { optimizeTextWithAI } from "../services/anthropicService";
import ToggleSwitch from './common/ToggleSwitch'; // Added ToggleSwitch import

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string, file?: File) => Promise<void>;
  isLoading: boolean;
  currentAiOperation: string;
  selectedElementInfo: { id: string; name: string } | null;
  onClearSelectedElementInfo: () => void;
  onCardAction: (actionId: string, value?: string | number | boolean) => void; 
  currentAiModel: string;
  onAiModelChange: (modelId: string) => void;
  currentAppMode: Mode;
  navigateToSelectedElementInDevMode: (elementInfo: { id: string; name: string } | null) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading,
  currentAiOperation,
  selectedElementInfo,
  onClearSelectedElementInfo,
  onCardAction,
  currentAiModel, 
  onAiModelChange, 
  currentAppMode,
  navigateToSelectedElementInDevMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeSelectionContext, setActiveSelectionContext] = useState<{ id: string; name: string } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null); 
  const dropZoneRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState<string | null>(null);

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const modelButtonRef = useRef<HTMLButtonElement>(null);

  const [isBeautifyingLoading, setIsBeautifyingLoading] = useState(false);

  // State for new toggles
  const [isBrandVisionaryEnabled, setIsBrandVisionaryEnabled] = useState(false);
  const [isVisualSparkEnabled, setIsVisualSparkEnabled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (selectedElementInfo) {
      setActiveSelectionContext(selectedElementInfo);
      setInputText(''); 
      textareaRef.current?.focus();
    } else {
      setActiveSelectionContext(null);
    }
  }, [selectedElementInfo]);


  const clearActiveSelection = () => {
    setActiveSelectionContext(null);
    onClearSelectedElementInfo(); 
  };
  
  const handleFormSubmitInternal = async () => {
    const textToSend = inputText.trim();
    if ((textToSend || uploadedFile) && !isLoading) {
      let messageWithContext = textToSend;
      
      if (uploadedFile) {
        messageWithContext = `[File Attached: ${uploadedFile.name}] ${messageWithContext}`.trim();
      }

      // You might want to include the state of isBrandVisionaryEnabled and isVisualSparkEnabled
      // when calling onSendMessage if the AI needs to be aware of them.
      // For now, their state is only local.
      // Example: 
      // let fullMessage = messageWithContext;
      // if (isBrandVisionaryEnabled) fullMessage = `[BrandVisionaryEnabled] ${fullMessage}`;
      // if (isVisualSparkEnabled) fullMessage = `[VisualSparkEnabled] ${fullMessage}`;
      // await onSendMessage(fullMessage, uploadedFile || undefined);

      await onSendMessage(messageWithContext, uploadedFile || undefined);
      setInputText('');
      setUploadedFile(null); 
      if (uploadedFilePreviewUrl) {
        URL.revokeObjectURL(uploadedFilePreviewUrl);
        setUploadedFilePreviewUrl(null);
      }
      textareaRef.current?.focus(); 
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmitInternal();
  };

  const handleFileProcessing = (file: File) => {
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setUploadedFilePreviewUrl(previewUrl);
      } else {
        if (uploadedFilePreviewUrl) URL.revokeObjectURL(uploadedFilePreviewUrl);
        setUploadedFilePreviewUrl(null);
      }
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const clearUploadedFile = () => {
    setUploadedFile(null);
    if (uploadedFilePreviewUrl) {
      URL.revokeObjectURL(uploadedFilePreviewUrl);
      setUploadedFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
    }
  }

  useEffect(() => {
    return () => {
      if (uploadedFilePreviewUrl) {
        URL.revokeObjectURL(uploadedFilePreviewUrl);
      }
    };
  }, [uploadedFilePreviewUrl]);

  const handleDragEnter = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
    } else if (!e.relatedTarget) {
        setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleFormSubmitInternal();
    }
  };

  const placeholderText = activeSelectionContext
    ? `Describe changes for "${activeSelectionContext.name}"...`
    : "Message Agent...";

  const toggleModelDropdown = () => setIsModelDropdownOpen(prev => !prev);

  const handleModelSelect = (modelId: string) => {
    onAiModelChange(modelId); 
    setIsModelDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModelDropdownOpen &&
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node) &&
        modelButtonRef.current &&
        !modelButtonRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelDropdownOpen]);

  const selectedModelForDisplay = AVAILABLE_AI_MODELS.find(m => m.id === currentAiModel) || AVAILABLE_AI_MODELS[0];

  const freeModels = AVAILABLE_AI_MODELS.filter(m => m.category === 'Free');
  const paidModels = AVAILABLE_AI_MODELS.filter(m => m.category === 'Paid');

  const handlePromptBeautifyClick = async () => { 
    if (!inputText.trim() || isBeautifyingLoading) return;

    setIsBeautifyingLoading(true);
    try {
      const beautifiedText = await optimizeTextWithAI(inputText, 'user prompt', currentAiModel);
      if (beautifiedText) {
        setInputText(beautifiedText);
      } else {
        console.warn("AI prompt beautification returned null or empty.");
      }
    } catch (error) {
      console.error("Error during AI prompt beautification:", error);
    } finally {
      setIsBeautifyingLoading(false);
      textareaRef.current?.focus();
    }
  };

  const getFileIcon = (fileType: string) => {
    const iconClass = "w-4 h-4 text-TEXT_PRIMARY dark:text-replit-dark-text-main"; 
    if (fileType.startsWith('image/')) return <FileImageIcon className={iconClass} />;
    if (fileType === 'application/pdf') return <FilePdfIcon className={iconClass} />;
    if (fileType.startsWith('text/')) return <FileTextIcon className={iconClass} />;
    return <GenericFileIcon className={iconClass} />;
  };

  const userBubbleClasses = "bg-replit-primary-blue text-white rounded-t-md rounded-bl-md";
  const aiBubbleClasses = "bg-BACKGROUND_MAIN dark:bg-replit-dark-border/40 text-TEXT_PRIMARY dark:text-replit-dark-text-main rounded-t-xl rounded-br-xl shadow-sm border border-BORDER_DEFAULT dark:border-replit-dark-border";

  const handleNavigateClick = useCallback(() => {
    if (activeSelectionContext && currentAppMode === Mode.DEVELOPER) {
      navigateToSelectedElementInDevMode(activeSelectionContext);
    }
  }, [activeSelectionContext, currentAppMode, navigateToSelectedElementInDevMode]);

  // Handlers for new toggles
  const handleBrandVisionaryToggle = (checked: boolean) => {
    setIsBrandVisionaryEnabled(checked);
    // Potentially show a toast or log, but no core logic change for now.
  };

  const handleVisualSparkToggle = (checked: boolean) => {
    setIsVisualSparkEnabled(checked);
  };

  const getModelBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Default':
        return 'bg-replit-primary-blue/70 text-white';
      case 'Silver':
        return 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
      case 'Gold':
        return 'bg-yellow-400 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-100';
      default:
        return 'bg-gray-200 dark:bg-replit-dark-border text-TEXT_MUTED dark:text-replit-dark-text-disabled';
    }
  };

  const getModelBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Silver':
        return <span className="text-[10px]">👑</span>;
      case 'Gold':
        return <span className="text-[10px]">👑</span>;
      default:
        return null;
    }
  };

  const isColorDark = (color: string) => {
    // 简单的颜色亮度计算
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  return (
    <div 
      className="flex flex-col h-full bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-md" 
    >
      <div className="p-3 border-b border-BORDER_DEFAULT dark:border-replit-dark-border">
        <h2 className="text-base font-medium text-TEXT_PRIMARY dark:text-replit-dark-text-main">AI Assistant</h2> 
      </div>
      <div 
        ref={messagesContainerRef}
        className="flex-grow p-3 space-y-2.5 overflow-y-auto styled-scrollbar" 
        aria-live="polite" 
        aria-atomic="false" 
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 text-sm leading-relaxed
                ${msg.sender === 'user' 
                  ? userBubbleClasses
                  : (msg.contentType === 'card')
                    ? `w-full !bg-transparent !border-none !p-0` // For cards, let AICardMessage handle bg
                    : aiBubbleClasses
                }`} 
            >
              {msg.contentType === 'card' && msg.cardContent ? (
                <>
                  {msg.text && <p className="text-sm whitespace-pre-wrap mb-1.5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{msg.text}</p>}
                  <AICardMessage cardContent={msg.cardContent} onAction={onCardAction} />
                </>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
              <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-white/70' : 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary'} text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && ( 
          <div className="flex justify-start">
             <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-t-md rounded-br-md ${aiBubbleClasses}`}>
                <LoadingSpinner size="sm" text={`AI is ${currentAiOperation}...`} color="text-PRIMARY_MAIN dark:text-replit-primary-blue" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-BORDER_DEFAULT dark:border-replit-dark-border">
        {activeSelectionContext && (
          <div className="mb-2 px-2.5 py-1 bg-replit-primary-blue/10 dark:bg-replit-primary-blue/20 text-replit-primary-blue dark:text-replit-primary-blue rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs border border-replit-primary-blue/30 dark:border-replit-primary-blue/40">
            <div className="flex items-center mb-1 sm:mb-0">
                <span className="font-medium truncate"><span className="font-semibold">Context:</span> {activeSelectionContext.name}</span>
                <button
                onClick={clearActiveSelection}
                className="ml-1.5 p-0.5 hover:bg-replit-primary-blue/20 dark:hover:bg-replit-primary-blue/30 rounded-full transition-colors flex-shrink-0"
                title="Clear selection context"
                aria-label="Clear selection context"
                >
                <UnlinkIcon className="w-3.5 h-3.5" />
                </button>
            </div>
            {currentAppMode === Mode.DEVELOPER && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleNavigateClick}
                className="!text-xs text-replit-primary-blue hover:bg-replit-primary-blue/20 dark:hover:bg-replit-primary-blue/30 self-start sm:self-center !py-0.5 !px-1"
                leftIcon={<EditIcon className="w-3 h-3" />}
                title={`Edit ${activeSelectionContext.name} in Developer Mode`}
              >
                Edit in Dev Mode
              </Button>
            )}
          </div>
        )}
        {uploadedFile && (
          <div className="mb-2 px-2 py-1.5 bg-BORDER_DEFAULT/50 dark:bg-replit-dark-border rounded-md text-TEXT_PRIMARY dark:text-replit-dark-text-main flex items-center text-xs">
            {uploadedFilePreviewUrl ? (
              <img src={uploadedFilePreviewUrl} alt="File preview" className="w-8 h-8 object-cover rounded mr-2 border border-BACKGROUND_MAIN dark:border-replit-dark-bg" />
            ) : (
              <div className="mr-2 flex-shrink-0 p-1 bg-TEXT_SECONDARY/30 dark:bg-replit-dark-text-secondary/30 rounded-sm">
                {getFileIcon(uploadedFile.type)}
              </div>
            )}
            <div className="flex-grow min-w-0">
                <p className="font-medium truncate text-xs">{uploadedFile.name}</p>
                <p className="text-xs text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={clearUploadedFile}
              className="ml-2 p-0.5 hover:bg-TEXT_SECONDARY/20 dark:hover:bg-replit-dark-text-secondary/20 rounded-full transition-colors flex-shrink-0"
              title="Remove file"
              aria-label="Remove file"
            >
              <XMarkIcon className="w-3.5 h-3.5 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main" />
            </button>
          </div>
        )}
        <form 
          ref={dropZoneRef}
          onSubmit={handleSubmit} 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`bg-BACKGROUND_MAIN dark:bg-replit-dark-bg p-2 rounded-md border border-BORDER_DEFAULT dark:border-replit-dark-border focus-within:ring-1 focus-within:ring-replit-primary-blue focus-within:border-replit-primary-blue transition-all duration-150 relative
                      ${isDraggingOver ? 'ring-2 ring-replit-primary-blue border-replit-primary-blue' : ''}
                      ${isLoading && activeSelectionContext ? 'border-replit-primary-blue chat-loading-pulse-opacity' : ''}`}
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full p-1 block resize-none border-none focus:outline-none bg-transparent text-sm placeholder-TEXT_MUTED dark:placeholder-replit-dark-text-disabled text-TEXT_PRIMARY dark:text-replit-dark-text-main"
            rows={uploadedFile ? 2 : 3} 
            disabled={isLoading || isBeautifyingLoading}
            aria-label="Chat message input"
          />
          <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-BORDER_DEFAULT/50 dark:border-replit-dark-border/50">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 relative"> {/* Main controls container */}
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="!p-1 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-PRIMARY_MAIN dark:hover:text-replit-primary-blue"
                onClick={handleFileUploadClick} 
                disabled={isLoading || isBeautifyingLoading} 
                title="Attach file"
                aria-label="Attach file"
                isColorDark={isColorDark}
              >
                <AttachFileIcon className="w-4 h-4" />
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelected} 
                accept="image/*,application/pdf,text/*"
              />
              <div className="relative"> {/* Model Dropdown Container */}
                <Button 
                  ref={modelButtonRef}
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="!p-1 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-PRIMARY_MAIN dark:hover:text-replit-primary-blue flex items-center"
                  disabled={isLoading || isBeautifyingLoading} 
                  title="Select AI Model" 
                  onClick={toggleModelDropdown}
                  aria-label="Select AI Model"
                  aria-haspopup="listbox" 
                  aria-expanded={isModelDropdownOpen} 
                  isColorDark={isColorDark}
                >
                  <span className="text-xs font-medium truncate max-w-[80px]">{selectedModelForDisplay.name}</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 ml-0.5" />
                </Button>
                {isModelDropdownOpen && (
                  <div 
                    ref={modelDropdownRef}
                    className="absolute bottom-full left-0 mb-1 w-56 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-md border border-BORDER_DEFAULT dark:border-replit-dark-border z-50 py-0.5 shadow-light-subtle dark:shadow-subtle"
                    role="listbox" 
                    aria-label="AI Models"
                  >
                    {freeModels.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary" role="group" aria-label="Free Models">Free Models</div>
                        {freeModels.map(model => (
                          <button
                            key={model.id}
                            onClick={() => handleModelSelect(model.id)}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded-sm flex justify-between items-center group
                                        ${currentAiModel === model.id ? 'bg-replit-primary-blue/20 text-replit-primary-blue font-medium' : 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-BORDER_DEFAULT/50 dark:hover:bg-replit-dark-border/50 hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main'}`}
                            role="option"
                            aria-selected={currentAiModel === model.id}
                          >
                            <span className="truncate">{model.name}</span>
                            {model.badge && <span className={`text-[10px] px-1 py-0.5 rounded-sm ${currentAiModel === model.id ? 'bg-replit-primary-blue/70 text-white' : 'bg-gray-200 dark:bg-replit-dark-border text-TEXT_MUTED dark:text-replit-dark-text-disabled'}`}>{model.badge}</span>}
                            {currentAiModel === model.id && <CheckIcon className="w-3.5 h-3.5 text-replit-primary-blue ml-1" />}
                          </button>
                        ))}
                      </>
                    )}
                    {paidModels.length > 0 && (
                      <>
                        <div className="px-2 pt-2 pb-1 text-xs font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary border-t border-BORDER_DEFAULT dark:border-replit-dark-border mt-0.5" role="group" aria-label="Paid Models">Paid Models</div>
                        {paidModels.map(model => (
                          <button
                            key={model.id}
                            onClick={() => handleModelSelect(model.id)}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded-sm flex justify-between items-center group
                                          ${currentAiModel === model.id ? 'bg-replit-primary-blue/20 text-replit-primary-blue font-medium' : 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-BORDER_DEFAULT/50 dark:hover:bg-replit-dark-border/50 hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main'}`}
                            role="option"
                            aria-selected={currentAiModel === model.id}
                          >
                            <span className="truncate">{model.name}</span>
                            <div className="flex items-center">
                                {model.badge && (
                                  <div className="flex items-center">
                                    <span className={`text-[10px] px-1 py-0.5 rounded-sm mr-1 ${getModelBadgeStyle(model.badge)}`}>
                                      {getModelBadgeIcon(model.badge)}
                                    </span>
                                    {currentAiModel === model.id && <CheckIcon className="w-3.5 h-3.5 text-replit-primary-blue" />}
                                  </div>
                                )}
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* New Toggles Section */}
              <div className="flex items-center space-x-2 sm:space-x-3 pl-1 sm:pl-2">
                <ToggleSwitch
                  id="ai-brand-visionary-toggle"
                  checked={isBrandVisionaryEnabled}
                  onChange={handleBrandVisionaryToggle}
                  label="AI Brand Visionary"
                  labelPosition="right"
                  size="sm"
                  disabled={isLoading || isBeautifyingLoading}
                  title="AI Brand Visionary & Kickstart"
                />
                <ToggleSwitch
                  id="ai-visual-spark-toggle"
                  checked={isVisualSparkEnabled}
                  onChange={handleVisualSparkToggle}
                  label="AI Visual Spark"
                  labelPosition="right"
                  size="sm"
                  disabled={isLoading || isBeautifyingLoading}
                  title="AI Visual Spark Engine"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!p-1 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:text-PRIMARY_MAIN dark:hover:text-replit-primary-blue ml-auto sm:ml-0" // Adjusted margin for flex-wrap
                onClick={handlePromptBeautifyClick}
                disabled={isLoading || isBeautifyingLoading || !inputText.trim()}
                title="Beautify prompt with AI"
                aria-label="Beautify prompt with AI"
                isColorDark={isColorDark}
              >
                {isBeautifyingLoading ? <LoadingSpinner size="sm" color="text-PRIMARY_MAIN" /> : <AISparkleIcon className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              size="sm" 
              className="!px-2 !py-1"
              disabled={isLoading || isBeautifyingLoading || (!inputText.trim() && !uploadedFile)} 
              title="Send message"
              aria-label="Send message"
              isColorDark={isColorDark}
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
          {isDraggingOver && (
            <div className="absolute inset-0 bg-replit-primary-blue/20 dark:bg-replit-primary-blue/30 border-2 border-dashed border-replit-primary-blue dark:border-replit-primary-blue rounded-md flex flex-col items-center justify-center pointer-events-none">
              <UploadIcon className="w-8 h-8 text-replit-primary-blue dark:text-replit-primary-blue mb-1" />
              <p className="text-sm font-medium text-replit-primary-blue dark:text-replit-primary-blue">Drop file here</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
