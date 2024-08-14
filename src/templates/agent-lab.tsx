import { Protect, RedirectToSignIn, SignedIn, SignedOut, useSession } from '@clerk/clerk-react';
import AnimatedOutlet from '../components/animated/animated-outlet';
import LinkCard from '../components/card';
import NotReadyHero from '../components/heroes/not-ready';
import { useSetTitle } from '../hooks/TitleHook';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import BackLinks from '@/components/back-links';

export default function AgentLabTemplate() {
  const { session } = useSession();

  const { pathname } = useLocation();

  const { backToDashboard, pathSegments } = useMemo(
    () => ({
      backToDashboard: pathname !== '/dashboard',
      pathSegments: pathname.split('/').filter(Boolean),
    }),
    [pathname],
  );

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
      <div className="container max-w-12xl mx-auto px-4 py-8">
        {backToDashboard && (
          <h1 className="text-3xl font-bold">
            <BackLinks pathSegments={pathSegments} />
          </h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 my-8">
          <LinkCard
            title="Agents"
            description="View and manage your agents."
            to="/dashboard/agent-lab/agents"
            gradient="red"
            isActive={isActive('agents')}
          />
          <LinkCard
            title="Capabilities"
            description="What can your agents do?"
            to="/dashboard/agent-lab/capabilities"
            gradient="green"
            isActive={isActive('capabilities')}
          />
          <LinkCard
            title="Prompts"
            description="Create and manage prompts."
            to="/dashboard/agent-lab/prompts"
            gradient="blue"
            isActive={isActive('prompts')}
          />
          <LinkCard
            title="Playground"
            description="See things go brrrr."
            to="/dashboard/agent-lab/playground"
            gradient="purple"
            isActive={isActive('playground')}
          />
        </div>
        <AnimatedOutlet />
      </div>
    </Protect>
  );
}
