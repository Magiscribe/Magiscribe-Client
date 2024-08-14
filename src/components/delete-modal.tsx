import React from 'react';
import CustomModal from './modal'; // Adjust the import path as needed

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'item',
}) => {
  return (
    <CustomModal title="Confirm Deletion" open={isOpen} onClose={onClose} size="md">
      <p>Are you sure you want to delete this {itemName}?</p>
      <div className="mt-4 flex justify-center space-x-40">
        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Delete
        </button>
      </div>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
