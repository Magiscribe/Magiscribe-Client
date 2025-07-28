import { GET_ALL_AUDIO_VOICES, GET_INQUIRY_INTEGRATIONS } from '@/clients/queries';
import { SET_INQUIRY_INTEGRATIONS } from '@/clients/mutations';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { GetAllAudioVoicesQuery } from '@/graphql/types';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { VOICE_LINE_SAMPLES } from '@/utils/audio/voice-line-samples';
import { useMutation, useQuery } from '@apollo/client';
import { faPlay, faSpinner, faPlus, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../controls/button';
import Select from '../../controls/select';
import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';
import { ModalEditOwners } from './edit-owners-modal';

/**
 * Props for the ModalUpsertInquiry component
 */
interface ModalUpsertInquiryProps {
  open: boolean;
  onSave?: (id: string) => void;
  onClose: () => void;
}

interface Integration {
  name: string;
  description: string;
  type: 'MCP';
  config: {
    serverUrl: string;
    auth?: {
      apiKey?: string;
    };
  };
}

/**
 * ModalUpsertInquiry component for creating or updating inquiries
 */
export default function ModalSettingsInquiry({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  // State
  const [deleteModal, setDeleteModal] = useState(false);
  const [showEditOwnersModal, setShowEditOwnersModal] = useState(false);
  const [isConfirmDeleteOwnerModalOpen, setIsConfirmDeleteOwnerModalOpen] = useState<boolean>(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Integration>({
    name: '',
    description: '',
    type: 'MCP',
    config: {
      serverUrl: '',
      auth: {
        apiKey: '',
      },
    },
  });

  // Hooks
  const { id, setSettings, settings, saveSettings, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();
  const navigate = useNavigate();

  // Voice hooks
  const { data: voices } = useQuery<GetAllAudioVoicesQuery>(GET_ALL_AUDIO_VOICES);
  const { addSentence, isLoading } = useElevenLabsAudio(settings.voice);

  // Get current integrations from inquiry data (they're stored at data.integrations level)
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [setInquiryIntegrationsMutation] = useMutation(SET_INQUIRY_INTEGRATIONS);

  // Load integrations when inquiry ID is available
  useQuery(GET_INQUIRY_INTEGRATIONS, {
    variables: { inquiryId: id },
    skip: !id,
    onCompleted: (data) => {
      if (data?.getInquiryIntegrations) {
        setIntegrations(data.getInquiryIntegrations);
      }
    },
  });

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
   * Handle input change for the form
   * @param field - The field to update
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setSettings({ ...settings, [field]: e.target.value });
    };

  /**
   * Handle saving the inquiry
   */
  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      // Save settings first
      await saveSettings(
        async (savedId) => {
          // Then save integrations if there's an inquiry ID
          const inquiryId = savedId || id;
          if (inquiryId) {
            await setInquiryIntegrationsMutation({
              variables: {
                inquiryId,
                integrations: integrations.map(integration => ({
                  name: integration.name,
                  description: integration.description,
                  type: integration.type,
                  config: integration.config,
                })),
              },
            });
          }
          alert('Inquiry saved successfully!', 'success');
          if (onSave) onSave(inquiryId as string);
        },
        () => {
          alert('Something went wrong!', 'error');
        },
      );
    } catch (error) {
      alert('Something went wrong!', 'error');
    }
  };

  /**
   * Handle previewing the voice with a few random sentences.
   */
  const handlePreviewVoice = () => {
    addSentence(VOICE_LINE_SAMPLES[Math.floor(Math.random() * VOICE_LINE_SAMPLES.length)]);
  };

  /**
   * Handle adding a new integration
   */
  const handleAddIntegration = () => {
    if (!newIntegration.name || !newIntegration.config.serverUrl) {
      alert('Name and Server URL are required', 'error');
      return;
    }

    const updatedIntegrations = [...integrations, {
      ...newIntegration,
      config: {
        serverUrl: newIntegration.config.serverUrl,
        ...(newIntegration.config.auth?.apiKey && {
          auth: { apiKey: newIntegration.config.auth.apiKey }
        })
      }
    }];

    setIntegrations(updatedIntegrations);
    setNewIntegration({
      name: '',
      description: '',
      type: 'MCP',
      config: { serverUrl: '', auth: { apiKey: '' } },
    });
    setShowAddIntegration(false);
    alert('Integration added successfully!', 'success');
  };

  /**
   * Handle removing an integration
   */
  const handleRemoveIntegration = (index: number) => {
    const updatedIntegrations = integrations.filter((_: any, i: number) => i !== index);
    setIntegrations(updatedIntegrations);
    alert('Integration removed successfully!', 'success');
  };

  /**
   * Handle integration input changes
   */
  const handleIntegrationInputChange = (field: string, value: string) => {
    if (field === 'serverUrl') {
      setNewIntegration({
        ...newIntegration,
        config: { ...newIntegration.config, serverUrl: value },
      });
    } else if (field === 'apiKey') {
      setNewIntegration({
        ...newIntegration,
        config: {
          ...newIntegration.config,
          auth: { ...newIntegration.config.auth, apiKey: value },
        },
      });
    } else {
      setNewIntegration({ ...newIntegration, [field]: value });
    }
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
          {/* Update graph owners */}
          <Button type="button" onClick={() => setShowEditOwnersModal(true)} size="small" className="w-full">
            Edit Owners
          </Button>

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
              size="small"
              icon={isLoading ? faSpinner : faPlay}
              iconSpin={isLoading}
              onClick={handlePreviewVoice}
            >
              Preview Voice
            </Button>
          </div>

          <Textarea
            name="globalContext"
            label="Context (optional)"
            subLabel="Provide any additional background information.  This helps Magiscribe to provide each survey respondent with relevant questions."
            value={settings.context ?? ''}
            onChange={handleInputChange('context')}
          />

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

          {/* Integrations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium">Integrations</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add MCP (Model Context Protocol) integrations to extend your inquiry capabilities
                </p>
              </div>
              <Button
                type="button"
                size="small"
                icon={faPlus}
                onClick={() => setShowAddIntegration(true)}
                variant="primary"
              >
                Add Integration
              </Button>
            </div>

            {/* Existing Integrations */}
            {integrations.length > 0 && (
              <div className="space-y-2">
                {integrations.map((integration: Integration, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600">
                    <div className="flex-1">
                      <h5 className="font-medium">{integration.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{integration.config.serverUrl}</p>
                    </div>
                    <Button
                      type="button"
                      size="small"
                      icon={faTrash}
                      variant="danger"
                      onClick={() => handleRemoveIntegration(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Integration Form */}
            {showAddIntegration && (
              <div className="space-y-3 p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <h5 className="font-medium">Add New Integration</h5>
                
                <Input
                  name="integrationName"
                  label="Name"
                  value={newIntegration.name}
                  onChange={(e) => handleIntegrationInputChange('name', e.target.value)}
                  placeholder="e.g., My Atlassian Integration"
                />

                <Input
                  name="integrationDescription"
                  label="Description"
                  value={newIntegration.description}
                  onChange={(e) => handleIntegrationInputChange('description', e.target.value)}
                  placeholder="Brief description of what this integration does"
                />

                <Input
                  name="serverUrl"
                  label="Server URL"
                  value={newIntegration.config.serverUrl}
                  onChange={(e) => handleIntegrationInputChange('serverUrl', e.target.value)}
                  placeholder="http://localhost:8080"
                />

                <Input
                  name="apiKey"
                  label="API Key (optional)"
                  type="password"
                  value={newIntegration.config.auth?.apiKey || ''}
                  onChange={(e) => handleIntegrationInputChange('apiKey', e.target.value)}
                  placeholder="Enter API key if required"
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    size="small"
                    icon={faTimes}
                    variant="transparentPrimary"
                    onClick={() => {
                      setShowAddIntegration(false);
                      setNewIntegration({
                        name: '',
                        description: '',
                        type: 'MCP',
                        config: { serverUrl: '', auth: { apiKey: '' } },
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    icon={faCheck}
                    variant="primary"
                    onClick={handleAddIntegration}
                  >
                    Add Integration
                  </Button>
                </div>
              </div>
            )}
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

      <ModalEditOwners
        open={showEditOwnersModal}
        onClose={() => setShowEditOwnersModal(false)}
        isConfirmDeleteModalOpen={isConfirmDeleteOwnerModalOpen}
        onDeleteOwner={() => setIsConfirmDeleteOwnerModalOpen(true)}
        onCloseConfirmDeleteOwnerModal={() => setIsConfirmDeleteOwnerModalOpen(false)}
      />
    </>
  );
}
