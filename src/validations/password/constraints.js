import String from 'src/translations';

export const defaultMessages = {
  length: String.t('errPasswordTooShort'),
  oneLowercase: String.t('validationError.passwordOneLower'),
  oneNumber: String.t('validationError.passwordOneNumber'),
  oneSpecial: String.t('validationError.passwordOneSpecial'),
  oneUppercase: String.t('validationError.passwordOneUppercase')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 8,
      maximum: 80,
      message: messages.length
    },
    oneLowercase: {
      message: messages.oneLowercase
    },
    oneNumber: {
      message: messages.oneNumber
    },
    oneSpecial: {
      message: messages.oneSpecial
    },
    oneUppercase: {
      message: messages.oneUppercase
    }
  };
}

export default constraints;
