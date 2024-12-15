import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { motion } from 'motion/react';
import React, { Fragment, useCallback, useState } from 'react';
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
  triggerOnHover?: boolean;
}

export default function CustomTooltip({
  children,
  render,
  placement = 'top-start',
  triggerOnHover = false,
}: CustomTooltipProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 24] } }],
    strategy: 'fixed',
  });

  const handleMouseEnter = useCallback(() => {
    if (triggerOnHover) setIsOpen(true);
  }, [triggerOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (triggerOnHover) setIsOpen(false);
  }, [triggerOnHover]);

  return (
    <Popover className="inline-block">
      {({ open }) => (
        <>
          <PopoverButton
            ref={setReferenceElement}
            aria-label="Open tooltip"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !triggerOnHover && setIsOpen(!isOpen)}
          >
            {render({ open: triggerOnHover ? isOpen : open })}
          </PopoverButton>
          <Transition show={triggerOnHover ? isOpen : open} as={Fragment}>
            <PopoverPanel
              static
              ref={setPopperElement}
              className="max-w-sm"
              style={styles.popper}
              {...attributes.popper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                className="z-20 rounded-lg shadow-xl bg-white dark:bg-slate-700 p-2"
              >
                {children}
              </motion.div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
