import Container from '@/components/container';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-1 gap-12">
      <Container>
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('common.buttons.contactUs')}</h2>
          <div className="space-y-4">
            <a
              href={`mailto:${t('emails.management')}`}
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-solid:envelope" /> {t('emails.management')}
            </a>
            <a
              href="https://www.linkedin.com/company/magiscribe"
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-brands:linkedin" /> {t('common.buttons.visitLinkedIn')}
            </a>
            <a
              href="https://discord.gg/VJBSsFsR"
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-brands:discord" /> {t('common.buttons.joinDiscord')}
            </a>
          </div>
        </div>

        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4">{t('pages.contact.responseTime.title')}</h3>
        <p className="text-gray-500 dark:text-gray-300">
          {t('pages.contact.responseTime.description')}
        </p>
      </Container>
    </div>
  );
}
