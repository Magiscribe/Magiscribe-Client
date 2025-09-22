import { EMAIL_INQUIRY_TO_USERS } from '@/clients/mutations';
import { CHECK_IF_USERS_RESPONDED_TO_INQUIRY } from '@/clients/queries';
import Button from '@/components/controls/button';
import DataWithLabel from '@/components/controls/dataWithLabel';
import Input from '@/components/controls/input';
import { EmailValidationErrors, useValidateEmailListInput } from '@/components/graph/utils/email-validation';
import { CheckIfUsersRespondedToInquiryQuery } from '@/graphql/graphql';
import { UserDataInput } from '@/graphql/types';
import {} from '@/graphql/types';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import dayjs from 'dayjs';
import React from 'react';

import CustomModal from '../modal';

interface ModalShareInqiryProps {
  open: boolean;
  onClose: () => void;
}

export const SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS: EmailValidationErrors = {
  INVALID_EMAIL_INPUT_ERROR: 'Please enter a valid user email',
  DUPLICATE_USER_ERROR: 'This email is already added to the contact list',
  EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR: 'INVALID_MAGISCRIBE_USER',
};

export function ModalShareInquiry(props: ModalShareInqiryProps) {
  const [nameInput, setNameInput] = React.useState<string>('');
  const { updateMetadata, metadata, id } = useInquiryBuilder();
  const [inquiryRespondentEmails, setInquiryRespondentEmails] = React.useState<string[]>([]);
  const [checkIfUsersRespondedToInquiry] = useLazyQuery<CheckIfUsersRespondedToInquiryQuery>(
    CHECK_IF_USERS_RESPONDED_TO_INQUIRY,
  );

  const invitedEmails = React.useMemo(() => {
    return metadata.inviteList?.map((user) => user.primaryEmailAddress);
  }, [metadata.inviteList]);
  const { emailInput, setEmailInput, emailInputError } = useValidateEmailListInput(
    invitedEmails,
    SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS,
  );
  const [emailInquiryToUsers] = useMutation<string>(EMAIL_INQUIRY_TO_USERS);

  // Check if any users invited to take the inquiry responded.
  React.useEffect(() => {
    (async () => {
      const inquiryRespondentResults = await checkIfUsersRespondedToInquiry({
        variables: {
          userEmails: invitedEmails,
          inquiryId: id,
        },
      });
      setInquiryRespondentEmails(inquiryRespondentResults?.data?.checkIfUsersRespondedToInquiry as string[]);
    })();
  }, [invitedEmails, id]);

  const sendInviteEmails = React.useCallback(() => {
    (async () => {
      // Only email users that weren't already contacted
      const usersToEmail = metadata.inviteList.filter((user) => !user.lastContacted);
      const emailsContacted = usersToEmail.map((users) => users.primaryEmailAddress);
      await emailInquiryToUsers({
        variables: {
          userData: usersToEmail,
          inquiryId: id,
        },
      });
      updateMetadata({
        ...metadata,
        inviteList: metadata.inviteList.map((user) => {
          const isUserContacted = emailsContacted.find((email) => email === user.primaryEmailAddress);
          if (!isUserContacted) {
            return user;
          } else {
            const userWithLastContactedTime: UserDataInput = {
              ...user,
              lastContacted: new Date().toUTCString(),
            };
            return userWithLastContactedTime;
          }
        }),
      });
    })();
  }, [metadata.inviteList]);

  const onAddClick = React.useCallback(
    (email: string, name: string) => {
      const userDataInput: UserDataInput = { primaryEmailAddress: email, firstName: name };
      updateMetadata({
        ...metadata,
        inviteList: metadata.inviteList.concat(userDataInput),
      });
      setEmailInput('');
      setNameInput('');
    },
    [metadata.inviteList],
  );

  return (
    <CustomModal
      size="5xl"
      open={props.open}
      onClose={props.onClose}
      title={'Share Inquiry'}
      buttons={
        <>
          <Button
            onClick={sendInviteEmails}
            variant="primary"
            size="medium"
            style={{ margin: '0px 20px 0px 0px' }}
            disabled={!metadata.inviteList?.length}
          >
            Email inquiry to contact list
          </Button>
          <Button onClick={props.onClose} variant="primary" size="medium">
            Done
          </Button>
        </>
      }
    >
      {metadata.inviteList?.map((item, index) => {
        return (
          <div className="grid grid-cols-1" key={index}>
            <div className="w-full flex items-center space-x-2 mb-4">
              <Input label="Email " name={item.primaryEmailAddress} value={item.primaryEmailAddress} disabled={true} />
              <Input label="Name " name={item.firstName ?? ''} value={item.firstName ?? ''} disabled={true} />
              <DataWithLabel
                label="Last Contacted"
                name={item.lastContacted ?? 'NA'}
                value={item.lastContacted ? dayjs(item.lastContacted).format('YYYY-MM-DD HH:mm:ss') : 'NA'}
                disabled={true}
              />
              <DataWithLabel
                label="Responded to inquiry"
                name={item.primaryEmailAddress}
                value={!!inquiryRespondentEmails?.find((email) => email === item.primaryEmailAddress) ? 'Yes' : 'No'}
                disabled={true}
              />
              <Button
                type="button"
                style={{ margin: '30px 0px 0px 10px' }}
                onClick={() => {
                  updateMetadata({
                    ...metadata,
                    inviteList: metadata.inviteList.filter(
                      (user) => user.primaryEmailAddress !== item.primaryEmailAddress,
                    ),
                  });
                }}
                variant="inverseDanger"
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <div className="w-full flex items-center space-x-2 mb-4">
        <Input
          name="addUser"
          placeholder="Email to send inquiry to"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
          }}
          error={emailInputError}
        />
        <Input
          name="addOwner"
          placeholder="Name of inquiry recipient"
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value);
          }}
        />
        <Button
          type="button"
          onClick={() => onAddClick(emailInput, nameInput)}
          disabled={!!emailInputError || !nameInput || !emailInput}
        >
          Add
        </Button>
      </div>
    </CustomModal>
  );
}
