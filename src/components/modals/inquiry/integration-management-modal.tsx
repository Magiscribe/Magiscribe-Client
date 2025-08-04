import { SET_INQUIRY_INTEGRATIONS } from '@/clients/mutations';
import { GET_INQUIRY_INTEGRATIONS, TEST_MCP_INTEGRATION } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { faCheck, faEdit, faPlug, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';

interface Integration {
  name: string;
  description: string;
  type: 'MCP';
  config: {
    serverUrl: string;
    // JSON-based configuration support
    mcpConfig?: {
      [key: string]: any;
    };
    // Environment variables for MCP server
    environment?: {
      [key: string]: string;
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
  const [jsonConfigText, setJsonConfigText] = useState('');
  const [environmentText, setEnvironmentText] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [formData, setFormData] = useState<Integration>({
    name: '',
    description: '',
    type: 'MCP',
    config: {
      serverUrl: '',
      mcpConfig: {},
      environment: {},
    },
  });

  // Hooks
  const { id } = useInquiryBuilder();
  const alert = useAddAlert();
  const [setInquiryIntegrationsMutation, { loading: savingIntegrations }] = useMutation(SET_INQUIRY_INTEGRATIONS);
  const [testIntegration] = useLazyQuery(TEST_MCP_INTEGRATION);

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
        mcpConfig: {},
        environment: {},
      },
    });
    setJsonConfigText('');
    setEnvironmentText('');
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
    } else if (field === 'jsonConfig') {
      setJsonConfigText(value);
      try {
        const parsedConfig = JSON.parse(value);
        setFormData({
          ...formData,
          config: {
            ...formData.config,
            mcpConfig: parsedConfig,
          },
        });
      } catch (error) {
        // Invalid JSON, don't update the config yet
      }
    } else if (field === 'environment') {
      setEnvironmentText(value);
      try {
        const parsedEnv = JSON.parse(value);
        setFormData({
          ...formData,
          config: {
            ...formData.config,
            environment: parsedEnv,
          },
        });
      } catch (error) {
        // Invalid JSON, don't update the environment yet
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  /**
   * Start editing an existing integration
   */
  const startEdit = (index: number) => {
    const integration = integrations[index];
    setFormData(integration);
    setEditingIndex(index);
    setShowAddForm(true);
    
    // Populate JSON fields if they exist
    if (integration.config.mcpConfig && Object.keys(integration.config.mcpConfig).length > 0) {
      setJsonConfigText(JSON.stringify(integration.config.mcpConfig, null, 2));
    }
    
    if (integration.config.environment && Object.keys(integration.config.environment).length > 0) {
      setEnvironmentText(JSON.stringify(integration.config.environment, null, 2));
    }
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
   * Test the connection to the MCP integration
   */
  const testConnection = async () => {
    if (!formData.name || !formData.config.serverUrl) {
      alert('Name and Server URL are required to test connection', 'error');
      return;
    }

    // Validate JSON config if provided
    let testConfig = {};
    let testEnvironment = {};

    if (jsonConfigText.trim()) {
      try {
        testConfig = JSON.parse(jsonConfigText);
      } catch (error) {
        alert('Invalid JSON configuration. Please check your syntax.', 'error');
        return;
      }
    }

    if (environmentText.trim()) {
      try {
        testEnvironment = JSON.parse(environmentText);
      } catch (error) {
        alert('Invalid environment variables JSON. Please check your syntax.', 'error');
        return;
      }
    }

    const integrationToTest = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      config: {
        serverUrl: formData.config.serverUrl,
        ...(jsonConfigText.trim() && {
          mcpConfig: testConfig
        }),
        ...(environmentText.trim() && {
          environment: testEnvironment
        }),
      }
    };

    setIsTestingConnection(true);
    try {
      const result = await testIntegration({
        variables: { integration: integrationToTest }
      });

      if (result.data?.testMCPIntegration?.success) {
        alert('Connection test successful! 🎉', 'success');
      } else {
        alert(`Connection test failed: ${result.data?.testMCPIntegration?.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      alert(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  /**
   * Save integration (add or edit)
   */
  const saveIntegration = () => {
    if (!formData.name || !formData.config.serverUrl) {
      alert('Name and Server URL are required', 'error');
      return;
    }

    // Validate JSON config if provided
    if (jsonConfigText.trim()) {
      try {
        JSON.parse(jsonConfigText);
      } catch (error) {
        alert('Invalid JSON configuration. Please check your syntax.', 'error');
        return;
      }
    }

    // Validate environment variables if provided
    if (environmentText.trim()) {
      try {
        JSON.parse(environmentText);
      } catch (error) {
        alert('Invalid environment variables JSON. Please check your syntax.', 'error');
        return;
      }
    }

    const newIntegration = {
      ...formData,
      config: {
        serverUrl: formData.config.serverUrl,
        // Include JSON config if provided
        ...(jsonConfigText.trim() && {
          mcpConfig: JSON.parse(jsonConfigText)
        }),
        // Include environment variables if provided
        ...(environmentText.trim() && {
          environment: JSON.parse(environmentText)
        }),
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
            <Button
              type="button"
              size="small"
              icon={faPlus}
              onClick={() => setShowAddForm(true)}
              variant="primary"
              disabled={showAddForm}
            >
              Add
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    MCP Configuration (JSON)
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Provide a JSON configuration object for the MCP server. 
                    This should contain environment variables and settings that the MCP server expects.
                    <br />
                    <strong>Example for Atlassian:</strong> JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN, CONFLUENCE_URL, etc.
                  </p>
                  <Textarea
                    name="jsonConfig"
                    value={jsonConfigText}
                    onChange={(e) => handleInputChange('jsonConfig', e.target.value)}
                    placeholder={`{
  "CONFLUENCE_URL": "https://your-company.atlassian.net/wiki",
  "CONFLUENCE_USERNAME": "your.email@company.com",
  "CONFLUENCE_API_TOKEN": "your_api_token",
  "JIRA_URL": "https://your-company.atlassian.net",
  "JIRA_USERNAME": "your.email@company.com",
  "JIRA_API_TOKEN": "your_jira_api_token"
}`}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Environment Variables (JSON, optional)
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Additional environment variables to pass to the MCP server.
                  </p>
                  <Textarea
                    name="environment"
                    value={environmentText}
                    onChange={(e) => handleInputChange('environment', e.target.value)}
                    placeholder={`{
  "READ_ONLY_MODE": "false",
  "MCP_VERBOSE": "true",
  "CONFLUENCE_SPACES_FILTER": "DEV,TEAM,DOC"
}`}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  size="small"
                  icon={faPlug}
                  variant="transparentPrimary"
                  onClick={testConnection}
                  disabled={isTestingConnection || !formData.name || !formData.config.serverUrl}
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
                
                <div className="flex space-x-2">
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
                        {(integration.config.mcpConfig && Object.keys(integration.config.mcpConfig).length > 0) && (
                          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                            JSON Config
                          </span>
                        )}
                      </div>
                      {integration.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {integration.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {integration.config.serverUrl}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        {integration.config.mcpConfig && Object.keys(integration.config.mcpConfig).length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            ⚙️ {Object.keys(integration.config.mcpConfig).length} config items
                          </span>
                        )}
                        {integration.config.environment && Object.keys(integration.config.environment).length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            🌍 {Object.keys(integration.config.environment).length} env vars
                          </span>
                        )}
                      </div>
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
