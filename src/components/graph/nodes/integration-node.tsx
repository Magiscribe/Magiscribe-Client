import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import { GET_INQUIRY_INTEGRATIONS } from '@/clients/queries';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { useQuery } from '@apollo/client';
import React, { useCallback, useMemo } from 'react';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';

interface Integration {
  name: string;
  description: string;
  type: string;
  config: {
    serverUrl: string;
    auth?: {
      apiKey?: string;
    };
  };
}

type IntegrationNodeProps = NodeProps & {
  data: {
    selectedIntegration: string;
    prompt: string;
  };
};

export default function IntegrationNode({ id, data }: IntegrationNodeProps) {
  const { handleInputChange } = useNodeData<IntegrationNodeProps>(id);
  const { id: inquiryId } = useInquiryBuilder();

  // Fetch available integrations for this inquiry
  const { data: integrationsData, loading: integrationsLoading } = useQuery(GET_INQUIRY_INTEGRATIONS, {
    variables: { inquiryId },
    skip: !inquiryId,
  });

  const handleUpdate = useCallback(
    (updates: Partial<IntegrationNodeProps['data']>) => {
      Object.entries(updates).forEach(([key, value]) => {
        handleInputChange({
          target: { name: key, value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    },
    [handleInputChange],
  );

  const integrationOptions = useMemo(() => {
    if (!integrationsData?.getInquiryIntegrations) return [];
    
    return integrationsData.getInquiryIntegrations.map((integration: Integration) => ({
      value: integration.name,
      label: `${integration.name} - ${integration.description}`,
    }));
  }, [integrationsData]);

  const selectedIntegrationDetails = useMemo(() => {
    if (!integrationsData?.getInquiryIntegrations || !data.selectedIntegration) return null;
    
    return integrationsData.getInquiryIntegrations.find(
      (integration: Integration) => integration.name === data.selectedIntegration
    );
  }, [integrationsData, data.selectedIntegration]);

  return (
    <NodeContainer title="Integration" faIcon={faCog} id={id}>
      <Select
        label="Integration Tool"
        name="selectedIntegration"
        value={data.selectedIntegration}
        onChange={(e) => handleUpdate({ selectedIntegration: e.target.value })}
        options={integrationOptions}
        className="nodrag"
        disabled={integrationsLoading}
        subLabel={
          integrationsLoading
            ? 'Loading available integrations...'
            : integrationOptions.length === 0
            ? 'No integrations configured. Add integrations in inquiry settings.'
            : 'Select an MCP integration tool to execute'
        }
      />

      {selectedIntegrationDetails && (
        <div className="p-3 bg-slate-100 dark:bg-slate-600 rounded-lg text-sm">
          <div className="font-medium text-slate-800 dark:text-white">Integration Details:</div>
          <div className="text-slate-600 dark:text-slate-300 mt-1">
            <div><strong>Type:</strong> {selectedIntegrationDetails.type}</div>
            <div><strong>Description:</strong> {selectedIntegrationDetails.description}</div>
          </div>
        </div>
      )}

      <Textarea
        label="System Prompt"
        subLabel={
          data.selectedIntegration
            ? 'Instructions for the integration tool. Can reference user input from previous nodes using {{variable_name}} syntax.'
            : 'Define how this integration should be used (disabled until integration is selected)'
        }
        name="prompt"
        value={data.prompt}
        onChange={(e) => handleUpdate({ prompt: e.target.value })}
        placeholder="Enter instructions for the integration tool..."
        className="resize-none overflow-hidden nodrag"
        rows={4}
        disabled={!data.selectedIntegration}
      />

      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
