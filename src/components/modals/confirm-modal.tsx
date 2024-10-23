import Button from '../controls/button';
import CustomModal from './modal';

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
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  return (
    <CustomModal title="Confirm" open={isOpen} onClose={onClose} size="md">
      <p>{text}</p>
      <div className="mt-4 flex justify-center space-x-40">
        <Button onClick={onClose} variant="secondary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="danger">
          {confirmText}
        </Button>
      </div>
    </CustomModal>
  );
}
