import { Outlet, useParams, useSearchParams } from 'react-router-dom';

import { InquiryTraversalProvider, useInquiry } from '@/providers/inquiry-traversal-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from '@/hooks/dark-mode';
import { motion } from 'framer-motion';
import Button from '@/components/controls/button';

function Header() {
  const { form, userDetails } = useInquiry();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  return (
    <header className="w-full bg-white dark:bg-slate-800 flex items-center justify-between shadow-md">
      <div className="relative flex w-full p-4 max-w-4xl min-h-16 mx-auto items-center">
        <motion.div
          className="flex items-center absolute left-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src="https://avatar.iran.liara.run/public" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">{userDetails.name || 'User'}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Participant</p>
          </div>
        </motion.div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl font-bold mx-auto text-slate-800 dark:text-white">{form.title}</h1>
        </div>

        <div className="flex items-center absolute right-4">
          {/* {form.voice && (
            <button
              onClick={() => setEnableAudio(!enableAudio)}
              className="mr-4 text-slate-800 dark:text-white hover:text-purple-600 transition-colors"
              aria-label={enableAudio ? 'Disable text-to-speech' : 'Enable text-to-speech'}
              title={enableAudio ? 'Disable text-to-speech' : 'Enable text-to-speech'}
            >
              <FontAwesomeIcon icon={enableAudio ? faVolumeUp : faVolumeMute} />
            </button>
          )} */}
          <Button onClick={toggleDarkMode}
            variant='transparentWhite'
            size='small'
          iconLeft={isDark ? faSun : faMoon} />
        </div>
      </div>
    </header>
  );
}

export default function InquiryUserTemplate() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get('preview') === 'true';

  if (!id) {
    return null;
  }

  return (
    <InquiryTraversalProvider id={id} preview={preview}>
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
        <Header />
        <Outlet />
      </div>
    </InquiryTraversalProvider>
  );
}
