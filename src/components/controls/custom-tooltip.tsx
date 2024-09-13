import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { usePopper } from 'react-popper';

interface CustomTooltipProps {
  children: React.ReactNode;
  render: (props: { open: boolean }) => JSX.Element;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end';
}

export default function CustomTooltip({ children, render, placement = 'top-start' }: CustomTooltipProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  });

  return (
    <>
      <Popover className="inline-block">
        {({ open }) => (
          <>
            <PopoverButton ref={setReferenceElement} aria-label="Open tooltip">
              {render({ open })}
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <PopoverPanel
                className="absolute z-10"
                as="div"
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <div className="overflow-hidden rounded-lg shadow-lg bg-white p-2">{children}</div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
