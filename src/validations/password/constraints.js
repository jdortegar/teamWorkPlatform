export const defaultMessages = {
  length: 'Must be at least 8 characters but no longer than 12',
  oneLowercase: 'Must have at least one lowercase letter (a-z)',
  oneNumber: 'Must have at least one number (0-9)',
  oneSpecial: 'Must have at least one special character',
  oneUppercase: 'Must have at least one uppercase letter (A-Z)'
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 8,
      maximum: 12,
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
