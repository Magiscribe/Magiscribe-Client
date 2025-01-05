import CustomModal from '../modal';
import Button from '@/components/controls/button';

interface ModalConfirmDeleteOwnerProps {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function ModalConfirmDeleteOwner(props: ModalConfirmDeleteOwnerProps) {

  return (
    <CustomModal size="3xl" open={props.open} onClose={props.onClose} title={'Are you sure you want to remove the inquiry owner?'}>
     
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={props.onConfirmDelete}
              variant="inverseDanger"
            >
              Remove
            </Button>
            <Button
              type="button"
              onClick={props.onClose}
              variant="inverseDanger"
            >
              Cancel
            </Button>
          </div>
    </CustomModal>
  );
}