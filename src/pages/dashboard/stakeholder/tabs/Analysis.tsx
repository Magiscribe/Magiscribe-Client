import React from 'react';
import { useQuery } from '@apollo/client';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { GET_DATA } from '../../../../clients/queries';
import PerResponseTab from './PerResponseTab';
import PerQuestionTab from './PerQuestionTab';
import ViaChatTab from './ViaChatTab';

const AnalysisTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const {
    loading: dataLoading,
    error: dataError,
    data,
  } = useQuery(GET_DATA, {
    variables: { id: id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      console.log(dataObject);
    },
  });

  if (dataLoading) return <p>Loading...</p>;
  if (dataError) return <p>Error: {dataError.message}</p>;

  const tabCategories = ['Per Response', 'Per Question', 'Via Chat'];

  return (
    <div className="mt-8">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-slate-200 p-1">
          {tabCategories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-slate-700'
                    : 'text-slate-500 hover:bg-white/[0.12] hover:text-slate-700',
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            {data && data.dataObject ? <PerResponseTab data={data.dataObject} /> : <p>No data available</p>}
          </Tab.Panel>
          <Tab.Panel>
            {data && data.dataObject ? <PerQuestionTab data={data.dataObject} /> : <p>No data available</p>}
          </Tab.Panel>
          <Tab.Panel>
            {data && data.dataObject ? <ViaChatTab data={data.dataObject} /> : <p>No data available</p>}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AnalysisTab;
