import React from 'react';

export interface EmailValidationErrors {
  INVALID_EMAIL_INPUT_ERROR: string;
  DUPLICATE_USER_ERROR: string;
  EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR: string;
}

export const DEFAULT_EMAIL_VALIDATION_ERRORS: EmailValidationErrors = {
  INVALID_EMAIL_INPUT_ERROR: 'INVALID_EMAIL_FORMAT',
  DUPLICATE_USER_ERROR: 'DUPLICATE_USER',
  EMAIL_DOES_NOT_CORRESPOND_TO_A_VALID_USER_ERROR: 'INVALID_MAGISCRIBE_USER',
};

export function isValidEmailFormat(ownerEmailInput: string) {
  return !!ownerEmailInput && ownerEmailInput.includes('@') && ownerEmailInput.includes('.');
}

function isEmailInList(emailInput: string, existingEmails: string[]) {
  return existingEmails.find((email) => email === emailInput);
}

// Validate the input email format and verify that the input email does not already exist in the list

export interface IUseValidateEmailListInput {
  emailInput: string;
  setEmailInput: (input: string) => void;
  emailInputError: string;
  setEmailInputError: (input: string) => void;
}

export function useValidateEmailListInput(
  existingEmails: string[],
  validationErrors?: EmailValidationErrors,
): IUseValidateEmailListInput {
  const [emailInput, setEmailInput] = React.useState<string>('');
  const [emailInputError, setEmailInputError] = React.useState<string>('');
  React.useEffect(() => {
    setEmailInputError('');
    if (!!emailInput) {
      if (!isValidEmailFormat(emailInput)) {
        setEmailInputError(
          validationErrors?.INVALID_EMAIL_INPUT_ERROR ?? DEFAULT_EMAIL_VALIDATION_ERRORS.INVALID_EMAIL_INPUT_ERROR,
        );
      } else if (isEmailInList(emailInput, existingEmails)) {
        setEmailInputError(
          validationErrors?.DUPLICATE_USER_ERROR ?? DEFAULT_EMAIL_VALIDATION_ERRORS.DUPLICATE_USER_ERROR,
        );
      }
    }
  }, [emailInput, existingEmails]);

  return {
    emailInput,
    setEmailInput,
    emailInputError,
    setEmailInputError,
  };
}
