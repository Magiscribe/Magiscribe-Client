import { useQuery } from '@apollo/client';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GET_DATA } from '../../../../clients/queries';

const AnalysisTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const { loading: dataLoading, error: dataError } = useQuery(GET_DATA, {
    variables: { id: id },
  });

  if (dataLoading) return <p>Loading...</p>;
  if (dataError) return <p>Error: {dataError.message}</p>;

  return (
    <div className="mt-8">
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-slate-200 p-1">
          {['Per Response', 'Per Question', 'Via Chat'].map((category) => (
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
        </TabList>
        <br />
      </TabGroup>
    </div>
  );
};

export default AnalysisTab;
