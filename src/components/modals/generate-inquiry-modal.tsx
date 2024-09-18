import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import CustomModal from '../modal';

interface ModalUpsertInquiryProps {
  /**
   * Whether the modal is open or not.
   */
  open: boolean;

  /**
   * A callback triggered when the inquiry is saved.
   * @param id {string} The ID of the inquiry that was saved.
   * @returns {void} Does not return anything.
   */
  onSave?: (id: string) => void;

  /**
   * A callback triggered when the inquiry is deleted.
   * @returns {void} Does not return anything.
   */
  onClose: () => void;
}

export default function ModalGenerateInquiryGraph({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  // Hooks
  const { form, updateForm, saveForm, generateGraph } = useInquiryBuilder();
  const alert = useAddAlert();

  /**
   * Handle input change for the form.
   * @param field {string} The field to update.
   * @returns {void} Does not return anything.
   */
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      updateForm({ ...form, [field]: e.target.value });
    };

  /**
   * Handle saving the inquiry and shows a success or error alert.
   */
  const handleSave = async () => {
    await saveForm(
      (id) => {
        alert('Started graph generation!', 'info');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
    generateGraph();
  };

  return (
    <CustomModal size={'3xl'} open={open} onClose={onClose} title="Generate Inquiry Graph">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
            Describe the goals of the inquiry you want to generate
          </label>
          <textarea
            id="inputGoals"
            value={form.inputGoals}
            onChange={handleInputChange('inputGoals')}
            rows={3}
            className="border-2 border-gray-200 p-2 rounded-lg w-full"
          />
        </div>
      </form>
      <div className="flex justify-end p-4 rounded-2xl space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
        >
          Start Graph Generation
        </button>
      </div>
    </CustomModal>
  );
}
