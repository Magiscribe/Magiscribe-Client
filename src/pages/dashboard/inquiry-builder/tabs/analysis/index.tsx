import React, { useState, useEffect } from 'react';
import { GET_INQUIRIES_RESPONSES, GET_INQUIRY } from '@/clients/queries';
import { GetInquiryQuery, GetInquiryResponsesQuery, InquiryResponseFilters } from '@/graphql/graphql';
import { useQuery } from '@apollo/client';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import PerQuestionTab from './per-question';
import PerResponseTab from './per-response';
import ViaChatTab from './via-chat';
import ExportButton from './export-button';
import FilterControls from './filter-controls';

interface AnalysisTabProps {
  id: string;
  onResponseCountChange: (count: number) => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ id, onResponseCountChange }) => {
  // Updated initial state to match new filter structure
  const [appliedFilters, setAppliedFilters] = useState<InquiryResponseFilters>({
    createdAt: {},
    userName: {},
    userEmail: {},
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {
    loading: graphLoading,
    data: inquiryData,
    error: graphError,
  } = useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    errorPolicy: 'all',
  });

  const {
    loading: dataLoading,
    data: inquiryResponseData,
    error: dataError,
  } = useQuery<GetInquiryResponsesQuery>(GET_INQUIRIES_RESPONSES, {
    variables: {
      id,
      filters: appliedFilters,
    },
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (inquiryResponseData?.getInquiryResponses) {
      onResponseCountChange(inquiryResponseData.getInquiryResponses.length);
    }
  }, [inquiryResponseData?.getInquiryResponses, onResponseCountChange]);

  // Updated to handle the new filter structure
  const handleApplyFilters = (filters: InquiryResponseFilters) => {
    // Remove any empty filter objects to keep the query clean
    const cleanedFilters: InquiryResponseFilters = {};

    if (filters.createdAt && Object.keys(filters.createdAt).length > 0) {
      cleanedFilters.createdAt = filters.createdAt;
    }

    if (filters.userName && Object.keys(filters.userName).length > 0) {
      cleanedFilters.userName = filters.userName;
    }

    if (filters.userEmail && Object.keys(filters.userEmail).length > 0) {
      cleanedFilters.userEmail = filters.userEmail;
    }

    setAppliedFilters(cleanedFilters);
  };

  if (graphLoading || dataLoading) return <p className="text-slate-700 dark:text-white">Loading...</p>;
  if (graphError || dataError) return <p className="text-slate-700 dark:text-white">Error loading data</p>;

  const data = {
    id,
    form: inquiryData?.getInquiry?.data?.form,
    graph: inquiryData?.getInquiry?.data?.graph ?? inquiryData?.getInquiry?.data?.draftGraph,
    responses: inquiryResponseData?.getInquiryResponses ?? [],
  };
  const tabs = ['Per Response', 'Per Question', 'Via Chat'];

  // Check if any filters are actually applied (have values)
  const hasActiveFilters = Object.values(appliedFilters).some((filter) => filter && Object.keys(filter).length > 0);

  return (
    <div className="mt-8 rounded-2xl">
      {/* Export buttons at the top */}
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
                  'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
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

        <div className="mt-6 mb-6">
          <FilterControls
            onApplyFilters={handleApplyFilters}
            hasActiveFilters={hasActiveFilters}
            initialFilters={appliedFilters}
          />
        </div>

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
