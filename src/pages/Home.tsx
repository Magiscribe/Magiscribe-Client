import { SignupForm } from "../components/forms/alpha";
import Footer from "../components/nav/Footer";
import { NavBar } from "../components/nav/NavBar";
import { GradientWaveBottom } from "../components/shapes/GradientWaveBottom";
import { GradientWaveTop } from "../components/shapes/GradientWaveTop";
import PencilShape from "../components/shapes/Pencil";
import SandcastleShape from "../components/shapes/SandCastle";
import WizardShape from "../components/shapes/Wizard";
import { SectionTemplate } from "../components/templates/section";

function Hero() {
  return (
    <div className="pt-24">
      <div className="container px-12 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-left">
          <h1 className="my-4 text-4xl md:text-5xl font-bold leading-tight">
            Write your ideas, <br />
            let magic take care of the rest.
          </h1>
          <p className="leading-normal text-xl md:text-2xl mb-8">
            With Magiscribe, you can focus on your ideas and let the magic of
            technology take care of the rest through multi-modal automation.
          </p>
          <a
            href="#signup"
            className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            Get Pre-Alpha Access
          </a>
        </div>
        <div className="w-full md:w-2/5 max-w-lg py-6 mb-12 text-center ml-auto">
          <WizardShape />
        </div>
      </div>
    </div>
  );
}

// ContentSection component
function ContentSection({
  content,
  title,
  description,
  reversed,
}: {
  content?: React.ReactNode;
  title: string;
  description: string;
  reversed: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap ${content && reversed ? "flex-col-reverse sm:flex-row" : ""}`}
    >
      <div
        className={`w-full sm:w-3/5 p-6 mt-6 ${content && reversed ? "order-2 sm:order-1" : ""}`}
      >
        <div className="object-cover object-center w-full h-full">
          {content}
        </div>
      </div>
      <div
        className={`w-${content ? "full sm:w-2/5" : "5/6 sm:w-1/2"} p-6 ${content ? "mt-6" : ""}`}
      >
        <div className="align-middle">
          <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
            {title}
          </h3>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
      </div>
    </div>
  );
}

// SectionOne component
function AboutSection() {
  return (
    <SectionTemplate>
      <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        What is Magicscribe?
      </h2>
      <div className="w-full mb-4">
        <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t"></div>
      </div>
      <ContentSection
        content={
          <div className="pt-8 w-full max-h-64 bg-indigo-700 flex flex-row rounded-2xl">
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
  return (
    <div className="leading-normal tracking-normal text-white gradient">
      <NavBar />
      <Hero />

      <div className="relative -mt-12 lg:-mt-24 pointer-events-none">
        <GradientWaveTop />
      </div>

      <AboutSection />

      <a id="signup" style={{ position: "relative", top: "-100px" }}></a>
      <SignupForm />

      <GradientWaveBottom />

      <section className="container mx-auto text-center py-6 mb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white">
          Reach out to us!
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto bg-white w-1/6 opacity-50 my-0 py-0 rounded-t"></div>
        </div>
        <h3 className="my-4 text-3xl leading-tight">
          Looking to learn more about Magiscribe, have a question, or just want
          to say hi?
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

      <Footer />
    </div>
  );
}

export default Home;
