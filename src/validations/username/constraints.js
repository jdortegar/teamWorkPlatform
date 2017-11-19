import String from '../../translations';

export const defaultMessages = {
  length: String.t('error.validation.usernameTooShort'),
  format: String.t('error.validation.usernameFormat'),
  notEndsWith: String.t('error.validation.usernameNotEndsWithPeriod')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 6,
      maximum: 20,
      tooShort: messages.length,
      tooLong: messages.length
    },
    format: {
      pattern: '^[a-zA-Z0-9-_@.]+$',
      message: messages.format
    },
    notEndsWith: {
      searchString: '.',
      message: messages.notEndsWith
    }
  };
}

export default constraints;
