import { GET_AGENT_WITH_PROMPTS } from '@/clients/queries';
import { GetAgentWithPromptsQuery } from '@/graphql/graphql';
import { useQuery } from '@apollo/client/react';
import React, { useEffect, useMemo } from 'react';

import Input from './controls/input';

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
      <Input name={variable.key} value={variable.key} placeholder="Value" disabled />
      <Input
        name={variable.value}
        value={variable.value}
        placeholder="Value"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...variable, value: e.target.value })}
      />
    </div>
  );
};

export interface CustomInput {
  key: string;
  value: string;
}

interface CustomInputSectionProps {
  variables: Variable[];
  agentId: string;
  onUpdateVariable: (index: number, updatedVariable: Variable) => void;
  setCustomInput: (customInput: CustomInput[]) => void;
}

export function ExtractPromptVariables(prompt: string): string[] {
  if (!prompt) return [];
  const regex = /{{(.*?)}}/g;
  const matches = [...prompt.matchAll(regex)];
  return matches.map((match) => match[1]);
}

export const CustomInputSection: React.FC<CustomInputSectionProps> = ({
  variables,
  agentId,
  onUpdateVariable,
  setCustomInput,
}) => {
  const { data: agent } = useQuery<GetAgentWithPromptsQuery>(GET_AGENT_WITH_PROMPTS, {
    variables: {
      agentId,
    },
  });

  /**
   * Extracts and processes custom prompt variables from agent capabilities and reasoning.
   *
   * @returns {CustomInput[]} Array of unique custom input variables with empty values
   * @remarks
   * - Extracts variables from all capability prompts
   * - Includes variables from reasoning prompt if present
   * - Removes duplicates and formats as CustomInput objects
   * - Returns empty array if agent data is not available
   */
  const customPromptVariables = useMemo(() => {
    if (!agent?.getAgentWithPrompts) return [];

    const { capabilities, reasoning } = agent.getAgentWithPrompts;

    // Collect variables from capability prompts
    const capabilityVariables = capabilities.flatMap(
      (capability) => capability?.prompts?.flatMap((prompt) => ExtractPromptVariables(prompt.text)) ?? [],
    );

    // Collect variables from reasoning prompt
    const reasoningVariables = reasoning?.prompt ? ExtractPromptVariables(reasoning.prompt) : [];

    // Combine and deduplicate variables
    const uniqueVariables = [...new Set([...capabilityVariables, ...reasoningVariables])];

    // Transform into CustomInput format
    return uniqueVariables.map((variable) => ({
      key: variable,
      value: '',
    }));
  }, [agent]);

  useEffect(() => {
    if (customPromptVariables?.length > 0) {
      setCustomInput(customPromptVariables);
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
