import { useUser } from '@clerk/clerk-react';
import Button from '../controls/button';
import CustomModal from './modal';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WelcomeModal({ isOpen, onConfirm, onClose }: WelcomeModalProps) {
  const { user } = useUser();
  return (
    <CustomModal title="Welcome to Magiscribe!" open={isOpen} onClose={onClose} size="3xl">
      <div className="px-6 py-4">
        <h2 className="text-3xl font-bold mb-6">{user?.firstName}, we're excited to have you here!</h2>
        <div className="space-y-4 text-lg mb-8">
          <p>
            Magiscribe helps you combine the efficiency of surveys with the depth of user interviews. Gather
            quantitative data from many participants while pursuing qualitative insights through targeted follow-up
            questions.
          </p>
          <p>Get started by exploring our features or creating your first inquiry.</p>
          <p className="text-slate-500">
            Need help getting started? Check out our{' '}
            <a href="/dashboard/user-guide" className="text-blue-600 hover:text-blue-700 underline">
              user guide
            </a>{' '}
            or reach out to us at{' '}
            <a href="mailto:management@magiscribe.com" className="text-blue-600 hover:text-blue-700 underline">
              management@magiscribe.com
            </a>
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={onConfirm} variant="primary">
            Let's Get Started!
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
