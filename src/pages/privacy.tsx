import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  useSetTitle()('Privacy Policy');

  return (
    <>
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p>
            This privacy policy governs how we, Magiscribe ("we", "our" or "us"), use Personal Information that we
            collect, receive and store about individuals in connection with the use of our website and services
            (collectively referred to as the "Services").
          </p>

          <h2>Introduction</h2>
          <p>
            We have implemented this Privacy Policy because your privacy, and the privacy of other users, is important
            to us. This Privacy Policy explains our online information practices and the choices you can make about the
            way your Personal Information is collected and used in connection with the Services. "Personal Information"
            means any information that may be used to personally identify an individual, including, but not limited to,
            names, email addresses, and other contact information.
          </p>

          <h2>Terms of Use</h2>
          <p>
            This Privacy Policy forms part of our{' '}
            <Link to="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>
            .
          </p>

          <h2>Information We Collect</h2>
          <p>We collect Personal Information in the following ways:</p>

          <h4>Account Information</h4>
          <p>
            When you create an account through Clerk authentication services, we receive basic profile information such
            as your name and email address.
          </p>

          <h4>Usage Information</h4>
          <p>
            We collect information about how you use our Services, including your inquiry responses, conversation
            patterns, and interaction with our AI features.
          </p>

          <h4>Technical Information</h4>
          <p>
            When you use our Services, we may collect technical data such as your IP address, browser type, and device
            information through cookies and similar technologies.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use your Personal Information to:</p>
          <ul>
            <li>Provide and improve our Services</li>
            <li>Generate analytics and improve our AI models</li>
            <li>Communicate with you about our Services</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>We share your information with:</p>
          <ul>
            <li>AWS Bedrock (for AI processing through Claude)</li>
            <li>Clerk (for authentication services)</li>
          </ul>
          <p>
            Amazon Bedrock doesn't store or log your prompts and completions. Amazon Bedrock doesn't use your prompts
            and completions to train any AWS models and doesn't distribute them to third parties.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your Personal Information.
            However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your Personal Information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of certain data collection</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please{' '}
            <Link to="/contact" className="text-blue-400 hover:text-blue-300">
              contact us
            </Link>
            .
          </p>

          <h2>Last Updated</h2>
          <p>December 10th, 2024</p>
        </motion.div>
      </div>
    </>
  );
}
