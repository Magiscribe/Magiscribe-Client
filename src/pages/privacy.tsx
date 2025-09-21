import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.privacy.title'));

  return (
    <>
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">{t('pages.privacy.title')}</h1>
          <p>
            {t('pages.privacy.description')}
          </p>

          <h2>{t('pages.privacy.sections.introduction.title')}</h2>
          <p>
            {t('pages.privacy.sections.introduction.content')}
          </p>

          <h2>{t('pages.privacy.sections.termsOfUse.title')}</h2>
          <p>
            {t('pages.privacy.sections.termsOfUse.content')}{' '}
            <Link to="/terms" className="text-blue-400 hover:text-blue-300">
              {t('common.navigation.terms')}
            </Link>
            .
          </p>

          <h2>{t('pages.privacy.sections.informationWeCollect.title')}</h2>
          <p>{t('pages.privacy.sections.informationWeCollect.content')}</p>

          <h4>{t('pages.privacy.sections.informationWeCollect.accountInfo.title')}</h4>
          <p>
            {t('pages.privacy.sections.informationWeCollect.accountInfo.content')}
          </p>

          <h4>{t('pages.privacy.sections.informationWeCollect.usageInfo.title')}</h4>
          <p>
            {t('pages.privacy.sections.informationWeCollect.usageInfo.content')}
          </p>

          <h4>{t('pages.privacy.sections.informationWeCollect.technicalInfo.title')}</h4>
          <p>
            {t('pages.privacy.sections.informationWeCollect.technicalInfo.content')}
          </p>

          <h2>{t('pages.privacy.sections.howWeUse.title')}</h2>
          <p>{t('pages.privacy.sections.howWeUse.content')}</p>
          <ul>
            {(t('pages.privacy.sections.howWeUse.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>{t('pages.privacy.sections.dataSharing.title')}</h2>
          <p>{t('pages.privacy.sections.dataSharing.content')}</p>
          <ul>
            {(t('pages.privacy.sections.dataSharing.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p>
            {t('pages.privacy.sections.dataSharing.note')}
          </p>

          <h2>{t('pages.privacy.sections.dataSecurity.title')}</h2>
          <p>
            {t('pages.privacy.sections.dataSecurity.content')}
          </p>

          <h2>{t('pages.privacy.sections.yourRights.title')}</h2>
          <p>{t('pages.privacy.sections.yourRights.content')}</p>
          <ul>
            {(t('pages.privacy.sections.yourRights.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>{t('pages.privacy.sections.changes.title')}</h2>
          <p>
            {t('pages.privacy.sections.changes.content')}
          </p>

          <h2>{t('pages.privacy.sections.contactUs.title')}</h2>
          <p>
            {t('pages.privacy.sections.contactUs.content')}{' '}
            <Link to="/contact" className="text-blue-400 hover:text-blue-300">
              {t('common.navigation.contact')}
            </Link>
            .
          </p>

          <h2>{t('common.labels.lastUpdated')}</h2>
          <p>{t('dates.lastUpdated')}</p>
        </motion.div>
      </div>
    </>
  );
}
