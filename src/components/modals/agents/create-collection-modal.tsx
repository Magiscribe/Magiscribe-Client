import { UPSERT_COLLECTION } from '@/clients/mutations';
import { useAddAlert } from '@/providers/alert-provider';
import { useMutation } from '@apollo/client';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../controls/button';
import Input from '../../controls/input';
import CustomModal from '../modal';

/**
 * Props for the ModalUpsertInquiry component
 */
interface ModalUpsertInquiryProps {
  open: boolean;
  onClose: () => void;
}
/**
 * ModalUpsertInquiry component for creating or updating inquiries
 */
const ModalUpsertCollection: React.FC<ModalUpsertInquiryProps> = ({ open, onClose }) => {
  // State
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '' });

  // Query
  const [upsertCollection] = useMutation(UPSERT_COLLECTION);

  // Hooks
  const navigate = useNavigate();
  const addAlert = useAddAlert();

  // Handlers
  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await upsertCollection({
        variables: {
          input: {
            name: form.title,
          },
        },
      });

      if (result.errors) {
        addAlert('Error saving collection', 'error');
        setLoading(false);
        return;
      }

      addAlert('Collection saved successfully', 'success');
      setLoading(false);
      navigate(`/dashboard/agent-lab/${result.data?.upsertCollection.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomModal size="3xl" open={open} onClose={onClose} title={'Create Collection'}>
      <form className="space-y-4" onSubmit={handleSave}>
        <Input
          name="title"
          label="Title"
          placeholder="Collection title"
          autoFocus
          subLabel="This will be displayed to the people you are sending the inquiry to"
          value={form.title}
          onChange={handleInputChange('title')}
        />

        <div className="flex justify-end items-center rounded-2xl">
          <Button type="button" onClick={onClose} variant="transparentPrimary" size="medium" className="ml-2">
            Cancel
          </Button>
          <Button disabled={loading} variant="primary" size="medium" className="ml-2">
            {'Create'} {loading && <FontAwesomeIcon icon={faSpinner} className="ml-2" spin />}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ModalUpsertCollection;
