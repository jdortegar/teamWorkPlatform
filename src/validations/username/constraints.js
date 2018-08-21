import String from '../../translations';

export const defaultMessages = {
  tooShort: String.t('validationError.usernameTooShort'),
  tooLong: String.t('validationError.usernameTooLong'),
  notEndsWith: String.t('validationError.usernameNotEndsWithPeriod')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 3,
      maximum: 80,
      tooShort: messages.tooShort,
      tooLong: messages.tooLong
    },
    notEndsWith: {
      searchString: '.',
      message: messages.notEndsWith
    }
  };
}

export default constraints;
