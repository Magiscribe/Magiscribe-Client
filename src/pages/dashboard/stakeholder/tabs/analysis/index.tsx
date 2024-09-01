import { GET_INQUIRIES_RESPONSES, GET_INQUIRY } from '@/clients/queries';
import { useQuery } from '@apollo/client';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ViaChatTab from './chat';
import PerResponseTab from './per-response';
import PerQuestionTab, { ResponseSummary } from './per-question';



const AnalysisTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [summaries, setSummaries] = useState<ResponseSummary>({}); 
  const setSummary = React.useCallback((summary: string, nodeId: string) => {
    setSummaries((prev) => ({ ...prev, [nodeId]: summary }));
  },[setSummaries])
  const {
    loading: graphLoading,
    data: inquiryData,
    error: graphError,
  } = useQuery(GET_INQUIRY, {
    variables: { id: id },
    skip: !id,
    errorPolicy: 'all',
  });

  const {
    loading: dataLoading,
    data: inquiryResponseData,
    error: dataError,
  } = useQuery(GET_INQUIRIES_RESPONSES, {
    variables: { id: id },
    skip: !id,
    errorPolicy: 'all',
  });

  if (dataLoading || graphLoading) return <p>Loading...</p>;
  if (dataError || graphError) return <p>Error</p>;

  const data = {
    form: inquiryData?.getInquiry?.data?.form,
    graph: inquiryData?.getInquiry?.data?.graph,
    nodeVisitData: inquiryResponseData?.getInquiryResponses,
    summaries,
    setSummary
  };

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
