import React from 'react';

interface Variable {
  key: string;
  value: string;
}

interface CustomVariableInputProps {
  variable: Variable;
  onUpdate: (updatedVariable: Variable) => void;
  onRemove: () => void;
  isUserMessage: boolean;
}

export const CustomVariableInput: React.FC<CustomVariableInputProps> = ({
  variable,
  onUpdate,
  onRemove,
  isUserMessage,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2 gap-2 my-2">
      <input
        className="border-2 border-gray-200 p-2 rounded-lg flex-grow"
        value={variable.key}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...variable, key: e.target.value })}
        placeholder="Key"
        disabled={isUserMessage}
      />
      <input
        className="border-2 border-gray-200 p-2 rounded-lg flex-grow"
        value={variable.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...variable, value: e.target.value })}
        placeholder="Value"
      />
      {!isUserMessage && (
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition-colors"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      )}
    </div>
  );
};

interface CustomVariablesSectionProps {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
  onUpdateVariable: (index: number, updatedVariable: Variable) => void;
}

export const CustomVariablesSection: React.FC<CustomVariablesSectionProps> = ({
  variables,
  setVariables,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">Custom Variables</label>
      {variables && variables.length > 0 ? (
        variables.map((variable, index) => (
          <CustomVariableInput
            key={index}
            variable={variable}
            onUpdate={(updatedVariable) => onUpdateVariable(index, updatedVariable)}
            onRemove={() => onRemoveVariable(index)}
            isUserMessage={variable.key === 'userMessage'}
          />
        ))
      ) : (
        <p>No custom variables. Add one below.</p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
        onClick={onAddVariable}
        type="button"
      >
        Add Variable
      </button>
    </div>
  );
};
