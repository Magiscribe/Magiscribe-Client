import GraphGeneratorMenu from '@/components/cards/generate-menu';
import Button from '@/components/controls/button';
import GraphContextBar from '@/components/graph/context-bar';
import GraphInput from '@/components/graph/graph-input';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence } from 'motion/react';
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
  const saveDebounce = useRef<NodeJS.Timeout>(null);

  // Hooks
  const { graph, initialized, settings, metadata, saveGraph, saveSettings, saveMetadata, saveOwners, owners } =
    useInquiryBuilder();

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
      saveSettings();
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [settings]);

  useEffect(() => {
    // Todo: Investigate how to add debouncing for inquiry metadata.  Adding debouncing for ImageMetadata
    // sometimes causes images to not be saved to nodes.
    if (Object.keys(metadata).length > 0) {
      saveMetadata();
    }
  }, [metadata]);

  useEffect(() => {
    if (owners.length > 0) {
      saveOwners();
    }
  }, [owners]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="h-[85vh] flex flex-col border-slate-200 dark:border-white border-2 rounded-2xl overflow-hidden">
        <div className=" bg-white dark:bg-slate-700 p-4 space-y-4 text-slate-700">
          <GraphContextBar />
        </div>
        <div className="grow">
          {initialized && (
            <>
              <GraphInput>
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
