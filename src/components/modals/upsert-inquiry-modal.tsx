import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import CustomModal from '../modal';
import { useAddAlert } from '@/providers/alert-provider';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './delete-modal';
import { useState } from 'react';

interface ModalUpsertInquiryProps {
  open: boolean;

  onSave?: (id: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function ModalUpsertInquiry({ open, onSave, onDelete, onClose }: ModalUpsertInquiryProps) {
  // States
  const [clearGraphModal, setClearGraphModal] = useState(false);

  // Hooks
  const { id, form, updateForm, saveForm, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();
  const navigate = useNavigate();

  /**
   * Handle input change for the form.
   * @param field {string} The field to update.
   * @returns {void} Does not return anything.
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      updateForm({ ...form, [field]: e.target.value });
    };

  /**
   * Handle deleting the inquiry, shows a confirmation dialog, and deletes the inquiry.
   */
  const handleDelete = async () => {
    setClearGraphModal(true);
  };

  /**
   * Handle saving the inquiry and shows a success or error alert.
   */
  const handleSave = async () => {
    await saveForm(
      (id) => {
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  return (
    <>
      <CustomModal size={'3xl'} open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleInputChange('title')}
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
              Description
            </label>
            <textarea
              id="inputGoals"
              value={form.description}
              onChange={handleInputChange('description')}
              rows={2}
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="organizationName">
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              value={form.organizationName}
              onChange={handleInputChange('organizationName')}
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
            />
          </div>
        </form>
        <div className="flex justify-end bg-white p-4 rounded-2xl space-x-4">
          {id && (
            <button
              onClick={handleDelete}
              className="bg-white hover:bg-red-600 border-red-600 border-2 hover:text-white text-red-600 text-sm font-bold py-2 px-4 rounded-full flex items-center transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={form.title === ''}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center disabled:opacity-50"
          >
            {id ? 'Save' : 'Create'}
          </button>
        </div>
      </CustomModal>

      <DeleteConfirmationModal
        isOpen={clearGraphModal}
        onClose={() => setClearGraphModal(false)}
        onConfirm={async () => {
          await deleteInquiry(
            () => {
              alert('Inquiry deleted successfully!', 'success');
              navigate('/dashboard/inquiry-builder');
              if (onDelete) onDelete();
            },
            () => {
              alert('Something went wrong!', 'error');
            },
          );
        }}
        text="Are you sure you want to delete the inquiry?"
        confirmText="Delete Inquiry"
      />
    </>
  );
}
