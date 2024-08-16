import { GET_AGENT_WITH_PROMPTS } from '@/clients/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useMemo } from 'react';
import { Agent } from '@/types/agents';

interface Variable {
  key: string;
  value: string;
}

interface CustomVariableInputProps {
  variable: Variable;
  onUpdate: (updatedVariable: Variable) => void;
}

export const CustomVariableInput: React.FC<CustomVariableInputProps> = ({ variable, onUpdate }) => {
  return (
    <div className="flex items-center space-x-2 mb-2 gap-2 my-2">
      <input
        className="border-2 border-gray-200 p-2 rounded-lg flex-grow"
        value={variable.key}
        disabled={true}
        placeholder="Key"
      />
      <input
        className="border-2 border-gray-200 p-2 rounded-lg flex-grow"
        value={variable.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...variable, value: e.target.value })}
        placeholder="Value"
      />
    </div>
  );
};

export interface CustomVariable {
  key: string;
  value: string;
}

interface CustomVariablesSectionProps {
  variables: Variable[];
  agentId: string;
  onUpdateVariable: (index: number, updatedVariable: Variable) => void;
  setCustomVariables: (customVariables: CustomVariable[]) => void;
}

export function ExractPromptVariables(prompt: string): string[] {
  if (!prompt) return [];

  const regex = /{{(.*?)}}/g;
  const matches = [...prompt.matchAll(regex)];

  return matches.map((match) => match[1]);
}

export const CustomVariablesSection: React.FC<CustomVariablesSectionProps> = ({
  variables,
  agentId,
  onUpdateVariable,
  setCustomVariables,
}) => {
  const { data: agent } = useQuery(GET_AGENT_WITH_PROMPTS, {
    variables: {
      agentId,
    },
  });

  const customPromptVariables = useMemo(() => {
    if (!agent || !agent.getAgentWithPrompts) return [];
    const variables = (agent.getAgentWithPrompts as Agent).capabilities
      .map((capability) => capability.prompts.map((prompt) => ExractPromptVariables(prompt.text)))
      .flat(Infinity);
    variables.concat(ExractPromptVariables((agent.getAgentWithPrompts as Agent).reasoningPrompt));
    const flattenedVariables = [...new Set(variables)] as string[];

    const customVariables: CustomVariable[] = flattenedVariables.map((variable) => {
      const customVariable: CustomVariable = {
        key: variable,
        value: '',
      };
      return customVariable;
    });
    return customVariables;
  }, [agent]);

  useEffect(() => {
    if (customPromptVariables?.length > 0) {
      setCustomVariables(customPromptVariables);
    }
  }, [customPromptVariables]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">Custom Variables</label>
      {variables && variables.length > 0 ? (
        variables.map((variable, index) => (
          <CustomVariableInput
            key={index}
            variable={variable}
            onUpdate={(updatedVariable) => onUpdateVariable(index, updatedVariable)}
          />
        ))
      ) : (
        <p>No custom variables. Add one below.</p>
      )}
    </div>
  );
};
