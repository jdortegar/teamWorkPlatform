import String from 'src/translations';

export const defaultMessages = {
  tooShort: String.t('validationError.usernameTooShort'),
  tooLong: String.t('validationError.usernameTooLong')
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
    }
  };
}

export default constraints;
