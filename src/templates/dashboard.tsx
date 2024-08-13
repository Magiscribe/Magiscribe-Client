import { Protect, RedirectToSignIn, SignedIn, SignedOut, useSession } from '@clerk/clerk-react';
import { ApolloProviderWrapper } from '../clients/graphqlClient';
import AnimatedOutlet from '../components/animated/animated-outlet';
import LinkCard from '../components/card';
import NotReadyHero from '../components/heroes/not-ready';
import { useSetTitle } from '../hooks/TitleHook';
import { useLocation } from 'react-router-dom';

export default function DashboardTemplate() {
  const { session } = useSession();
  const location = useLocation();

  useSetTitle()('Agent Lab');

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <Protect
      condition={() => session?.user.organizationMemberships[0]?.role === 'org:admin'}
      fallback={
        <>
          <SignedIn>
            <div className="mt-36">
              <NotReadyHero />
            </div>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    >
      <ApolloProviderWrapper>
        <div className="container max-w-12xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 my-8">
            <LinkCard
              title="Agents"
              description="View and manage your agents."
              to="/dashboard/agents"
              gradient="red"
              isActive={isActive('/agents')}
            />
            <LinkCard
              title="Capabilities"
              description="What can your agents do?"
              to="/dashboard/capabilities"
              gradient="green"
              isActive={isActive('/capabilities')}
            />
            <LinkCard
              title="Prompts"
              description="Create and manage prompts."
              to="/dashboard/prompts"
              gradient="blue"
              isActive={isActive('/prompts')}
            />
            <LinkCard
              title="Playground"
              description="See things go brrrr."
              to="/dashboard/playground"
              gradient="purple"
              isActive={isActive('/playground')}
            />
          </div>
          <AnimatedOutlet />
        </div>
      </ApolloProviderWrapper>
    </Protect>
  );
}
