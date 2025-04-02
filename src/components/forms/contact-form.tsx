import Container from '@/components/container';
import { Icon } from '@iconify/react';

export default function ContactForm() {
  return (
    <div className="grid md:grid-cols-1 gap-12">
      <Container>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
          <div className="space-y-4">
            <a
              href="mailto:management@magiscribe.com"
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-solid:envelope" /> management@magiscribe.com
            </a>
            <a
              href="https://www.linkedin.com/company/magiscribe"
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-brands:linkedin" /> Visit our LinkedIn
            </a>
            <a
              href="https://discord.gg/VJBSsFsR"
              className="flex items-center gap-3 text-lg hover:text-blue-400 transition-colors"
            >
              <Icon icon="fa-brands:discord" /> Join our Discord
            </a>
          </div>
        </div>

        <hr className="my-8" />

        <h3 className="text-xl font-semibold mb-4">Response Time</h3>
        <p className="text-gray-500 dark:text-gray-300">
          We typically respond to inquiries within 6-12 hours during business days. For urgent matters, please reach out
          to us on Discord.
        </p>
      </Container>
    </div>
  );
}
