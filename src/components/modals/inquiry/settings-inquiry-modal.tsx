import { GET_ALL_AUDIO_VOICES } from '@/clients/queries';
import { GetAllAudioVoicesQuery } from '@/graphql/types';
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
import { VOICE_LINE_SAMPLES } from '@/utils/audio/voice-line-samples';
import Input from '@/components/controls/input';

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
  const { id, setSettings, settings, saveSettings, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();
  const navigate = useNavigate();

  // Voice hooks
  const { data: voices } = useQuery<GetAllAudioVoicesQuery>(GET_ALL_AUDIO_VOICES);
  const { addSentence, isLoading } = useElevenLabsAudio(settings.voice);

  /**
   * Handle select change for the form
   * @param field - The field to update
   * @param e - The change event
   * @returns void
   */
  const handleSelectChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      setSettings({ ...settings, [field]: e.target.value !== '' ? e.target.value : null });
    };

  /**
   * Handle saving the inquiry
   */
  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    await saveSettings(
      (id) => {
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  /**
   * Handle previewing the voice with a few random sentences.
   */
  const handlePreviewVoice = () => {
    addSentence(VOICE_LINE_SAMPLES[Math.floor(Math.random() * VOICE_LINE_SAMPLES.length)]);
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
            value={settings.voice ?? ''}
            onChange={handleSelectChange('voice')}
            options={
              voices?.getAllAudioVoices.map((voice) => ({
                value: voice.id,
                label: `${voice.name} (${voice.tags.join(', ')})`,
              })) ?? []
            }
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="small"
              icon={isLoading ? faSpinner : faPlay}
              iconSpin={isLoading}
              onClick={handlePreviewVoice}
            >
              Preview Voice
            </Button>
          </div>

          <Input
            name="email"
            label="Recieve Email On Response"
            type="checkbox"
            subLabel="Be alerted via email when someone finishes your inquiry."
            value={String(settings.notifications?.recieveEmailOnResponse)}
            onChange={(e) => {
              setSettings({ ...settings, notifications: { recieveEmailOnResponse: e.target.checked } });
            }}
          />
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
