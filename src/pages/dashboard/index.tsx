import blocksImage from '@/assets/imgs/cards/blocks.webp';
import bondImage from '@/assets/imgs/cards/bond.webp';
import roadImage from '@/assets/imgs/cards/road.webp';
import yellImage from '@/assets/imgs/cards/yell.webp';
import { REGISTER_USER } from '@/clients/mutations';
import { IS_USER_REGISTERED } from '@/clients/queries';
import LinkCard from '@/components/cards/card';
import GenericHero from '@/components/heroes/generic-hero';
import WelcomeModal from '@/components/modals/welcome-modal';
import { useSetTitle } from '@/hooks/title-hook';
import { useMutation, useQuery } from '@apollo/client';
import { useUser } from '@clerk/clerk-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  useSetTitle()('Dashboard');

  // States
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Queries and mutations
  const { data: registrationData } = useQuery(IS_USER_REGISTERED);
  const [registerUser] = useMutation(REGISTER_USER);

  // Hooks
  const { user } = useUser();

  const isAdmin = user?.organizationMemberships[0]?.role === 'org:admin';

  const cardData = [
    {
      title: 'Getting Started Guide',
      description: "Learn how to get started with Magiscribe's Inquiry Builder and start uncovering insights.",
      to: '/dashboard/user-guide',
      gradient: 'green',
      visible: !isAdmin,
      backgroundImage: roadImage,
      span: 1,
    },
    {
      title: 'Contact Us',
      description: 'Run into any issues? Contact us for help.',
      to: '/contact',
      gradient: 'blue',
      visible: !isAdmin,
      backgroundImage: yellImage,
      span: 1,
    },
    {
      title: 'Inquiry Builder',
      description: 'Create complex conversational flows to capture user feedback.',
      to: '/dashboard/inquiry-builder',
      gradient: 'purple',
      visible: true,
      backgroundImage: blocksImage,
      span: 2,
    },
    {
      title: 'Agent Lab',
      description: 'Build and manage AI agents.',
      to: '/dashboard/agent-lab',
      gradient: 'orange',
      visible: isAdmin,
      backgroundImage: bondImage,
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

  return (
    <>
      <GenericHero
        title={user ? `${user.firstName}, welcome to Magiscribe!` : 'Welcome to Magiscribe!'}
        subtitle="Get started turning dialogue into discoveries."
      />
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

      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={handleCloseWelcomeModal} onConfirm={handleCloseWelcomeModal} />
    </>
  );
}
