import { GET_ALL_AUDIO_VOICES, GET_TEMPLATES } from '@/clients/queries';
import GenericDisclosure from '@/components/controls/disclosure';
import GenericRadioGroup from '@/components/controls/radio-button';
import Select from '@/components/controls/select';
import { GetAllAudioVoicesQuery, GetInquiryTemplatesQuery } from '@/graphql/graphql';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { VOICE_LINE_SAMPLES } from '@/utils/audio/voice-line-samples';
import { useQuery } from '@apollo/client/react';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Edge, Node } from '@xyflow/react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../controls/button';
import Input from '../../controls/input';
import Textarea from '../../controls/textarea';
import CustomModal from '../modal';

interface Template {
  name: string;
  description: string;
  allowGeneration: boolean;
  graph?: { nodes: Node[]; edges: Edge[] };
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
  const { t } = useTranslation();
  const {
    id,
    settings,
    setSettings,
    generateGraph,
    setGraph,
    onGraphGenerationCompleted,
    saveSettingsAndGraph,
    generatingGraph,
  } = useInquiryBuilder();
  const alert = useAddAlert();

  // Templates Hook
  const { data: templates } = useQuery<GetInquiryTemplatesQuery>(GET_TEMPLATES);

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
      const { type, checked, value } = e.target as HTMLInputElement;
      const inputValue = type === 'checkbox' ? checked : value;
      setSettings({ ...settings, [field]: inputValue });
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
      alert(t('components.createInquiryModal.goalsRequired'), 'error');
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
        alert(t('components.createInquiryModal.inquirySaved'), 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert(t('components.createInquiryModal.somethingWrong'), 'error');
      },
    );
  };

  /*================================ RENDER ==============================*/

  /**
   * Render the advanced settings section of the modal.
   */
  const renderAdvancedSettings = () => (
    <GenericDisclosure title={t('components.createInquiryModal.advancedSettings')} className="mt-4">
      <div className="space-y-4">
        <GenericRadioGroup<Template>
          label={t('components.createInquiryModal.graphTemplate')}
          subLabel={t('components.createInquiryModal.graphTemplateSubtitle')}
          options={(templates?.getInquiryTemplates ?? []).map((template) => ({ ...template, value: template }))}
          value={selectedTemplate}
          onChange={setSelectedTemplate}
          clearable
        />

        <div className="space-y-2">
          <Select
            name="voice"
            label={t('common.labels.voice')}
            subLabel={t('components.createInquiryModal.voiceSubtitle')}
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
              {t('components.createInquiryModal.previewVoice')}
            </Button>
          </div>
        </div>
      </div>
    </GenericDisclosure>
  );

  return (
    <CustomModal
      size="5xl"
      open={open}
      onClose={onClose}
      title={id ? t('components.createInquiryModal.updateTitle') : t('components.createInquiryModal.title')}
    >
      <form className="space-y-4" onSubmit={handleSave}>
        <Input
          name="title"
          label={t('common.labels.title')}
          placeholder={t('common.forms.placeholders.inquiryTitle')}
          autoFocus
          subLabel={t('components.createInquiryModal.titleSubtitle')}
          value={settings.title}
          onChange={handleInputChange('title')}
        />

        <Textarea
          name="goals"
          label={t('components.createInquiryModal.goals')}
          subLabel={t('components.createInquiryModal.goalsSubtitle')}
          value={settings.goals}
          onChange={handleInputChange('goals')}
          onKeyDown={handleInputKeyDown}
        />

        <Input
          name="email"
          label={t('components.createInquiryModal.receiveEmailOnResponse')}
          type="checkbox"
          subLabel={t('components.createInquiryModal.receiveEmailSubtitle')}
          value={String(settings.notifications?.recieveEmailOnResponse)}
          onChange={(e) => {
            setSettings({ ...settings, notifications: { recieveEmailOnResponse: e.target.checked } });
          }}
        />

        <Textarea
          name="globalContext"
          label={t('components.createInquiryModal.context')}
          subLabel={t('components.createInquiryModal.contextSubtitle')}
          value={settings.context ?? ''}
          onChange={handleInputChange('context')}
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
            {t('common.buttons.cancel')}
          </Button>
          <Button disabled={generatingGraph} onClick={handleSave} variant="primary" size="medium" className="ml-2">
            {id ? t('common.buttons.save') : t('common.buttons.create')}{' '}
            {generatingGraph && <FontAwesomeIcon icon={faSpinner} className="ml-2" spin />}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
