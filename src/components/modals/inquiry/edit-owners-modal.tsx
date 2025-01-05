import { GET_USERS_BY_EMAIL, GET_USERS_BY_ID } from '@/clients/queries';
import { GetUsersByEmailQuery, GetUsersByIdQuery } from '@/graphql/graphql';
import { UserData } from '@/graphql/types';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery } from '@apollo/client';
import React from 'react';
import CustomModal from '../modal';
import Textarea from '@/components/controls/textarea';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { ModalConfirmDeleteOwner } from './confirm-delete-owner-modal';

interface ModalEditOwnersProps {
  open: boolean;
  onClose: () => void;
}

const INVALID_EMAIL_INPUT_ERROR = 'Please enter a valid user email';
const EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR = 'No Magiscribe users with this email address were found.';

export function ModalEditOwners(props: ModalEditOwnersProps) {
  const { owners, updateOwners } = useInquiryBuilder();
  const [ownerDetails, setOwnerDetails] = React.useState<UserData[]>([]);
  const [ownerEmailInput, setOwnerEmailInput] = React.useState<string>('');
  const [getUsersById] = useLazyQuery<GetUsersByIdQuery>(GET_USERS_BY_ID);
  const [getUsersByEmail] = useLazyQuery<GetUsersByEmailQuery>(GET_USERS_BY_EMAIL);
  const [ownerEmailInputError, setOwnerEmailInputError] = React.useState<string>('');

  const [isConfirmDeleteOwnerModalOpen, setIsConfirmDeleteOwnerModalOpen] = React.useState<boolean>(false);
  const [ownerToDelete, setOwnerToDelete] = React.useState<string>('');

  React.useEffect(() => {
    if (ownerEmailInput && !isValidOwnerEmailInput(ownerEmailInput, ownerDetails)) {
      setOwnerEmailInputError(INVALID_EMAIL_INPUT_ERROR);
    } else {
      setOwnerEmailInputError('');
    }
  }, [ownerEmailInput]);

  const onConfirmDelete = React.useCallback(() => {
    updateOwners(owners.filter((owner) => owner !== ownerToDelete));
    setOwnerToDelete('');
    setIsConfirmDeleteOwnerModalOpen(false);
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
      } else {
        setOwnerEmailInputError(EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR);
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

  /*
    TODO:
    1. Don't allow deleting the current user or the original graph owner
    2. Confirmation before deleting user?
    3. Migration script; Is this needed?
    4. Send an invite if user isn't already in magiscribe
  */
  return (
    <div>
      <CustomModal size="3xl" open={props.open} onClose={props.onClose} title={'Edit owners'}>
        {ownerDetails?.map((item, index) => {
          return (
            <div className="flex items-center space-x-2">
              <Textarea
                name={`graphOwner_${index}`}
                value={item.primaryEmailAddress}
                disabled={true}
                className="w-full mb-2 p-1 border rounded-lg no-drag"
                rows={1}
              />
              <Button
                type="button"
                onClick={() => {
                  setOwnerToDelete(item.id);
                  setIsConfirmDeleteOwnerModalOpen(true);
                }}
                variant="inverseDanger"
                disabled={ownerDetails.length === 1}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <div>
          <Input
            label="Add Owner"
            name="addOwner"
            placeholder="Your name"
            value={ownerEmailInput}
            onChange={(e) => {
              setOwnerEmailInput(e.target.value);
            }}
            error={ownerEmailInputError}
          />
          <Button type="button" onClick={() => onAddClick(ownerEmailInput)} className="mt-4 w-full">
            Add
          </Button>
        </div>
      </CustomModal>
      <ModalConfirmDeleteOwner
        onConfirmDelete={onConfirmDelete}
        onClose={() => {
          setIsConfirmDeleteOwnerModalOpen(false);
        }}
        open={isConfirmDeleteOwnerModalOpen}
      />
    </div>
  );
}

// Validate the input email format and verify that the input email does not correspond to an existing owner.
function isValidOwnerEmailInput(ownerEmailInput: string, existingOwners: UserData[]) {
  const ownerAlreadyInList = existingOwners.find((ownerData) => ownerData.primaryEmailAddress === ownerEmailInput);
  return (
    ownerEmailInput !== '' && ownerEmailInput.includes('@') && ownerEmailInput.includes('.') && !ownerAlreadyInList
  );
}
