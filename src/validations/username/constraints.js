export const defaultMessages = {
  length: 'Must be 6 to 20 characters',
  format: 'Must be alphanumeric without spaces (period, underscore and @ symbol are allowed).',
  notEndsWith: 'Cannot end with a period'
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      minimum: 6,
      maximum: 20,
      tooShort: messages.length,
      tooLong: messages.length
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
