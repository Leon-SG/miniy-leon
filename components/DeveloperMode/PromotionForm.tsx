import React, { useState, useEffect, useCallback } from 'react';
import { Promotion } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import DraftRestoreModal from '../common/DraftRestoreModal';

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promotion: Promotion) => void;
  initialPromotion?: Promotion | null;
}

const DRAFT_KEY_NEW = 'miniy_draft_promotionForm_new';
const getDraftKeyEdit = (promoId: string) => `miniy_draft_promotionForm_edit_${promoId}`;

const emptyPromotion: Omit<Promotion, 'id'> & { id?: string } = {
  code: '',
  description: '',
  discountPercentage: 0,
  isActive: true,
};

const PromotionForm: React.FC<PromotionFormProps> = ({ isOpen, onClose, onSubmit, initialPromotion }) => {
  const [promotion, setPromotion] = useState<Omit<Promotion, 'id'> & { id?: string }>(
    initialPromotion || emptyPromotion
  );
  const { showToast } = useToast();
  const [currentDraftKey, setCurrentDraftKey] = useState(DRAFT_KEY_NEW);
  const [draftActionTaken, setDraftActionTaken] = useState(false); 
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const resetFormAndDraft = useCallback((skipDraftClear = false) => {
    if (!skipDraftClear) {
      localStorage.removeItem(currentDraftKey);
    }
    setPromotion(initialPromotion || emptyPromotion);
    setCurrentDraftKey(initialPromotion ? getDraftKeyEdit(initialPromotion.id) : DRAFT_KEY_NEW);
  }, [currentDraftKey, initialPromotion]);

  useEffect(() => {
    const draftKey = initialPromotion ? getDraftKeyEdit(initialPromotion.id) : DRAFT_KEY_NEW;
    setCurrentDraftKey(draftKey);

    if (isOpen) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setIsDraftModalOpen(true);
      } else {
        resetFormAndDraft(true);
        setDraftActionTaken(false);
      }
    } else {
      setDraftActionTaken(false);
    }
  }, [initialPromotion, isOpen, resetFormAndDraft]);

  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem(currentDraftKey);
    if (savedDraft) {
      try {
        setPromotion(JSON.parse(savedDraft));
        showToast("Promotion draft restored.", "info");
        setDraftActionTaken(false);
      } catch (e) {
        console.error("Failed to parse promotion draft:", e);
        localStorage.removeItem(currentDraftKey);
        resetFormAndDraft(true);
      }
    }
    setIsDraftModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(currentDraftKey);
    resetFormAndDraft(true);
    setDraftActionTaken(true);
    setIsDraftModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPromotion(prev => {
      const newPromoData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : (name === 'discountPercentage' ? parseFloat(value) || 0 : value),
      };
      localStorage.setItem(currentDraftKey, JSON.stringify(newPromoData));
      setDraftActionTaken(false);
      return newPromoData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPromotionSubmit: Promotion = {
      ...promotion,
      id: promotion.id || Date.now().toString(),
      discountPercentage: Number(promotion.discountPercentage)
    };

    const originalPromotionState = initialPromotion || emptyPromotion;
    if (draftActionTaken && JSON.stringify(promotion) === JSON.stringify(originalPromotionState)) {
        showToast("No new changes to save.", "info");
        localStorage.removeItem(currentDraftKey);
        setDraftActionTaken(false);
        onClose();
        return;
    }
    
    onSubmit(finalPromotionSubmit);
    localStorage.removeItem(currentDraftKey); 
    setDraftActionTaken(false);
    onClose();
  };
  
  const handleCloseModal = () => {
    setDraftActionTaken(false);
    onClose();
  };

  const hasUnsavedChanges = localStorage.getItem(currentDraftKey) !== null;

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title={initialPromotion ? "Edit Promotion" : "Add New Promotion"} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Promotion Code"
          name="code"
          value={promotion.code}
          onChange={handleFormChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={promotion.description}
          onChange={handleFormChange}
          required
        />
        <Input
          label="Discount Percentage (%)"
          name="discountPercentage"
          type="number"
          value={promotion.discountPercentage.toString()}
          onChange={handleFormChange}
          required
          min="0"
          max="100"
          step="0.1"
        />
        <div className="flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={promotion.isActive}
            onChange={handleFormChange}
            className="h-4 w-4 text-PRIMARY_MAIN border-BORDER_DEFAULT rounded focus:ring-PRIMARY_MAIN"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-TEXT_SECONDARY">
            Active
          </label>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex-grow">
            {hasUnsavedChanges && (
                <Button type="button" variant="ghost" size="sm" onClick={handleDiscardDraft} className="text-ERROR_RED hover:bg-ERROR_RED/10">
                    Discard Unsaved Changes
                </Button>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="primary">{initialPromotion ? "Save Changes" : "Add Promotion"}</Button>
          </div>
        </div>
      </form>

      <DraftRestoreModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        title="Restore Promotion Draft"
      />
    </Modal>
  );
};

export default PromotionForm;
// End of file
