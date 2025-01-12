import { SignupForm } from '@/components/forms/alpha';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

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
        What is Magiscribe?
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
        title="Balance Efficiency with Depth"
        description="Magiscribe helps you combine the efficiency of surveys with the depth of user interviews. Gather quantitative data from many participants while pursuing qualitative insights through targeted follow-up questions."
        reversed={false}
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <PencilShape />
          </div>
        }
        title="Understand Your Audience"
        description="From simple yes-no surveys to in-depth quizzes and free-flowing conversations, our AI-powered platform streamlines audience insights. Magiscribe combines smart technology with artificial intelligence to deliver deeper understanding."
        reversed
      />
      <ContentSection
        content={
          <div className="pt-8 w-full h-full aspect-video bg-[#7133D5] flex flex-row rounded-2xl">
            <SandcastleShape />
          </div>
        }
        title="From rough drafts to rich dialogues"
        description="Magiscribe produces semi-structured conversations allowing you to both guarantee particular questions get asked and allow for dynamic follow-up when the respondent says something interesting the same way a skilled interviewer would."
        reversed={false}
      />
    </SectionTemplate>
  );
}

function Home() {
  useSetTitle()('');

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
        <Link to="/contact">Contact Us</Link>
      </section>
    </>
  );
}

export default Home;
