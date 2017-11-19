import String from '../../translations';

export const defaultMessages = {
  length: String.t('errPasswordTooShort'),
  oneLowercase: String.t('error.validation.passwordOneLower'),
  oneNumber: String.t('error.validation.passwordOneNumber'),
  oneSpecial: String.t('error.validation.passwordOneSpecial'),
  oneUppercase: String.t('error.validation.passwordOneUppercase')
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
