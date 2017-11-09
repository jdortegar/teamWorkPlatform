import { defineMessages } from 'react-intl';

export default defineMessages({
  length: {
    id: 'error.validation.usernameTooShort',
    defaultMessage: 'Must be 6 to 20 characters'
  },
  format: {
    id: 'error.validation.usernameFormat',
    defaultMessage: 'Must be alphanumeric without spaces (period, underscore and @ symbol are allowed).'
  },
  notEndsWith: {
    id: 'error.validation.usernameNotEndsWith',
    defaultMessage: 'Cannot end with character "%\\{searchString\\}"'
  }
});
