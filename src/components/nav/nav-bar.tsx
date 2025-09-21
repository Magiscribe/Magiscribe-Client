import { useDarkMode } from '@/hooks/dark-mode';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { faCog, faMoon, faSun, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTitle } from '../../hooks/title-hook';
import { AnimatedLogo } from '../animated/animated-logo';
import Button from '../controls/button';
import TokenUsageBar from '../progress/token-usage-bar';
import { availableLanguages } from '@/i18n/i18n';

export function NavBar({ isFixed = true }) {
  const [atTop, setAtTop] = useState(true);
  const { t, i18n } = useTranslation();

  const { isSignedIn } = useUser();
  const { title } = useTitle();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getLanguageDisplayName = (langCode: string) => {
    const names: Record<string, string> = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
      'ru': 'Русский',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어'
    };
    return names[langCode] || langCode.toUpperCase();
  };

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
        <Link to={isSignedIn ? '/dashboard' : '/'} className="pl-4 flex items-center">
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

          {/* Settings Dropdown */}
          <Menu as="div" className="relative inline-block text-left mr-4">
            <MenuButton
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all ${
                isDark ? 'border-slate-400 text-slate-300 hover:border-slate-200 hover:text-slate-100' : 
                atTop ? 'border-white text-white hover:border-slate-200' : 'border-blue-600 text-blue-600 hover:border-blue-700'
              } hover:bg-opacity-10 hover:bg-current`}
            >
              <FontAwesomeIcon icon={faCog} size="sm" />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {/* Theme Toggle */}
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={toggleDarkMode}
                        className={`${
                          focus ? 'bg-slate-100 dark:bg-slate-700' : ''
                        } group flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200`}
                      >
                        <FontAwesomeIcon 
                          icon={isDark ? faMoon : faSun} 
                          className="mr-3 h-4 w-4" 
                          aria-hidden="true" 
                        />
                        {isDark ? t('common.settings.darkMode') : t('common.settings.lightMode')}
                      </button>
                    )}
                  </MenuItem>

                  {/* Language Selector */}
                  <MenuItem>
                    <div className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faGlobe} className="mr-3 h-4 w-4" />
                        {t('common.settings.language')}
                      </div>
                    </div>
                  </MenuItem>

                  {/* Language Options */}
                  {availableLanguages.map((langCode) => (
                    <MenuItem key={langCode}>
                      {({ focus }) => (
                        <button
                          onClick={() => changeLanguage(langCode)}
                          className={`${
                            focus ? 'bg-slate-100 dark:bg-slate-700' : ''
                          } ${
                            i18n.language === langCode ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                          } group flex w-full items-center px-8 py-2 text-sm`}
                        >
                          {getLanguageDisplayName(langCode)}
                          {i18n.language === langCode && (
                            <span className="ml-auto">✓</span>
                          )}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>

          <SignedOut>
            <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <Button variant={atTop ? 'light' : 'primary'}>{t('common.buttons.getStartedFree')}</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex space-x-4">
              <Button variant={atTop ? 'transparentWhite' : 'primary'} onClick={() => navigate('/dashboard')}>
                {t('common.navigation.dashboard')}
              </Button>
            </div>
          </SignedIn>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  rootBox: 'px-4',
                  userButtonAvatarBox: 'w-12 h-12',
                  userButtonAvatar: 'w-12 h-12',
                  userButtonTrigger: 'w-12 h-12',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="transparentWhite">{t('common.buttons.signIn')}</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      <hr className="border-b border-slate-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
