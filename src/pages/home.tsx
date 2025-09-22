import ContactForm from '@/components/forms/contact-form';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import ContentSection from '../components/content-section';
import HomeHero from '../components/heroes/home-hero';
import SandcastleShape from '../components/shapes/beach';
import PencilShape from '../components/shapes/drawing';
import { GradientWaveBottom, GradientWaveTop } from '../components/shapes/gradient-wave';
import { SectionTemplate } from '../components/templates/section';
import { useSetTitle } from '../hooks/title-hook';

function AboutSection() {
  const { t } = useTranslation();

  return (
    <SectionTemplate>
      <motion.h2
        className="w-full my-2 text-5xl font-bold leading-tight text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {t('pages.home.about.title')}
      </motion.h2>
      <div className="w-full mb-4">
        <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t"></div>
      </div>

      <ContentSection
        content={
          <iframe
            className="w-full h-full aspect-video bg-indigo-700 flex flex-row rounded-2xl"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/45l_kHRTmdY?si=DQZnYOwZOL1qih1N"
            title={t('media.youtubeVideoPlayer')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        }
        title={t('pages.home.about.balanceEfficiency.title')}
        description={t('pages.home.about.balanceEfficiency.description')}
        reversed={false}
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <PencilShape />
          </div>
        }
        title={t('pages.home.about.understandAudience.title')}
        description={t('pages.home.about.understandAudience.description')}
        reversed
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <SandcastleShape />
          </div>
        }
        title={t('pages.home.about.roughDrafts.title')}
        description={t('pages.home.about.roughDrafts.description')}
        reversed={false}
      />
    </SectionTemplate>
  );
}

function ContactSection() {
  const { t } = useTranslation();

  return (
    <SectionTemplate>
      <motion.h2
        className="w-full my-2 text-5xl font-bold leading-tight text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {t('pages.home.contact.title')}
      </motion.h2>
      <div className="w-full mb-4">
        <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t"></div>
      </div>
      <motion.h3
        className="w-full  my-4 text-2xl leading-tight pb-4 text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {t('pages.home.contact.subtitle')}
      </motion.h3>

      <ContactForm />
    </SectionTemplate>
  );
}

function Home() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.home.title'));

  return (
    <>
      <HomeHero />

      <div className="relative -mt-12 lg:-mt-24 pointer-events-none">
        <GradientWaveTop />
      </div>

      <AboutSection />
      <ContactSection />

      <GradientWaveBottom />
    </>
  );
}

export default Home;
