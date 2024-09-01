import { motion } from 'framer-motion';
import ContentSection from '../components/content-section';
import { SignupForm } from '../components/forms/alpha';
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
        className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800"
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
          <div className="pt-8 min-h-64 max-h-64 bg-indigo-700 flex flex-row rounded-2xl">
            <PencilShape />
          </div>
        }
        title="An assistive drawing tool"
        description="Visualizations are some of the most powerful tools for understanding complex ideas. But, it can sometimes be difficult to your ideas into a clean and understandable visualization. With Magiscribe, you can focus on your ideas and let the magic of technology take care of the rest. All you have to do it describe your idea verbally, in writing, or through a rough sketch, and Magiscribe will take care of the rest."
        reversed
      />
      <ContentSection
        content={
          <div className="pt-8 w-full max-h-64 bg-indigo-700 flex flex-row rounded-2xl">
            <SandcastleShape />
          </div>
        }
        title="A sandbox environment"
        description="Magiscribe is a sandbox environment where you can experiment with your ideas and see them come to life. You can create visualizations, diagrams, and other forms of visual content to help you understand your ideas better. You can also share your visualizations with others to get feedback and collaborate on your ideas."
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
        <a
          href="mailto:management@magiscribe.com"
          className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Contact Us
        </a>
      </section>
    </>
  );
}

export default Home;
