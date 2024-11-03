import AnimatedOutlet from '@/components/animated/animated-outlet';
import BackLinks from '@/components/nav/back-links';
import Footer from '@/components/nav/footer';
import { NavBar } from '@/components/nav/nav-bar';
import { Protect, RedirectToSignIn } from '@clerk/clerk-react';
import clsx from 'clsx';
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
      <div
        className={clsx(
          'h-full w-full fixed',
          'text-white dark:text-slate-800',
          'bg-gradient-to-r from-[#7133d5] to-[#0508be]',
          ' dark:from-slate-800 dark:to-slate-800',
        )}
      ></div>
      <div className="h-full w-full leading-normal tracking-normal h-full absolute top-0 text-white">
        <NavBar />

        <div className="pt-2 sm:pt-24">
          <div className="container w-full mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">
              <BackLinks pathSegments={pathSegments} />
            </h1>
            <div className="my-8">
              <AnimatedOutlet />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </Protect>
  );
}
