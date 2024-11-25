import Button from '@/components/controls/button';
import { SignupForm } from '@/components/forms/alpha';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentSection from '../components/content-section';
import HomeHero from '../components/heroes/home-hero';
import SandcastleShape from '../components/shapes/beach';
import PencilShape from '../components/shapes/drawing';
import { GradientWaveBottom, GradientWaveTop } from '../components/shapes/gradient-wave';
import { SectionTemplate } from '../components/templates/section';
import { useSetTitle } from '../hooks/title-hook';

function AboutSection() {
  return (
    <SectionTemplate>
      <motion.h2
        className="w-full my-2 text-5xl font-bold leading-tight text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        What is Magicscribe?
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
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        }
        title="What is Magicscribe?"
        description="Learn how Magicscribe can help you create engaging, interactive content that provides valuable insights about your audience. You can checkout our demo video to see how it works."
        reversed={false}
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <PencilShape />
          </div>
        }
        title="From rough drafts to rich dialogues"
        description="Transform your initial ideas into flowing conversations with ease. Start with a handful of key questions, and watch as our tool weaves them into an engaging dialogue that you can tweak so that resonate with your audience."
        reversed
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <SandcastleShape />
          </div>
        }
        title="Tailor-made interactions for every need"
        description="Whether you need a simple yes-or-no survey, an in-depth quiz, or a free-flowing conversation, our tool has you covered. Create interactive content that's perfectly aligned with your audience and research goals. Gather the insights you need in the format that works best for you and your users."
        reversed={false}
      />
    </SectionTemplate>
  );
}

function Home() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useSetTitle()('');

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn]);

  return (
    <>
      <HomeHero />

      <div className="relative -mt-12 lg:-mt-24 pointer-events-none">
        <GradientWaveTop />
      </div>

      <AboutSection />

      <a id="signup" style={{ position: 'relative', top: '-100px' }}></a>
      <SignupForm />

      <GradientWaveBottom />

      <section className="container mx-auto text-center py-6 mb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white">Reach out to us!</h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto bg-white w-1/6 opacity-50 my-0 py-0 rounded-t"></div>
        </div>
        <h3 className="my-4 text-2xl leading-tight pb-4">
          Looking to learn more about Magiscribe, have a question, or just want to say hi?
          <br />
          Reach out to us!
        </h3>
        <Button as={'a'} size="large" variant="white" href="mailto:management@magiscribe.com">
          Contact Us
        </Button>
      </section>
    </>
  );
}

export default Home;
