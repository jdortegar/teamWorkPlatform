import String from 'src/translations';

export const defaultMessages = {
  email: String.t('errEmailNotValid')
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    email: {
      message: messages.email
    }
  };
}

export default constraints;
