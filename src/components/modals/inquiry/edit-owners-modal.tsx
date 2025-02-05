import { GET_USERS_BY_EMAIL, GET_USERS_BY_ID } from '@/clients/queries';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { GetUsersByEmailQuery, GetUsersByIdQuery } from '@/graphql/graphql';
import { UserData } from '@/graphql/types';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery } from '@apollo/client';
import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmationModal from '../confirm-modal';
import CustomModal from '../modal';

interface ModalEditOwnersProps {
  open: boolean;
  isConfirmDeleteModalOpen: boolean;
  onDeleteOwner: () => void;
  onClose: () => void;
  onCloseConfirmDeleteOwnerModal: () => void;
}

const EMAIL_VALIDATION_ERRORS = {
  INVALID_EMAIL_INPUT_ERROR: 'Please enter a valid user email',
  DUPLICATE_USER_ERROR: 'The user you entered already has access to this inquiry.',
  EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR: 'No Magiscribe users with this email address were found.',
};

const REMOVE_SELF_FROM_INQUIRY_CONFIRMATION =
  'You are about to remove yourself from the owners list of this inquiry.  You will no longer have access to edit this inquiry.  Are you sure you want to continue?';

export function ModalEditOwners(props: ModalEditOwnersProps) {
  const navigate = useNavigate();
  // Get the current Clerk user
  const currentUser = useUser();
  const [ownerDetails, setOwnerDetails] = React.useState<UserData[]>([]);
  const [ownerEmailInput, setOwnerEmailInput] = React.useState<string>('');
  const [getUsersById] = useLazyQuery<GetUsersByIdQuery>(GET_USERS_BY_ID);
  const [getUsersByEmail] = useLazyQuery<GetUsersByEmailQuery>(GET_USERS_BY_EMAIL);
  const [ownerEmailInputError, setOwnerEmailInputError] = React.useState<string>('');
  const [ownerToDelete, setOwnerToDelete] = React.useState<UserData>();

  const { owners, updateOwners } = useInquiryBuilder();

  React.useEffect(() => {
    setOwnerEmailInputError('');
    if (ownerEmailInput) {
      if (!isValidEmailFormat(ownerEmailInput)) {
        setOwnerEmailInputError(EMAIL_VALIDATION_ERRORS.INVALID_EMAIL_INPUT_ERROR);
      } else if (isInputEmailInExistingOwners(ownerEmailInput, ownerDetails)) {
        setOwnerEmailInputError(EMAIL_VALIDATION_ERRORS.DUPLICATE_USER_ERROR);
      }
    }
  }, [ownerEmailInput, ownerDetails]);

  const onConfirmDelete = React.useCallback(() => {
    updateOwners(owners.filter((owner) => owner !== ownerToDelete?.id));
    if (currentUser?.user?.id === ownerToDelete?.id) {
      // Navigate to the dashboard page since the current user no longer has access to the inquiry.
      navigate('/dashboard');
    }
    setOwnerToDelete({ id: '', primaryEmailAddress: '' });
    props.onCloseConfirmDeleteOwnerModal();
  }, [ownerToDelete]);

  const onAddClick = React.useCallback(
    async (ownerEmailInput: string) => {
      const userDetails = await getUsersByEmail({
        variables: {
          userEmails: [ownerEmailInput],
        },
      });
      const userId = userDetails?.data?.getUsersByEmail?.shift()?.id;
      if (userId) {
        setOwnerEmailInputError('');
        updateOwners(owners.concat([userId]));
        setOwnerEmailInput('');
      } else {
        setOwnerEmailInputError(EMAIL_VALIDATION_ERRORS.EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR);
      }
    },
    [ownerDetails],
  );

  // Fetch the email corresponding to each graph owner to disply in the edit owners UI.
  React.useEffect(() => {
    if (owners?.length > 0) {
      (async () => {
        const graphOwnerDetails = await getUsersById({
          variables: {
            userIds: owners,
          },
        });
        setOwnerDetails(graphOwnerDetails?.data?.getUsersById as UserData[]);
      })();
    }
  }, [owners]);

  return (
    <>
      <CustomModal
        size="3xl"
        open={props.open}
        onClose={props.onClose}
        title={'Edit Owners'}
        buttons={
          <>
            <Button onClick={props.onClose} variant="primary" size="medium">
              Done
            </Button>
          </>
        }
      >
        <p className="mb-4">Owners have full access to this inquiry and can edit, delete, and share it.</p>
        {ownerDetails?.map((item, index) => {
          return (
            <div className="grid grid-cols-1" key={index}>
              <div className="w-full flex items-center space-x-2 mb-4">
                <Input name={item.primaryEmailAddress} value={item.primaryEmailAddress} disabled={true} />
                <Button
                  type="button"
                  onClick={() => {
                    setOwnerToDelete(item);
                    props.onDeleteOwner();
                  }}
                  variant="inverseDanger"
                  disabled={ownerDetails.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
        <hr className="my-4" />
        <div className="w-full flex items-center space-x-2 mb-4">
          <Input
            label="Add Owner"
            subLabel="Enter the email address of the user you would like to add as an owner"
            name="addOwner"
            placeholder="Your name"
            value={ownerEmailInput}
            onChange={(e) => {
              setOwnerEmailInput(e.target.value);
            }}
            error={ownerEmailInputError}
          />
          <Button
            type="button"
            onClick={() => onAddClick(ownerEmailInput)}
            disabled={!!ownerEmailInputError}
            className="mt-14"
          >
            Add
          </Button>
        </div>
      </CustomModal>
      <ConfirmationModal
        isOpen={props.isConfirmDeleteModalOpen}
        onClose={props.onCloseConfirmDeleteOwnerModal}
        onConfirm={onConfirmDelete}
        text={
          currentUser?.user?.id === ownerToDelete?.id
            ? REMOVE_SELF_FROM_INQUIRY_CONFIRMATION
            : `Are you sure you want to remove the inquiry owner with email ${ownerToDelete?.primaryEmailAddress}?`
        }
      />
    </>
  );
}

// Validate the input email format and verify that the input email does not correspond to an existing owner.
function isInputEmailInExistingOwners(ownerEmailInput: string, existingOwners: UserData[]) {
  return existingOwners.find((ownerData) => ownerData.primaryEmailAddress === ownerEmailInput);
}

function isValidEmailFormat(ownerEmailInput: string) {
  return !!ownerEmailInput && ownerEmailInput.includes('@') && ownerEmailInput.includes('.');
}
