import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { motion } from 'motion/react';
import React, { Fragment, JSX, useCallback, useState, useRef, useEffect } from 'react';
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
  delay?: number;
}

export default function CustomTooltip({
  children,
  render,
  placement = 'top-start',
  triggerOnHover = false,
  delay = 0,
}: CustomTooltipProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 24] } }],
    strategy: 'fixed',
  });

  const handleMouseEnter = useCallback(() => {
    if (triggerOnHover) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(true);
        }, delay);
      } else {
        setIsOpen(true);
      }
    }
  }, [triggerOnHover, delay]);

  const handleMouseLeave = useCallback(() => {
    if (triggerOnHover) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(false);
    }
  }, [triggerOnHover]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
