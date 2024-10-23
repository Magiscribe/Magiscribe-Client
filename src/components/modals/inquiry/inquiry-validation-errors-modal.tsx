import Button from '@/components/controls/button';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { validateGraph } from '@/utils/graphs/graph-utils';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import CustomModal from '../modal';

interface ValidationErrorsProps {
  /**
   * Whether the modal is open or not.
   */
  open: boolean;

  /**
   * A callback triggered when the modal requests to be closed.
   * @returns {void} Does not return anything.
   */
  onClose: () => void;
}

/**
 * A component to display validation errors and provide an auto-fix option.
 */
export default function ModalValidationErrors({ open, onClose }: ValidationErrorsProps) {
  // States
  const [errors, setErrors] = useState<string[]>([]);

  // Hooks
  const { graph, generateGraph } = useInquiryBuilder();

  useEffect(() => {
    if (open) {
      const { errors } = validateGraph(graph);
      setErrors(errors);
    }
  }, [open, graph]);

  const handleAutoFix = () => {
    onClose();
    generateGraph(false, `I would like to fix the following errors in my graph: \n- ${errors.join('\n- ')}`);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Invalid Inquiry Graph" size="4xl">
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Please address the following errors before publishing:
        </h3>
        <ul className="list-disc list-inside">
          {errors.map((error, index) => (
            <li key={index} className="text-red-600">
              {error}
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <Button onClick={handleAutoFix} variant="primary" iconLeft={faMagicWandSparkles}>
            Automagically Fix
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
