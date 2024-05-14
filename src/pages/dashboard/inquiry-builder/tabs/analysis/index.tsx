import React, { useEffect, useState } from 'react';
import { GET_INQUIRIES_RESPONSES } from '@/clients/queries';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import PerQuestionTab from './per-question';
import PerResponseTab from './per-response';
import ViaChatTab from './via-chat';
import ExportButton from './export-button';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';

interface AnalysisTabProps {
  id: string;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ id }) => {
  const [searchParams] = useSearchParams();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Keep only the unfiltered query for export functionality
  const { data: inquiryResponseData } = useQuery<GetInquiryResponsesQuery>(GET_INQUIRIES_RESPONSES, {
    variables: { id },
    errorPolicy: 'all',
  });

  const tabs = ['Per Response', 'Per Question', 'Via Chat'];

  useEffect(() => {
    if (searchParams.has('id')) {
      setSelectedTabIndex(tabs.indexOf('Per Response'));
    }
  }, [searchParams, tabs]);

  return (
    <div className="mt-8 rounded-2xl">
      {/* Export buttons remain at the top level */}
      {(inquiryResponseData?.getInquiryResponses?.length ?? 0) > 0 && (
        <div className="flex justify-end gap-4 mb-6">
          <ExportButton id={id} responses={inquiryResponseData?.getInquiryResponses ?? []} type="csv" />
          <ExportButton id={id} responses={inquiryResponseData?.getInquiryResponses ?? []} type="json" />
        </div>
      )}

      <TabGroup selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
        <TabList className="flex space-x-1 rounded-xl border-2 border-white mb-4">
          {tabs.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 focus:outline-hidden focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-slate-700 shadow-xl text-slate-800 dark:text-white'
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
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <PerResponseTab id={id} defaultSelect={searchParams.get('id')} />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <PerQuestionTab id={id} />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <ViaChatTab id={id} />
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default AnalysisTab;
