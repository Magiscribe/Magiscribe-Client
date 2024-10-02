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
        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
          {cancelText}
        </button>
        <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          {confirmText}
        </button>
      </div>
    </CustomModal>
  );
}
