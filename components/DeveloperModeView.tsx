import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StoreConfiguration, DeveloperSection, Product, Promotion, BasicInfo, PaymentMethods, AppearanceSettings, Mode, AICustomerServiceSettings, CartItem, SupportConversation, SupportChatMessage } from '../../types';
import BasicInfoEditor from './DeveloperMode/BasicInfoEditor';
import SocialMediaManager from './DeveloperMode/SocialMediaManager';
import ProductManager from './DeveloperMode/ProductManager';
import PromotionManager from './DeveloperMode/PromotionManager';
import PaymentSettingsComponent from './DeveloperMode/PaymentSettings';
import StoreTemplateSelector from './DeveloperMode/StoreTemplateSelector';
import AnalyticsView from './DeveloperMode/AnalyticsView';
import AICustomerServiceManager from './DeveloperMode/AICustomerServiceManager';
import StatusCheckView from './DeveloperMode/StatusCheckView';
import SupportChatView from './DeveloperMode/SupportChatView'; 
import {
    CreditCardIcon,
    ChartBarSquareIcon,
    NewBasicInfoIcon,
    NewProductsIcon,
    NewPromotionIcon,
    NewThemeIcon,
    NewAIAgentIcon,
    ShareNetworkIcon,
    CaretDoubleLeftIcon,
    CaretDoubleRightIcon,
    ServerIcon,
    ChatBubbleOvalLeftEllipsisIcon, 
    DocumentTextIcon 
} from '../constants';
import { DeploymentSettings } from './DeveloperMode/DeploymentSettingsModal';

const SIDEBAR_OPEN_WIDTH_MD_PX = 220; 
const SIDEBAR_COLLAPSED_WIDTH_MD_PX = 60; 
const DRAWER_WIDTH_SM_VW = 85; 
const DRAWER_MAX_WIDTH_SM_PX = 280; 

interface DeveloperModeViewProps {
  storeConfig: StoreConfiguration;
  onUpdateConfig: (newConfig: StoreConfiguration) => void;
  currentAppMode: Mode;
  onAppModeChange: (mode: Mode) => void;
  onDeploymentSuccess: (settings: DeploymentSettings) => void;
  targetSection: DeveloperSection | null;
  onTargetSectionConsumed: () => void;
  onActiveSectionChange: (section: DeveloperSection) => void; 
  supportConversations: SupportConversation[];
  onSendMessageToSupport: (conversationId: string, messageText: string, senderName: string) => void; // Added senderName
  onMarkConversationAsRead: (conversationId: string) => void;
  onCreateSupportConversation: (customerName: string, firstMessage: string) => string;
  onToggleAiAssistanceForConversation: (conversationId: string, enable: boolean) => void; // Added prop
}

const DeveloperModeView: React.FC<DeveloperModeViewProps> = ({
  storeConfig,
  onUpdateConfig,
  currentAppMode,
  onAppModeChange,
  onDeploymentSuccess,
  targetSection,
  onTargetSectionConsumed,
  onActiveSectionChange, 
  supportConversations,
  onSendMessageToSupport,
  onMarkConversationAsRead,
  onCreateSupportConversation,
  onToggleAiAssistanceForConversation, // Destructure new prop
}) => {
  const [activeSection, setActiveSection] = useState<DeveloperSection>('storeInfo'); 
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [isSmDrawerOpen, setIsSmDrawerOpen] = useState(false); 
  const [isMdSidebarCollapsed, setIsMdSidebarCollapsed] = useState(false); 

  useEffect(() => {
    if (targetSection && targetSection !== activeSection) {
      setActiveSection(targetSection);
      onTargetSectionConsumed(); 
    }
  }, [targetSection, activeSection, onTargetSectionConsumed]);

  useEffect(() => {
    onActiveSectionChange(activeSection);
  }, [activeSection, onActiveSectionChange]);


  const handleUpdateBasicInfo = (updatedBasicInfo: BasicInfo) => onUpdateConfig({ ...storeConfig, basicInfo: updatedBasicInfo });
  const handleUpdateSocialMedia = (updatedBasicInfo: BasicInfo) => onUpdateConfig({ ...storeConfig, basicInfo: updatedBasicInfo });
  const handleUpdateProducts = (updatedProducts: Product[]) => onUpdateConfig({ ...storeConfig, products: updatedProducts });
  const handleUpdatePromotions = (updatedPromotions: Promotion[]) => onUpdateConfig({ ...storeConfig, promotions: updatedPromotions });
  const handleUpdatePaymentMethods = (updatedPaymentMethods: PaymentMethods) => onUpdateConfig({ ...storeConfig, paymentMethods: updatedPaymentMethods });
  const handleUpdateAppearance = (newAppearance: AppearanceSettings) => onUpdateConfig({ ...storeConfig, appearance: newAppearance });
  const handleUpdateAICustomerService = (updatedSettings: AICustomerServiceSettings) => onUpdateConfig({ ...storeConfig, aiCustomerService: updatedSettings });

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMdScreen = window.innerWidth >= 768;
      if (newIsMdScreen !== isMdScreen) setIsMdScreen(newIsMdScreen);
      if (!newIsMdScreen && isMdSidebarCollapsed) setIsMdSidebarCollapsed(false); 
      if (newIsMdScreen && isSmDrawerOpen) setIsSmDrawerOpen(false); 
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMdScreen, isMdSidebarCollapsed, isSmDrawerOpen]);

  const toggleSmDrawer = () => setIsSmDrawerOpen(prev => !prev);
  const toggleMdSidebarCollapse = () => setIsMdSidebarCollapsed(prev => !prev);

  const sections: { id: DeveloperSection; name: string; icon: JSX.Element }[] = [
    { id: 'storeInfo', name: 'Store Info', icon: <NewBasicInfoIcon /> },
    { id: 'social', name: 'Social', icon: <ShareNetworkIcon /> },
    { id: 'support', name: 'Support', icon: <ChatBubbleOvalLeftEllipsisIcon /> },
    { id: 'aiHelp', name: 'AI Help', icon: <NewAIAgentIcon /> },
    { id: 'products', name: 'Products', icon: <NewProductsIcon /> },
    { id: 'offers', name: 'Offers', icon: <NewPromotionIcon /> },
    { id: 'payments', name: 'Payments', icon: <CreditCardIcon /> },
    { id: 'insights', name: 'Insights', icon: <ChartBarSquareIcon /> },
    { id: 'design', name: 'Design', icon: <NewThemeIcon /> },
    { id: 'status', name: 'Status', icon: <ServerIcon /> },
    { id: 'data', name: 'Data', icon: <DocumentTextIcon /> },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'storeInfo': return <BasicInfoEditor basicInfo={storeConfig.basicInfo} onUpdate={handleUpdateBasicInfo} />;
      case 'social': return <SocialMediaManager basicInfo={storeConfig.basicInfo} onUpdateBasicInfo={handleUpdateSocialMedia} />;
      case 'support': return <SupportChatView 
                                conversations={supportConversations} 
                                onSendMessage={(convId, text) => onSendMessageToSupport(convId, text, storeConfig.basicInfo.storeName || "Store Owner")}
                                onMarkAsRead={onMarkConversationAsRead}
                                storeOwnerName={storeConfig.basicInfo.storeName || "Store Owner"}
                                isGlobalAiEnabled={storeConfig.aiCustomerService?.isEnabled || false}
                                aiSettings={storeConfig.aiCustomerService}
                                onToggleAiAssist={onToggleAiAssistanceForConversation}
                              />;
      case 'aiHelp': return <AICustomerServiceManager settings={storeConfig.aiCustomerService} onUpdateSettings={handleUpdateAICustomerService} />;
      case 'products': return <ProductManager products={storeConfig.products} onUpdateProducts={handleUpdateProducts} />;
      case 'offers': return <PromotionManager promotions={storeConfig.promotions} onUpdatePromotions={handleUpdatePromotions} />;
      case 'payments': return <PaymentSettingsComponent paymentMethods={storeConfig.paymentMethods} onUpdate={handleUpdatePaymentMethods} />;
      case 'insights': return <AnalyticsView storeConfig={storeConfig} />;
      case 'design': return <StoreTemplateSelector currentAppearance={storeConfig.appearance} currentBasicInfo={storeConfig.basicInfo} onUpdateAppearance={handleUpdateAppearance} onUpdateBasicInfo={handleUpdateBasicInfo} />;
      case 'status': return <StatusCheckView />;
      case 'data': return <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary p-4">Data management section coming soon. Import/export data, view logs, etc.</p>;
      default: return <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Select a section to edit.</p>;
    }
  };

  const sidebarCurrentWidth = isMdScreen 
    ? (isMdSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH_MD_PX : SIDEBAR_OPEN_WIDTH_MD_PX)
    : `min(${DRAWER_WIDTH_SM_VW}vw, ${DRAWER_MAX_WIDTH_SM_PX}px)`;

  const sidebarStyle = isMdScreen 
    ? { width: `${sidebarCurrentWidth}px`, transition: 'width 0.2s ease-in-out', flexShrink: 0 } 
    : { width: sidebarCurrentWidth, top: '57px', height: 'calc(100vh - 57px)' }; 

  return (
    <div className="flex h-full w-full overflow-hidden bg-BACKGROUND_MAIN dark:bg-replit-dark-bg">
      {!isMdScreen && (
        <button
          onClick={toggleSmDrawer}
          className="fixed top-[62px] left-2 z-40 p-1.5 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-md border border-BORDER_DEFAULT dark:border-replit-dark-border md:hidden shadow-light-subtle dark:shadow-subtle"
          aria-label={isSmDrawerOpen ? "Close developer settings sidebar" : "Open developer settings sidebar"}
          aria-expanded={isSmDrawerOpen}
        >
          {isSmDrawerOpen ? <CaretDoubleLeftIcon className="w-4 h-4 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary" /> : <CaretDoubleRightIcon className="w-4 h-4 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary" />}
        </button>
      )}

      <div
        className={`
          ${isMdScreen ? 'relative flex-shrink-0' : `fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 ease-in-out ${isSmDrawerOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}
          bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg border-r border-BORDER_DEFAULT dark:border-replit-dark-border md:h-full
        `}
        style={sidebarStyle}
        role="navigation"
        aria-label="Developer Settings Navigation"
      >
        <div className="p-2 overflow-y-auto h-full styled-scrollbar flex flex-col">
          <div className="flex justify-between items-center mb-3 p-1.5">
            {!isMdSidebarCollapsed && <h2 className="text-base font-medium text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">Developer</h2>}
            {isMdScreen && (
              <button
                onClick={toggleMdSidebarCollapse}
                className="p-1 text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-BORDER_DEFAULT/50 dark:hover:bg-replit-dark-border/50 rounded-md"
                title={isMdSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isMdSidebarCollapsed ? <CaretDoubleRightIcon className="w-4 h-4" /> : <CaretDoubleLeftIcon className="w-4 h-4" />}
              </button>
            )}
          </div>
          <nav className={`space-y-1 ${isMdSidebarCollapsed && isMdScreen ? 'flex flex-col items-center' : ''}`}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  if(!isMdScreen && isSmDrawerOpen) setIsSmDrawerOpen(false);
                }}
                title={section.name}
                className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-md text-sm font-normal transition-colors duration-150 relative group
                  ${activeSection === section.id
                    ? 'bg-replit-primary-blue/10 dark:bg-replit-primary-blue/20 text-replit-primary-blue' 
                    : 'text-TEXT_SECONDARY dark:text-replit-dark-text-secondary hover:bg-BORDER_DEFAULT/50 dark:hover:bg-replit-dark-border/50 hover:text-TEXT_PRIMARY dark:hover:text-replit-dark-text-main'
                  }
                  ${isMdSidebarCollapsed && isMdScreen ? 'justify-center' : ''}
                `}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                {activeSection === section.id && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-replit-primary-blue rounded-r-sm"></span>
                )}
                {React.cloneElement(section.icon, { className: `w-4 h-4 flex-shrink-0 ${activeSection === section.id ? 'text-replit-primary-blue' : 'text-TEXT_MUTED dark:text-replit-dark-text-disabled group-hover:text-TEXT_PRIMARY dark:group-hover:text-replit-dark-text-main'}` })}
                {!(isMdSidebarCollapsed && isMdScreen) && <span className="truncate">{section.name}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {!isMdScreen && isSmDrawerOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" onClick={toggleSmDrawer}></div>
      )}
      
      <main 
        className={`flex-grow p-3 md:p-4 overflow-y-auto styled-scrollbar bg-BACKGROUND_MAIN dark:bg-replit-dark-bg md:h-full w-full 
                    max-w-7xl mx-auto 
                    ${isMdScreen ? '' : 'pl-3 pr-3'} 
                    ${(!isMdScreen && isSmDrawerOpen) ? 'pointer-events-none opacity-50' : ''}`}
      >
          {renderActiveSection()}
      </main>
    </div>
  );
};

export default DeveloperModeView;
