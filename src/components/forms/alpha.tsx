import { SignUpButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

import Button from '../controls/button';
import { SectionTemplate } from '../templates/section';

export function SignupForm() {
  return (
    <SectionTemplate>
      <motion.h2
        className="w-full my-2 text-5xl font-bold leading-tight text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        Get Alpha Access
      </motion.h2>
      <motion.div
        className="w-full mb-4"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t"></div>
        <p className="text-center mt-4">Want to be one of the first people to try out Magiscribe?</p>
      </motion.div>
      <motion.div
        className="w-full max-w-3xl p-6 mx-auto flex flex-col items-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {/* Form */}
        <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
          <Button size="large">Sign Up Now</Button>
        </SignUpButton>
      </motion.div>
    </SectionTemplate>
  );
}
