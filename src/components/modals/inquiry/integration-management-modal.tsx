import { SET_INQUIRY_INTEGRATIONS } from '@/clients/mutations';
import { GET_INQUIRY_INTEGRATIONS, GET_MCP_INTEGRATION_TOOLS, TEST_MCP_INTEGRATION } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { faCheck, faEdit, faMinus, faPlug, faPlus, faTimes, faTools, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';

interface Integration {
  id?: string;
  name: string;
  description: string;
  type: 'MCP';
  config: {
    serverUrl: string;
    // Headers to pass with requests to the MCP server
    headers?: {
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
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [viewingToolsIndex, setViewingToolsIndex] = useState<number | null>(null);
  const [discoveredTools, setDiscoveredTools] = useState<Array<{ name: string; description: string; inputSchema?: any }>>([]);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [formData, setFormData] = useState<Integration>({
    name: '',
    description: '',
    type: 'MCP',
    config: {
      serverUrl: '',
      headers: {},
    },
  });

  // Hooks
  const { id } = useInquiryBuilder();
  const alert = useAddAlert();
  const [setInquiryIntegrationsMutation, { loading: savingIntegrations }] = useMutation(SET_INQUIRY_INTEGRATIONS);
  const [testIntegration] = useLazyQuery(TEST_MCP_INTEGRATION);
  const [getMCPIntegrationTools, { loading: loadingTools }] = useLazyQuery(GET_MCP_INTEGRATION_TOOLS);

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
      setViewingToolsIndex(null);
      setDiscoveredTools([]);
      setShowToolsModal(false);
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
        headers: {},
      },
    });
    setHeaders([{ key: '', value: '' }]);
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
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  /**
   * Handle header changes
   */
  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
    
    // Update formData headers
    const headersObj = newHeaders.reduce((acc, header) => {
      if (header.key.trim() && header.value.trim()) {
        acc[header.key.trim()] = header.value.trim();
      }
      return acc;
    }, {} as { [key: string]: string });
    
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        headers: headersObj,
      },
    });
  };

  /**
   * Add a new header row
   */
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  /**
   * Remove a header row
   */
  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    
    // Update formData headers
    const headersObj = newHeaders.reduce((acc, header) => {
      if (header.key.trim() && header.value.trim()) {
        acc[header.key.trim()] = header.value.trim();
      }
      return acc;
    }, {} as { [key: string]: string });
    
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        headers: headersObj,
      },
    });
  };

  /**
   * Start editing an existing integration
   */
  const startEdit = (index: number) => {
    const integration = integrations[index];
    setFormData(integration);
    setEditingIndex(index);
    setShowAddForm(true);
    
    // Populate headers if they exist
    if (integration.config.headers && Object.keys(integration.config.headers).length > 0) {
      const headerPairs = Object.entries(integration.config.headers).map(([key, value]) => ({
        key,
        value,
      }));
      setHeaders(headerPairs.length > 0 ? headerPairs : [{ key: '', value: '' }]);
    } else {
      setHeaders([{ key: '', value: '' }]);
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

    const integrationToTest = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      config: {
        serverUrl: formData.config.serverUrl,
        headers: formData.config.headers || {},
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

    const newIntegration = {
      ...formData,
      config: {
        serverUrl: formData.config.serverUrl,
        headers: formData.config.headers || {},
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
   * View available tools for an integration
   */
  const viewAvailableTools = async (integrationIndex: number) => {
    const integration = integrations[integrationIndex];
    
    if (!integration.id) {
      alert('Integration must be saved before viewing tools', 'error');
      return;
    }

    setViewingToolsIndex(integrationIndex);
    setShowToolsModal(true);
    
    try {
      const result = await getMCPIntegrationTools({
        variables: { integrationId: integration.id }
      });

      if (result.data?.getMCPIntegrationTools?.success) {
        const tools = result.data.getMCPIntegrationTools.tools || [];
        setDiscoveredTools(tools);
      } else {
        alert(`Failed to load tools: ${result.data?.getMCPIntegrationTools?.error || 'Unknown error'}`, 'error');
        setDiscoveredTools([]);
      }
    } catch (error) {
      alert(`Failed to load tools: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setDiscoveredTools([]);
    }
  };

  /**
   * Close tools modal
   */
  const closeToolsModal = () => {
    setViewingToolsIndex(null);
    setShowToolsModal(false);
    setDiscoveredTools([]);
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
            id: integration.id,
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
                    Headers
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Configure headers to be sent with requests to the MCP server.
                    <br />
                    <strong>Example:</strong> Authorization → Bearer your-token-here
                  </p>
                  
                  <div className="space-y-2">
                    {headers.map((header, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-2">
                          <Input
                            name={`headerKey-${index}`}
                            placeholder="Header name (e.g., Authorization)"
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            name={`headerValue-${index}`}
                            placeholder="Header value (e.g., Bearer token123)"
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-1">
                          {index === headers.length - 1 && (
                            <Button
                              type="button"
                              size="small"
                              icon={faPlus}
                              variant="transparentPrimary"
                              onClick={addHeader}
                              disabled={!header.key.trim() || !header.value.trim()}
                            />
                          )}
                          {headers.length > 1 && (
                            <Button
                              type="button"
                              size="small"
                              icon={faMinus}
                              variant="transparentPrimary"
                              onClick={() => removeHeader(index)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                        {(integration.config.headers && Object.keys(integration.config.headers).length > 0) && (
                          <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                            Headers
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
                        {integration.config.headers && Object.keys(integration.config.headers).length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            📋 {Object.keys(integration.config.headers).length} headers
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="small"
                        icon={faTools}
                        variant="transparentPrimary"
                        onClick={() => viewAvailableTools(index)}
                        disabled={!integration.id || loadingTools}
                      >
                        {loadingTools && viewingToolsIndex === index ? 'Loading...' : 'View Tools'}
                      </Button>
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

      {/* Tools Modal */}
      <CustomModal
        size="3xl"
        open={showToolsModal}
        onClose={closeToolsModal}
        title={`Available Tools - ${viewingToolsIndex !== null ? integrations[viewingToolsIndex]?.name : ''}`}
        buttons={
          <Button
            type="button"
            onClick={closeToolsModal}
            variant="primary"
            size="medium"
          >
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          {loadingTools ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading available tools...</p>
            </div>
          ) : discoveredTools.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  🔧 Found <strong>{discoveredTools.length}</strong> available tool{discoveredTools.length === 1 ? '' : 's'} 
                  for this integration. Click on any tool below to view its details and input schema.
                </p>
              </div>
              
              <div className="space-y-3">
                {discoveredTools.map((tool, toolIndex) => (
                  <details key={toolIndex} className="group">
                    <summary className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-900 dark:text-white">
                            {tool.name}
                          </h6>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <svg 
                          className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    
                    <div className="mt-3 ml-4 mr-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="space-y-3">
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white">Tool Details</h6>
                            <div className="mt-2 space-y-2">
                              <div className="flex">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Name:</span>
                                <span className="text-xs text-gray-900 dark:text-white font-mono">{tool.name}</span>
                              </div>
                              <div className="flex">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Purpose:</span>
                                <span className="text-xs text-gray-700 dark:text-gray-300">{tool.description}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              💡 This tool can be executed through the Integration node in your inquiry workflow.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Tools Available</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                No tools were found for this integration. This could mean:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 mt-3 space-y-1">
                <li>• The MCP server is not running</li>
                <li>• The integration configuration is incorrect</li>
                <li>• The server doesn't expose any tools</li>
              </ul>
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
