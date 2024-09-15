import BackLinks from '@/components/nav/back-links';
import { Protect, RedirectToSignIn, SignedIn, SignedOut, useSession } from '@clerk/clerk-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedOutlet from '@/components/animated/animated-outlet';
import ProtectedHero from '@/components/heroes/protected-hero';

export default function DashboardTemplate() {
  const { session } = useSession();

  const { pathname } = useLocation();
  const { pathSegments } = useMemo(
    () => ({
      pathSegments: pathname.split('/').filter(Boolean),
    }),
    [pathname],
  );

  return (
    <Protect
      condition={() => session?.user.organizationMemberships[0]?.role === 'org:admin'}
      fallback={
        <>
          <SignedIn>
            <div className="mt-36">
              <ProtectedHero />
            </div>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    >
      <div className="container w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">
          <BackLinks pathSegments={pathSegments} />
        </h1>
        <div className="my-8">
          <AnimatedOutlet />
        </div>
      </div>
    </Protect>
  );
}
