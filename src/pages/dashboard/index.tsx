import agentImg from '@/assets/imgs/cards/agent.webp';
import gettingStartedImg from '@/assets/imgs/cards/getting-started.webp';
import contactImg from '@/assets/imgs/cards/contact.webp';
import { REGISTER_USER } from '@/clients/mutations';
import { GET_INQUIRIES, GET_INQUIRY_RESPONSE_COUNT, IS_USER_REGISTERED } from '@/clients/queries';
import LinkCard from '@/components/cards/card';
import GenericHero from '@/components/heroes/generic-hero';
import CreateInquiry from '@/components/modals/inquiry/create-inquiry-modal';
import WelcomeModal from '@/components/modals/welcome-modal';
import { GetInquiriesQuery, GetInquiryResponseCountQuery, IsUserRegisteredQuery } from '@/graphql/graphql';
import GraphProvider from '@/hooks/graph-state';
import { useSetTitle } from '@/hooks/title-hook';
import { InquiryBuilderProvider } from '@/providers/inquiry-builder-provider';
import { useMutation, useQuery } from '@apollo/client/react';
import { useUser } from '@clerk/clerk-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Note: We do this to get the subtype that may have less fields than the original Inquiry type.
type InquiryType = NonNullable<GetInquiriesQuery['getInquiries']>[number];

function InquiryCard({ inquiry }: { inquiry: InquiryType }) {
  const { t } = useTranslation();
  const settings = inquiry.data.settings;

  // Add the response count query
  const { data: responseCountData } = useQuery<GetInquiryResponseCountQuery>(GET_INQUIRY_RESPONSE_COUNT, {
    variables: { id: inquiry.id },
  });

  const updatedAt = new Date(inquiry.updatedAt);

  const formattedUpdateDate = updatedAt.toLocaleDateString('en-US', {
    minute: 'numeric',
    hour: 'numeric',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const responseCount = responseCountData?.getInquiryResponseCount ?? 0;
  const responseText = responseCount === 1 ? t('common.labels.response') : t('common.labels.responses');

  return (
    <Link to={`/dashboard/inquiry-builder/${inquiry.id}`} className="hover:no-underline">
      <motion.div
        key={inquiry.id}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 100 }}
        className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-lg text-slate-900 dark:text-slate-100 font-semibold">{settings.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('common.labels.updated')}: {formattedUpdateDate}
          </p>
          <div className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
            <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-nowrap">
              {responseCount} {responseText}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.dashboard.title'));

  // States
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [createFormModal, setCreateFormModal] = useState(false);

  // Queries and mutations
  const { data: registrationData } = useQuery<IsUserRegisteredQuery>(IS_USER_REGISTERED);
  const { data: inquiriesData } = useQuery<GetInquiriesQuery>(GET_INQUIRIES);
  const [registerUser] = useMutation(REGISTER_USER);

  // Hooks
  const { user } = useUser();
  const navigate = useNavigate();

  const isAdmin = user?.organizationMemberships[0]?.role === 'org:admin';

  const cardData = [
    {
      title: t('pages.dashboard.cards.gettingStarted.title'),
      description: t('pages.dashboard.cards.gettingStarted.description'),
      to: '/dashboard/user-guide',
      gradient: 'green',
      visible: !isAdmin,
      backgroundImage: gettingStartedImg,
      span: 1,
    },
    {
      title: t('pages.dashboard.cards.contactUs.title'),
      description: t('pages.dashboard.cards.contactUs.description'),
      to: '/contact',
      gradient: 'blue',
      visible: !isAdmin,
      backgroundImage: contactImg,
      span: 1,
    },
    {
      title: t('pages.dashboard.cards.agentLab.title'),
      description: t('pages.dashboard.cards.agentLab.description'),
      to: '/dashboard/agent-lab',
      gradient: 'orange',
      visible: isAdmin,
      backgroundImage: agentImg,
      span: 2,
    },
  ];

  const visibleCards = cardData.filter((card) => card.visible);

  useEffect(() => {
    if (registrationData && !registrationData.isUserRegistered) {
      setIsWelcomeModalOpen(true);
    }
  }, [registrationData]);

  const handleCloseWelcomeModal = async () => {
    await registerUser();
    setIsWelcomeModalOpen(false);
  };

  /**
   * Redirects to the inquiry form creation page on form creation.
   * @param id {string} The ID of the inquiry form.
   */
  const onCreateForm = (id: string) => {
    navigate(`/dashboard/inquiry-builder/${id}`);
  };

  const welcomeTitle = user
    ? t('pages.dashboard.welcome', { name: user.firstName })
    : t('pages.dashboard.welcomeGeneric');

  return (
    <GraphProvider>
      <InquiryBuilderProvider>
        <CreateInquiry open={createFormModal} onClose={() => setCreateFormModal(false)} onSave={onCreateForm} />

        <GenericHero title={welcomeTitle} subtitle={t('pages.dashboard.subtitle')} />
        <hr className="my-8" />

        <div className="space-y-4">
          <div
            className={clsx('grid grid-cols-1 gap-6', visibleCards.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2')}
          >
            {visibleCards.map((card) => (
              <div key={card.title} className={clsx('col-span-1', card.span == 2 && 'md:col-span-2')}>
                <LinkCard
                  title={card.title}
                  description={card.description}
                  to={card.to}
                  gradient={card.gradient}
                  backgroundImage={card.backgroundImage}
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="my-8" />
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">{t('pages.dashboard.yourInquiries')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {(inquiriesData?.getInquiries ?? []).map((inquiry) => (
            <InquiryCard inquiry={inquiry} key={inquiry.id} />
          ))}
          <motion.div
            className="bg-blue-500 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            onClick={() => setCreateFormModal(true)}
          >
            <span className="text-4xl font-bold text-white">+</span>
          </motion.div>
        </div>

        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          onClose={handleCloseWelcomeModal}
          onConfirm={handleCloseWelcomeModal}
        />
      </InquiryBuilderProvider>
    </GraphProvider>
  );
}
