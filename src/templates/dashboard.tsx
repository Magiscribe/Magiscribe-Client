import AnimatedOutlet from '@/components/animated/animated-outlet';
import BackLinks from '@/components/nav/back-links';
import { Protect, RedirectToSignIn } from '@clerk/clerk-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function DashboardTemplate() {
  const { pathname } = useLocation();
  const { pathSegments } = useMemo(
    () => ({
      pathSegments: pathname.split('/').filter(Boolean),
    }),
    [pathname],
  );

  return (
    <Protect fallback={<RedirectToSignIn />}>
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
