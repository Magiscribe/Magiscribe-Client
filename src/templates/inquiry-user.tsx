import Button from '@/components/controls/button';
import { useDarkMode } from '@/hooks/dark-mode';
import AudioProvider, { useAudioContext } from '@/providers/audio-provider';
import { InquiryTraversalProvider, useInquiry } from '@/providers/inquiry-traversal-provider';
import { faMoon, faSun, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';

function Header() {
  const { form } = useInquiry();

  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { isAudioEnabled, toggleAudio } = useAudioContext();

  return (
    <header className="fixed w-full bg-white dark:bg-slate-800 flex items-center justify-between shadow-md">
      <div className="relative flex w-full p-4 max-w-4xl min-h-16 mx-auto items-center">
        <div className="flex items-center absolute left-4">
          <h1 className="text-xl font-bold mx-auto text-slate-800 dark:text-white">{form.title}</h1>
        </div>

        <div className="flex items-center absolute right-4 space-x-4">
          {form.voice && (
            <Button
              onClick={toggleAudio}
              variant="transparentDark"
              size="small"
              icon={isAudioEnabled ? faVolumeUp : faVolumeMute}
            />
          )}
          <Button onClick={toggleDarkMode} variant="transparentDark" size="small" icon={isDark ? faSun : faMoon} />
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
    <AudioProvider>
      <InquiryTraversalProvider id={id} preview={preview}>
        <div className="flex flex-col h-screen text-slate-800 dark:text-white">
          <div className="fixed w-full h-screen bg-slate-200 dark:bg-slate-900 -z-10"></div>
          <Header />
          <div className="flex flex-col h-screen pt-20">
            <Outlet />
          </div>
        </div>
      </InquiryTraversalProvider>
    </AudioProvider>
  );
}
