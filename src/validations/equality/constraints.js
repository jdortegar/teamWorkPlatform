export const defaultMessages = {
  equality: 'values must match'
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
