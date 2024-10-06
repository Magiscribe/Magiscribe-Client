import Button from '@/components/controls/button';
import GraphContextBar from '@/components/graph/context-bar';
import GraphGeneratorMenu from '@/components/graph/generate-menu';
import GraphInput from '@/components/graph/graph-input';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_DELAY_IN_MS = 1000;

/**
 * Setup component for creating and managing decision graphs.
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the current setup
 */
export default function InquiryBuilder() {
  // States
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Refs
  const saveDebounce = useRef<NodeJS.Timeout>();

  // Hooks
  const {
    initialized,
    form,
    graph,
    saveGraph,
    onEdgesChange,
    onNodesChange,
    updateGraphEdges,
    updateGraphNodes,
    saveForm,
  } = useInquiryBuilder();

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
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
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveForm(); // Function to save the graph
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [form]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="h-[85vh] flex flex-col border-white border-2 rounded-2xl overflow-hidden">
        <div className="bg-white p-4 space-y-4 text-slate-700">
          <GraphContextBar />
        </div>
        <div className="flex-grow">
          {initialized && (
            <>
              <GraphInput
                nodes={graph.nodes}
                edges={graph.edges}
                setNodes={updateGraphNodes}
                setEdges={updateGraphEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
              >
                <Button
                  onClick={toggleChat}
                  className="absolute bottom-4 right-4"
                  variant="inversePrimary"
                  iconLeft={faMagicWandSparkles}
                >
                  Graph Editor
                </Button>

                <AnimatePresence>
                  {isChatOpen && <GraphGeneratorMenu onClose={() => setIsChatOpen(false)} />}
                </AnimatePresence>
              </GraphInput>
            </>
          )}
        </div>
      </div>
    </>
  );
}
