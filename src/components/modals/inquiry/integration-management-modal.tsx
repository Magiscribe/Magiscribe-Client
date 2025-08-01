import { SET_INQUIRY_INTEGRATIONS } from '@/clients/mutations';
import { GET_INQUIRY_INTEGRATIONS } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useMutation, useQuery } from '@apollo/client';
import { faCheck, faEdit, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';

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

interface IntegrationManagementModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function IntegrationManagementModal({ open, onClose, onSave }: IntegrationManagementModalProps) {
  // State
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Integration>({
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
  const { id } = useInquiryBuilder();
  const alert = useAddAlert();
  const [setInquiryIntegrationsMutation, { loading: savingIntegrations }] = useMutation(SET_INQUIRY_INTEGRATIONS);

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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setShowAddForm(false);
      setEditingIndex(null);
      setDeleteConfirmIndex(null);
      resetForm();
    }
  }, [open]);

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    setFormData({
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
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string) => {
    if (field === 'serverUrl') {
      setFormData({
        ...formData,
        config: { ...formData.config, serverUrl: value },
      });
    } else if (field === 'apiKey') {
      setFormData({
        ...formData,
        config: {
          ...formData.config,
          auth: { ...formData.config.auth, apiKey: value },
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  /**
   * Start editing an existing integration
   */
  const startEdit = (index: number) => {
    setFormData(integrations[index]);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  /**
   * Cancel add/edit operation
   */
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingIndex(null);
    resetForm();
  };

  /**
   * Save integration (add or edit)
   */
  const saveIntegration = () => {
    if (!formData.name || !formData.config.serverUrl) {
      alert('Name and Server URL are required', 'error');
      return;
    }

    const newIntegration = {
      ...formData,
      config: {
        serverUrl: formData.config.serverUrl,
        ...(formData.config.auth?.apiKey && {
          auth: { apiKey: formData.config.auth.apiKey }
        })
      }
    };

    let updatedIntegrations: Integration[];

    if (editingIndex !== null) {
      // Edit existing integration
      updatedIntegrations = [...integrations];
      updatedIntegrations[editingIndex] = newIntegration;
      alert('Integration updated successfully!', 'success');
    } else {
      // Add new integration
      updatedIntegrations = [...integrations, newIntegration];
      alert('Integration added successfully!', 'success');
    }

    setIntegrations(updatedIntegrations);
    cancelForm();
  };

  /**
   * Confirm deletion of an integration
   */
  const confirmDelete = (index: number) => {
    setDeleteConfirmIndex(index);
  };

  /**
   * Delete an integration
   */
  const deleteIntegration = () => {
    if (deleteConfirmIndex !== null) {
      const updatedIntegrations = integrations.filter((_: any, i: number) => i !== deleteConfirmIndex);
      setIntegrations(updatedIntegrations);
      setDeleteConfirmIndex(null);
      alert('Integration removed successfully!', 'success');
    }
  };

  /**
   * Save all integrations to the backend
   */
  const saveAllIntegrations = async () => {
    if (!id) {
      alert('No inquiry ID available', 'error');
      return;
    }

    try {
      await setInquiryIntegrationsMutation({
        variables: {
          inquiryId: id,
          integrations: integrations.map(integration => ({
            name: integration.name,
            description: integration.description,
            type: integration.type,
            config: integration.config,
          })),
        },
      });
      alert('Integrations saved successfully!', 'success');
      if (onSave) onSave();
      onClose();
    } catch (error) {
      alert('Failed to save integrations', 'error');
      console.error('Error saving integrations:', error);
    }
  };

  return (
    <>
      <CustomModal
        size="4xl"
        open={open}
        onClose={onClose}
        title="Manage Integrations"
        buttons={
          <>
            <Button
              type="button"
              onClick={onClose}
              variant="transparentPrimary"
              size="medium"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAllIntegrations}
              variant="primary"
              size="medium"
              disabled={savingIntegrations}
            >
              {savingIntegrations ? 'Saving...' : 'Save Integrations'}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Header with description and add button */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add MCP (Model Context Protocol) integrations to extend your inquiry capabilities.
                These integrations allow your inquiry to connect with external tools and services.
              </p>
            </div>
            <Button
              type="button"
              size="small"
              icon={faPlus}
              onClick={() => setShowAddForm(true)}
              variant="primary"
              disabled={showAddForm}
            >
              Add Integration
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="space-y-4 p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <h5 className="font-medium">
                {editingIndex !== null ? 'Edit Integration' : 'Add New Integration'}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="integrationName"
                  label="Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., My Atlassian Integration"
                />

                <Input
                  name="serverUrl"
                  label="Server URL *"
                  value={formData.config.serverUrl}
                  onChange={(e) => handleInputChange('serverUrl', e.target.value)}
                  placeholder="http://localhost:8080"
                />
              </div>

              <Input
                name="integrationDescription"
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of what this integration does"
              />

              <Input
                name="apiKey"
                label="API Key (optional)"
                type="password"
                value={formData.config.auth?.apiKey || ''}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter API key if required"
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  size="small"
                  icon={faTimes}
                  variant="transparentPrimary"
                  onClick={cancelForm}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="small"
                  icon={faCheck}
                  variant="primary"
                  onClick={saveIntegration}
                >
                  {editingIndex !== null ? 'Update' : 'Add'} Integration
                </Button>
              </div>
            </div>
          )}

          {/* Existing Integrations List */}
          {integrations.length > 0 ? (
            <div className="space-y-3">
              <h5 className="font-medium">Current Integrations ({integrations.length})</h5>
              <div className="space-y-2">
                {integrations.map((integration: Integration, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h6 className="font-medium">{integration.name}</h6>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {integration.type}
                        </span>
                      </div>
                      {integration.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {integration.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {integration.config.serverUrl}
                      </p>
                      {integration.config.auth?.apiKey && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          🔑 API Key configured
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="small"
                        icon={faEdit}
                        variant="transparentPrimary"
                        onClick={() => startEdit(index)}
                        disabled={showAddForm}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        icon={faTrash}
                        variant="danger"
                        onClick={() => confirmDelete(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No integrations configured yet.</p>
              <p className="text-sm">Click "Add Integration" to get started.</p>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmIndex !== null}
        onClose={() => setDeleteConfirmIndex(null)}
        onConfirm={deleteIntegration}
        text={
          deleteConfirmIndex !== null
            ? `Are you sure you want to delete the integration "${integrations[deleteConfirmIndex]?.name}"?`
            : ''
        }
        confirmText="Delete Integration"
      />
    </>
  );
}
