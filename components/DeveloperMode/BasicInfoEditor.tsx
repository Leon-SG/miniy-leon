import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { BasicInfo } from '../../types';
import { optimizeTextWithAI } from '../../services/anthropicService';
import { COUNTRIES, TIMEZONES, AISparkleIcon, UploadIcon, XMarkIcon, PhotoIcon, InfoIcon, CURRENCIES } from '../../constants';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import DraftRestoreModal from '../common/DraftRestoreModal';

interface BasicInfoEditorProps {
  basicInfo: BasicInfo;
  onUpdate: (updatedBasicInfo: BasicInfo) => void;
}

type OptimizationLoadingState = {
  tagline: boolean;
  metaDescription: boolean;
  seoTitle: boolean;
  storeWelcomeMessage: boolean; // Added for welcome message
};

const DRAFT_KEY = 'miniy_draft_basicInfo';

// Removed React.FC type annotation
const BasicInfoEditor = ({ basicInfo, onUpdate }: BasicInfoEditorProps) => {
  const [formData, setFormData] = useState<BasicInfo>(basicInfo);
  const [optimizationLoading, setOptimizationLoading] = useState<OptimizationLoadingState>({
    tagline: false,
    metaDescription: false,
    seoTitle: false,
    storeWelcomeMessage: false, // Initialized
  });
  const { showToast } = useToast();
  const [draftActionTaken, setDraftActionTaken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const saveDraft = useCallback((dataToSave: BasicInfo): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
    setDraftActionTaken(false); // Reset if a new change is made to draft
  }, []);

  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setIsDraftModalOpen(true);
    } else {
      setFormData(basicInfo); // Ensure form is initialized with basicInfo if no draft
      setDraftActionTaken(true);
    }
  }, [basicInfo]);

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
        showToast("Draft restored.", "info");
      } catch (e) {
        console.error("Failed to parse Basic Info draft:", e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    setIsDraftModalOpen(false);
    setDraftActionTaken(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(basicInfo); // Revert to original if draft discarded
    setIsDraftModalOpen(false);
    setDraftActionTaken(true);
  };

  useEffect(() => {
    loadDraft();
  }, [loadDraft]); // Load draft on initial mount

  // If basicInfo prop changes (e.g., AI update), and no draft exists or draft was just cleared/applied, update formData
  useEffect(() => {
    if (draftActionTaken && !localStorage.getItem(DRAFT_KEY)) {
       setFormData(basicInfo);
    }
  }, [basicInfo, draftActionTaken]);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: BasicInfo): BasicInfo => {
      const newFormData = { ...prev, [name]: value };
      saveDraft(newFormData);
      return newFormData;
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast("File size exceeds 2MB. Please choose a smaller image.", "error");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        showToast("Invalid file type. Please upload JPG, PNG, SVG, or GIF.", "error");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const newFormData = { ...prev, logoUrl: reader.result as string };
          saveDraft(newFormData);
          return newFormData;
        });
        showToast("Logo image selected. Save changes to apply.", "info");
      };
      reader.onerror = () => {
        showToast("Failed to read image file.", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => {
      const newFormData = { ...prev, logoUrl: "" };
      saveDraft(newFormData);
      return newFormData;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Logo removed. Save changes to apply.", "info");
  };

  const handleOptimizeField = async (
    fieldName: keyof OptimizationLoadingState,
    textSourceField: keyof Pick<BasicInfo, 'tagline' | 'metaDescription' | 'seoTitle' | 'storeWelcomeMessage'>
  ) => {
    const textToOptimize = formData[textSourceField];
    if (!textToOptimize) {
      showToast(`Please enter some text in ${textSourceField.replace(/([A-Z])/g, ' $1').toLowerCase()} to optimize.`, "error");
      return;
    }

    setOptimizationLoading(prev => ({ ...prev, [fieldName]: true }));
    try {
      let fieldHint: 'tagline' | 'meta description' | 'seo title' | 'user prompt'; // Keep 'user prompt' as it's part of the type
      switch (fieldName) {
        case 'tagline': fieldHint = 'tagline'; break;
        case 'metaDescription': fieldHint = 'meta description'; break;
        case 'seoTitle': fieldHint = 'seo title'; break;
        case 'storeWelcomeMessage': fieldHint = 'user prompt'; break; // Optimize welcome message as a general user prompt
        default: showToast("Invalid field for optimization.", "error"); return;
      }
      
      const optimizedText = await optimizeTextWithAI(textToOptimize, fieldHint);
      if (optimizedText) {
        setFormData(prev => {
           const newFormData = { ...prev, [textSourceField]: optimizedText };
           saveDraft(newFormData);
           return newFormData;
        });
        showToast(`${fieldName.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + fieldName.replace(/([A-Z])/g, ' $1').slice(1)} optimized successfully! Save changes to apply.`, "success");
      } else {
        showToast(`Could not optimize ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`, "error");
      }
    } catch (error) {
      console.error(`Error optimizing ${fieldName}:`, error);
      showToast(`Error optimizing ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}. Check console for details.`, "error");
    } finally {
      setOptimizationLoading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    localStorage.removeItem(DRAFT_KEY);
    showToast("Basic info updated successfully!", "success");
    setDraftActionTaken(true); // Mark as applied
  };

  const hasUnsavedChanges = localStorage.getItem(DRAFT_KEY) !== null;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Store Details Section */}
        <section className="p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h3 className="text-lg font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Store Details 📤</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Store Name"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleFormChange}
              required
            />
            <div className="relative">
              <Input
                label="Tagline"
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleFormChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!absolute right-1 bottom-1 !p-1 text-TEXT_MUTED hover:text-PRIMARY_MAIN"
                onClick={() => handleOptimizeField('tagline', 'tagline')}
                disabled={optimizationLoading.tagline}
                title="Optimize Tagline with AI"
              >
                {optimizationLoading.tagline ? <LoadingSpinner size="sm" color="text-PRIMARY_MAIN" /> : <AISparkleIcon className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Logo Upload Section */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">Store Logo</label>
              <div className="flex items-center space-x-4 p-3 border border-BORDER_DEFAULT dark:border-replit-dark-border rounded-md bg-BACKGROUND_MAIN dark:bg-replit-dark-bg">
                {formData.logoUrl ? (
                  <img 
                    src={formData.logoUrl} 
                    alt="Store Logo Preview" 
                    className="w-16 h-16 rounded-md object-contain border border-BORDER_MUTED dark:border-replit-dark-border-muted"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-BORDER_DEFAULT/50 dark:bg-replit-dark-border-muted flex items-center justify-center text-TEXT_MUTED dark:text-replit-dark-text-disabled">
                    <PhotoIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-grow">
                  <input 
                    type="file" 
                    id="logoUrl"
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    className="hidden"
                    accept="image/jpeg,image/png,image/svg+xml,image/gif" 
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<UploadIcon />}
                  >
                    Upload Logo
                  </Button>
                  {formData.logoUrl && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemoveLogo}
                      className="ml-2 text-ERROR_RED hover:bg-ERROR_RED/10"
                      leftIcon={<XMarkIcon />}
                    >
                      Remove
                    </Button>
                  )}
                  <p className="text-xs text-TEXT_MUTED dark:text-replit-dark-text-disabled mt-1.5">Supported: JPG, PNG, SVG, GIF. Max 2MB.</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 relative">
              <Textarea
                label="Store Welcome Message / Owner's Note (Optional)"
                id="storeWelcomeMessage"
                name="storeWelcomeMessage"
                value={formData.storeWelcomeMessage || ''}
                onChange={handleFormChange}
                rows={3}
                placeholder="A short welcome message displayed at the top of your store preview."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!absolute right-1 bottom-1 !p-1 text-TEXT_MUTED hover:text-PRIMARY_MAIN"
                onClick={() => handleOptimizeField('storeWelcomeMessage', 'storeWelcomeMessage')}
                disabled={optimizationLoading.storeWelcomeMessage}
                title="Optimize Welcome Message with AI"
              >
                {optimizationLoading.storeWelcomeMessage ? <LoadingSpinner size="sm" color="text-PRIMARY_MAIN" /> : <AISparkleIcon className="w-4 h-4" />}
              </Button>
            </div>


            <Input
              label="Industry"
              id="industry"
              name="industry"
              value={formData.industry || ''}
              onChange={handleFormChange}
            />
            <Input
              label="Legal Name of Business (Optional)"
              id="legalNameOfBusiness"
              name="legalNameOfBusiness"
              value={formData.legalNameOfBusiness || ''}
              onChange={handleFormChange}
            />
          </div>
        </section>

        {/* Contact & Localization Section */}
        <section className="p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h3 className="text-lg font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Contact & Localization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Store Email"
              id="storeEmail"
              name="storeEmail"
              type="email"
              value={formData.storeEmail}
              onChange={handleFormChange}
              required
            />
            <Input
              label="Store Phone Number (Optional)"
              id="storePhoneNumber"
              name="storePhoneNumber"
              type="tel"
              value={formData.storePhoneNumber || ''}
              onChange={handleFormChange}
            />
            <Textarea
              label="Store Address"
              id="storeAddress"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleFormChange}
              required
              rows={3}
            />
            <div className="flex flex-col space-y-5"> {/* Container for Country, Currency, Timezone to keep them together */}
              <Select
                label="Country"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleFormChange}
                options={COUNTRIES}
                required
              />
              <div className="flex space-x-4">
                <Select
                  label="Currency"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleFormChange}
                  options={CURRENCIES}
                  required
                  className="flex-1"
                />
                <Select
                  label="Timezone"
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleFormChange}
                  options={TIMEZONES}
                  required
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* SEO Section */}
        <section className="p-6 bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg rounded-lg border border-BORDER_DEFAULT dark:border-replit-dark-border">
          <h3 className="text-lg font-semibold text-PRIMARY_MAIN dark:text-replit-primary-blue mb-5 border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-3">Search Engine Optimization (SEO)</h3>
          <div className="space-y-5">
             <div className="relative">
              <Input
                label="SEO Title (Optional)"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle || ''}
                onChange={handleFormChange}
                maxLength={60}
                placeholder="Concise and compelling title for search results (max 60 chars)"
              />
               <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!absolute right-1 bottom-1 !p-1 text-TEXT_MUTED hover:text-PRIMARY_MAIN"
                onClick={() => handleOptimizeField('seoTitle', 'seoTitle')}
                disabled={optimizationLoading.seoTitle}
                title="Optimize SEO Title with AI"
              >
                {optimizationLoading.seoTitle ? <LoadingSpinner size="sm" color="text-PRIMARY_MAIN" /> : <AISparkleIcon className="w-4 h-4" />}
              </Button>
            </div>
            <div className="relative">
              <Textarea
                label="Meta Description (Optional)"
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription || ''}
                onChange={handleFormChange}
                rows={3}
                maxLength={160}
                placeholder="Brief summary for search results to attract clicks (max 160 chars)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="!absolute right-1 bottom-1 !p-1 text-TEXT_MUTED hover:text-PRIMARY_MAIN"
                onClick={() => handleOptimizeField('metaDescription', 'metaDescription')}
                disabled={optimizationLoading.metaDescription}
                title="Optimize Meta Description with AI"
              >
                {optimizationLoading.metaDescription ? <LoadingSpinner size="sm" color="text-PRIMARY_MAIN" /> : <AISparkleIcon className="w-4 h-4" />}
              </Button>
            </div>
             <Input
                label="Focus Keywords (comma-separated, Optional)"
                id="focusKeywords"
                name="focusKeywords"
                value={formData.focusKeywords || ''}
                onChange={handleFormChange}
                placeholder="e.g. handmade jewelry, custom t-shirts, local art"
              />
          </div>
        </section>

        <div className="flex justify-between items-center pt-6 border-t border-BORDER_DEFAULT dark:border-replit-dark-border">
          <div className="flex-grow">
            {hasUnsavedChanges && (
              <Button type="button" variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-ERROR_RED hover:bg-ERROR_RED/10">
                Discard Unsaved Changes
              </Button>
            )}
          </div>
          <Button type="submit" variant="primary" size="lg">
            Save Basic Info
          </Button>
        </div>
      </form>

      <DraftRestoreModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        title="Restore Basic Info Draft"
      />
    </>
  );
};

export default BasicInfoEditor;
