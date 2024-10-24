import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import clsx from 'clsx';

/**
 * Props for the ListBox component.
 * @typedef {Object} ListBoxProps
 * @property {Object} selected - The currently selected item.
 * @property {function} setSelected - Function to update the selected item.
 * @property {Array<{id: string, name: string}>} values - Array of options for the listbox.
 * @property {string} [label] - The label for the listbox field.
 * @property {string} [subLabel] - An optional sub-label for additional information.
 * @property {string} [error] - An optional error message to display.
 * @property {string} [className] - Additional CSS classes for the listbox.
 * @property {string} [placeholder] - Placeholder text when no item is selected.
 */
interface ListBoxProps {
  selected: { id: string; name: string } | undefined;
  setSelected: ({ id, name }: { id: string; name: string }) => void;
  values: { id: string; name: string }[];
  label?: string;
  subLabel?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

/**
 * A flexible listbox component built with Headless UI that provides a styled dropdown
 * with customizable options, labels, and error handling.
 *
 * @param {ListBoxProps} props - The props for the ListBox component.
 * @returns {JSX.Element} The rendered ListBox component.
 */
export default function ListBox({
  selected,
  setSelected,
  values,
  label,
  subLabel,
  error,
  className,
  placeholder = 'Select...',
}: ListBoxProps) {
  const baseButtonClassName = clsx(
    'w-full p-3 border rounded-2xl focus:outline-none focus:ring-2',
    'relative overflow-hidden appearance-none dark:bg-slate-600 bg-white',
    {
      'border-slate-300': !error,
      'border-red-700 focus:ring-red-500': error,
    },
    className,
  );

  return (
    <div className="flex flex-col gap-2 dark:text-white text-slate-800">
      {label && (
        <label className="text-sm font-bold">
          {label}
          {subLabel && (
            <>
              <br />
              <span className="italic text-slate-500 text-sm font-normal">{subLabel}</span>
            </>
          )}
        </label>
      )}
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <ListboxButton className={baseButtonClassName}>
            <span className="block text-left truncate">{selected?.name || placeholder}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 fill-white"
            />
          </ListboxButton>
          <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions className="absolute z-10 w-full mt-1 rounded-xl border-2 border-slate-200 bg-white p-1 shadow-lg focus:outline-none dark:bg-slate-600 dark:border-slate-500">
              {values.map((item) => (
                <ListboxOption
                  key={item.id}
                  value={item}
                  className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-300 transition-colors dark:data-[focus]:bg-slate-500"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="invisible size-4 fill-white group-data-[selected]:visible"
                  />
                  <div className="text-sm/6">{item.name}</div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="text-red-700 text-sm mt-1">{error}</p>}
    </div>
  );
}
