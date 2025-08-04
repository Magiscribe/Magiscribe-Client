import { useDarkMode } from '@/hooks/dark-mode';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useTitle } from '../../hooks/title-hook';
import { AnimatedLogo } from '../animated/animated-logo';
import Button from '../controls/button';
import TokenUsageBar from '../progress/token-usage-bar';

export function NavBar({ isFixed = true }) {
  const [atTop, setAtTop] = useState(true);

  const user = useUser();
  const { title } = useTitle();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setAtTop(false);
      } else {
        setAtTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`relative ${isFixed ? 'sm:fixed' : ''} w-full z-30 top-0 ${
        !atTop && isFixed ? 'bg-white dark:bg-slate-700 shadow-lg text-indigo-800 dark:text-white' : 'text-white'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <Link to={user ? '/dashboard' : '/'} className="pl-4 flex items-center">
          <AnimatedLogo />
          <AnimatePresence mode="wait">
            {title && (
              <motion.span
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl lg:text-3xl font-display pl-2 hidden sm:block"
              >
                | {title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <div
          className={`w-full grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 p-4 lg:p-0 z-20 bg-white lg:bg-transparent`}
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">{/* Add menu items here if needed */}</ul>

          {/* Token Usage Progress Bar - only show when signed in */}
          <SignedIn>
            <div className="mr-6 hidden lg:block">
              <TokenUsageBar />
            </div>
            <div className="mr-4 block lg:hidden">
              <TokenUsageBar compact />
            </div>
          </SignedIn>

          <Button
            onClick={toggleDarkMode}
            variant={isDark ? 'transparentWhiteFixed' : atTop ? 'transparentWhite' : 'transparentPrimary'}
            size="small"
            className="mr-4"
            icon={isDark ? faMoon : faSun}
          />
          <SignedOut>
            <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <Button variant={atTop ? 'light' : 'primary'}>Get Started for Free</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex space-x-4">
              <Button variant={atTop ? 'white' : 'primary'} onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </div>
          </SignedIn>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  rootBox: 'w-12 h-12 px-4',
                  userButtonAvatarBox: 'w-12 h-12',
                  userButtonAvatar: 'w-12 h-12',
                  userButtonTrigger: 'w-12 h-12',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="transparentWhite">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      <hr className="border-b border-slate-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
