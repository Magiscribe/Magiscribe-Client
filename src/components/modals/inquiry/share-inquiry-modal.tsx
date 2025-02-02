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
  const [contactedUsers, setContactedUsers] = React.useState<UserDataInput[]>([]);
  const [nameInput, setNameInput] = React.useState<string>('');
  const { emailInput, setEmailInput, emailInputError } = useValidateEmailListInput(
    contactedUsers?.map((user) => user.primaryEmailAddress),
    SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS,
  );
  const [emailInquiryToUsers] = useMutation<string>(EMAIL_INQUIRY_TO_USERS);
  const { id } = useInquiryBuilder();

  // When adding a user, add email to inqiry metadata.  Then fetch user details.  For existing emails in metadata, check if user responded to inquiry
  // Bulk fetch user details for previous users who were invited (will use user ids to check user response status).
  // include date email was sent

  const sendInviteEmails = React.useCallback(() => {
    (async () => {
      const result = await emailInquiryToUsers({
        variables: {
          userData: contactedUsers,
          inquiryId: id,
        },
      });
    })();
  }, [contactedUsers]);

  const onAddClick = React.useCallback(
    (email: string, name: string) => {
      const userDataInput: UserDataInput = { primaryEmailAddress: email, firstName: name };
      setContactedUsers(contactedUsers.concat(userDataInput));
      setEmailInput('');
      setNameInput('');
    },
    [contactedUsers],
  );

  return (
    <CustomModal
      size="3xl"
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
            disabled={!contactedUsers?.length}
          >
            Email inquiry to contact list
          </Button>
          <Button onClick={props.onClose} variant="primary" size="medium">
            Done
          </Button>
        </>
      }
    >
      {contactedUsers?.map((item, index) => {
        return (
          <div className="grid grid-cols-1" key={index}>
            <div className="w-full flex items-center space-x-2 mb-4">
              <Input name={item.primaryEmailAddress} value={item.primaryEmailAddress} disabled={true} />
              <Input name={item.firstName ?? ''} value={item.firstName ?? ''} disabled={true} />
              <Button
                type="button"
                onClick={() => {
                  setContactedUsers(contactedUsers.filter((user) => user !== item));
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
