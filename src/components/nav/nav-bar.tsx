import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../logo';
import { useTitle } from '../../hooks/TitleHook';
import { AnimatePresence, motion } from 'framer-motion';

export function NavBar() {
  const [atTop, setAtTop] = useState(true);
  const { title } = useTitle();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
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
      className={`fixed w-full z-30 top-0 ${!atTop ? 'bg-white shadow-lg text-indigo-800' : 'text-white'} transition-all duration-300 ease-in-out`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <Link to="/" className="pl-4 flex items-center">
          <Logo />
          <AnimatePresence mode="wait">
            {title && (
              <motion.span
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl lg:text-3xl font-display pl-2"
              >
                | {title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <div
          className={`w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 p-4 lg:p-0 z-20 bg-white lg:bg-transparent`}
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            {/* <li className="mr-3">
              <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#">link</a>
            </li>
            <li className="mr-3">
              <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#">link</a>
            </li> */}
          </ul>
          <SignedOut>
            <a
              href="#signup"
              className={`mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-3 px-5 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out ${
                atTop ? 'bg-white text-slate-800' : 'bg-indigo-800 text-white'
              }`}
            >
              Get Pre-Alpha Access
            </a>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className={`mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-3 px-5 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out ${
                atTop ? 'bg-white text-slate-800' : 'bg-indigo-800 text-white'
              }`}
            >
              Dashboard
            </Link>
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
            <SignInButton forceRedirectUrl={'/dashboard'}>
              <button className="px-4">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
