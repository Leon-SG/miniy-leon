

import React, { useState } from 'react';
import { Promotion } from '../../types';
import Button from '../common/Button';
import PromotionForm from './PromotionForm';
import { AddCircleIcon, EditIcon, TrashIcon, TagIcon } from '../../constants'; // Changed PlusIcon to AddCircleIcon

interface PromotionManagerProps {
  promotions: Promotion[];
  onUpdatePromotions: (updatedPromotions: Promotion[]) => void;
}

const PromotionManager: React.FC<PromotionManagerProps> = ({ promotions, onUpdatePromotions }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setIsFormOpen(true);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromotion(promo);
    setIsFormOpen(true);
  };

  const handleDeletePromotion = (promoId: string) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      onUpdatePromotions(promotions.filter(p => p.id !== promoId));
    }
  };

  const handleFormSubmit = (promo: Promotion) => {
    if (editingPromotion) {
      onUpdatePromotions(promotions.map(p => p.id === promo.id ? promo : p));
    } else {
      const newPromoWithId = { ...promo, id: promo.id || Date.now().toString() };
      onUpdatePromotions([...promotions, newPromoWithId]);
    }
    setIsFormOpen(false);
    setEditingPromotion(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-BORDER_DEFAULT dark:border-replit-dark-border pb-4">
        <h2 className="text-2xl font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main">Manage Promotions</h2>
        <Button variant="primary" onClick={handleAddPromotion} leftIcon={<AddCircleIcon className="w-5 h-5" />}> {/* Changed PlusIcon to AddCircleIcon */}
          Add Promotion
        </Button>
      </div>
      {promotions.length > 0 ? (
        <div className="space-y-4">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-BACKGROUND_CONTENT dark:bg-replit-dark-panel-bg p-4 rounded-xl border border-BORDER_DEFAULT dark:border-replit-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-TEXT_PRIMARY dark:text-replit-dark-text-main text-lg truncate">{promo.code}</h4>
                <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary my-1 line-clamp-2 break-words">{promo.description}</p>
                <div className="flex items-center space-x-3 text-sm mt-1">
                    <span className="font-medium text-ACCENT_MAIN dark:text-ACCENT_DARK">{promo.discountPercentage}% Discount</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${promo.isActive ? 'bg-SUCCESS_GREEN/20 text-SUCCESS_GREEN dark:bg-replit-dark-green/20 dark:text-replit-dark-green' : 'bg-TEXT_MUTED/30 text-TEXT_SECONDARY dark:bg-replit-dark-text-disabled/30 dark:text-replit-dark-text-secondary'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
                <Button variant="ghost" size="sm" onClick={() => handleEditPromotion(promo)} aria-label={`Edit ${promo.code}`}><EditIcon className="w-5 h-5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePromotion(promo.id)} className="text-ERROR_RED hover:bg-ERROR_RED/10 dark:text-replit-dark-red dark:hover:bg-replit-dark-red/20" aria-label={`Delete ${promo.code}`}><TrashIcon className="w-5 h-5" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-10 border-2 border-dashed border-BORDER_DEFAULT dark:border-replit-dark-border rounded-lg">
          <TagIcon className="w-12 h-12 mx-auto text-TEXT_MUTED dark:text-replit-dark-text-disabled mb-2" />
          <p className="text-TEXT_SECONDARY dark:text-replit-dark-text-secondary font-medium">No promotions yet.</p>
          <p className="text-sm text-TEXT_MUTED dark:text-replit-dark-text-disabled">Click "Add Promotion" to create one.</p>
        </div>
      )}
      {isFormOpen && (
        <PromotionForm
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditingPromotion(null); }}
          onSubmit={handleFormSubmit}
          initialPromotion={editingPromotion}
        />
      )}
    </div>
  );
};

export default PromotionManager;
// End of file
