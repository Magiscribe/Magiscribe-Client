import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';

import CustomModal from '../modal';

interface ModalUpsertInquiryProps {
  open: boolean;

  onSave?: (id: string) => void;
  onClose: () => void;
}

export default function ModalUpsertInquiry({ open, onSave, onClose }: ModalUpsertInquiryProps) {
  // Hooks
  const { id, form, updateForm, saveForm } = useInquiryBuilder();
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
        alert('Inquiry saved successfully!', 'success');
        if (onSave) onSave(id as string);
      },
      () => {
        alert('Something went wrong!', 'error');
      },
    );
  };

  return (
    <>
      <CustomModal size={'3xl'} open={open} onClose={onClose} title={id ? 'Update Inquiry' : 'Create Inquiry'}>
        <form className="space-y-4">
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
              id="title"
              value={form.title}
              onChange={handleInputChange('title')}
              className="border-2 border-slate-200 p-2 rounded-lg w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="inputGoals">
              Goals
              <br />
              <span className="italic text-slate-500 text-sm font-normal">
                Describe the goals of the inquiry you want to generate
              </span>
            </label>
            <textarea
              id="goals"
              value={form.goals}
              onChange={handleInputChange('goals')}
              rows={2}
              className="border-2 border-slate-200 p-2 rounded-lg w-full"
            />
          </div>
        </form>
        <div className="flex justify-end p-4 rounded-2xl space-x-4">
          <button
            onClick={handleSave}
            disabled={form.title === ''}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center disabled:opacity-50"
          >
            {id ? 'Save' : 'Create'}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
