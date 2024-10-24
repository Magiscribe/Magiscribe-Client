import ConfirmationModal from '@/components/modals/confirm-modal';
import ModalSendInquiry from '@/components/modals/inquiry/send-inquiry-modal';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { formatGraph, validateGraph } from '@/utils/graphs/graph-utils';
import { faCheckCircle, faCog, faEllipsisV, faEye, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import Button from '../controls/button';
import ModalValidationErrors from '../modals/inquiry/inquiry-validation-errors-modal';
import ModalSettingsInquiry from '../modals/inquiry/settings-inquiry-modal';
import Input from '../controls/input';

export default function GraphContextBar() {
  // States
  const [clearGraphModal, setClearGraphModal] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [validationErrorsModalOpen, setValidationErrorsModalOpen] = useState(false);

  // Hooks
  const { id, form, graph, lastUpdated, updateForm, updateGraph, resetGraph, publishGraph } = useInquiryBuilder();
  const alert = useAddAlert();

  // Misc
  const previewLink = `${window.location.origin}/inquiry/${id}?preview=true`;

  /**
   * Handle formatting the graph.
   */
  const handleFormat = () => {
    updateGraph(formatGraph(graph));
    alert('Graph formatted successfully!', 'success');
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
      <div className="flex justify-between items-start">
        <div>
          <Input
          name='title'
            value={form.title}
            onChange={(e) => {
              updateForm({ ...form, title: e.target.value });
            }}
            className="text-2xl font-bold w-full border-2 border-slate-200 p-2 rounded-lg"
          />
          <p className="text-sm dark:text-slate-400 text-slate-600">
            Last updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="success" iconLeft={faCheckCircle} onClick={handlePublish}>
            Publish
          </Button>
          <Button variant="primary" iconLeft={faCog} onClick={handleFormat}>
            Format
          </Button>
          <Button variant="primary" iconLeft={faEye} onClick={() => window.open(previewLink, '_blank')}>
            Preview
          </Button>
          <Button variant="secondary" iconLeft={faRotateLeft} onClick={() => setClearGraphModal(true)}>
            Clear
          </Button>
          <Button variant="transparentSecondary" iconLeft={faEllipsisV} onClick={() => setSettingsModalOpen(true)} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={clearGraphModal}
        onClose={() => setClearGraphModal(false)}
        onConfirm={() => {
          resetGraph();
          setClearGraphModal(false);
          alert('Graph cleared successfully!', 'success');
        }}
        text="Are you sure you want to clear the graph? This action cannot be undone."
        confirmText="Clear Graph"
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
