import { defineMessages } from 'react-intl';

export default defineMessages({
  length: {
    id: 'error.validation.passwordLength',
    defaultMessage: 'Must be at least 8 characters but no longer than 12'
  },
  oneLowercase: {
    id: 'error.validation.passwordOneLower',
    defaultMessage: 'Must have at least one lowercase letter (a-z)'
  },
  oneNumber: {
    id: 'error.validation.passwordOneNumber',
    defaultMessage: 'Must have at least one number (0-9)'
  },
  oneSpecial: {
    id: 'error.validation.passwordOneSpecial',
    defaultMessage: 'Must have at least one special character'
  },
  oneUppercase: {
    id: 'error.validation.passwordOneUppercase',
    defaultMessage: 'Must have at least one uppercase letter (A-Z)'
  }
});
