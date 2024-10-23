import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import React, { useState } from 'react';

import Button from '../../controls/button';
import Select from '../../controls/select';
import CustomModal from '../modal';
import ConfirmationModal from '../confirm-modal';
import { useNavigate } from 'react-router-dom';

/**
 * Props for the ModalUpsertInquiry component
 */
interface ModalUpsertInquiryProps {
  open: boolean;
  onSave?: (id: string) => void;
  onClose: () => void;
}

/**
 * ModalUpsertInquiry component for creating or updating inquiries
 */
export default function ModalSettingsInquiry({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  const [deleteModal, setDeleteModal] = useState(false);
  const { id, form, updateForm, saveForm, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();

  const navigate = useNavigate();

  /**
   * Handle select change for the form
   * @param field - The field to update
   * @param e - The change event
   * @returns void
   */
  const handleSelectChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      updateForm({ ...form, [field]: e.target.value });
    };

  /**
   * Handle saving the inquiry
   */
  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

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
      <CustomModal size="3xl" open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
        <form className="space-y-4" onSubmit={handleSave}>
          <Select
            name="voice"
            label="Voice"
            subLabel="Select the voice you would like to use for your inquiry"
            value={form.voice ?? 'formal'}
            onChange={handleSelectChange('voice')}
            options={[
              { label: 'Phoebe', value: 'phoebe' },
              { label: 'Oxley', value: 'oxley' },
            ]}
          />

          <div className="flex">
            <Button
              type="button"
              onClick={() => setDeleteModal(true)}
              variant="transparentDanger"
              size="medium"
              className="ml-auto"
            >
              Delete Inquiry
            </Button>
          </div>

          <div className="flex justify-end items-center p-4 rounded-2xl">
            <Button type="button" onClick={onClose} variant="transparentPrimary" size="medium" className="ml-2">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary" size="medium" className="ml-2">
              Save
            </Button>
          </div>
        </form>
      </CustomModal>

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={async () => {
          await deleteInquiry(
            () => {
              alert('Inquiry deleted successfully!', 'success');
              navigate('/dashboard/inquiry-builder');
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
