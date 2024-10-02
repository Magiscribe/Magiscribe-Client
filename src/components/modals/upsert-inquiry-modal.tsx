import templates, { Template } from '@/assets/templates';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import CustomModal from './modal';

/**
 * Props for the ModalUpsertInquiry component
 */
interface ModalUpsertInquiryProps {
  open: boolean;
  onSave?: (id: string) => void;
  onClose: () => void;
}

/**
 * Props for the TemplateSelection component
 */
interface TemplateSelectionProps {
  value?: Template;
  onChange?: (template: Template) => void;
}

/**
 * Array of funny loading quotes
 */
const conversationGraphLoadingQuotes = [
  "Visualizing argument structures... don't worry, we won't take sides.",
  'Connecting conversational dots... like a gossip network, but smarter.',
  'Analyzing dialogue flows... detecting sarcasm may take extra time.',
  "Graphing your small talk... turns out it's not so small after all.",
  'Plotting the path from "Hello" to "Goodbye"... it\'s quite the journey.',
  'Identifying conversational hubs... looking at you, office chatterbox.',
  'Visualizing topic transitions... from weather to quantum physics in 3 messages flat.',
  'Measuring conversational depth... some threads go deeper than the Mariana Trench.',
  'Detecting storytelling patterns... once upon a time, in a dataset far, far away...',
  'Analyzing turn-taking dynamics... sorry for interrupting your loading time.',
  'Mapping the six degrees of conversation... Batman is somehow involved.',
  'Tracing the spread of inside jokes... laughter clusters detected.',
  'Identifying conversation starters... "Nice weather we\'re having" is surprisingly ineffective.',
  "Detecting conversational dead-ends... we've got a rescue team standing by.",
  "Mapping the ebb and flow of group chats... it's chaotic in here.",
  'Analyzing emoji usage patterns... 🤔 seems to be doing a lot of heavy lifting.',
  'Tracing the lifecycle of memes in your conversations... they grow up so fast.',
  'Identifying the gravitational pull of off-topic tangents... resistance is futile.',
  'Hiring an exterminator to deal with the bug infestation...',
];

/**
 * TemplateSelection component for selecting inquiry templates
 */
const TemplateSelection: React.FC<TemplateSelectionProps> = ({ value, onChange }) => (
  <div className="w-full">
    <RadioGroup value={value} onChange={onChange}>
      <Label className="block text-sm font-bold mb-2">
        Templates
        <br />
        <span className="italic text-slate-500 text-sm font-normal">
          Not sure where to start? Select a template to jumpstart your inquiry.
        </span>
      </Label>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <Radio
            key={template.name}
            value={template}
            className={({ checked }) =>
              `${checked ? 'bg-blue-500 text-white' : 'bg-gray-200'}
                relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
            }
          >
            {({ checked }) => (
              <div className="flex flex-col">
                <Label as="span" className={`text-lg font-bold ${checked ? 'text-white' : 'text-gray-800'}`}>
                  {template.name}
                </Label>
                <Description as="span" className={`text-sm ${checked ? 'text-indigo-100' : 'text-gray-600'}`}>
                  {template.description}
                </Description>
              </div>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  </div>
);

/**
 * ModalUpsertInquiry component for creating or updating inquiries
 */
const ModalUpsertInquiry: React.FC<ModalUpsertInquiryProps> = ({ open, onSave, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const [enableGraphGeneration, setEnableGraphGeneration] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(conversationGraphLoadingQuotes[0]);

  const { id, form, updateForm, generateGraph, updateGraph, onGraphGenerated, saveFormAndGraph, generatingGraph } =
    useInquiryBuilder();
  const alert = useAddAlert();

  useEffect(() => {
    if (generatingGraph) {
      const interval = setInterval(() => {
        setLoadingQuote(
          conversationGraphLoadingQuotes[Math.floor(Math.random() * conversationGraphLoadingQuotes.length)],
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [generatingGraph]);

  /**
   * Handle input change for the form
   * @param field - The field to update
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      updateForm({ ...form, [field]: e.target.value });
    };

  /**
   * Handle changing the graph template
   * @param template - The selected template
   */
  const handleChangeGraphTemplate = (template: Template) => {
    setSelectedTemplate(template);
    updateGraph(template.graph ?? { nodes: [], edges: [] });
  };

  /**
   * Toggle graph generation
   */
  const handleCheckboxChange = () => {
    setEnableGraphGeneration(!enableGraphGeneration);
  };

  useEffect(() => {
    onGraphGenerated(async () => {
      alert('Graph generated successfully!', 'success');
      await saveFormAndGraph(
        (id) => {
          alert('Inquiry saved successfully!', 'success');
          if (onSave) onSave(id as string);
        },
        () => {
          alert('Something went wrong!', 'error');
        },
      );
    });
  }, [onGraphGenerated, saveFormAndGraph, alert, onSave]);

  /**
   * Handle saving the inquiry
   */
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTemplate) {
      alert('Please select a template!', 'error');
      return;
    }

    if (selectedTemplate?.allowGeneration && enableGraphGeneration) {
      generateGraph();
      return;
    }

    await saveFormAndGraph(
      (id) => {
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  return (
    <CustomModal size="3xl" open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
      <form className="space-y-4" onSubmit={handleSave}>
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="title">
            Title
            <br />
            <span className="italic text-slate-500 text-sm font-normal">
              The title of the inquiry that is displayed to the user.
            </span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={handleInputChange('title')}
            className="border-2 border-slate-200 p-2 rounded-lg w-full"
          />
        </div>

        <TemplateSelection value={selectedTemplate} onChange={handleChangeGraphTemplate} />

        <AnimatePresence mode="sync">
          {selectedTemplate?.allowGeneration && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 250 }}
            >
              <input
                type="checkbox"
                id="generateGraph"
                checked={enableGraphGeneration}
                onChange={handleCheckboxChange}
                className="mr-2 h-5 w-5 text-blue-500 border-2 border-blue-500 rounded-md"
              />
              <label htmlFor="generateGraph" className="text-sm font-bold">
                Generate my graph
              </label>
            </motion.div>
          )}

          {selectedTemplate?.allowGeneration && enableGraphGeneration && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 250 }}
            >
              <label className="block text-sm font-bold mb-2" htmlFor="goals">
                Goals
                <br />
                <span className="italic text-slate-500 text-sm font-normal">
                  Not sure where to start? Enter some goals you want to achieve and we'll modify the graph to match your
                  goals.
                </span>
              </label>
              <input
                type="text"
                value={form.goals}
                onChange={handleInputChange('goals')}
                className="border-2 border-slate-200 p-2 rounded-lg w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-end items-center p-4 rounded-2xl">
          <div className="w-full ">
            <AnimatePresence mode="wait">
              {generatingGraph && (
                <motion.p
                  key={loadingQuote}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm italic text-gray-600"
                >
                  {loadingQuote}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button
            disabled={form.title === '' || generatingGraph || !selectedTemplate}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center disabled:opacity-50"
          >
            {id ? 'Save' : 'Create'} {generatingGraph && <FontAwesomeIcon icon={faSpinner} className="ml-2" spin />}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ModalUpsertInquiry;
