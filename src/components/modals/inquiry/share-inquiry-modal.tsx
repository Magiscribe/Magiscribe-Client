import React from 'react';
import CustomModal from '../modal';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { EmailValidationErrors, useValidateEmailListInput } from '@/components/graph/utils/email-validation';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useMutation } from '@apollo/client';
import { EMAIL_INQUIRY_TO_USERS } from '@/clients/mutations';
import { UserDataInput } from '@/graphql/types';

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
  const { updateMetadata, metadata } = useInquiryBuilder();
  const { emailInput, setEmailInput, emailInputError } = useValidateEmailListInput(
    metadata.inviteList?.map((user) => user.primaryEmailAddress),
    SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS,
  );
  const [emailInquiryToUsers] = useMutation<string>(EMAIL_INQUIRY_TO_USERS);
  const { id } = useInquiryBuilder();

  const sendInviteEmails = React.useCallback(() => {
    (async () => {
      // Only email users that weren't already contacted
      const usersToEmail = metadata.inviteList.filter(user => !user.lastContacted);
      const emailsContacted = usersToEmail.map(users => users.primaryEmailAddress);
      const result = await emailInquiryToUsers({
        variables: {
          userData: usersToEmail,
          inquiryId: id,
        },
      });
      updateMetadata({
        ...metadata,
        inviteList: metadata.inviteList.map(user => {
          const isUserContacted = emailsContacted.find(email => email === user.primaryEmailAddress);
          if (!isUserContacted) {
            return user;
          } else {
            const userWithLastContactedTime: UserDataInput = {
              ...user,
              lastContacted: new Date().toUTCString()
            }
            return userWithLastContactedTime
          }
        } ),
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
              <Input label = "Email " name={item.primaryEmailAddress} value={item.primaryEmailAddress} disabled={true} />
              <Input label = "Name " name={item.firstName ?? ''} value={item.firstName ?? ''} disabled={true} />
              <Input label='Last Contacted' name={item.lastContacted ?? 'NA'} value={item.lastContacted ?? 'NA'} disabled={true} />
              <Button
                type="button"
                style={{ margin: '30px 0px 0px 10px' }}
                onClick={() => {
                  updateMetadata({
                    ...metadata,
                    inviteList: metadata.inviteList.filter((user) => user.primaryEmailAddress !== item.primaryEmailAddress),
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
