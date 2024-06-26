import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import clsx from 'clsx';

interface ListBoxProps {
  selected: { id: string; name: string }[] | undefined;
  setSelected: (input: { id: string; name: string }[]) => void;
  values: { id: string; name: string }[];
}

export default function ListBoxMultiple({
  selected,
  setSelected,
  values,
}: ListBoxProps) {
  return (
    <Listbox value={selected} onChange={setSelected} multiple>
      <ListboxButton
        className={clsx(
          'border-2 border-gray-200 p-2 rounded-lg w-full text-left relative overflow-hidden',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
        )}
      >
        {selected?.map((person) => person.name).join(', ') || 'Select...'}
        <FontAwesomeIcon
          icon={faChevronDown}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 fill-white"
        />
      </ListboxButton>
      <Transition
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions
          anchor="bottom"
          className="w-[var(--button-width)] rounded-xl border-2 border-gray-200 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none"
        >
          {values.map((person) => (
            <ListboxOption
              key={person.name}
              value={person}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-300 transition-colors"
            >
              <FontAwesomeIcon
                icon={faCheck}
                className="invisible size-4 fill-white group-data-[selected]:visible"
              />
              <div className="text-sm/6">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </Listbox>
  );
}
