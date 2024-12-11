import GenericHero from '@/components/heroes/generic-hero';
import { useSetTitle } from '@/hooks/title-hook';

export default function ContactPage() {
  useSetTitle()('Contact Us');

  return (
    <>
      <GenericHero title="Contact Us" subtitle="We're here to help. Reach out to us with any questions or concerns." />
      <div className="container mx-auto mt-12">
        <p className="text-xl">
          If you have any questions or concerns, please reach out to us at{' '}
          <a className="underline" href="mailto:management@magiscribe.com">
            management@magiscribe.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
