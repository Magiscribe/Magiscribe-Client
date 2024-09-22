import GraphInput from '@/components/graph/graph-input';
import DeleteConfirmationModal from '@/components/modals/delete-modal';
import ModalGenerateInquiryGraph from '@/components/modals/generate-inquiry-modal';
import ModalGraphHelp from '@/components/modals/graph-help-modal';
import ModalUpsertInquiry from '@/components/modals/upsert-inquiry-modal';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { formatGraph } from '@/utils/graphs/graph-utils';
import { faGear, faQuestionCircle, faSpinner, faTrash, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_DELAY_IN_MS = 1000;

/**
 * Setup component for creating and managing decision graphs.
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the current setup
 */
export default function InquiryBuilder() {
  // States
  const [upsertFormModal, setUpsertFormModal] = useState(false);
  const [resetGraphModal, setResetGraphModal] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  // Refs
  const saveDebounce = useRef<NodeJS.Timeout>();

  // Hooks
  const {
    initialized,
    form,
    graph,
    lastUpdated,
    updateGraph,
    saveGraph,
    resetGraph,
    onEdgesChange,
    onNodesChange,
    updateGraphEdges,
    updateGraphNodes,
    generatingGraph,
  } = useInquiryBuilder();
  const alert = useAddAlert();

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (graph.nodes.length === 0 && graph.edges.length === 0) {
      return;
    }

    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveGraph(); // Function to save the graph
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [graph]);

  /**
   * Handle formatting the graph.
   */
  const handleFormat = () => {
    updateGraph(formatGraph(graph, true));
    alert('Graph formatted successfully!', 'success');
  };

  return (
    <>
      <div className="h-[85vh] flex flex-col border-white border-2 rounded-2xl overflow-hidden">
        <div className="bg-white p-4 space-y-4 text-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex flex-col items-start">
              <span>
                {form.title} Graph{' '}
                <span className="text-sm font-normal text-slate-500">
                  Last updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
                </span>
              </span>
              <button onClick={() => setUpsertFormModal(true)} className="text-blue-500 text-sm font-semibold">
                Edit Inquiry
              </button>
            </h2>
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
                onClick={() => setGenerateModalOpen(true)}
                disabled={generatingGraph}
              >
                <FontAwesomeIcon
                  icon={generatingGraph ? faSpinner : faWandMagicSparkles}
                  className="mr-2"
                  spin={generatingGraph}
                />
                Generate Graph
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
                onClick={handleFormat}
              >
                <FontAwesomeIcon icon={faGear} className="mr-2" />
                Format Graph
              </button>
              <button
                onClick={() => setResetGraphModal(true)}
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Reset Graph
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
          {initialized && (
            <GraphInput
              nodes={graph.nodes}
              setNodes={updateGraphNodes}
              edges={graph.edges}
              setEdges={updateGraphEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            />
          )}
        </div>
      </div>

      <ModalUpsertInquiry
        open={upsertFormModal}
        onClose={() => setUpsertFormModal(false)}
        onSave={() => {
          setUpsertFormModal(false);
        }}
      />

      <ModalGenerateInquiryGraph
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSave={() => {
          setGenerateModalOpen(false);
        }}
      />

      <DeleteConfirmationModal
        isOpen={resetGraphModal}
        onClose={() => setResetGraphModal(false)}
        onConfirm={() => {
          resetGraph();
          setResetGraphModal(false);
          alert('Graph reset successfully!', 'success');
        }}
        text="Are you sure you want to reset the graph?"
        confirmText="Reset Graph"
      />

      <ModalGraphHelp open={helpModal} onClose={() => setHelpModal(false)} />
    </>
  );
}
