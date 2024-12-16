import templates, { Template } from '@/assets/templates';
import { GET_ALL_AUDIO_VOICES } from '@/clients/queries';
import GenericDisclosure from '@/components/controls/disclosure';
import GenericRadioGroup from '@/components/controls/radio-button';
import Select from '@/components/controls/select';
import { GetAllAudioVoicesQuery } from '@/graphql/graphql';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { VOICE_LINE_SAMPLES } from '@/utils/audio/voice-line-samples';
import { useQuery } from '@apollo/client';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import Button from '../../controls/button';
import Input from '../../controls/input';
import Textarea from '../../controls/textarea';
import CustomModal from '../modal';

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

interface ModalUpsertInquiryProps {
  open: boolean;
  onSave?: (id: string) => void;
  onClose: () => void;
}

/**
 * ModalUpsertInquiry component for creating or updating inquiries
 */
export default function CreateInquiryModal({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>();
  const [loadingQuote, setLoadingQuote] = useState(conversationGraphLoadingQuotes[0]);

  // Hooks
  const { id, settings, setSettings, generateGraph, setGraph, onGraphGenerationCompleted, saveSettingsAndGraph, generatingGraph } =
    useInquiryBuilder();
  const alert = useAddAlert();

  // Voice Hooks
  const { data: voices } = useQuery<GetAllAudioVoicesQuery>(GET_ALL_AUDIO_VOICES);
  const { addSentence, isLoading: isVoicePreviewLoading } = useElevenLabsAudio(settings.voice!);

  /*================================ SIDE EFFECTS ==============================*/

  useEffect(() => {
    if (selectedTemplate) {
      setGraph(selectedTemplate.graph ?? { nodes: [], edges: [] });
    }
  }, [selectedTemplate]);

  /**
   * Randomly change the loading quote every 3 seconds while generating the graph.
   */
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
   * Sets the default voice once the voices are loaded.
   */
  useEffect(() => {
    if (voices) {
      if (!settings.voice) {
        setSettings({ ...settings, voice: voices.getAllAudioVoices[0].id });
      }
    }
  }, [voices, settings, setSettings]);

  /**
   * Save the settings and graph once the graph generation is completed
   */
  useEffect(() => {
    if (open) {
      onGraphGenerationCompleted?.(async () => {
        alert('Graph generated successfully!', 'success');
        await saveSettingsAndGraph(
          (id) => {
            alert('Inquiry saved successfully!', 'success');
            if (onSave) onSave(id as string);
          },
          () => {
            alert('Something went wrong!', 'error');
          },
        );
      });
    }
  }, [open, onGraphGenerationCompleted, saveSettingsAndGraph, alert, onSave]);

  /*================================ EVENT HANDLERS ==============================*/

  /**
   * Handle input change for the settings
   * @param field - The field to update
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setSettings({ ...settings, [field]: e.target.value });
    };

  /**
   * Handle input key down for the settings
   * @param e
   */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    }
  };

  /**
   * Handle select change for the settings
   * @param field - The field to update
   * @param e - The change event
   * @returns void
   */
  const handleSelectChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      setSettings({ ...settings, [field]: e.target.value });
    };

  /**
   * Handle previewing the voice with a few random sentences.
   */
  const handlePreviewVoice = () => {
    addSentence(VOICE_LINE_SAMPLES[Math.floor(Math.random() * VOICE_LINE_SAMPLES.length)]);
  };

  /**
   * Handle saving the inquiry
   */
  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (settings.goals.trim() === '' && !(selectedTemplate && !selectedTemplate?.allowGeneration)) {
      alert('Please enter some goals for the inquiry', 'error');
      return;
    }

    if (selectedTemplate && selectedTemplate?.allowGeneration) {
      generateGraph(true, settings.goals);
      return;
    } else if (!selectedTemplate) {
      generateGraph(false, settings.goals);
      return;
    }

    await saveSettingsAndGraph(
      (id) => {
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  /*================================ RENDER ==============================*/

  /**
   * Render the advanced settings section of the modal.
   */
  const renderAdvancedSettings = () => (
    <GenericDisclosure title="Advanced Settings" className="mt-4">
      <div className="space-y-4">
        <GenericRadioGroup<Template>
          label="Graph Template"
          subLabel="Select a template to generate a conversation graph"
          options={templates.map((template) => ({ ...template, value: template }))}
          value={selectedTemplate}
          onChange={setSelectedTemplate}
          clearable
        />

        <div className="space-y-2">
          <Select
            name="voice"
            label="Voice"
            subLabel="This will be the voice used to read responses to the user if they have audio enabled"
            value={settings.voice ?? ''}
            onChange={handleSelectChange('voice')}
            options={
              voices?.getAllAudioVoices.map((voice) => ({
                value: voice.id,
                label: `${voice.name} (${voice.tags.join(', ')})`,
              })) ?? []
            }
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="small"
              icon={isVoicePreviewLoading ? faSpinner : faPlay}
              iconSpin={isVoicePreviewLoading}
              onClick={handlePreviewVoice}
            >
              Preview Voice
            </Button>
          </div>
        </div>
      </div>
    </GenericDisclosure>
  );

  return (
    <CustomModal size="5xl" open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
      <form className="space-y-4" onSubmit={handleSave}>
        <Input
          name="title"
          label="Title"
          placeholder="Inquiry title"
          autoFocus
          subLabel="This will be displayed to the people you are sending the inquiry to"
          value={settings.title}
          onChange={handleInputChange('title')}
        />

        <Textarea
          name="goals"
          label="Goals"
          subLabel="Who are you trying to gain insights from and what type of information are you looking to capture?"
          value={settings.goals}
          onChange={handleInputChange('goals')}
          onKeyDown={handleInputKeyDown}
        />

        <hr className="border-t border-slate-200 dark:border-slate-600" />

        {renderAdvancedSettings()}

        <div className="flex justify-end items-center rounded-2xl">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {generatingGraph && (
                <motion.p
                  key={loadingQuote}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm italic text-slate-500"
                >
                  {loadingQuote}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <Button type="button" onClick={onClose} variant="transparentPrimary" size="medium" className="ml-2">
            Cancel
          </Button>
          <Button disabled={generatingGraph} onClick={handleSave} variant="primary" size="medium" className="ml-2">
            {id ? 'Save' : 'Create'} {generatingGraph && <FontAwesomeIcon icon={faSpinner} className="ml-2" spin />}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
