import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, easeOut, motion } from 'motion/react';
import React, { Fragment } from 'react';

interface GenericDisclosureProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function GenericDisclosure({ title, children, className }: GenericDisclosureProps) {
  return (
    <div className={`w-full ${className}`}>
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton
              className={clsx(
                'flex w-full',
                'text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100',
                'rounded-2xl py-2 text-left text-sm font-medium ',
                'focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75',
                'transition-colors duration-200',
              )}
            >
              {title}
              <FontAwesomeIcon
                icon={faChevronUp}
                className={`${open ? 'transform rotate-180' : ''} ml-2 mt-1 transition-transform duration-200`}
              />
            </DisclosureButton>

            <div className="overflow-hidden py-2">
              <AnimatePresence>
                {open && (
                  <DisclosurePanel static as={Fragment}>
                    <motion.div
                      initial={{ opacity: 0, y: -24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.2, ease: easeOut }}
                      className="origin-top"
                    >
                      {children}
                    </motion.div>
                  </DisclosurePanel>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
