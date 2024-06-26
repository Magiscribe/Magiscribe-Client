import { useState } from 'react';
import { SectionTemplate } from '../templates/section';
import { motion } from 'framer-motion';

export function SignupForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setFormSubmitted(true);

    await fetch(
      'https://forms.zohopublic.com/magiscribe/form/BetaSignup/formperma/YL1QuMc8RT8_SVhvX0UrPDz78OTj6gyaWqELdoC0SRo/htmlRecords/submit',
      {
        method: 'POST',
        body: formData,
      },
    );
  };

  return (
    <SectionTemplate>
      <motion.h2
        className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        Get Pre-Alpha Access
      </motion.h2>
      <motion.div
        className="w-full mb-4"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t"></div>
        <p className="text-center text-gray-600 mt-4">
          Want to be the first to try out Magiscribe? Let us know and we'll get you on the list!
        </p>
      </motion.div>
      <motion.div
        className="w-full max-w-3xl p-6 mx-auto"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        viewport={{ once: true }}
      >
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
          <input type="hidden" name="zf_referrer_name" value="" />
          <input type="hidden" name="zf_redirect_url" value="" />
          <input type="hidden" name="zc_gad" value="" />
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              maxLength={255}
              name="Name_First"
              placeholder=""
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              maxLength={255}
              name="Name_Last"
              placeholder=""
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              maxLength={255}
              name="Email"
              placeholder=""
            />
          </div>
          <button
            disabled={formSubmitted}
            className={`${
              formSubmitted ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-800'
            } w-full text-white font-bold mt-2 py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out`}
            type="submit"
          >
            {formSubmitted ? 'Submitted!' : 'Submit'}
          </button>
          {formSubmitted && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-gray-600 mt-2"
            >
              Thank you for signing up for pre-alpha access! We'll be in touch soon.
            </motion.p>
          )}
        </form>
      </motion.div>
    </SectionTemplate>
  );
}
