import String from '../../translations';

export const defaultMessages = {
  tooShort: String.t('validationError.usernameTooShort'),
  tooLong: String.t('validationError.usernameTooLong'),
  format: String.t('validationError.usernameFormat'),
  notEndsWith: String.t('validationError.usernameNotEndsWithPeriod')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 6,
      maximum: 32,
      tooShort: messages.tooShort,
      tooLong: messages.tooLong
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
