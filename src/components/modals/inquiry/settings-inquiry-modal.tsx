import { GET_ALL_AUDIO_VOICES } from '@/clients/queries';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useQuery } from '@apollo/client';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../controls/button';
import Select from '../../controls/select';
import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';
import { GetAllAudioVoicesQuery } from '@/graphql/types';

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
  // State
  const [deleteModal, setDeleteModal] = useState(false);

  // Hooks
  const { id, form, updateForm, saveForm, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();
  const navigate = useNavigate();
  const { addSentence, isLoading } = useElevenLabsAudio(form.voice!);

  // Apollo
  const { data: voices } = useQuery<GetAllAudioVoicesQuery>(GET_ALL_AUDIO_VOICES);

  /**
   * Handle select change for the form
   * @param field - The field to update
   * @param e - The change event
   * @returns void
   */
  const handleSelectChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      updateForm({ ...form, [field]: e.target.value !== '' ? e.target.value : null });
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
      <CustomModal
        size="3xl"
        open={open}
        onClose={onClose}
        title={id ? 'Update Inquiry' : 'Create Inquiry'}
        buttons={
          <>
            <Button
              type="button"
              onClick={() => setDeleteModal(true)}
              variant="inverseDanger"
              size="medium"
              className="mr-auto"
            >
              Delete Inquiry
            </Button>
            <Button type="button" onClick={onClose} variant="transparentPrimary" size="medium" className="ml-2">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary" size="medium" className="ml-2">
              Save
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <Select
            name="voice"
            label="Voice"
            subLabel="This will be the voice used to read responses to the user if they have audio enabled"
            value={form.voice ?? ''}
            onChange={handleSelectChange('voice')}
            options={voices?.getAllAudioVoices.map((voice) => ({ value: voice.id, label: voice.name })) ?? []}
          />
          <Button
            type="button"
            icon={isLoading ? faSpinner : faPlay}
            iconSpin={isLoading}
            onClick={() => {
              addSentence(
                `Hello, I am ${form.voice}! ${
                  ["Let's capture insights!", 'It is nice to meet you!', 'I was programmed to say this!'][
                    Math.floor(Math.random() * 3)
                  ]
                }`,
              );
            }}
          >
            Preview Voice
          </Button>
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
