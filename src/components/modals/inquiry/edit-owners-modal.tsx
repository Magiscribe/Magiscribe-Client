import { GET_USERS_BY_EMAIL, GET_USERS_BY_ID } from '@/clients/queries';
import { GetUsersByEmailQuery, GetUsersByIdQuery } from '@/graphql/graphql';
import { UserData } from '@/graphql/types';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '../modal';
import Textarea from '@/components/controls/textarea';
import Button from '@/components/controls/button';
import { isNonEmptyArray } from '@apollo/client/utilities';

interface ModalEditOwnersProps {
  open: boolean;
  onClose: () => void;
}

const DEBOUNCE_DELAY_IN_MS = 1000;

export function ModalEditOwners(props: ModalEditOwnersProps) {
  // Get current list of graph user ids and fetch the corresponding name / email
  const { owners, updateOwners } = useInquiryBuilder();
  const [ownerDetails, setOwnerDetails] = React.useState<UserData[]>([]);
  const [ownerEmailInput, setOwnerEmailInput] = React.useState<string>('');
  // Stores the Clerk user id corresponding to the user-supplied email, if an account is associated with the email.
  const [ownerIdInput, setOwnerIdInput] = React.useState<string>('');
  const saveDebounce = useRef<NodeJS.Timeout>();
  // Call use query to fetch the user objects corresponding to the owners
  const [getUsersById] = useLazyQuery<GetUsersByIdQuery>(GET_USERS_BY_ID);
  const [getUsersByEmail] = useLazyQuery<GetUsersByEmailQuery>(GET_USERS_BY_EMAIL);
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

  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      // Check if an account is associated with the user-supplied email.
      const ownerAlreadyInList = ownerDetails.find(ownerData => ownerData.primaryEmailAddress === ownerEmailInput);
      if (ownerEmailInput !== '' && ownerEmailInput.includes('@') && ownerEmailInput.includes('.') && !ownerAlreadyInList) {   
        (async () => {
          const graphOwnerDetails = await getUsersByEmail({
            variables: {
              userEmails: [ownerEmailInput],
            },
          });
          setOwnerIdInput(graphOwnerDetails?.data?.getUsersByEmail?.shift()?.id ?? '');
        })();
      }
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [ownerEmailInput]);

  /*
    TODO:
    3. fix styling
    5. Don't allow deleting current user?
    6. Confirmation before deleting user?
    7. Migration script; Is this needed?
  */
  return (
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
            {ownerDetails.length > 1 && (
              <Button
                type="button"
                onClick={() => updateOwners(owners.filter((owner) => owner !== item.id))}
                variant="inverseDanger"
              >
                Remove
              </Button>
            )}
          </div>
        );
      })}
      <div className="flex items-center space-x-2">
        <Textarea
          name={`addOwner`}
          value={ownerEmailInput}
          onChange={(e) => {
            setOwnerEmailInput(e.target.value);
          }}
          className="w-full mb-2 p-1 border rounded-lg no-drag"
          rows={1}
        />
        <Button type="button" onClick={() => updateOwners(owners.concat([ownerIdInput]))} disabled={!ownerIdInput.length}>
          Add
        </Button>
      </div>
    </CustomModal>
  );
}
