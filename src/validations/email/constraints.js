export const defaultMessages = {
  email: 'Must be a valid email'
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
