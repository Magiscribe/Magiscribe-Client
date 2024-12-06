import GraphProvider from '@/hooks/graph-state';
import { InquiryBuilderProvider } from '@/providers/inquiry-builder-provider';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

import AnalysisTab from './tabs/analysis';
import InquiryBuilder from './tabs/builder';

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();

  const tabs = ['Builder', 'Analysis'];

  if (!id) {
    return <></>;
  }

  return (
    <GraphProvider>
      <InquiryBuilderProvider id={id}>
        <div className="w-full flex items-center justify-between mb-4">
          <Link
            to="/dashboard/inquiry-builder"
            className="flex items-center text-slate-100 hover:text-slate-200 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </Link>
        </div>
        <TabGroup>
          <TabList className="flex space-x-1 rounded-xl border-2 border-white mb-4">
            {tabs.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white'
                      : 'text-white dark:text-slate-200',
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
                <InquiryBuilder />
              </motion.div>
            </TabPanel>
            <TabPanel>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <AnalysisTab id={id} />
              </motion.div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </InquiryBuilderProvider>
    </GraphProvider>
  );
}
