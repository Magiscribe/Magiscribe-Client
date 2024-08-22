import React from 'react';
import { useQuery } from '@apollo/client';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { GET_DATA } from '@/clients/queries';
import PerResponseTab from './per-response';
import PerQuestionTab from './per-question';
import ViaChatTab from './chat';
import { motion } from 'framer-motion';

const AnalysisTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    loading: dataLoading,
    error: dataError,
    data,
  } = useQuery(GET_DATA, {
    variables: { id: id },
    skip: !id,
    errorPolicy: 'all',
  });

  if (dataLoading) return <p>Loading...</p>;
  if (dataError) return <p>Error: {dataError.message}</p>;

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
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              {data && data.dataObject ? <PerResponseTab data={data.dataObject} /> : <p>No data available</p>}
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              {data && data.dataObject ? <PerQuestionTab data={data.dataObject} /> : <p>No data available</p>}
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              {data && data.dataObject ? <ViaChatTab data={data.dataObject} /> : <p>No data available</p>}
            </motion.div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default AnalysisTab;
