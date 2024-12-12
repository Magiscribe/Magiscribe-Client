import GenericHero from '@/components/heroes/generic-hero';
import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  useSetTitle()('Terms and Conditions');

  return (
    <>
      <GenericHero
        title="Terms and Conditions"
        subtitle="Please read these terms and conditions carefully before using Magiscribe."
      />
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Terms of Service</h2>

          <p>
            By accessing and using Magiscribe ("Service"), you acknowledge that you have read, understood, and agree to
            be bound by these Terms of Service ("Agreement"). If you do not agree with any part of these terms, you may
            not use our services. This Agreement constitutes a binding agreement between you ("User" or "you") and
            Magiscribe ("we," "us," or "our").
          </p>

          <h3>Service Description</h3>
          <p>
            Magiscribe provides a platform for creating and managing structured conversations through our inquiry
            system. Our services include but are not limited to inquiry creation, distribution, and response collection.
            The Service utilizes Anthropic's Claude AI model for various functionalities. When using the Service, you
            are subject to both these terms and any applicable Anthropic terms of service.
          </p>

          <h3>User Accounts</h3>
          <p>
            To use the Service, you must create an account using Clerk authentication services. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities that occur under your
            account. You must immediately notify us of any unauthorized use of your account. Your use of Clerk
            authentication services is also subject to Clerk's terms of service and privacy policy.
          </p>

          <h3>Privacy and Data Protection</h3>
          <p>
            We respect your privacy and handle your data in accordance with our{' '}
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
            . When collecting responses through inquiries, you agree to inform respondents about data collection
            practices and obtain necessary consents. You acknowledge that the Service uses Anthropic's Claude AI model
            and that data processing may occur through Anthropic's systems in accordance with their privacy practices.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            All content, features, and functionality of the Service are the exclusive property of Magiscribe and are
            protected by international copyright laws. You retain ownership of any content you create using our
            services, but grant us a license to use and process that content to provide and improve our services.
          </p>

          <h3>Prohibited Activities</h3>
          <p>
            Users may not use Magiscribe for any illegal purposes or to distribute harmful content. We reserve the right
            to terminate accounts that violate these terms or engage in unauthorized activities.
          </p>

          <h3>Disclaimer of Warranties</h3>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind. We do not warrant that
            the Service will be uninterrupted or error-free. We are not responsible for the accuracy, reliability, or
            quality of any content or responses generated through the Service.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Magiscribe shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use or inability to use the Service.
          </p>

          <h3>Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new
            terms on the Service. Your continued use of the Service after such modifications constitutes your acceptance
            of the new terms.
          </p>

          <h3>Governing Law</h3>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the United States, without
            regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of
            the courts located within the United States.
          </p>

          <h3>Contact Us</h3>
          <p>If you have any questions about these Terms, please contact us.</p>

          <h3>Last Updated</h3>
          <p>December 10th, 2024</p>
        </motion.div>
      </div>
    </>
  );
}
