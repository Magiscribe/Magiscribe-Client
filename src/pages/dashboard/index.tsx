import LinkCard from '@/components/cards/card';
import DashboardHero from '@/components/heroes/dashboard-hero';
import { useSetTitle } from '@/hooks/title-hook';
import { useSession } from '@clerk/clerk-react';
import clsx from 'clsx';

const cardData = [
  {
    title: 'Agent Lab',
    description: 'Build and manage AI agents.',
    to: '/dashboard/agent-lab',
    gradient: 'orange',
    adminOnly: true,
  },
  {
    title: 'Inquiry Builder',
    description: 'Create complex conversational flows to capture user feedback.',
    to: '/dashboard/inquiry-builder',
    gradient: 'purple',
    adminOnly: false,
  },
];

export default function DashboardPage() {
  useSetTitle()('Dashboard');

  const { session } = useSession();
  const isAdmin = session?.user.organizationMemberships[0]?.role === 'org:admin';

  const visibleCards = cardData.filter((card) => !card.adminOnly || isAdmin);

  return (
    <>
      <DashboardHero />
      <hr className="my-8" />
      <div className={clsx('grid grid-cols-1 gap-4 md:grid-cols-2', visibleCards.length === 1 && 'md:grid-cols-1')}>
        {visibleCards.map((card) => (
          <LinkCard title={card.title} description={card.description} to={card.to} gradient={card.gradient} />
        ))}
      </div>
    </>
  );
}
