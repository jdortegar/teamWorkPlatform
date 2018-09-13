import String from '../../translations';

export const defaultMessages = {
  equality: String.t('errConfirmPasswordNoMatch')
};

function constraints(comparator, customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    equality: {
      attribute: 'NOT_IMPORTANT',
      comparator,
      message: messages.equality
    }
  };
}

export default constraints;
