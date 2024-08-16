import { ADD_PREDICTION, DELETE_DATA, UPDATE_DATA } from '@/clients/mutations';
import { GET_ALL_AGENTS, GET_DATA } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import GraphInput from '@/components/graph/graph-input';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useAuth } from '@clerk/clerk-react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Edge, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState } from '@xyflow/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Dagre from '@dagrejs/dagre';

interface Form {
  userId: string;
  title: string;
  createdAt: number;
  organizationName: string;
  organizationRole: string;
  inputGoals: string;
}

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'start',
    position: { x: 0, y: -250 },
    data: {},
  },
];

const initialEdges: Edge[] = [];

const SetupForm = ({ form, handleSetForm }: { form: Form; handleSetForm: (newForm: Form) => void }) => {
  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Setup</h2>
      </div>
      <form className="space-y-4">
        {['title', 'organizationName', 'organizationRole'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-bold mb-2" htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              id={field}
              value={form[field as keyof Form]}
              onChange={(e) => handleSetForm({ ...form, [field]: e.target.value })}
              className="border-2 border-gray-200 p-2 rounded-lg w-full"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
            Who are you looking to get input from and what insights are you trying to capture?
          </label>
          <textarea
            id="inputGoals"
            value={form.inputGoals}
            onChange={(e) => handleSetForm({ ...form, inputGoals: e.target.value })}
            rows={3}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
      </form>
    </div>
  );
};

const DecisionGraph = ({
  loading,
  generateGraph,
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  clearGraph,
}: {
  loading: boolean;
  generateGraph: () => void;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
  clearGraph: () => void;
}) => {
  return (
    <div className="mt-8 h-[70vh] grid grid-cols-4 gap-4 border-white border-2 rounded-2xl">
      <div className="col-span-1 bg-white p-4 rounded-lg space-y-4 text-slate-700">
        <h2 className="text-2xl font-bold">Decision Graph</h2>
        <p className="text-sm">What is a decision graph?</p>
        <p className="text-sm">
          A decision graph is a visual representation of what questions you want to ask a user and how you want to
          handle the conversation flow based on their answers.
        </p>
        <p className="text-sm">
          This provides you the opportunity to create a structured conversation flow that can be used to gather
          information from your users, while still adhering to the conversational principles of a natural conversation.
        </p>
        <hr />
        <p className="text-sm">
          Not sure where to start? Click the button below to generate some questions based on the information you
          provided above.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            disabled={loading}
            onClick={generateGraph}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded-3xl"
          >
            Generate Graph {loading && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>
          <button
            onClick={clearGraph}
            className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-3xl"
          >
            Clear Graph
          </button>
        </div>
      </div>
      <div className="col-span-3">
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
  );
};

const Setup = ({ id }: { id: string }) => {
  const { userId } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Form>({
    userId: userId!,
    title: '',
    createdAt: Date.now(),
    organizationName: '',
    organizationRole: '',
    inputGoals: '',
  });

  const { data: agents } = useQuery(GET_ALL_AGENTS);
  const [addPrediction] = useMutation(ADD_PREDICTION);
  const [updateObject] = useMutation(UPDATE_DATA);
  const [deleteObject] = useMutation(DELETE_DATA);

  const navigate = useNavigate();

  useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      setForm(dataObject.data.form);
      if (dataObject.data.graph) {
        const loadedGraph = dataObject.data.graph;
        setNodes(loadedGraph.nodes);
        setEdges(loadedGraph.edges);
      }
    },
  });

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId: 'predictionAdded' },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;
      if (prediction && prediction.type === 'SUCCESS') {
        setLoading(false);
        processGraph(JSON.parse(JSON.parse(prediction.result)));
      }
    },
    onError: (error) => {
      console.error(error);
      setLoading(false);
    },
  });

  const generateGraph = () => {
    const drawingAgent = agents?.getAllAgents.find(
      (agent: { name: string }) => agent.name === 'Stakeholder | Graph Generator',
    );
    setLoading(true);
    addPrediction({
      variables: {
        subscriptionId: 'predictionAdded',
        agentId: drawingAgent?.id,
        variables: {
          ...form,
          userMessage: `${form.title}: As a ${form.organizationRole} for ${form.organizationName} I am looking create questions to get input from ${form.inputGoals}.`,
        },
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processGraph = (input: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'TB' });

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    input.nodes.map((edge) => {
      return newNodes.push({
        id: edge.id,
        type: edge.type,
        position: { x: 0, y: 0 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: edge.data as any,
      });
    });

    input.edges.map((edge) => {
      return newEdges.push({
        id: uuid(),
        source: edge.source.toString(),
        target: edge.target.toString(),
      });
    });

    newNodes.forEach((node) => {
      g.setNode(node.id, { width: 400, height: 400 });
    });
    newEdges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    Dagre.layout(g);

    setNodes(
      newNodes.map((node) => {
        return { ...node, position: { x: g.node(node.id).x, y: g.node(node.id).y } };
      }),
    );
    setEdges(newEdges);
  };

  const handleSetForm = (newForm: Form) => {
    setForm(newForm);
  };
  const handleDelete = () => {
    deleteObject({ variables: { id } });
    navigate('/dashboard/inquiry');
  };

  const handleSave = () => {
    updateObject({ variables: { id, data: { form, graph: { nodes, edges } } } });
    navigate('/dashboard/inquiry');
  };

  const clearGraph = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  return (
    <div className="container max-w-12xl mx-auto">
      <SetupForm form={form} handleSetForm={handleSetForm} />
      <DecisionGraph
        loading={loading}
        generateGraph={generateGraph}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        clearGraph={clearGraph}
      />
      <div className="flex justify-end bg-white p-4 rounded-2xl mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded-3xl"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-3xl ml-4"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Setup;
