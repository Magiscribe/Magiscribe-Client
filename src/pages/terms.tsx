import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.terms.title'));

  return (
    <>
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{t('pages.terms.pageTitle')}</h1>

          <p>
            {t('pages.terms.description')}
          </p>

          <h2>{t('pages.terms.sections.serviceDescription.title')}</h2>
          <p>
            {t('pages.terms.sections.serviceDescription.content')}
          </p>

          <h2>{t('pages.terms.sections.userAccounts.title')}</h2>
          <p>
            {t('pages.terms.sections.userAccounts.content')}
          </p>

          <h2>{t('pages.terms.sections.privacyData.title')}</h2>
          <p>
            {t('pages.terms.sections.privacyData.content').split('Privacy Policy')[0]}
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
              {t('common.navigation.privacy')}
            </Link>
            {t('pages.terms.sections.privacyData.content').split('Privacy Policy')[1]}
          </p>

          <h2>{t('pages.terms.sections.intellectualProperty.title')}</h2>
          <p>
            {t('pages.terms.sections.intellectualProperty.content')}
          </p>

          <h2>{t('pages.terms.sections.prohibitedActivities.title')}</h2>
          <p>
            {t('pages.terms.sections.prohibitedActivities.content')}
          </p>

          <h2>{t('pages.terms.sections.disclaimerWarranties.title')}</h2>
          <p>
            {t('pages.terms.sections.disclaimerWarranties.content')}
          </p>

          <h2>{t('pages.terms.sections.limitationLiability.title')}</h2>
          <p>
            {t('pages.terms.sections.limitationLiability.content')}
          </p>

          <h2>{t('pages.terms.sections.changesTerms.title')}</h2>
          <p>
            {t('pages.terms.sections.changesTerms.content')}
          </p>

          <h2>{t('pages.terms.sections.governingLaw.title')}</h2>
          <p>
            {t('pages.terms.sections.governingLaw.content')}
          </p>

          <h2>{t('pages.terms.sections.contactUs.title')}</h2>
          <p>{t('pages.terms.sections.contactUs.content')}</p>

          <h2>{t('common.labels.lastUpdated')}</h2>
          <p>{t('dates.lastUpdated')}</p>
        </motion.div>
      </div>
    </>
  );
}
