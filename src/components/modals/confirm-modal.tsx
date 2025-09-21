import Button from '../controls/button';
import CustomModal from './modal';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  text = 'item',
  confirmText,
  cancelText,
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  
  return (
    <CustomModal title={t('components.confirmModal.title')} open={isOpen} onClose={onClose} size="md">
      <p>{text}</p>
      <div className="mt-4 flex justify-center space-x-40">
        <Button onClick={onClose} variant="secondary">
          {cancelText || t('components.confirmModal.defaultCancel')}
        </Button>
        <Button onClick={onConfirm} variant="danger">
          {confirmText || t('components.confirmModal.defaultConfirm')}
        </Button>
      </div>
    </CustomModal>
  );
}
