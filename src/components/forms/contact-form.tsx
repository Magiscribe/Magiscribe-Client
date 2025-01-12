import { SEND_CONTACT } from '@/clients/mutations';
import Container from '@/components/container';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import { ContactResponse } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sendContact] = useMutation<ContactResponse>(SEND_CONTACT);

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { type, checked, value } = e.target as HTMLInputElement;
      const inputValue = type === 'checkbox' ? checked : value;
      setForm({ ...form, [field]: inputValue });
    };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      await sendContact({ variables: { input: form } });
      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <Container>
        <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-green-700 dark:text-green-100 mb-4"
            >
              <div className="flex items-center gap-2">
                <Icon icon="fa-solid:check-circle" />
                <span>Message sent successfully!</span>
              </div>
            </motion.div>
          )}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm mb-2">Message</label>
            <Textarea
              rows={4}
              name="message"
              value={form.message}
              onChange={handleInputChange('message')}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <Button disabled={isLoading || isSubmitting}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Icon icon="fa-solid:spinner" className="animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </Container>

      <Container>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Other ways to reach us</h2>
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
