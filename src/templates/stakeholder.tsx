import { Protect, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import AnimatedOutlet from '../components/animated/animated-outlet';
import NotReadyHero from '../components/heroes/not-ready';
import { useSetTitle } from '../hooks/TitleHook';

export default function StakeholderTemplate() {
  useSetTitle()('Stakeholder');

  return (
    <Protect
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
        <h1 className="text-3xl font-bold">Stakeholder</h1>
        <AnimatedOutlet />
      </div>
    </Protect>
  );
}
