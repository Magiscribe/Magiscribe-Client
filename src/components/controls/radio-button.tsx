import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { useState } from 'react';

interface RadioOption<T> {
  value: T;
  name: string;
  description?: string;
}

interface GenericRadioGroupProps<T> {
  label?: string;
  subLabel?: string;
  options: RadioOption<T>[];
  value?: T | null;
  onChange: (value: T | null) => void;
  className?: string;
  clearable?: boolean;
}

export default function GenericRadioGroup<T>({
  label = 'Options',
  subLabel,
  options,
  value,
  onChange,
  className,
  clearable = false,
}: GenericRadioGroupProps<T>) {
  const [lastSelected, setLastSelected] = useState<T | null>(null);

  const handleOptionClick = (option: T) => {
    if (clearable && lastSelected === option && value === option) {
      onChange(null);
    }
    setLastSelected(option);
  };

  return (
    <div className={`w-full dark:text-white text-slate-800 ${className}`}>
      <RadioGroup value={value} onChange={onChange}>
        {label && (
          <Label className="text-sm font-bold mb-2">
            {label}
            {subLabel && (
              <>
                <br />
                <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
              </>
            )}
          </Label>
        )}
        <div className={`grid grid-cols-2 gap-4`}>
          {options.map((option) => (
            <Radio
              key={option.name}
              value={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={({ checked }) =>
                `${checked ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-600'}
                relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <div className="flex flex-col">
                  <Label
                    as="span"
                    className={`text-md font-bold ${checked ? 'text-white' : ' text-slate-800 dark:text-white'}`}
                  >
                    {option.name}
                  </Label>
                  {option.description && (
                    <Description
                      as="span"
                      className={`text-sm ${checked ? 'text-slate-100' : ' text-slate-800 dark:text-slate-300'}`}
                    >
                      {option.description}
                    </Description>
                  )}
                </div>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
