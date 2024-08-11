import { CREATE_DATA } from '@/clients/mutations';
import CustomModal from '@/components/modal';
import { useAddAlert } from '@/providers/AlertProvider';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '@clerk/clerk-react';
import { faArrowLeft, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_USER_FORMS } from '../../../clients/queries';
import AnalysisTab from './tabs/Analysis';
import SetupForm from './tabs/Setup';

export default function StakeholderInput() {
  // Hooks
  const { userId } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Fetch user forms
  const { data: userFormsData } = useQuery(GET_USER_FORMS);
  const [createObject] = useMutation(CREATE_DATA);

  const createForm = async () => {
    const result = await createObject({
      variables: {
        data: {
          form: {
            userId,
            title: '',
            createdAt: Date.now(),
            organizationName: '',
            organizationRole: '',
            inputGoals: '',
          },
        },
      },
    });
    navigate(`${result.data.createUpdateDataObject.id}`);
  };

  const selectForm = (formId: string) => {
    navigate(`${formId}`);
  };

  const handleBack = () => {
    navigate('../');
  };

  const FormBubbles = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
      userFormsData?.dataObjectsCreated.map((userForm: any) => {
        const formData = userForm.data;
        return (
          <motion.div
            key={userForm.id}
            className="bg-white p-4 text-black rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            onClick={() => selectForm(userForm.id)}
          >
            <h3 className="text-lg font-semibold mb-2">
              {formData.form.title == '' ? 'Untitled Form' : formData.form.title}
            </h3>
            <p className="text-sm text-gray-500">Created: {new Date(formData.form.createdAt).toLocaleDateString()}</p>
          </motion.div>
        );
      })}
      <motion.div
        className="bg-blue-500 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
        whileHover={{ scale: 1.05 }} // Darker blue on hover
        onClick={createForm}
      >
        <span className="text-4xl font-bold text-white">+</span>
      </motion.div>
    </div>
  );

  const IntroContent = () => (
    <div className="mb-8 text-slate-100">
      <h2 className="text-2xl font-semibold  mb-4">Are you responsible for a large group of stakeholders?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>User base of your product/service</li>
        <li>Workforce/Shareholders of your company</li>
        <li>Audience of your content</li>
        <li>Constituents you represent</li>
        <li>Members of your social organization</li>
        <li>Any other group you want to gain insights from</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">Do you want to make decisions in their best interest?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Gather detailed responses across multiple modalities</li>
        <li>Build consensus from more voices than you could ever engage individually</li>
        <li>Make informed decisions backed by comprehensive data and our advanced analysis</li>
      </ul>
    </div>
  );

  const Modal = () => {
    const alert = useAddAlert();

    const link = `${window.location.origin}/link/${id}`;

    const handleCopyLink = () => {
      navigator.clipboard.writeText(link);
      setShareModalOpen(false);
      alert('Link copied to clipboard', 'success');
    };

    return (
      <CustomModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share" size="4xl">
        <p className="text-slate-600 mb-6">Share the link with anyone you want to get input from</p>

        <div className="flex items-stretch">
          <p className="flex-grow bg-white p-2 rounded-l-md border border-r-0 border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500">
            {link}
          </p>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 rounded-r-md text-sm font-medium shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            <span className="whitespace-nowrap">Copy Link</span>
          </button>
        </div>
      </CustomModal>
    );
  };

  return (
    <>
      {!id && (
        <>
          <IntroContent />
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">Your Forms</h2>
          <FormBubbles />
        </>
      )}
      {id ? (
        <>
          <div className="w-full flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-slate-100 hover:text-slate-200 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Forms
            </button>
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center text-slate-100 hover:text-slate-200 transition-colors"
            >
              <FontAwesomeIcon icon={faLink} className="mr-2" />
              Share
            </button>
          </div>
          <TabGroup>
            <TabList className="flex space-x-1 rounded-xl border-2 border-white mb-4">
              {['Setup', 'Analyze'].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    clsx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow text-slate-700'
                        : 'text-slate-100 hover:bg-white/[0.12] hover:text-slate-700',
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-2">
              <TabPanel>
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <SetupForm id={id} />
                </motion.div>
              </TabPanel>
              <TabPanel>
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <AnalysisTab />
                </motion.div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </>
      ) : null}
      <Modal />
    </>
  );
}
