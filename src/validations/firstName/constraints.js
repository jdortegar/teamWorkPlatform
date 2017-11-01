export const defaultMessages = {
  tooLong: 'First Name is limited to 30 characters',
  format: 'First Names is limited to alphabetic values'
};

function constraints(customMessages) {
  const messages = {
    ...defaultMessages,
    ...customMessages
  };

  return {
    length: {
      maximum: 30,
      tooLong: messages.tooLong
    },
    format: {
      pattern: "[a-zA-Z\\sàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð ,.'-]*",
      message: messages.format
    }
  };
}

export default constraints;
