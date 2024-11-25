import { GET_AGENT_WITH_PROMPTS } from '@/clients/queries';
import { GetAgentWithPromptsQuery } from '@/graphql/graphql';
import { useQuery } from '@apollo/client';
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

  const customPromptVariables = useMemo(() => {
    if (!agent || !agent.getAgentWithPrompts) return [];
    console.log('Agent', agent);
    let variables = agent.getAgentWithPrompts.capabilities
      .map((capability) => capability?.prompts?.map((prompt) => ExtractPromptVariables(prompt.text)))
      .flat(Infinity);

    console.log('Variables before', variables);
    // Extract variables from reasoning prompt
    if (agent.getAgentWithPrompts.reasoning) {
      const reasoningVariables = ExtractPromptVariables(agent.getAgentWithPrompts.reasoning.prompt);
      variables = [...variables, ...reasoningVariables];
    }

    // Remove duplicates
    const flattenedVariables = [...new Set(variables)] as string[];

    const customInput: CustomInput[] = flattenedVariables.map((variable) => {
      const customVariable: CustomInput = {
        key: variable,
        value: '',
      };
      return customVariable;
    });
    return customInput;
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
