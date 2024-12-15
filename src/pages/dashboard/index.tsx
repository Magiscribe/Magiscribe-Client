import blocksImage from '@/assets/imgs/cards/blocks.webp';
import bondImage from '@/assets/imgs/cards/bond.webp';
import booksImage from '@/assets/imgs/cards/books.webp';
import folderImage from '@/assets/imgs/cards/folder.webp';
import privacyImage from '@/assets/imgs/cards/privacy.webp';
import roadImage from '@/assets/imgs/cards/road.webp';
import yellImage from '@/assets/imgs/cards/yell.webp';
import LinkCard from '@/components/cards/card';
import GenericHero from '@/components/heroes/generic-hero';
import { useSetTitle } from '@/hooks/title-hook';
import { useSession } from '@clerk/clerk-react';
import clsx from 'clsx';

const cardData = [
  {
    title: 'Inquiry Builder',
    description: 'Create complex conversational flows to capture user feedback.',
    to: '/dashboard/inquiry-builder',
    gradient: 'indigo',
    adminOnly: false,
    backgroundImage: blocksImage,
  },
  {
    title: 'User Guide',
    description: 'Learn about the structure of the conversation graphs that define an inquiry',
    to: '/dashboard/user-guide',
    gradient: 'purple',
    adminOnly: false,
    backgroundImage: roadImage,
  },
  {
    title: 'Agent Lab',
    description: 'Build and manage AI agents.',
    to: '/dashboard/agent-lab',
    gradient: 'orange',
    adminOnly: true,
    backgroundImage: bondImage,
  },
  {
    title: 'Contact Us',
    description: 'Run into any issues? Contact us for help.',
    to: '/contact',
    gradient: 'blue',
    adminOnly: false,
    backgroundImage: yellImage,
  },
];

export default function DashboardPage() {
  useSetTitle()('Dashboard');

  const { session } = useSession();
  const isAdmin = session?.user.organizationMemberships[0]?.role === 'org:admin';

  const visibleCards = cardData.filter((card) => !card.adminOnly || isAdmin);

  return (
    <>
      <GenericHero
        title="Welcome to Magiscribe!"
        subtitle="We are excited to have you here. We appreciate your patience and understanding as we actively develop this project to best meet your needs."
      />
      <hr className="my-8" />
      <div className="space-y-4">
        <div
          className={clsx('grid grid-cols-1 gap-4', visibleCards.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2')}
        >
          {visibleCards.map((card) => (
            <div key={card.title} className={clsx('col-span-1')}>
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
    </>
  );
}
