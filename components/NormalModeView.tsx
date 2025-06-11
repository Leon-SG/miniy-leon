import React from 'react';
import { ChatMessage, Mode, Product, CartItem, DeveloperSection } from '../types'; 
import ChatInterface from './ChatInterface';

interface NormalModeViewProps {
  chatMessages: ChatMessage[];
  onSendMessage: (messageText: string, file?: File) => Promise<void>;
  isAiLoading: boolean;
  currentAiOperation: string;
  selectedElementInfo: { id: string; name: string } | null;
  onClearSelectedElementInfo: () => void;
  onCardAction: (actionId: string, value?: string | number | boolean) => void;
  currentAiModel: string;
  onAiModelChange: (modelId: string) => void;
  currentAppMode: Mode;
  navigateToSelectedElementInDevMode: (elementInfo: { id: string; name: string } | null) => void;
}

const NormalModeView: React.FC<NormalModeViewProps> = ({
  chatMessages,
  onSendMessage,
  isAiLoading,
  currentAiOperation,
  selectedElementInfo,
  onClearSelectedElementInfo,
  onCardAction,
  currentAiModel,
  onAiModelChange,
  currentAppMode,
  navigateToSelectedElementInDevMode,
}) => {
  return (
    <div className="h-full w-full flex flex-col p-2 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg"> 
      <ChatInterface
        messages={chatMessages}
        onSendMessage={onSendMessage}
        isLoading={isAiLoading}
        currentAiOperation={currentAiOperation}
        selectedElementInfo={selectedElementInfo}
        onClearSelectedElementInfo={onClearSelectedElementInfo}
        onCardAction={onCardAction}
        currentAiModel={currentAiModel}
        onAiModelChange={onAiModelChange}
        currentAppMode={currentAppMode}
        navigateToSelectedElementInDevMode={navigateToSelectedElementInDevMode}
      />
    </div>
  );
};

export default NormalModeView;
// End of file
