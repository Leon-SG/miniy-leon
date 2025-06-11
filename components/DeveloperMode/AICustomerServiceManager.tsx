import React, { useState, useEffect, useCallback } from 'react';
import { AICustomerServiceSettings } from '../../types';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { NewAIAgentIcon, ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, AISparkleIcon } from '../../constants';
import { useToast } from '../../contexts/ToastContext'; 
import ToggleSwitch from '../common/ToggleSwitch'; // Import the new ToggleSwitch
import DraftRestoreModal from '../common/DraftRestoreModal';

interface AICustomerServiceManagerProps {
  settings: AICustomerServiceSettings;
  onUpdateSettings: (updatedSettings: AICustomerServiceSettings) => void;
}

const DRAFT_KEY = 'miniy_draft_aiAgentSettings';

const AICustomerServiceManager: React.FC<AICustomerServiceManagerProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<AICustomerServiceSettings>(settings);
  const [conversationStartersString, setConversationStartersString] = useState('');
  const { showToast } = useToast(); 
  const [draftActionTaken, setDraftActionTaken] = useState(false); 
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setIsDraftModalOpen(true);
    } else {
      setDraftActionTaken(false);
    }
  }, []);

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft.formData);
        setConversationStartersString(parsedDraft.conversationStartersString);
        showToast("AI Agent draft restored.", "info");
        setDraftActionTaken(false);
      } catch (e) {
        console.error("Failed to parse AI Agent draft:", e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    setIsDraftModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(settings); 
    setConversationStartersString(settings.conversationStarters?.join(', ') || '');
    setDraftActionTaken(true);
    setIsDraftModalOpen(false);
  };

  useEffect(() => {
    loadDraft();
  }, [loadDraft]); 

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (!savedDraft && !draftActionTaken) { 
      setFormData(settings);
      setConversationStartersString(settings.conversationStarters?.join(', ') || '');
    }
  }, [settings, draftActionTaken]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Note: isEnabled is now handled by handleToggleChange

    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData: newFormData, conversationStartersString }));
      setDraftActionTaken(false); 
      return newFormData;
    });
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData(prev => {
      const newFormData = { ...prev, isEnabled: checked };
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData: newFormData, conversationStartersString }));
      setDraftActionTaken(false);
      return newFormData;
    });
  };

  const handleConversationStartersStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newString = e.target.value;
    setConversationStartersString(newString);
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, conversationStartersString: newString }));
    setDraftActionTaken(false); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFormDataToSubmit = {
        ...formData,
        conversationStarters: conversationStartersString.split(',').map(s => s.trim()).filter(s => s),
    };
    
    const originalSettingsForComparison = {
        ...settings,
        conversationStarters: settings.conversationStarters || [], 
    };
    
    if (draftActionTaken && 
        JSON.stringify(finalFormDataToSubmit) === JSON.stringify(originalSettingsForComparison)
    ) {
      showToast("No new changes to save.", "info");
      localStorage.removeItem(DRAFT_KEY);
      setDraftActionTaken(false);
      return;
    }

    onUpdateSettings(finalFormDataToSubmit);
    localStorage.removeItem(DRAFT_KEY); 
    showToast('AI Agent settings saved!', "success");
    setDraftActionTaken(false);
  };

  const hasUnsavedChanges = localStorage.getItem(DRAFT_KEY) !== null;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10 w-full"> 
        <div className="flex justify-between items-center border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-5"> 
            <div className="flex items-center">
                <NewAIAgentIcon className="w-8 h-8 text-PRIMARY_MAIN dark:text-replit-primary-blue mr-4" /> 
                <div>
                    <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">AI Customer Service Agent</h2>
                    <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mt-1">Configure your automated assistant to engage customers.</p>
                </div>
            </div>
            <ToggleSwitch
                id="isEnabled"
                checked={formData.isEnabled}
                onChange={handleToggleChange}
                label={formData.isEnabled ? 'Agent Enabled' : 'Agent Disabled'}
                labelPosition="left"
            />
        </div>

        <section className={`p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border transition-opacity duration-300 ${!formData.isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-xl font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Agent Configuration</h3> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"> 
            <Input
              label="Agent Display Name"
              id="agentName"
              name="agentName"
              value={formData.agentName}
              onChange={handleFormChange}
              placeholder="e.g., Support Bot, Miniy Helper"
              disabled={!formData.isEnabled}
            />
            <Input
              label="Welcome Message"
              id="welcomeMessage"
              name="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={handleFormChange}
              placeholder="e.g., Hi there! How can I help you today?"
              disabled={!formData.isEnabled}
            />
            <div className="md:col-span-2">
              <Textarea
                label="System Prompt (AI Instructions)"
                id="systemPrompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleFormChange}
                rows={6}
                placeholder="Define the AI's personality, goals, and key information. E.g., 'You are a friendly assistant for Sparkle Gems...'"
                disabled={!formData.isEnabled}
                className="text-sm leading-relaxed"
              />
            </div>
            <div className="md:col-span-2">
             <Textarea
                label="Key Business Information & FAQs"
                id="keyBusinessInfo"
                name="keyBusinessInfo"
                value={formData.keyBusinessInfo || ''}
                onChange={handleFormChange}
                rows={5}
                placeholder="Enter important details like return policy, shipping info, common questions, etc. The AI will use this to answer customer queries."
                disabled={!formData.isEnabled}
                className="text-sm leading-relaxed"
              />
            </div>
             <div className="md:col-span-2">
              <Input
                label="Conversation Starters (comma-separated)"
                id="conversationStartersString" 
                name="conversationStartersString" 
                value={conversationStartersString}
                onChange={handleConversationStartersStringChange} 
                placeholder="e.g., Track my order, Product questions, Discount codes"
                disabled={!formData.isEnabled}
              />
            </div>
             <div className="md:col-span-2">
              <Textarea
                label="Human Handoff Instructions"
                id="humanHandoffInstructions"
                name="humanHandoffInstructions"
                value={formData.humanHandoffInstructions || ''}
                onChange={handleFormChange}
                rows={3}
                placeholder="What should the AI say/do if it can't help and needs to escalate to a human? E.g., 'Please email support@example.com for further assistance.'"
                disabled={!formData.isEnabled}
                className="text-sm leading-relaxed"
              />
            </div>
          </div>
        </section>
        
        <section className={`p-2 ${!formData.isEnabled ? 'opacity-50 pointer-events-none' : ''}`}> 
            <h3 className="text-xl font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-4">Chat Widget Preview (Visual Only)</h3> 
            <div className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border w-full sm:w-96 mx-auto"> 
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-BORDER_DEFAULT dark:border-replit-dark-border">
                    <div className="flex items-center">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-PRIMARY_MAIN dark:text-replit-primary-blue mr-2" />
                        <p className="text-sm font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">{formData.agentName || "Chat Agent"}</p>
                    </div>
                    <XMarkIcon className="w-4 h-4 text-TEXT_MUTED dark:text-replit-dark-text-disabled cursor-pointer" />
                </div>
                <div className="space-y-2 mb-3">
                    <div className="flex">
                        <div className="bg-PRIMARY_MAIN/10 dark:bg-replit-primary-blue/20 text-PRIMARY_MAIN dark:text-replit-primary-blue text-xs px-3 py-1.5 rounded-lg rounded-bl-none max-w-[80%]">
                            {formData.welcomeMessage || "Hello! How can I assist you?"}
                        </div>
                    </div>
                     {conversationStartersString && conversationStartersString.split(',').map(s=>s.trim()).filter(s=>s).length > 0 && (
                         <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {conversationStartersString.split(',').map(s=>s.trim()).filter(s=>s).slice(0,3).map((starter, idx) => (
                                <button key={idx} type="button" className="text-xs bg-BACKGROUND_MAIN dark:bg-replit-dark-bg border border-BORDER_DEFAULT dark:border-replit-dark-border text-TEXT_SECONDARY dark:text-replit-dark-text-secondary px-2 py-1 rounded-full hover:bg-BORDER_DEFAULT/70 dark:hover:bg-replit-dark-border-muted/70 transition-colors">
                                    {starter}
                                </button>
                            ))}
                         </div>
                     )}
                </div>
                 <div className="mt-3 pt-2 border-t border-BORDER_DEFAULT dark:border-replit-dark-border">
                    <input type="text" placeholder="Type your message..." className="w-full text-xs p-1.5 border border-BORDER_DEFAULT dark:border-replit-dark-border rounded-md focus:ring-PRIMARY_MAIN focus:border-PRIMARY_MAIN dark:bg-replit-dark-panel-bg dark:text-replit-dark-text-main dark:placeholder-replit-dark-text-disabled" disabled/>
                 </div>
            </div>
        </section>

        <section className={`p-2 ${!formData.isEnabled ? 'opacity-50 pointer-events-none' : ''}`}> 
          <h3 className="text-xl font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-4">Conversations & Insights</h3> 
          <div className="p-8 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border text-center"> 
            <AISparkleIcon className="w-12 h-12 mx-auto text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-4" /> 
            <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary font-medium mb-2">Unlock Customer Insights & Automate Support</p>
            <p className="text-sm text-TEXT_MUTED dark:text-replit-dark-text-disabled">
              (Coming Soon) Access detailed customer chat logs, sentiment analysis, common queries, AI performance metrics (e.g., resolution rate), and handoff rates.
            </p>
          </div>
        </section>

        <div className="pt-6 flex justify-between items-center border-t border-BORDER_DEFAULT dark:border-replit-dark-border mt-4"> 
          <Button type="submit" variant="primary" size="lg" disabled={!formData.isEnabled}>
            Save AI Agent Settings
          </Button>
           {hasUnsavedChanges && formData.isEnabled && (
             <Button type="button" variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-ERROR_RED hover:bg-ERROR_RED/10 dark:text-replit-dark-red dark:hover:bg-replit-dark-red/20">
                Discard Unsaved Changes
            </Button>
          )}
        </div>
      </form>

      <DraftRestoreModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        title="Restore AI Agent Draft"
      />
    </>
  );
};

export default AICustomerServiceManager;
