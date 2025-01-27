import React from 'react';
import CustomModal from '../modal';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import { EmailValidationErrors, useValidateEmailListInput } from '@/components/graph/utils/email-validation';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { useMutation } from '@apollo/client';
import { EMAIL_INQUIRY_TO_USERS } from '@/clients/mutations';

interface ModalShareInqiryProps {
  open: boolean;
  onClose: () => void;
}

export const SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS: EmailValidationErrors = {
  INVALID_EMAIL_INPUT_ERROR: 'Please enter a valid user email',
  DUPLICATE_USER_ERROR: 'An inquiry invite was already sent to this email',
  EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR: 'INVALID_MAGISCRIBE_USER',
};

export function ModalShareInquiry(props: ModalShareInqiryProps) {
  const [contactedUsers, setContactedUsers] = React.useState<string[]>([]);
  const { emailInput, setEmailInput, emailInputError, setEmailInputError } = useValidateEmailListInput(
    contactedUsers,
    SHARE_INQUIRY_MODAL_EMAIL_VALIDATION_ERRORS,
  );
  const [emailInquiryToUsers] = useMutation<string>(EMAIL_INQUIRY_TO_USERS);
  const { id } = useInquiryBuilder();

  // When adding a user, add email to inqiry metadata.  Then fetch user details.  For existing emails in metadata, check if user responded to inquiry
  // Bulk fetch user details for previous users who were invited (will use user ids to check user response status).
  // include date email was sent

  const onAddClick = React.useCallback(
    (email: string) => {
      // Send welcome email to user
      (async () => {
        const result = await emailInquiryToUsers({
          variables: {
            userEmails: [email],
            inquiryId: id,
          },
        });
        setContactedUsers(contactedUsers.concat(email));
      })();
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
              <Input name={item} value={item} disabled={true} />
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
          label="Email to user"
          subLabel="Enter the email address of the user you would like to share the inquiry with"
          name="addOwner"
          placeholder="Your name"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
          }}
          error={emailInputError}
        />
        <Button type="button" onClick={() => onAddClick(emailInput)} disabled={!!emailInputError} className="mt-14">
          Add
        </Button>
      </div>
    </CustomModal>
  );
}
