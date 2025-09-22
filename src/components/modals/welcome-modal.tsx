import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import Button from '../controls/button';
import CustomModal from './modal';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WelcomeModal({ isOpen, onConfirm, onClose }: WelcomeModalProps) {
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <CustomModal title={t('components.welcomeModal.title')} open={isOpen} onClose={onClose} size="3xl">
      <div className="px-6 py-4">
        <h2 className="text-3xl font-bold mb-6">{t('components.welcomeModal.subtitle', { name: user?.firstName })}</h2>
        <div className="space-y-4 text-lg mb-8">
          <p>{t('components.welcomeModal.description1')}</p>
          <p>{t('components.welcomeModal.description2')}</p>
          <p className="text-slate-500">{t('components.welcomeModal.helpText')}</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={onConfirm} variant="primary">
            {t('common.buttons.letsProceed')}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
