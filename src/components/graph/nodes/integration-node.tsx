import Select from '@/components/controls/select';
import Textarea from '@/components/controls/textarea';
import { GET_INQUIRY_INTEGRATIONS } from '@/clients/queries';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { useQuery } from '@apollo/client/react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import NodeContainer from '../elements/node-container';
import CustomHandle from '../handles/limit-handle';
import { useNodeData } from '../utils';
import { GetInquiryIntegrationsQuery } from '@/graphql/graphql';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
}

type IntegrationNodeProps = NodeProps & {
  data: {
    selectedIntegrationId: string;
    prompt: string;
  };
};

export default function IntegrationNode({ id, data }: IntegrationNodeProps) {
  const { handleInputChange } = useNodeData<IntegrationNodeProps>(id);
  const { id: inquiryId } = useInquiryBuilder();
  const { t } = useTranslation();

  // Fetch available integrations for this inquiry
  const { data: integrationsData, loading: integrationsLoading } = useQuery<GetInquiryIntegrationsQuery>(
    GET_INQUIRY_INTEGRATIONS,
    {
      variables: { inquiryId },
      skip: !inquiryId,
    },
  );

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
    const options = [{ value: '', label: t('nodes.integration.selectIntegrationPlaceholder') }];

    if (!integrationsData?.getInquiryIntegrations) return options;

    const integrationItems = integrationsData.getInquiryIntegrations.map((integration: Integration) => ({
      value: integration.id,
      label: integration.name,
    }));

    return [...options, ...integrationItems];
  }, [integrationsData, t]);

  const selectedIntegrationDetails = useMemo(() => {
    if (!integrationsData?.getInquiryIntegrations || !data.selectedIntegrationId) return null;

    return integrationsData.getInquiryIntegrations.find(
      (integration: Integration) => integration.id === data.selectedIntegrationId,
    );
  }, [integrationsData, data.selectedIntegrationId]);

  return (
    <NodeContainer title={t('nodes.integration.title')} faIcon={faCog} id={id}>
      <Select
        label={t('nodes.integration.integrationToolLabel')}
        name="selectedIntegrationId"
        value={data.selectedIntegrationId}
        onChange={(e) => handleUpdate({ selectedIntegrationId: e.target.value })}
        options={integrationOptions}
        className="nodrag"
        disabled={integrationsLoading}
        subLabel={
          integrationsLoading
            ? t('nodes.integration.loadingIntegrationsSubLabel')
            : integrationOptions.length === 0
              ? t('nodes.integration.noIntegrationsSubLabel')
              : t('nodes.integration.selectIntegrationSubLabel')
        }
      />

      {selectedIntegrationDetails && (
        <div className="p-3 bg-slate-100 dark:bg-slate-600 rounded-lg text-sm">
          <div className="font-medium text-slate-800 dark:text-white">{t('nodes.integration.integrationDetailsTitle')}</div>
          <div className="text-slate-600 dark:text-slate-300 mt-1">
            <div>
              <strong>{t('nodes.integration.detailsType')}</strong> {selectedIntegrationDetails.type}
            </div>
            <div>
              <strong>{t('nodes.integration.detailsDescription')}</strong> {selectedIntegrationDetails.description}
            </div>
          </div>
        </div>
      )}

      <Textarea
        label={t('nodes.integration.systemPromptLabel')}
        subLabel={
          data.selectedIntegrationId
            ? t('nodes.integration.systemPromptSubLabelEnabled')
            : t('nodes.integration.systemPromptSubLabelDisabled')
        }
        name="prompt"
        value={data.prompt}
        onChange={(e) => handleUpdate({ prompt: e.target.value })}
        placeholder={t('nodes.integration.systemPromptPlaceholder')}
        className="resize-none overflow-hidden nodrag"
        rows={4}
        disabled={!data.selectedIntegrationId}
      />

      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-green-500!" />
      <CustomHandle connectionCount={1} type="source" position={Position.Right} className="w-4 h-4 bg-green-500!" />
    </NodeContainer>
  );
}
