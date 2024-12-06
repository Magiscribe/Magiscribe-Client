import GraphGeneratorMenu from '@/components/cards/generate-menu';
import Button from '@/components/controls/button';
import GraphContextBar from '@/components/graph/context-bar';
import GraphInput from '@/components/graph/graph-input';
import { useGraphContext } from '@/hooks/graph-state';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const { initialized, form, metadata, saveGraph, saveForm, saveMetadata } = useInquiryBuilder();

  const { graph, setGraph, canRedo, canUndo, redo, undo, triggerUpdate, onEdgesChange, onNodesChange } =
    useGraphContext();

  const memoGraph = useMemo(() => ({ nodes: graph.nodes, edges: graph.edges }), [graph.nodes, graph.edges]);

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveGraph();
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [memoGraph]);

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveForm();
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [form]);

  useEffect(() => {
    // Todo: Investigate how to add debouncing for inquiry metadata.  Adding debouncing for ImageMetadata
    // sometimes causes images to not be saved to nodes.
    if (Object.keys(metadata).length > 0) {
      saveMetadata();
    }
  }, [metadata]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleUndo = () => {
    if (!canUndo) {
      return;
    }
    console.log('undo');

    undo();
  };

  const handleRedo = () => {
    if (!canRedo) {
      return;
    }
    console.log('redo');

    redo();
  };

  // Use Effect to register the undo and redo keyboard shortcuts
  useEffect(() => {
    const handleUndoRedo = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      } else if ((event.ctrlKey && event.key === 'y') || (event.ctrlKey && event.key === 'Z')) {
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleUndoRedo);

    return () => {
      document.removeEventListener('keydown', handleUndoRedo);
    };
  }, [handleUndo, handleRedo]);

  return (
    <>
      <div className="h-[85vh] flex flex-col border-slate-200 dark:border-white border-2 rounded-2xl overflow-hidden">
        <div className=" bg-white dark:bg-slate-700 p-4 space-y-4 text-slate-700">
          <GraphContextBar />
        </div>
        <div className="flex-grow">
          {initialized && (
            <>
              <GraphInput
                graph={graph}
                setGraph={setGraph}
                triggerUpdate={triggerUpdate}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                canRedo={canRedo}
                canUndo={canUndo}
                redo={redo}
                undo={undo}
              >
                <Button
                  onClick={toggleChat}
                  className="absolute top-4 right-4 z-100"
                  variant="primary"
                  icon={faMagicWandSparkles}
                >
                  Graph Editor
                </Button>

                <AnimatePresence>
                  <GraphGeneratorMenu
                    open={isChatOpen}
                    onUpdate={() => setIsChatOpen(true)}
                    onClose={() => setIsChatOpen(false)}
                  />
                </AnimatePresence>
              </GraphInput>
            </>
          )}
        </div>
      </div>
    </>
  );
}
