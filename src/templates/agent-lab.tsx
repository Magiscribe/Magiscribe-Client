import { DELETE_COLLECTION } from '@/clients/mutations';
import { GET_ALL_COLLECTIONS } from '@/clients/queries';
import Button from '@/components/controls/button';
import Select from '@/components/controls/select';
import ModalUpsertCollection from '@/components/modals/agents/create-collection-modal';
import ConfirmationModal from '@/components/modals/confirm-modal';
import { GetAllCollectionsQuery } from '@/graphql/graphql';
import { useMutation, useQuery } from "@apollo/client/react";
import { motion } from 'motion/react';
import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import LinkCard from '../components/cards/card';
import { useSetTitle } from '../hooks/title-hook';
import Container from '@/components/container';

export default function AgentLabTemplate() {
  useSetTitle()('Agent Lab');

  // State
  const [createCollectionModalOpen, setCreateCollectionModalOpen] = useState(false);
  const [deleteCollectioModalOpen, setDeleteCollectionModalOpen] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { collection } = useParams<{ collection?: string }>();

  const isActive = (path: string) => location.pathname.includes(path);

  // Queries
  const { data: collections } = useQuery<GetAllCollectionsQuery>(GET_ALL_COLLECTIONS);
  const [deleteCollection] = useMutation(DELETE_COLLECTION);

  if (!collections) return null;

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const basePath = '/dashboard/agent-lab';
    const currentPath = location.pathname.replace(basePath, '').replace(`/${collection}`, '');

    if (e.target.value === 'none') {
      // Remove collection from URL
      navigate(`${basePath}`);
    } else {
      // Add collection to URL
      navigate(`${basePath}/${e.target.value}${currentPath}`);
    }
  };

  const collectionOptions = [
    { label: 'Not selected', value: 'none' },
    ...(collections?.getAllCollections.map((collection) => ({
      label: collection.name,
      value: collection.id,
    })) || []),
  ];

  return (
    <>
      {collection && (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 my-8">
          <LinkCard
            title="Agents"
            description="View and manage your agents."
            to={`/dashboard/agent-lab${collection ? `/${collection}` : ''}/agents`}
            gradient="orange"
            isActive={isActive('agents')}
          />
          <LinkCard
            title="Capabilities"
            description="What can your agents do?"
            to={`/dashboard/agent-lab${collection ? `/${collection}` : ''}/capabilities`}
            gradient="green"
            isActive={isActive('capabilities')}
          />
          <LinkCard
            title="Prompts"
            description="Create and manage prompts."
            to={`/dashboard/agent-lab${collection ? `/${collection}` : ''}/prompts`}
            gradient="purple"
            isActive={isActive('prompts')}
          />
          <LinkCard
            title="Playground"
            description="See things go brrrr."
            to={`/dashboard/agent-lab${collection ? `/${collection}` : ''}/playground`}
            gradient="blue"
            isActive={isActive('playground')}
          />
        </motion.div>
      )}
      <Container>
        <Select
          label="Collection"
          subLabel="A collection is a logical grouping of agents, capabilities, and prompts."
          name="collection"
          value={collectionOptions.find((option) => option.value === collection)?.value || 'none'}
          onChange={handleCollectionChange}
          options={collectionOptions}
          className="grow"
        />
        <div className="flex justify-end gap-4 mt-4">
          <Button size="small" onClick={() => setCreateCollectionModalOpen(true)}>
            Create Collection
          </Button>
          <Button size="small" variant="inverseDanger" onClick={() => setDeleteCollectionModalOpen(true)}>
            Delete Collection
          </Button>
        </div>
      </Container>
      <Outlet />

      <ModalUpsertCollection open={createCollectionModalOpen} onClose={() => setCreateCollectionModalOpen(false)} />

      <ConfirmationModal
        text="Are you sure you want to delete this collection?"
        isOpen={deleteCollectioModalOpen}
        onClose={() => setDeleteCollectionModalOpen(false)}
        onConfirm={async () => {
          await deleteCollection({ variables: { collectionId: collection } });
          setDeleteCollectionModalOpen(false);
          navigate('/dashboard/agent-lab');
        }}
      />
    </>
  );
}
