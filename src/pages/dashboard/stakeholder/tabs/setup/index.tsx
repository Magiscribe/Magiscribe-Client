import { ADD_PREDICTION, DELETE_INQUIRY, UPDATE_INQUIRY } from '@/clients/mutations';
import { GET_INQUIRY } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import GraphInput from '@/components/graph/graph-input';
import DeleteConfirmationModal from '@/components/modals/delete-modal';
import ModalGraphHelp from '@/components/modals/graph-help-modal';
import useReactFlowGraph from '@/hooks/graph';
import { useAddAlert } from '@/providers/alert-provider';
import { getAgentIdByName } from '@/utils/agents';
import { createGraph, formatAndSetGraph } from '@/utils/graphs/graph-utils';
import { useApolloClient, useMutation, useQuery, useSubscription } from '@apollo/client';
import { faBroom, faPlus, faQuestionCircle, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Edge, Node } from '@xyflow/react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SetupFormData {
  title: string;
  description: string;
  organizationName: string;
  organizationRole: string;
  inputGoals: string;
}

interface SetupFormProps {
  form: SetupFormData;
  updateForm: (newForm: SetupFormData) => void;
}

/**
 * SetupForm component for inputting setup details.
 * @param {Object} props - Component props
 * @param {SetupFormData} props.form - The current form data
 * @param {Function} props.updateForm - Function to update the form data
 */
export const SetupForm: React.FC<SetupFormProps> = ({ form, updateForm }) => {
  const handleInputChange =
    (field: keyof SetupFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateForm({ ...form, [field]: e.target.value });
    };

  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Setup</h2>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={handleInputChange('title')}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
            Description
          </label>
          <textarea
            id="inputGoals"
            value={form.description}
            onChange={handleInputChange('description')}
            rows={2}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="organizationName">
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            value={form.organizationName}
            onChange={handleInputChange('organizationName')}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="organizationRole">
            Organization Role
          </label>
          <input
            type="text"
            id="organizationRole"
            value={form.organizationRole}
            onChange={handleInputChange('organizationRole')}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
            Who are you looking to get input from and what insights are you trying to capture?
          </label>
          <textarea
            id="inputGoals"
            value={form.inputGoals}
            onChange={handleInputChange('inputGoals')}
            rows={3}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
      </form>
    </div>
  );
};

/**
 * Setup component for creating and managing decision graphs.
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the current setup
 */
const Setup: React.FC<{ id: string }> = ({ id }) => {
  const [form, setForm] = useState<SetupFormData>({
    title: '',
    description: '',
    organizationName: '',
    organizationRole: '',
    inputGoals: '',
  });
  const [loading, setLoading] = useState(false);
  const [clearGraphModal, setClearGraphModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  const alert = useAddAlert();
  const navigate = useNavigate();

  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } = useReactFlowGraph();

  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const [updateObject] = useMutation(UPDATE_INQUIRY);
  const [deleteObject] = useMutation(DELETE_INQUIRY);

  useQuery(GET_INQUIRY, {
    variables: { id },
    skip: !id,
    onCompleted: ({ getInquiry }) => {
      setForm(getInquiry.data.form);
      if (getInquiry.data.graph) {
        handleGraphCreation(getInquiry.data.graph);
      }
    },
  });

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId: 'predictionAdded' },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;
      if (prediction?.type === 'SUCCESS') {
        alert('Graph generated successfully!', 'success');
        setLoading(false);
        handleGraphCreation(JSON.parse(JSON.parse(prediction.result)), true);
      }
    },
    onError: () => {
      alert('Something went wrong!', 'error');
      setLoading(false);
    },
  });

  const handleGenerateGraph = useCallback(async () => {
    const agentId = await getAgentIdByName('Stakeholder | Graph Generator', client);

    setLoading(true);
    addPrediction({
      variables: {
        subscriptionId: 'predictionAdded',
        agentId,
        variables: {
          ...form,
          userMessage: `${form.title}: As a ${form.organizationRole} for ${form.organizationName} I am looking create questions to get input from ${form.inputGoals}.`,
        },
      },
    });
    alert('Started generating graph... This may take a few seconds.', 'info');
  }, [form, addPrediction, alert]);

  const handleGraphCreation = useCallback(
    (input: { nodes: Node[]; edges: Edge[] }, autoPosition: boolean = false) => {
      const graph = createGraph(input);
      formatAndSetGraph(graph, autoPosition, setNodes, setEdges);
    },
    [setNodes, setEdges],
  );

  const updateForm = useCallback((newForm: SetupFormData) => {
    setForm(newForm);
  }, []);

  const handleDelete = useCallback(() => {
    deleteObject({ variables: { id } });
    alert('Inquiry deleted successfully!', 'success');
    navigate('/dashboard/inquiry');
  }, [deleteObject, id, alert, navigate]);

  const handleSave = useCallback(() => {
    updateObject({ variables: { id, data: { form, graph: { nodes, edges } } } });
    alert('Inquiry saved successfully!', 'success');
    navigate('/dashboard/inquiry');
  }, [updateObject, id, form, nodes, edges, alert, navigate]);

  const handleFormat = useCallback(() => {
    formatAndSetGraph({ nodes, edges }, true, setNodes, setEdges);
    alert('Graph formatted successfully!', 'success');
  }, [nodes, edges, setNodes, setEdges, alert]);

  const clearGraph = useCallback(() => {
    handleGraphCreation({ nodes: [{ id: '0', type: 'start', position: { x: 0, y: 0 }, data: {} }], edges: [] }, true);
    alert('Graph cleared successfully!', 'success');
  }, [handleGraphCreation, alert]);

  return (
    <div className="container max-w-12xl mx-auto">
      <SetupForm form={form} updateForm={updateForm} />
      <ModalGraphHelp open={helpModal} onClose={() => setHelpModal(false)} />
      <DeleteConfirmationModal
        isOpen={clearGraphModal}
        onClose={() => setClearGraphModal(false)}
        onConfirm={() => {
          clearGraph();
          setClearGraphModal(false);
        }}
        text="Are you sure you want to clear the graph?"
        confirmText="Clear Graph"
      />
      <div className="mt-8 h-[80vh] flex flex-col border-white border-2 rounded-2xl">
        <div className="bg-white p-4 rounded-lg space-y-4 text-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Decision Graph</h2>
            <div className="flex space-x-4">
              <button
                disabled={loading}
                onClick={handleGenerateGraph}
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Generate Graph {loading && <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />}
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
                onClick={handleFormat}
              >
                <FontAwesomeIcon icon={faBroom} className="mr-2" />
                Format Graph
              </button>
              <button
                onClick={() => setClearGraphModal(true)}
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Clear Graph
              </button>
              <button
                onClick={() => setHelpModal(true)}
                className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                Help
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <GraphInput
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          />
        </div>
      </div>
      <div className="flex justify-end bg-white p-4 rounded-2xl mt-8 space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Setup;
