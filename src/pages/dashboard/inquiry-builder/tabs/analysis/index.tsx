import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import PerQuestionTab from './per-question';
import PerResponseTab from './per-response';
import ViaChatTab from './via-chat';
import ExportButton from './export-button';
import FilterControls from './filter-controls';
import { AnalysisFilterProvider } from '@/contexts/AnalysisFilterContext';
import { useSearchParams } from 'react-router-dom';
import { useFilteredResponses } from '@/hooks/useFilteredResponses';

interface AnalysisTabProps {
  id: string;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ id }) => {
  return (
    <AnalysisFilterProvider>
      <AnalysisTabContent id={id} />
    </AnalysisFilterProvider>
  );
};

const AnalysisTabContent: React.FC<AnalysisTabProps> = ({ id }) => {
  const [searchParams] = useSearchParams();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Get filtered responses for count display and exports
  const { responses: filteredResponses } = useFilteredResponses({ id });

  const tabs = ['Per Response', 'Per Question', 'Via Chat'];

  useEffect(() => {
    if (searchParams.has('id')) {
      setSelectedTabIndex(tabs.indexOf('Per Response'));
    }
  }, [searchParams, tabs]);

  return (
    <div className="mt-8 rounded-2xl">
      {/* Export buttons remain at the top level */}
      {(filteredResponses?.length ?? 0) > 0 && (
        <div className="flex justify-end gap-4 mb-6">
          <ExportButton id={id} responses={filteredResponses ?? []} type="csv" />
          <ExportButton id={id} responses={filteredResponses ?? []} type="json" />
        </div>
      )}

      {/* Shared filter controls */}
      <div className="mb-6">
        <FilterControls responseCount={filteredResponses?.length ?? 0} />
      </div>

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
              <PerResponseTab id={id} />
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
