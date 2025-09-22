import ConfirmationModal from '@/components/modals/confirm-modal';
import ModalSendInquiry from '@/components/modals/inquiry/send-inquiry-modal';
import { useGraphContext } from '@/hooks/graph-state';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { formatGraph, validateGraph } from '@/utils/graphs/graph-utils';
import { faCog, faEllipsisV, faEye, faPaperPlane, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../controls/button';
import Input from '../controls/input';
import ModalValidationErrors from '../modals/inquiry/inquiry-validation-errors-modal';
import ModalSettingsInquiry from '../modals/inquiry/settings-inquiry-modal';

export default function GraphContextBar() {
  const { t } = useTranslation();
  
  // States
  const [clearGraphModal, setClearGraphModal] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [validationErrorsModalOpen, setValidationErrorsModalOpen] = useState(false);

  // Hooks
  const { id, settings, lastUpdated, setSettings, publishGraph } = useInquiryBuilder();
  const { graph, setGraph } = useGraphContext();
  const alert = useAddAlert();

  // Misc
  const previewLink = `${window.location.origin}/inquiry/${id}?preview=true`;

  /**
   * Handle formatting the graph.
   */
  const handleFormat = () => {
    setGraph(formatGraph(graph));
    alert('Graph formatted successfully!', 'success');
  };

  /**
   * Handles resetting the graph.
   */
  const handleReset = () => {
    setGraph({ nodes: [], edges: [] });
    alert('Graph cleared successfully!', 'success');
  };

  /**
   * Handles opening the appropriate modal to publish the inquiry or show validation errors
   * so that the user can fix them before publishing.
   */
  const handlePublish = () => {
    const validationResult = validateGraph(graph);

    if (validationResult.valid) {
      setSendModalOpen(true);
      publishGraph();
      alert('Inquiry published successfully!', 'success');
    } else {
      setValidationErrorsModalOpen(true);
      alert('Unable to publish inquiry due to validation errors!', 'error');
    }
  };

  return (
    <>
      <div className="flex space-x-4 justify-between items-start">
        <div className="w-full max-w-2xl">
          <Input
            name="title"
            value={settings.title ?? t('builder.untitledInquiry')}
            onChange={(e) => {
              setSettings({ ...settings, title: e.target.value });
            }}
            className="text-2xl font-bold border-2 border-slate-200 p-2 rounded-lg"
          />
          <p className="text-sm dark:text-slate-400 text-slate-600">
            Last updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="success" icon={faPaperPlane} onClick={handlePublish}>
            Publish
          </Button>
          <Button variant="primary" icon={faCog} onClick={handleFormat}>
            Format
          </Button>
          <Button variant="primary" icon={faEye} onClick={() => window.open(previewLink, '_blank')}>
            Preview
          </Button>
          <Button variant="secondary" icon={faRotateLeft} onClick={() => setClearGraphModal(true)}>
            Clear
          </Button>
          <Button variant="transparentSecondary" icon={faEllipsisV} onClick={() => setSettingsModalOpen(true)} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={clearGraphModal}
        onClose={() => setClearGraphModal(false)}
        onConfirm={() => {
          handleReset();
          setClearGraphModal(false);
        }}
        text="Are you sure you want to clear the graph? This action cannot be undone."
        confirmText={t('builder.clearGraph')}
      />

      <ModalSettingsInquiry
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSave={() => setSettingsModalOpen(false)}
      />

      <ModalSendInquiry open={sendModalOpen} onClose={() => setSendModalOpen(false)} />

      <ModalValidationErrors open={validationErrorsModalOpen} onClose={() => setValidationErrorsModalOpen(false)} />
    </>
  );
}
