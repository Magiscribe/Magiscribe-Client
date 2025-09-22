import GraphProvider from '@/hooks/graph-state';
import { InquiryBuilderProvider } from '@/providers/inquiry-builder-provider';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AnalysisTab from './tabs/analysis';
import InquiryBuilder from './tabs/builder';

export default function InquiryPage() {
  const { id, view } = useParams<{ id: string; view: string }>();
  const { t } = useTranslation();

  const tabs = [t('pages.inquiryBuilder.tabs.builder'), t('pages.inquiryBuilder.tabs.analysis')];
  const tabRoutes = ['builder', 'analysis'];
  const navigate = useNavigate();

  if (!id) {
    return <></>;
  }

  return (
    <GraphProvider>
      <InquiryBuilderProvider id={id}>
        <div className="w-full flex items-center justify-between mb-4">
          <Link to="/dashboard" className="flex items-center text-slate-100 hover:text-slate-200 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            {t('common.buttons.back')}
          </Link>
        </div>
        <TabGroup
          selectedIndex={
            tabRoutes.findIndex((tab) => tab.toLowerCase() === view) > -1
              ? tabRoutes.findIndex((tab) => tab.toLowerCase() === view)
              : 0
          }
          onChange={(index) => {
            const tab = tabRoutes[index];
            navigate(`/dashboard/inquiry-builder/${id}/${tab.toLowerCase()}`);
          }}
        >
          <TabList className="flex space-x-1 rounded-xl border-2 border-white mb-4">
            {tabs.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 focus:outline-hidden focus:ring-2',
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
