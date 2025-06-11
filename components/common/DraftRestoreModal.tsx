import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface DraftRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
  onDiscard: () => void;
  title?: string;
}

const DraftRestoreModal: React.FC<DraftRestoreModalProps> = ({
  isOpen,
  onClose,
  onRestore,
  onDiscard,
  title = 'Restore Unsaved Draft'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-TEXT_SECONDARY dark:text-replit-dark-text-secondary">
          You have an unsaved draft. Would you like to restore it?
        </p>
        <div className="flex justify-end space-x-3 pt-3">
          <Button variant="ghost" onClick={onDiscard}>Discard Draft</Button>
          <Button variant="primary" onClick={onRestore}>Restore Draft</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DraftRestoreModal; 