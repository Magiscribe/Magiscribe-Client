import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React from 'react';
import ViaChatTab from './via-chat';
import PerQuestionTab from './per-question';
import PerResponseTab from './per-response';

interface AnalysisTabProps {
  data: {
    id: string;
    form: any;
    graph: any;
    nodeVisitData: any[];
  } | null;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  const tabCategories = ['Per Response', 'Per Question', 'Via Chat'];

  return (
    <div className="mt-8">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl border-2 border-white mb-4">
          {tabCategories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
                  selected ? 'bg-white shadow text-slate-700' : 'text-slate-100 hover:bg-white/[0.12]',
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
              <PerResponseTab data={data} />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <PerQuestionTab data={data} />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <ViaChatTab data={data} />
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default AnalysisTab;
