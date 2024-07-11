import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
  open: boolean;
  onClose: () => void;
  backgroundColor?: string;
}

export default function CustomModal(props: Props) {
  function closeModal() {
    props.onClose();
  }

  const sizeClassMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    '8xl': 'max-w-8xl',
  };
  const sizeClass = sizeClassMap[props.size || 'md'];
  const backgroundColor = props.backgroundColor || 'bg-white';

  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-40" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-50"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-filter backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`w-full ${sizeClass} transform rounded-2xl ${backgroundColor} p-6 text-left align-middle shadow-xl transition-all`}
              >
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-slate-900">
                  {props.title}
                  <button
                    className="fixed top-2 right-4 p-4 text-slate-700 hover:text-orange-700 transition-colors duration-150"
                    onClick={closeModal}
                  >
                    x
                  </button>
                </DialogTitle>
                <div className="mt-2">{props.children}</div>
                <div className="mt-4 flex justify-between">{props.buttons}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
