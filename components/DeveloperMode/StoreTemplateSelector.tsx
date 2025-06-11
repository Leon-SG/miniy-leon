
import React, { useState } from 'react';
import { StoreConfiguration, StoreTemplate, BasicInfo, AppearanceSettings } from '../../types';
import { STORE_TEMPLATES } from '../../constants';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface StoreTemplateSelectorProps {
  currentAppearance: AppearanceSettings;
  currentBasicInfo: BasicInfo;
  onUpdateAppearance: (newAppearance: AppearanceSettings) => void;
  onUpdateBasicInfo: (newBasicInfo: BasicInfo) => void; // For applying basic info overrides
}

const StoreTemplateSelector: React.FC<StoreTemplateSelectorProps> = ({
  currentAppearance,
  currentBasicInfo,
  onUpdateAppearance,
  onUpdateBasicInfo
}) => {
  const [selectedTemplateForInfoModal, setSelectedTemplateForInfoModal] = useState<StoreTemplate | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleApplyTemplate = (template: StoreTemplate) => {
    onUpdateAppearance(template.appearance);
    // After applying appearance, check for basic info overrides
    if (template.defaultBasicInfoOverrides && Object.keys(template.defaultBasicInfoOverrides).length > 0) {
      setSelectedTemplateForInfoModal(template);
      setIsInfoModalOpen(true);
    } else {
      alert(`Template "${template.name}" applied successfully!`);
    }
  };

  const handleApplyBasicInfoOverrides = () => {
    if (selectedTemplateForInfoModal && selectedTemplateForInfoModal.defaultBasicInfoOverrides) {
      const newBasicInfo = {
        ...currentBasicInfo, // Keep existing info
        ...selectedTemplateForInfoModal.defaultBasicInfoOverrides, // Override with template suggestions
      };
      onUpdateBasicInfo(newBasicInfo);
      alert(`Template "${selectedTemplateForInfoModal.name}" and suggested info applied!`);
    }
    setIsInfoModalOpen(false);
    setSelectedTemplateForInfoModal(null);
  };

  const handleCloseInfoModal = () => {
    if(selectedTemplateForInfoModal) {
         alert(`Template "${selectedTemplateForInfoModal.name}" appearance applied. Suggested info was not applied.`);
    }
    setIsInfoModalOpen(false);
    setSelectedTemplateForInfoModal(null);
  };
  
  const isTemplateActive = (template: StoreTemplate) => {
    return template.appearance.primaryColor === currentAppearance.primaryColor &&
           template.appearance.fontFamily === currentAppearance.fontFamily &&
           template.appearance.darkMode === currentAppearance.darkMode;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main mb-1">Store Templates</h2>
        <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary mb-6">Choose a pre-designed template to quickly set up your store's look and feel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {STORE_TEMPLATES.map(template => (
          <div key={template.id} className={`bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-xl border overflow-hidden transition-all duration-200 ease-in-out ${isTemplateActive(template) ? 'border-PRIMARY_MAIN ring-2 ring-PRIMARY_MAIN dark:border-replit-primary-blue dark:ring-replit-primary-blue' : 'border-BORDER_DEFAULT dark:border-replit-dark-border hover:border-TEXT_MUTED dark:hover:border-replit-dark-border-muted'}`}>
            <img 
              src={template.thumbnailUrl} 
              alt={template.name} 
              className="w-full h-48 object-cover" 
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/placeholder_template/600/400')}
            />
            <div className="p-5 min-w-0">
              <h3 className="text-lg font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main truncate">{template.name}</h3>
              <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-1">{template.category}</p>
              <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary my-2 line-clamp-3 break-words">{template.description}</p>
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <Button 
                  variant={isTemplateActive(template) ? "secondary" : "primary"} 
                  size="sm" 
                  onClick={() => handleApplyTemplate(template)}
                  disabled={isTemplateActive(template)}
                >
                  {isTemplateActive(template) ? "Currently Active" : "Apply Template"}
                </Button>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full border border-BORDER_DEFAULT dark:border-replit-dark-border-muted" style={{backgroundColor: template.appearance.primaryColor}}></div>
                    <span className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled">{template.appearance.fontFamily.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplateForInfoModal && (
        <Modal
          isOpen={isInfoModalOpen}
          onClose={handleCloseInfoModal}
          title={`Apply Suggested Info from "${selectedTemplateForInfoModal.name}"?`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">
              The template "{selectedTemplateForInfoModal.name}" also suggests the following updates to your store information. Would you like to apply them?
            </p>
            <ul className="list-disc list-inside text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary bg-gray-50 dark:bg-replit-dark-border-muted p-3 rounded-md">
              {selectedTemplateForInfoModal.defaultBasicInfoOverrides?.storeName && <li>Store Name: "{selectedTemplateForInfoModal.defaultBasicInfoOverrides.storeName}"</li>}
              {selectedTemplateForInfoModal.defaultBasicInfoOverrides?.tagline && <li>Tagline: "{selectedTemplateForInfoModal.defaultBasicInfoOverrides.tagline}"</li>}
              {selectedTemplateForInfoModal.defaultBasicInfoOverrides?.industry && <li>Industry: "{selectedTemplateForInfoModal.defaultBasicInfoOverrides.industry}"</li>}
            </ul>
            <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled">
                Your existing store information will be updated. This step is optional.
            </p>
            <div className="flex justify-end space-x-3 pt-3">
              <Button variant="ghost" onClick={handleCloseInfoModal}>No, Skip</Button>
              <Button variant="primary" onClick={handleApplyBasicInfoOverrides}>Yes, Apply Info</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoreTemplateSelector;
